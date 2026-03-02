import { describe, expect, it } from "vitest";
import { createDemoApiRuntime } from "./demo-api-runtime";

describe("DemoApiRuntime", () => {
  it("returns loaded videos and recommendations for dashboard", async () => {
    const runtime = createDemoApiRuntime();

    const videos = await runtime.listExerciseVideos({
      userId: "demo-user",
      exerciseId: "goblet-squat",
      locale: "es-ES"
    });

    const recommendations = await runtime.listAIRecommendations({
      userId: "demo-user",
      goal: "recomposition",
      pendingQueueCount: 1,
      daysSinceLastWorkout: 3,
      recentCompletionRate: 0.5,
      locale: "es-ES"
    });

    expect(videos.length).toBeGreaterThan(0);
    expect(recommendations.length).toBeGreaterThan(0);
    expect(recommendations[0]?.priority).toBe("high");
  });

  it("returns auth recovery status for email and sms channels", async () => {
    const runtime = createDemoApiRuntime();

    const emailRecovery = await runtime.requestAuthRecovery({
      channel: "email",
      identifier: "user@example.com"
    });
    const smsRecovery = await runtime.requestAuthRecovery({
      channel: "sms",
      identifier: "+34123456789"
    });

    expect(emailRecovery.status).toBe("recovery_sent_email");
    expect(smsRecovery.status).toBe("recovery_sent_sms");
  });

  it("creates a standalone health screening for onboarding precheck", async () => {
    const runtime = createDemoApiRuntime();

    const screening = await runtime.createHealthScreening({
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
    });

    expect(screening.userId).toBe("demo-user");
    expect(screening.risk).toBe("moderate");
  });

  it("persists training and nutrition flows in local runtime", async () => {
    const runtime = createDemoApiRuntime();

    const createdPlan = await runtime.createTrainingPlan({
      id: "plan-1",
      userId: "demo-user",
      name: "Starter",
      weeks: 4,
      days: [
        {
          dayIndex: 1,
          exercises: [{ exerciseId: "goblet-squat", targetSets: 4, targetReps: 10 }]
        }
      ]
    });

    await runtime.createWorkoutSession({
      userId: "demo-user",
      planId: createdPlan.id,
      startedAt: "2026-03-01T08:00:00.000Z",
      endedAt: "2026-03-01T08:35:00.000Z",
      exercises: [
        { exerciseId: "goblet-squat", sets: [{ reps: 10, loadKg: 22, rpe: 7 }] }
      ]
    });

    await runtime.createNutritionLog({
      userId: "demo-user",
      date: "2026-03-01",
      calories: 2200,
      proteinGrams: 150,
      carbsGrams: 230,
      fatsGrams: 70
    });

    const summary = await runtime.getProgressSummary("demo-user");

    expect(summary.workoutSessionsCount).toBe(1);
    expect(summary.nutritionLogsCount).toBe(1);
  });

  it("returns role capabilities for RBAC runtime", async () => {
    const runtime = createDemoApiRuntime();

    const capabilities = await runtime.listRoleCapabilities("coach");

    expect(capabilities.role).toBe("coach");
    expect(capabilities.allowedDomains).toEqual([
      "all",
      "training",
      "nutrition",
      "progress",
      "operations"
    ]);
    expect(capabilities.permissions.find((permission) => permission.domain === "training")?.actions).toContain(
      "approve"
    );
  });

  it("evaluates conditional access decisions and persists denied access audits", async () => {
    const runtime = createDemoApiRuntime();

    const denied = await runtime.evaluateAccessDecision({
      role: "athlete",
      domain: "training",
      action: "view",
      context: {
        isOwner: true,
        medicalDisclaimerAccepted: false
      }
    });

    expect(denied.allowed).toBe(false);
    expect(denied.reason).toBe("medical_consent_required");

    const audit = await runtime.recordDeniedAccessAudit({
      userId: "demo-user",
      role: "athlete",
      domain: "training",
      action: "view",
      reason: denied.reason === "allowed" ? "domain_denied" : denied.reason,
      trigger: "domain_select",
      correlationId: "corr-audit-1"
    });

    const audits = await runtime.listDeniedAccessAudits("demo-user");

    expect(audit.id.length).toBeGreaterThan(0);
    expect(audits).toHaveLength(1);
    expect(audits[0]?.reason).toBe("medical_consent_required");
  });

  it("returns billing invoices and support incidents for enterprise operations", async () => {
    const runtime = createDemoApiRuntime();

    await runtime.createTrainingPlan({
      id: "plan-1",
      userId: "demo-user",
      name: "Starter",
      weeks: 4,
      days: [
        {
          dayIndex: 1,
          exercises: [{ exerciseId: "goblet-squat", targetSets: 4, targetReps: 10 }]
        }
      ]
    });

    await runtime.createWorkoutSession({
      userId: "demo-user",
      planId: "plan-1",
      startedAt: "2026-03-02T08:00:00.000Z",
      endedAt: "2026-03-02T08:45:00.000Z",
      exercises: [
        { exerciseId: "goblet-squat", sets: [{ reps: 10, loadKg: 22, rpe: 7 }] }
      ]
    });

    await runtime.createNutritionLog({
      userId: "demo-user",
      date: "2026-03-02",
      calories: 2200,
      proteinGrams: 150,
      carbsGrams: 230,
      fatsGrams: 70
    });

    await runtime.createAnalyticsEvent({
      userId: "demo-user",
      name: "dashboard_action_blocked",
      source: "web",
      occurredAt: "2026-03-02T10:00:00.000Z",
      attributes: {
        domain: "operations",
        reason: "domain_denied",
        correlationId: "corr-1"
      }
    });

    await runtime.createCrashReport({
      userId: "demo-user",
      source: "backend",
      message: "fatal worker crash",
      stackTrace: "worker.ts:44",
      severity: "fatal",
      occurredAt: "2026-03-02T10:10:00.000Z"
    });

    const invoices = await runtime.listBillingInvoices("demo-user");
    const incidents = await runtime.listSupportIncidents("demo-user");

    expect(invoices.length).toBe(4);
    expect(invoices.map((invoice) => invoice.status)).toContain("overdue");
    expect(incidents.length).toBe(2);
    expect(incidents[0]?.severity).toBe("high");
  });

  it("returns observability summary with canonical coverage", async () => {
    const runtime = createDemoApiRuntime();

    await runtime.createAnalyticsEvent({
      userId: "demo-user",
      name: "dashboard_action_blocked",
      source: "web",
      occurredAt: "2026-03-03T10:00:00.000Z",
      attributes: {
        correlationId: "corr-obs-1"
      }
    });
    await runtime.createCrashReport({
      userId: "demo-user",
      source: "backend",
      message: "fatal worker crash",
      severity: "fatal",
      occurredAt: "2026-03-03T10:05:00.000Z"
    });

    const summary = await runtime.listObservabilitySummary("demo-user");

    expect(summary.totalAnalyticsEvents).toBeGreaterThan(0);
    expect(summary.totalCrashReports).toBeGreaterThan(0);
    expect(summary.blockedActions).toBeGreaterThan(0);
    expect(summary.fatalCrashReports).toBeGreaterThan(0);
    expect(summary.canonicalCoverage.trackedCanonicalEvents).toBeGreaterThan(0);
  });

  it("returns operational alerts and runbooks for on-call response", async () => {
    const runtime = createDemoApiRuntime();

    await runtime.createAnalyticsEvent({
      userId: "demo-user",
      name: "dashboard_domain_access_denied",
      source: "web",
      occurredAt: "2026-03-03T10:00:00.000Z",
      attributes: {
        domain: "training",
        reason: "domain_denied",
        correlationId: "corr-ops-1"
      }
    });
    await runtime.createAnalyticsEvent({
      userId: "demo-user",
      name: "dashboard_domain_access_denied",
      source: "web",
      occurredAt: "2026-03-03T10:01:00.000Z",
      attributes: {
        domain: "nutrition",
        reason: "domain_denied",
        correlationId: "corr-ops-1"
      }
    });
    await runtime.createAnalyticsEvent({
      userId: "demo-user",
      name: "dashboard_domain_access_denied",
      source: "web",
      occurredAt: "2026-03-03T10:02:00.000Z",
      attributes: {
        domain: "progress",
        reason: "domain_denied",
        correlationId: "corr-ops-1"
      }
    });
    await runtime.createCrashReport({
      userId: "demo-user",
      source: "backend",
      message: "fatal worker crash",
      severity: "fatal",
      occurredAt: "2026-03-03T10:03:00.000Z"
    });

    const alerts = await runtime.listOperationalAlerts("demo-user");
    const runbooks = await runtime.listOperationalRunbooks();

    expect(alerts.length).toBeGreaterThan(0);
    expect(alerts.some((item) => item.code === "fatal_crash_slo_breach")).toBe(true);
    expect(alerts.some((item) => item.code === "denied_access_spike")).toBe(true);
    expect(runbooks.length).toBe(5);
    expect(runbooks.every((item) => item.steps.length > 0)).toBe(true);
  });

  it("returns structured logs activity log and forensic export metadata", async () => {
    const runtime = createDemoApiRuntime();

    await runtime.createAnalyticsEvent({
      userId: "demo-user",
      name: "dashboard_action_blocked",
      source: "web",
      occurredAt: "2026-03-03T10:00:00.000Z",
      attributes: {
        role: "athlete",
        domain: "training",
        backendRoute: "training/view",
        reason: "domain_denied",
        correlationId: "corr-forensic-1"
      }
    });
    await runtime.recordDeniedAccessAudit({
      userId: "demo-user",
      role: "athlete",
      domain: "training",
      action: "view",
      reason: "domain_denied",
      trigger: "domain_select",
      correlationId: "corr-forensic-1"
    });
    await runtime.createCrashReport({
      userId: "demo-user",
      source: "backend",
      message: "fatal worker crash",
      severity: "fatal",
      occurredAt: "2026-03-03T10:01:00.000Z",
      correlationId: "corr-forensic-2"
    });

    const [logs, activityLog, forensicExport] = await Promise.all([
      runtime.listStructuredLogs("demo-user", {
        query: "blocked",
        limit: 10
      }),
      runtime.listActivityLog("demo-user", {
        source: "web",
        limit: 10
      }),
      runtime.exportForensicAudit({
        userId: "demo-user",
        format: "csv",
        fromDate: "2026-03-03T09:00:00.000Z",
        toDate: "2026-03-03T12:00:00.000Z",
        includeStructuredLogs: true,
        includeActivityLog: true
      })
    ]);

    expect(logs.length).toBeGreaterThan(0);
    expect(activityLog.length).toBeGreaterThan(0);
    expect(forensicExport.status).toBe("completed");
    expect(forensicExport.rowCount).toBeGreaterThan(0);
    expect(forensicExport.downloadUrl.endsWith(".csv")).toBe(true);
  });

  it("profiles endpoint calls and records cache hits for repeated reads", async () => {
    const runtime = createDemoApiRuntime();

    await runtime.createAnalyticsEvent({
      userId: "demo-user",
      name: "dashboard_action_blocked",
      source: "web",
      occurredAt: "2026-03-03T10:00:00.000Z",
      attributes: {
        domain: "operations",
        reason: "domain_denied",
        correlationId: "corr-profile-1"
      }
    });

    await runtime.listObservabilitySummary("demo-user");
    await runtime.listObservabilitySummary("demo-user");

    const profiles = runtime.listRuntimeProfiles();
    const summaryProfile = profiles.find((profile) => profile.endpoint === "listObservabilitySummary");

    expect(summaryProfile).toBeDefined();
    expect(summaryProfile?.calls).toBe(2);
    expect(summaryProfile?.cacheHits).toBe(1);
  });

  it("invalidates cached reads after mutating operations", async () => {
    const runtime = createDemoApiRuntime();

    await runtime.createCrashReport({
      userId: "demo-user",
      source: "backend",
      message: "initial fatal crash",
      severity: "fatal",
      occurredAt: "2026-03-03T10:00:00.000Z"
    });

    const firstSummary = await runtime.listObservabilitySummary("demo-user");
    expect(firstSummary.totalCrashReports).toBe(1);

    await runtime.listObservabilitySummary("demo-user");

    await runtime.createCrashReport({
      userId: "demo-user",
      source: "backend",
      message: "second fatal crash",
      severity: "fatal",
      occurredAt: "2026-03-03T10:05:00.000Z"
    });

    const summaryAfterMutation = await runtime.listObservabilitySummary("demo-user");
    expect(summaryAfterMutation.totalCrashReports).toBe(2);

    const profiles = runtime.listRuntimeProfiles();
    const summaryProfile = profiles.find((profile) => profile.endpoint === "listObservabilitySummary");
    expect(summaryProfile?.calls).toBe(3);
    expect(summaryProfile?.cacheHits).toBe(1);
  });
});
