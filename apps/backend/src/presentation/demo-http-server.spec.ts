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

    const payload = (await response.json()) as {
      error?: string;
      minimumVersion?: string;
      correlationId?: string;
      retryable?: boolean;
    };
    expect(payload.error).toBe("client_update_required");
    expect(payload.minimumVersion).toBe("0.2.0");
    expect(payload.correlationId?.startsWith("flux-")).toBe(true);
    expect(payload.retryable).toBe(false);
    expect(response.headers.get("x-correlation-id")).toBe(payload.correlationId);
  });

  it("returns method_not_allowed for known routes with invalid HTTP method", async () => {
    server = await startDemoHttpServer({ port: 0 });

    const response = await fetch(`${server.baseUrl}/api/listTrainingPlans?userId=demo-user`, {
      method: "POST",
      headers: clientHeaders
    });

    expect(response.status).toBe(405);
    const payload = (await response.json()) as {
      error?: string;
      correlationId?: string;
      retryable?: boolean;
    };
    expect(payload.error).toBe("method_not_allowed");
    expect(payload.correlationId?.startsWith("flux-")).toBe(true);
    expect(payload.retryable).toBe(false);
    expect(response.headers.get("x-correlation-id")).toBe(payload.correlationId);
  });

  it("serves auth recovery endpoint for email and sms channels", async () => {
    server = await startDemoHttpServer({ port: 0 });

    const emailResponse = await fetch(`${server.baseUrl}/api/requestAuthRecovery`, {
      method: "POST",
      headers: {
        ...clientHeaders,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        channel: "email",
        identifier: "user@example.com"
      })
    });

    const smsResponse = await fetch(`${server.baseUrl}/api/requestAuthRecovery`, {
      method: "POST",
      headers: {
        ...clientHeaders,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        channel: "sms",
        identifier: "+34123456789"
      })
    });

    expect(emailResponse.status).toBe(201);
    expect(smsResponse.status).toBe(201);

    const emailPayload = (await emailResponse.json()) as {
      recovery?: { status?: string };
    };
    const smsPayload = (await smsResponse.json()) as {
      recovery?: { status?: string };
    };

    expect(emailPayload.recovery?.status).toBe("recovery_sent_email");
    expect(smsPayload.recovery?.status).toBe("recovery_sent_sms");
  });

  it("propagates request correlation id into analytics and crash traces", async () => {
    server = await startDemoHttpServer({ port: 0 });

    const correlationHeaders = {
      ...clientHeaders,
      "content-type": "application/json",
      "x-correlation-id": "trace-demo-123"
    };

    const analyticsResponse = await fetch(`${server.baseUrl}/api/createAnalyticsEvent`, {
      method: "POST",
      headers: correlationHeaders,
      body: JSON.stringify({
        userId: "demo-user",
        name: "dashboard_timeout",
        source: "web",
        occurredAt: "2026-03-02T11:00:00.000Z",
        attributes: {
          domain: "operations",
          reason: "timeout"
        }
      })
    });

    const crashResponse = await fetch(`${server.baseUrl}/api/createCrashReport`, {
      method: "POST",
      headers: correlationHeaders,
      body: JSON.stringify({
        userId: "demo-user",
        source: "backend",
        message: "background worker timeout",
        severity: "warning",
        occurredAt: "2026-03-02T11:01:00.000Z"
      })
    });

    const eventsByQuery = await fetch(
      `${server.baseUrl}/api/listAnalyticsEvents?userId=demo-user&query=trace-demo-123`,
      { headers: clientHeaders }
    );
    const crashesByQuery = await fetch(
      `${server.baseUrl}/api/listCrashReports?userId=demo-user&query=trace-demo-123`,
      { headers: clientHeaders }
    );

    expect(analyticsResponse.status).toBe(201);
    expect(crashResponse.status).toBe(201);
    expect(eventsByQuery.status).toBe(200);
    expect(crashesByQuery.status).toBe(200);

    const analyticsPayload = (await analyticsResponse.json()) as {
      event?: { attributes?: Record<string, string | number | boolean> };
    };
    const crashPayload = (await crashResponse.json()) as {
      report?: { correlationId?: string };
    };
    const filteredEventsPayload = (await eventsByQuery.json()) as { events: unknown[] };
    const filteredCrashesPayload = (await crashesByQuery.json()) as { reports: unknown[] };

    expect(analyticsPayload.event?.attributes?.correlationId).toBe("trace-demo-123");
    expect(crashPayload.report?.correlationId).toBe("trace-demo-123");
    expect(filteredEventsPayload.events.length).toBe(1);
    expect(filteredCrashesPayload.reports.length).toBe(1);
  });

  it("serves observability summary for operations dashboard", async () => {
    server = await startDemoHttpServer({ port: 0 });

    await fetch(`${server.baseUrl}/api/createAnalyticsEvent`, {
      method: "POST",
      headers: {
        ...clientHeaders,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        userId: "demo-user",
        name: "dashboard_action_blocked",
        source: "web",
        occurredAt: "2026-03-02T11:10:00.000Z",
        attributes: {
          domain: "operations",
          reason: "domain_denied",
          correlationId: "corr-obs-summary-1"
        }
      })
    });

    await fetch(`${server.baseUrl}/api/createCrashReport`, {
      method: "POST",
      headers: {
        ...clientHeaders,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        userId: "demo-user",
        source: "backend",
        message: "fatal worker crash",
        severity: "fatal",
        occurredAt: "2026-03-02T11:11:00.000Z"
      })
    });

    const response = await fetch(
      `${server.baseUrl}/api/listObservabilitySummary?userId=demo-user`,
      { headers: clientHeaders }
    );

    expect(response.status).toBe(200);
    const payload = (await response.json()) as {
      summary?: {
        totalAnalyticsEvents?: number;
        totalCrashReports?: number;
        blockedActions?: number;
        fatalCrashReports?: number;
        canonicalCoverage?: { trackedCanonicalEvents?: number };
      };
    };
    expect(payload.summary?.totalAnalyticsEvents).toBeGreaterThan(0);
    expect(payload.summary?.totalCrashReports).toBeGreaterThan(0);
    expect(payload.summary?.blockedActions).toBeGreaterThan(0);
    expect(payload.summary?.fatalCrashReports).toBeGreaterThan(0);
    expect(payload.summary?.canonicalCoverage?.trackedCanonicalEvents).toBeGreaterThan(0);
  });

  it("serves operational alerts and runbooks endpoints", async () => {
    server = await startDemoHttpServer({ port: 0 });

    await fetch(`${server.baseUrl}/api/createAnalyticsEvent`, {
      method: "POST",
      headers: {
        ...clientHeaders,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        userId: "demo-user",
        name: "dashboard_domain_access_denied",
        source: "web",
        occurredAt: "2026-03-02T11:20:00.000Z",
        attributes: {
          domain: "training",
          reason: "domain_denied",
          correlationId: "corr-ops-api-1"
        }
      })
    });

    await fetch(`${server.baseUrl}/api/createAnalyticsEvent`, {
      method: "POST",
      headers: {
        ...clientHeaders,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        userId: "demo-user",
        name: "dashboard_domain_access_denied",
        source: "web",
        occurredAt: "2026-03-02T11:21:00.000Z",
        attributes: {
          domain: "nutrition",
          reason: "domain_denied",
          correlationId: "corr-ops-api-1"
        }
      })
    });

    await fetch(`${server.baseUrl}/api/createAnalyticsEvent`, {
      method: "POST",
      headers: {
        ...clientHeaders,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        userId: "demo-user",
        name: "dashboard_domain_access_denied",
        source: "web",
        occurredAt: "2026-03-02T11:22:00.000Z",
        attributes: {
          domain: "progress",
          reason: "domain_denied",
          correlationId: "corr-ops-api-2"
        }
      })
    });

    await fetch(`${server.baseUrl}/api/createCrashReport`, {
      method: "POST",
      headers: {
        ...clientHeaders,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        userId: "demo-user",
        source: "backend",
        message: "fatal worker crash",
        severity: "fatal",
        occurredAt: "2026-03-02T11:23:00.000Z"
      })
    });

    const alertsResponse = await fetch(
      `${server.baseUrl}/api/listOperationalAlerts?userId=demo-user`,
      { headers: clientHeaders }
    );
    const runbooksResponse = await fetch(
      `${server.baseUrl}/api/listOperationalRunbooks`,
      { headers: clientHeaders }
    );

    expect(alertsResponse.status).toBe(200);
    expect(runbooksResponse.status).toBe(200);

    const alertsPayload = (await alertsResponse.json()) as {
      alerts?: Array<{ code?: string; runbookId?: string }>;
    };
    const runbooksPayload = (await runbooksResponse.json()) as {
      runbooks?: Array<{ id?: string; alertCode?: string }>;
    };

    expect((alertsPayload.alerts?.length ?? 0) > 0).toBe(true);
    expect(alertsPayload.alerts?.some((alert) => alert.code === "fatal_crash_slo_breach")).toBe(true);
    expect(alertsPayload.alerts?.every((alert) => (alert.runbookId ?? "").startsWith("RB-"))).toBe(
      true
    );
    expect(runbooksPayload.runbooks).toHaveLength(5);
    expect(
      runbooksPayload.runbooks?.some((runbook) => runbook.alertCode === "denied_access_spike")
    ).toBe(true);
  });

  it("serves structured logs activity log and forensic export endpoints", async () => {
    server = await startDemoHttpServer({ port: 0 });

    await fetch(`${server.baseUrl}/api/createAnalyticsEvent`, {
      method: "POST",
      headers: {
        ...clientHeaders,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        userId: "demo-user",
        name: "dashboard_action_blocked",
        source: "web",
        occurredAt: "2026-03-02T11:30:00.000Z",
        attributes: {
          role: "athlete",
          domain: "training",
          backendRoute: "training/view",
          reason: "domain_denied",
          correlationId: "corr-forensic-1"
        }
      })
    });

    await fetch(`${server.baseUrl}/api/recordDeniedAccessAudit`, {
      method: "POST",
      headers: {
        ...clientHeaders,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        userId: "demo-user",
        role: "athlete",
        domain: "training",
        action: "view",
        reason: "domain_denied",
        trigger: "domain_select",
        correlationId: "corr-forensic-1"
      })
    });

    const logsResponse = await fetch(
      `${server.baseUrl}/api/listStructuredLogs?userId=demo-user&query=blocked&limit=10`,
      { headers: clientHeaders }
    );
    const activityResponse = await fetch(
      `${server.baseUrl}/api/listActivityLog?userId=demo-user&action=access_denied`,
      { headers: clientHeaders }
    );
    const exportResponse = await fetch(`${server.baseUrl}/api/exportForensicAudit`, {
      method: "POST",
      headers: {
        ...clientHeaders,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        userId: "demo-user",
        format: "csv",
        fromDate: "2026-03-02T00:00:00.000Z",
        toDate: "2026-03-03T00:00:00.000Z",
        includeStructuredLogs: true,
        includeActivityLog: true
      })
    });

    expect(logsResponse.status).toBe(200);
    expect(activityResponse.status).toBe(200);
    expect(exportResponse.status).toBe(201);

    const logsPayload = (await logsResponse.json()) as { logs?: unknown[] };
    const activityPayload = (await activityResponse.json()) as { activityLog?: unknown[] };
    const exportPayload = (await exportResponse.json()) as {
      exportResult?: { status?: string; rowCount?: number; downloadUrl?: string };
    };

    expect((logsPayload.logs ?? []).length).toBeGreaterThan(0);
    expect((activityPayload.activityLog ?? []).length).toBeGreaterThan(0);
    expect(exportPayload.exportResult?.status).toBe("completed");
    expect((exportPayload.exportResult?.rowCount ?? 0) > 0).toBe(true);
    expect((exportPayload.exportResult?.downloadUrl ?? "").endsWith(".csv")).toBe(true);
  });

  it("applies idempotency policy for critical post endpoints", async () => {
    server = await startDemoHttpServer({ port: 0 });

    const idempotentHeaders = {
      ...clientHeaders,
      "content-type": "application/json",
      "x-idempotency-key": "idem-workout-1"
    };

    const requestBody = {
      userId: "demo-user",
      planId: "starter-plan",
      startedAt: "2026-03-02T12:00:00.000Z",
      endedAt: "2026-03-02T12:35:00.000Z",
      exercises: [
        {
          exerciseId: "goblet-squat",
          sets: [{ reps: 10, loadKg: 24, rpe: 8 }]
        }
      ]
    };

    const firstResponse = await fetch(`${server.baseUrl}/api/createWorkoutSession`, {
      method: "POST",
      headers: idempotentHeaders,
      body: JSON.stringify(requestBody)
    });
    const secondResponse = await fetch(`${server.baseUrl}/api/createWorkoutSession`, {
      method: "POST",
      headers: idempotentHeaders,
      body: JSON.stringify(requestBody)
    });
    const sessionsResponse = await fetch(
      `${server.baseUrl}/api/listWorkoutSessions?userId=demo-user`,
      { headers: clientHeaders }
    );

    expect(firstResponse.status).toBe(201);
    expect(secondResponse.status).toBe(201);
    expect(sessionsResponse.status).toBe(200);

    const firstPayload = (await firstResponse.json()) as {
      idempotency?: { key?: string; replayed?: boolean };
    };
    const secondPayload = (await secondResponse.json()) as {
      idempotency?: { key?: string; replayed?: boolean };
    };
    const sessionsPayload = (await sessionsResponse.json()) as { sessions: unknown[] };

    expect(firstPayload.idempotency?.key).toContain("idem-workout-1");
    expect(firstPayload.idempotency?.replayed).toBe(false);
    expect(secondPayload.idempotency?.replayed).toBe(true);
    expect(sessionsPayload.sessions.length).toBe(1);
  });

  it("serves createHealthScreening endpoint for onboarding precheck", async () => {
    server = await startDemoHttpServer({ port: 0 });

    const response = await fetch(`${server.baseUrl}/api/createHealthScreening`, {
      method: "POST",
      headers: {
        ...clientHeaders,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        userId: "demo-user",
        onboardingProfile: {
          displayName: "Juan",
          age: 35,
          heightCm: 178,
          weightKg: 84,
          availableDaysPerWeek: 4,
          equipment: ["dumbbells"],
          injuries: []
        },
        responses: [{ questionId: "parq-1", answer: true }]
      })
    });

    expect(response.status).toBe(201);
    const payload = (await response.json()) as { screening?: { risk?: string } };
    expect(payload.screening?.risk).toBe("moderate");
  });

  it("serves role capabilities for RBAC runtime", async () => {
    server = await startDemoHttpServer({ port: 0 });

    const response = await fetch(
      `${server.baseUrl}/api/listRoleCapabilities?role=coach`,
      { headers: clientHeaders }
    );

    expect(response.status).toBe(200);
    const payload = (await response.json()) as {
      capabilities?: {
        role?: string;
        allowedDomains?: string[];
        permissions?: Array<{ domain?: string; actions?: string[] }>;
      };
    };
    expect(payload.capabilities?.role).toBe("coach");
    expect(payload.capabilities?.allowedDomains).toContain("training");
    expect(payload.capabilities?.allowedDomains).not.toContain("onboarding");
    expect(payload.capabilities?.permissions?.some((permission) => permission.domain === "training")).toBe(
      true
    );
  });

  it("evaluates role access and stores denied access audits", async () => {
    server = await startDemoHttpServer({ port: 0 });

    const evaluateResponse = await fetch(`${server.baseUrl}/api/evaluateAccessDecision`, {
      method: "POST",
      headers: {
        ...clientHeaders,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        role: "athlete",
        domain: "training",
        action: "view",
        context: {
          isOwner: true,
          medicalDisclaimerAccepted: false
        }
      })
    });

    expect(evaluateResponse.status).toBe(200);
    const evaluatePayload = (await evaluateResponse.json()) as {
      decision?: { allowed?: boolean; reason?: string };
    };
    expect(evaluatePayload.decision?.allowed).toBe(false);
    expect(evaluatePayload.decision?.reason).toBe("medical_consent_required");

    const auditResponse = await fetch(`${server.baseUrl}/api/recordDeniedAccessAudit`, {
      method: "POST",
      headers: {
        ...clientHeaders,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        userId: "demo-user",
        role: "athlete",
        domain: "training",
        action: "view",
        reason: "medical_consent_required",
        trigger: "domain_select",
        correlationId: "corr-rbac-1"
      })
    });
    expect(auditResponse.status).toBe(201);

    const listResponse = await fetch(
      `${server.baseUrl}/api/listDeniedAccessAudits?userId=demo-user`,
      { headers: clientHeaders }
    );
    expect(listResponse.status).toBe(200);
    const listPayload = (await listResponse.json()) as {
      audits?: Array<{ reason?: string; id?: string }>;
    };
    expect(listPayload.audits).toHaveLength(1);
    expect(listPayload.audits?.[0]?.reason).toBe("medical_consent_required");
    expect((listPayload.audits?.[0]?.id ?? "").length).toBeGreaterThan(0);
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

  it("supports range filters for workout/nutrition lists and generatedAt for summary", async () => {
    server = await startDemoHttpServer({ port: 0 });

    await fetch(`${server.baseUrl}/api/createTrainingPlan`, {
      method: "POST",
      headers: {
        ...clientHeaders,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        id: "plan-1",
        userId: "demo-user",
        name: "Starter",
        weeks: 4,
        days: [
          {
            dayIndex: 1,
            exercises: [{ exerciseId: "goblet-squat", targetSets: 4, targetReps: 8 }]
          }
        ]
      })
    });

    await fetch(`${server.baseUrl}/api/createWorkoutSession`, {
      method: "POST",
      headers: {
        ...clientHeaders,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        userId: "demo-user",
        planId: "plan-1",
        startedAt: "2026-03-01T08:00:00.000Z",
        endedAt: "2026-03-01T08:45:00.000Z",
        exercises: [{ exerciseId: "goblet-squat", sets: [{ reps: 8, loadKg: 40, rpe: 7 }] }]
      })
    });

    await fetch(`${server.baseUrl}/api/createWorkoutSession`, {
      method: "POST",
      headers: {
        ...clientHeaders,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        userId: "demo-user",
        planId: "plan-1",
        startedAt: "2026-03-02T08:00:00.000Z",
        endedAt: "2026-03-02T08:45:00.000Z",
        exercises: [{ exerciseId: "goblet-squat", sets: [{ reps: 8, loadKg: 42, rpe: 8 }] }]
      })
    });

    await fetch(`${server.baseUrl}/api/createNutritionLog`, {
      method: "POST",
      headers: {
        ...clientHeaders,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        userId: "demo-user",
        date: "2026-03-01",
        calories: 2200,
        proteinGrams: 150,
        carbsGrams: 230,
        fatsGrams: 70
      })
    });

    await fetch(`${server.baseUrl}/api/createNutritionLog`, {
      method: "POST",
      headers: {
        ...clientHeaders,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        userId: "demo-user",
        date: "2026-03-02",
        calories: 2100,
        proteinGrams: 145,
        carbsGrams: 220,
        fatsGrams: 65
      })
    });

    const sessionsResponse = await fetch(
      `${server.baseUrl}/api/listWorkoutSessions?userId=demo-user&fromDate=2026-03-02T00:00:00.000Z&limit=1`,
      { headers: clientHeaders }
    );
    const logsResponse = await fetch(
      `${server.baseUrl}/api/listNutritionLogs?userId=demo-user&fromDate=2026-03-02&limit=1`,
      { headers: clientHeaders }
    );
    const summaryResponse = await fetch(
      `${server.baseUrl}/api/getProgressSummary?userId=demo-user&generatedAt=2026-03-03T00:00:00.000Z`,
      { headers: clientHeaders }
    );

    expect(sessionsResponse.status).toBe(200);
    expect(logsResponse.status).toBe(200);
    expect(summaryResponse.status).toBe(200);

    const sessionsPayload = (await sessionsResponse.json()) as { sessions: unknown[] };
    const logsPayload = (await logsResponse.json()) as { logs: unknown[] };
    const summaryPayload = (await summaryResponse.json()) as {
      summary?: { generatedAt?: string; workoutSessionsCount?: number };
    };

    expect(sessionsPayload.sessions.length).toBe(1);
    expect(logsPayload.logs.length).toBe(1);
    expect(summaryPayload.summary?.generatedAt).toBe("2026-03-03T00:00:00.000Z");
    expect(summaryPayload.summary?.workoutSessionsCount).toBe(2);
  });

  it("supports filters for analytics events and crash reports", async () => {
    server = await startDemoHttpServer({ port: 0 });

    await fetch(`${server.baseUrl}/api/createAnalyticsEvent`, {
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

    await fetch(`${server.baseUrl}/api/createAnalyticsEvent`, {
      method: "POST",
      headers: {
        ...clientHeaders,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        userId: "demo-user",
        name: "nutrition_log_saved",
        source: "web",
        occurredAt: "2026-03-02T10:01:00.000Z",
        attributes: {
          domain: "nutrition",
          reason: "saved",
          correlationId: "corr-2"
        }
      })
    });

    await fetch(`${server.baseUrl}/api/createCrashReport`, {
      method: "POST",
      headers: {
        ...clientHeaders,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        userId: "demo-user",
        source: "web",
        message: "warning crash",
        stackTrace: "App.tsx:10",
        severity: "warning",
        occurredAt: "2026-03-02T10:02:00.000Z"
      })
    });

    await fetch(`${server.baseUrl}/api/createCrashReport`, {
      method: "POST",
      headers: {
        ...clientHeaders,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        userId: "demo-user",
        source: "backend",
        message: "fatal crash",
        stackTrace: "worker.ts:20",
        severity: "fatal",
        occurredAt: "2026-03-02T10:03:00.000Z"
      })
    });

    const eventsResponse = await fetch(
      `${server.baseUrl}/api/listAnalyticsEvents?userId=demo-user&domain=operations&query=blocked&limit=1`,
      { headers: clientHeaders }
    );
    const crashResponse = await fetch(
      `${server.baseUrl}/api/listCrashReports?userId=demo-user&source=backend&severity=fatal&limit=1`,
      { headers: clientHeaders }
    );

    expect(eventsResponse.status).toBe(200);
    expect(crashResponse.status).toBe(200);

    const eventsPayload = (await eventsResponse.json()) as {
      events: Array<{ name?: string }>;
    };
    const crashPayload = (await crashResponse.json()) as {
      reports: Array<{ severity?: string; source?: string }>;
    };

    expect(eventsPayload.events.length).toBe(1);
    expect(eventsPayload.events[0]?.name).toBe("dashboard_action_blocked");
    expect(crashPayload.reports.length).toBe(1);
    expect(crashPayload.reports[0]?.severity).toBe("fatal");
    expect(crashPayload.reports[0]?.source).toBe("backend");
  });

  it("exposes runtime profiles for endpoint latency and cache behavior", async () => {
    server = await startDemoHttpServer({ port: 0 });

    await fetch(`${server.baseUrl}/api/listTrainingPlans?userId=demo-user`, {
      headers: clientHeaders
    });
    await fetch(`${server.baseUrl}/api/listTrainingPlans?userId=demo-user`, {
      headers: clientHeaders
    });
    await fetch(`${server.baseUrl}/api/listObservabilitySummary?userId=demo-user`, {
      headers: clientHeaders
    });
    await fetch(`${server.baseUrl}/api/listObservabilitySummary?userId=demo-user`, {
      headers: clientHeaders
    });

    const response = await fetch(`${server.baseUrl}/api/listRuntimeProfiles`, {
      headers: clientHeaders
    });

    expect(response.status).toBe(200);
    const payload = (await response.json()) as {
      profiles: Array<{
        endpoint?: string;
        calls?: number;
        cacheHits?: number;
        averageMs?: number;
      }>;
    };

    expect(payload.profiles.length).toBeGreaterThan(0);
    const plansProfile = payload.profiles.find((profile) => profile.endpoint === "listTrainingPlans");
    const summaryProfile = payload.profiles.find(
      (profile) => profile.endpoint === "listObservabilitySummary"
    );

    expect(plansProfile?.calls).toBe(2);
    expect(summaryProfile?.calls).toBe(2);
    expect((summaryProfile?.cacheHits ?? 0) >= 1).toBe(true);
    expect((plansProfile?.averageMs ?? -1) >= 0).toBe(true);
  });
});
