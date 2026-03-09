import { afterEach, describe, expect, it } from "vitest";
import { startDemoHttpServer, type DemoHttpServer } from "./demo-http-server";

const clientHeaders = {
  "x-flux-client-platform": "web",
  "x-flux-client-version": "0.1.0",
  "content-type": "application/json"
};

const strictLatencyMode = process.env.FLUX_LOAD_TEST_STRICT === "1";
const baselineLatencyBudgetMs = strictLatencyMode ? 350 : 3000;
const stressLatencyBudgetMs = strictLatencyMode ? 600 : 5000;

type TimedResponse = {
  status: number;
  elapsedMs: number;
};

function percentile(values: number[], ratio: number): number {
  if (values.length === 0) {
    return 0;
  }
  const sorted = [...values].sort((left, right) => left - right);
  const index = Math.min(sorted.length - 1, Math.max(0, Math.ceil(sorted.length * ratio) - 1));
  return sorted[index] ?? sorted[sorted.length - 1] ?? 0;
}

async function timedFetch(url: string, init?: RequestInit): Promise<TimedResponse> {
  const startedAt = Date.now();
  const response = await fetch(url, init);
  return {
    status: response.status,
    elapsedMs: Date.now() - startedAt
  };
}

describe("Load and degradation suite", () => {
  let server: DemoHttpServer | undefined;

  afterEach(async () => {
    if (server !== undefined) {
      await server.stop();
      server = undefined;
    }
  });

  it("keeps baseline load stable and records endpoint profiles", async () => {
    server = await startDemoHttpServer({ port: 0 });

    const baselineRequests: Promise<TimedResponse>[] = [];
    for (let index = 0; index < 45; index += 1) {
      baselineRequests.push(
        timedFetch(`${server.baseUrl}/api/listTrainingPlans?userId=demo-user`, {
          headers: clientHeaders
        })
      );
      baselineRequests.push(
        timedFetch(`${server.baseUrl}/api/listObservabilitySummary?userId=demo-user`, {
          headers: clientHeaders
        })
      );
      baselineRequests.push(
        timedFetch(`${server.baseUrl}/api/listOperationalAlerts?userId=demo-user`, {
          headers: clientHeaders
        })
      );
    }

    const baselineResponses = await Promise.all(baselineRequests);
    const errors = baselineResponses.filter((response) => response.status >= 500);
    const p95LatencyMs = percentile(
      baselineResponses.map((response) => response.elapsedMs),
      0.95
    );

    expect(errors.length).toBe(0);
    expect(p95LatencyMs < baselineLatencyBudgetMs).toBe(true);

    const profilesResponse = await fetch(`${server.baseUrl}/api/listRuntimeProfiles`, {
      headers: clientHeaders
    });
    expect(profilesResponse.status).toBe(200);
    const profilesPayload = (await profilesResponse.json()) as {
      profiles: Array<{
        endpoint?: string;
        calls?: number;
        cacheHits?: number;
      }>;
    };

    const plansProfile = profilesPayload.profiles.find((profile) => profile.endpoint === "listTrainingPlans");
    const summaryProfile = profilesPayload.profiles.find(
      (profile) => profile.endpoint === "listObservabilitySummary"
    );
    const alertsProfile = profilesPayload.profiles.find(
      (profile) => profile.endpoint === "listOperationalAlerts"
    );

    expect((plansProfile?.calls ?? 0) >= 45).toBe(true);
    expect((summaryProfile?.calls ?? 0) >= 45).toBe(true);
    expect((alertsProfile?.calls ?? 0) >= 45).toBe(true);
    expect((summaryProfile?.cacheHits ?? 0) >= 1).toBe(true);
  });

  it("remains controlled under stress and triggers degradation alerts with runbooks", async () => {
    server = await startDemoHttpServer({ port: 0 });

    const stressRequests: Promise<TimedResponse>[] = [];
    for (let index = 0; index < 90; index += 1) {
      stressRequests.push(
        timedFetch(`${server.baseUrl}/api/createCrashReport`, {
          method: "POST",
          headers: clientHeaders,
          body: JSON.stringify({
            userId: "demo-user",
            source: "backend",
            message: `stress-fatal-${index}`,
            severity: "fatal",
            occurredAt: `2026-03-03T10:${String(index % 60).padStart(2, "0")}:00.000Z`
          })
        })
      );
      stressRequests.push(
        timedFetch(`${server.baseUrl}/api/createAnalyticsEvent`, {
          method: "POST",
          headers: clientHeaders,
          body: JSON.stringify({
            userId: "demo-user",
            name: "dashboard_action_blocked",
            source: "web",
            occurredAt: `2026-03-03T11:${String(index % 60).padStart(2, "0")}:00.000Z`,
            attributes: {
              domain: "operations",
              reason: "domain_denied",
              correlationId: `corr-stress-${index}`
            }
          })
        })
      );
      stressRequests.push(
        timedFetch(`${server.baseUrl}/api/listObservabilitySummary?userId=demo-user`, {
          headers: clientHeaders
        })
      );
    }

    const stressResponses = await Promise.all(stressRequests);
    const serverErrors = stressResponses.filter((response) => response.status >= 500);
    const stressP95LatencyMs = percentile(
      stressResponses.map((response) => response.elapsedMs),
      0.95
    );

    expect(serverErrors.length).toBe(0);
    expect(stressP95LatencyMs < stressLatencyBudgetMs).toBe(true);

    for (let index = 0; index < 4; index += 1) {
      const deniedAuditResponse = await fetch(`${server.baseUrl}/api/recordDeniedAccessAudit`, {
        method: "POST",
        headers: clientHeaders,
        body: JSON.stringify({
          userId: "demo-user",
          role: "athlete",
          domain: "training",
          action: "view",
          reason: "domain_denied",
          trigger: "domain_select",
          correlationId: `corr-denied-${index}`
        })
      });
      expect(deniedAuditResponse.status).toBe(201);
    }

    for (let index = 0; index < 4; index += 1) {
      const deniedEventResponse = await fetch(`${server.baseUrl}/api/createAnalyticsEvent`, {
        method: "POST",
        headers: clientHeaders,
        body: JSON.stringify({
          userId: "demo-user",
          name: "dashboard_domain_access_denied",
          source: "web",
          occurredAt: `2026-03-03T12:${String(index).padStart(2, "0")}:00.000Z`,
          attributes: {
            domain: "training",
            reason: "domain_denied",
            correlationId: `corr-denied-event-${index}`
          }
        })
      });
      expect(deniedEventResponse.status).toBe(201);
    }

    const alertsResponse = await fetch(
      `${server.baseUrl}/api/listOperationalAlerts?userId=demo-user`,
      { headers: clientHeaders }
    );
    const runbooksResponse = await fetch(`${server.baseUrl}/api/listOperationalRunbooks`, {
      headers: clientHeaders
    });
    const incidentsResponse = await fetch(
      `${server.baseUrl}/api/listSupportIncidents?userId=demo-user`,
      { headers: clientHeaders }
    );
    const profilesResponse = await fetch(`${server.baseUrl}/api/listRuntimeProfiles`, {
      headers: clientHeaders
    });

    expect(alertsResponse.status).toBe(200);
    expect(runbooksResponse.status).toBe(200);
    expect(incidentsResponse.status).toBe(200);
    expect(profilesResponse.status).toBe(200);

    const alertsPayload = (await alertsResponse.json()) as {
      alerts: Array<{ code?: string; runbookId?: string }>;
    };
    const runbooksPayload = (await runbooksResponse.json()) as {
      runbooks: Array<{ id?: string }>;
    };
    const incidentsPayload = (await incidentsResponse.json()) as {
      incidents: Array<{ severity?: string; state?: string }>;
    };
    const profilesPayload = (await profilesResponse.json()) as {
      profiles: Array<{ endpoint?: string; calls?: number }>;
    };

    const alertCodes = alertsPayload.alerts.map((alert) => alert.code ?? "");
    const runbookIds = new Set(runbooksPayload.runbooks.map((runbook) => runbook.id ?? ""));
    const unresolvedHighIncidents = incidentsPayload.incidents.filter(
      (incident) => incident.severity === "high" && incident.state !== "resolved"
    );
    const crashProfile = profilesPayload.profiles.find(
      (profile) => profile.endpoint === "createCrashReport"
    );

    expect(alertCodes).toContain("fatal_crash_slo_breach");
    expect(alertCodes).toContain("denied_access_spike");
    expect(alertCodes).toContain("blocked_action_spike");
    expect(
      alertsPayload.alerts.every((alert) =>
        typeof alert.runbookId === "string" && runbookIds.has(alert.runbookId)
      )
    ).toBe(true);
    expect(unresolvedHighIncidents.length > 0).toBe(true);
    expect((crashProfile?.calls ?? 0) >= 90).toBe(true);
  });
});
