import { afterEach, describe, expect, it } from "vitest";
import { startDemoHttpServer, type DemoHttpServer } from "./demo-http-server";

const clientHeaders = {
  "x-flux-client-platform": "web",
  "x-flux-client-version": "0.1.0"
};

describe("DemoHttpServer", () => {
  let server: DemoHttpServer | undefined;

  afterEach(async () => {
    if (server !== undefined) {
      await server.stop();
      server = undefined;
    }
  });

  it("serves videos and recommendations for dashboard local demo", async () => {
    server = await startDemoHttpServer({ port: 0 });

    const videosResponse = await fetch(
      `${server.baseUrl}/api/listExerciseVideos?userId=demo-user&exerciseId=goblet-squat&locale=es-ES`,
      { headers: clientHeaders }
    );
    const recommendationsResponse = await fetch(
      `${server.baseUrl}/api/listAIRecommendations?userId=demo-user&goal=recomposition&pendingQueueCount=1&daysSinceLastWorkout=3&recentCompletionRate=0.5&locale=es-ES`,
      { headers: clientHeaders }
    );

    expect(videosResponse.status).toBe(200);
    expect(recommendationsResponse.status).toBe(200);

    const videosPayload = (await videosResponse.json()) as { videos: unknown[] };
    const recommendationsPayload = (await recommendationsResponse.json()) as {
      recommendations: Array<{ priority?: string }>;
    };

    expect(videosPayload.videos.length).toBeGreaterThan(0);
    expect(recommendationsPayload.recommendations.length).toBeGreaterThan(0);
    expect(recommendationsPayload.recommendations[0]?.priority).toBe("high");
  });

  it("rejects clients below minimum version", async () => {
    server = await startDemoHttpServer({
      port: 0,
      webMinimumVersion: "0.2.0"
    });

    const response = await fetch(`${server.baseUrl}/api/listTrainingPlans?userId=demo-user`, {
      headers: clientHeaders
    });

    expect(response.status).toBe(426);

    const payload = (await response.json()) as { error?: string; minimumVersion?: string };
    expect(payload.error).toBe("client_update_required");
    expect(payload.minimumVersion).toBe("0.2.0");
  });

  it("returns method_not_allowed for known routes with invalid HTTP method", async () => {
    server = await startDemoHttpServer({ port: 0 });

    const response = await fetch(`${server.baseUrl}/api/listTrainingPlans?userId=demo-user`, {
      method: "POST",
      headers: clientHeaders
    });

    expect(response.status).toBe(405);
    const payload = (await response.json()) as { error?: string };
    expect(payload.error).toBe("method_not_allowed");
  });

  it("serves role capabilities for RBAC runtime", async () => {
    server = await startDemoHttpServer({ port: 0 });

    const response = await fetch(
      `${server.baseUrl}/api/listRoleCapabilities?role=coach`,
      { headers: clientHeaders }
    );

    expect(response.status).toBe(200);
    const payload = (await response.json()) as {
      capabilities?: { role?: string; allowedDomains?: string[] };
    };
    expect(payload.capabilities?.role).toBe("coach");
    expect(payload.capabilities?.allowedDomains).toContain("training");
    expect(payload.capabilities?.allowedDomains).not.toContain("onboarding");
  });

  it("surfaces missing_user_id for list endpoints requiring identity scope", async () => {
    server = await startDemoHttpServer({ port: 0 });

    const response = await fetch(`${server.baseUrl}/api/listTrainingPlans`, {
      headers: clientHeaders
    });

    expect(response.status).toBe(400);
    const payload = (await response.json()) as { error?: string };
    expect(payload.error).toBe("missing_user_id");
  });

  it("serves billing invoices and support incidents endpoints", async () => {
    server = await startDemoHttpServer({ port: 0 });

    const analyticsResponse = await fetch(`${server.baseUrl}/api/createAnalyticsEvent`, {
      method: "POST",
      headers: {
        ...clientHeaders,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        userId: "demo-user",
        name: "dashboard_action_blocked",
        source: "web",
        occurredAt: "2026-03-02T10:00:00.000Z",
        attributes: {
          domain: "operations",
          reason: "domain_denied",
          correlationId: "corr-1"
        }
      })
    });

    const crashResponse = await fetch(`${server.baseUrl}/api/createCrashReport`, {
      method: "POST",
      headers: {
        ...clientHeaders,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        userId: "demo-user",
        source: "backend",
        message: "fatal worker crash",
        stackTrace: "worker.ts:44",
        severity: "fatal",
        occurredAt: "2026-03-02T10:10:00.000Z"
      })
    });

    const invoicesResponse = await fetch(
      `${server.baseUrl}/api/listBillingInvoices?userId=demo-user`,
      { headers: clientHeaders }
    );
    const incidentsResponse = await fetch(
      `${server.baseUrl}/api/listSupportIncidents?userId=demo-user`,
      { headers: clientHeaders }
    );

    expect(analyticsResponse.status).toBe(201);
    expect(crashResponse.status).toBe(201);
    expect(invoicesResponse.status).toBe(200);
    expect(incidentsResponse.status).toBe(200);

    const invoicesPayload = (await invoicesResponse.json()) as {
      invoices: Array<{ status?: string }>;
    };
    const incidentsPayload = (await incidentsResponse.json()) as {
      incidents: Array<{ severity?: string }>;
    };

    expect(invoicesPayload.invoices.length).toBe(4);
    expect(invoicesPayload.invoices.map((invoice) => invoice.status)).toContain("overdue");
    expect(incidentsPayload.incidents.length).toBe(2);
    expect(incidentsPayload.incidents[0]?.severity).toBe("high");
  });
});
