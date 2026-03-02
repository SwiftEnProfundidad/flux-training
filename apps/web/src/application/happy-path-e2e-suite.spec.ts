import { describe, expect, it } from "vitest";
import type {
  ActivityLogEntry,
  AIRecommendation,
  AccessRole,
  AnalyticsEvent,
  CrashReport,
  DataDeletionRequest,
  DataExportRequest,
  DataExportRequestInput,
  ExerciseVideo,
  ForensicAuditExport,
  ForensicAuditExportRequest,
  LegalConsentSubmission,
  NutritionLog,
  ObservabilitySummary,
  OperationalAlert,
  OperationalRunbook,
  ProgressSummary,
  RoleCapabilities,
  StructuredLog,
  SyncQueueItem,
  SyncQueueProcessInput,
  SyncQueueProcessResult,
  TrainingPlan,
  WorkoutSessionInput
} from "@flux/contracts";
import type { LegalGateway } from "./manage-legal";
import { ManageLegalUseCase } from "./manage-legal";
import type { NutritionGateway } from "./manage-nutrition";
import { ManageNutritionUseCase } from "./manage-nutrition";
import type { ObservabilityGateway } from "./manage-observability";
import { ManageObservabilityUseCase } from "./manage-observability";
import type { OfflineQueueStore, OfflineSyncGateway } from "./offline-sync-queue";
import { OfflineSyncQueueUseCase } from "./offline-sync-queue";
import type { ProgressGateway } from "./manage-progress";
import { ManageProgressUseCase } from "./manage-progress";
import type { RecommendationsGateway, RecommendationsRequest } from "./manage-recommendations";
import { ManageRecommendationsUseCase } from "./manage-recommendations";
import type { RoleCapabilitiesGateway } from "./manage-role-capabilities";
import { ManageRoleCapabilitiesUseCase } from "./manage-role-capabilities";
import type { TrainingGateway } from "./manage-training";
import { ManageTrainingUseCase } from "./manage-training";

class InMemoryOfflineQueueStore implements OfflineQueueStore {
  private readonly records: SyncQueueItem[] = [];

  async add(item: SyncQueueItem): Promise<void> {
    this.records.push(item);
  }

  async list(userId: string): Promise<SyncQueueItem[]> {
    return this.records.filter((record) => record.userId === userId);
  }

  async remove(ids: string[]): Promise<void> {
    const idSet = new Set(ids);
    const remaining = this.records.filter((record) => idSet.has(record.id) === false);
    this.records.splice(0, this.records.length, ...remaining);
  }
}

class InMemoryHappyPathGateway
  implements
    TrainingGateway,
    NutritionGateway,
    ProgressGateway,
    ObservabilityGateway,
    OfflineSyncGateway,
    RecommendationsGateway,
    LegalGateway,
    RoleCapabilitiesGateway
{
  private readonly plans: TrainingPlan[] = [];
  private readonly sessions: WorkoutSessionInput[] = [];
  private readonly nutritionLogs: NutritionLog[] = [];
  private readonly analyticsEvents: AnalyticsEvent[] = [];
  private readonly crashReports: CrashReport[] = [];
  private readonly legalConsents: LegalConsentSubmission[] = [];
  private readonly exportRequests: DataExportRequestInput[] = [];
  private readonly deletionRequests: DataDeletionRequest[] = [];
  private readonly recommendations: AIRecommendation[] = [
    {
      id: "rec-happy-1",
      userId: "user-happy-1",
      title: "Complete one focused session",
      rationale: "Consistent execution improves adherence.",
      priority: "high",
      category: "training",
      expectedImpact: "retention",
      actionLabel: "Start 25-min session",
      generatedAt: "2026-03-02T18:20:00.000Z"
    }
  ];
  private readonly exerciseVideos: ExerciseVideo[] = [
    {
      id: "video-squat-es",
      exerciseId: "squat",
      title: "Sentadilla tecnica base",
      coach: "Flux Coach",
      difficulty: "beginner",
      durationSeconds: 180,
      videoUrl: "https://cdn.flux.training/videos/squat-es.mp4",
      thumbnailUrl: "https://cdn.flux.training/videos/squat-es.jpg",
      tags: ["piernas", "tecnica"],
      locale: "es-ES"
    }
  ];

  async listRoleCapabilities(role: AccessRole): Promise<RoleCapabilities> {
    const isCoach = role === "coach";
    return {
      role,
      allowedDomains: isCoach
        ? ["all", "training", "nutrition", "progress", "operations"]
        : ["all", "onboarding", "training", "nutrition", "progress", "operations"],
      permissions: isCoach
        ? [
            {
              domain: "training",
              actions: ["view", "create", "update", "approve"],
              conditions: { requiresOwnership: false, requiresMedicalConsent: true }
            },
            {
              domain: "nutrition",
              actions: ["view", "update", "export"],
              conditions: { requiresOwnership: false, requiresMedicalConsent: false }
            },
            {
              domain: "progress",
              actions: ["view", "export"],
              conditions: { requiresOwnership: false, requiresMedicalConsent: false }
            },
            {
              domain: "operations",
              actions: ["view", "assign"],
              conditions: { requiresOwnership: false, requiresMedicalConsent: false }
            }
          ]
        : [
            {
              domain: "onboarding",
              actions: ["view", "update"],
              conditions: { requiresOwnership: true, requiresMedicalConsent: false }
            },
            {
              domain: "training",
              actions: ["view", "create", "update"],
              conditions: { requiresOwnership: true, requiresMedicalConsent: true }
            },
            {
              domain: "nutrition",
              actions: ["view", "create", "update"],
              conditions: { requiresOwnership: true, requiresMedicalConsent: false }
            },
            {
              domain: "progress",
              actions: ["view", "export"],
              conditions: { requiresOwnership: true, requiresMedicalConsent: false }
            },
            {
              domain: "operations",
              actions: ["view"],
              conditions: { requiresOwnership: true, requiresMedicalConsent: false }
            }
          ],
      issuedAt: "2026-03-02T18:00:00.000Z"
    };
  }

  async submitConsent(input: LegalConsentSubmission): Promise<LegalConsentSubmission> {
    this.legalConsents.push(input);
    return input;
  }

  async requestDataExport(input: DataExportRequestInput): Promise<DataExportRequest> {
    this.exportRequests.push(input);
    return {
      id: "exp-happy-1",
      userId: input.userId,
      requestedAt: input.requestedAt ?? "2026-03-02T18:02:00.000Z",
      format: input.format,
      status: "completed",
      downloadUrl: `https://cdn.flux.training/exports/${input.userId}/exp-happy-1.${input.format}`,
      expiresAt: "2026-03-03T18:02:00.000Z"
    };
  }

  async requestDataDeletion(input: DataDeletionRequest): Promise<DataDeletionRequest> {
    this.deletionRequests.push(input);
    return input;
  }

  async createTrainingPlan(input: Omit<TrainingPlan, "createdAt">): Promise<TrainingPlan> {
    const plan = { ...input, createdAt: "2026-03-02T18:01:00.000Z" };
    this.plans.push(plan);
    return plan;
  }

  async listTrainingPlans(userId: string): Promise<TrainingPlan[]> {
    return this.plans.filter((plan) => plan.userId === userId);
  }

  async createWorkoutSession(input: WorkoutSessionInput): Promise<WorkoutSessionInput> {
    this.sessions.push(input);
    return input;
  }

  async listWorkoutSessions(userId: string, planId?: string): Promise<WorkoutSessionInput[]> {
    return this.sessions.filter(
      (session) => session.userId === userId && (planId === undefined || session.planId === planId)
    );
  }

  async listExerciseVideos(exerciseId: string, locale: string): Promise<ExerciseVideo[]> {
    return this.exerciseVideos.filter(
      (video) =>
        video.exerciseId === exerciseId && (video.locale === locale || video.locale === "en-US")
    );
  }

  async listRecommendations(input: RecommendationsRequest): Promise<AIRecommendation[]> {
    return this.recommendations.filter((item) => item.userId === input.userId);
  }

  async createNutritionLog(log: NutritionLog): Promise<NutritionLog> {
    this.nutritionLogs.push(log);
    return log;
  }

  async listNutritionLogs(userId: string): Promise<NutritionLog[]> {
    return this.nutritionLogs.filter((log) => log.userId === userId);
  }

  async getProgressSummary(userId: string): Promise<ProgressSummary> {
    const sessions = this.sessions.filter((session) => session.userId === userId);
    const logs = this.nutritionLogs.filter((log) => log.userId === userId);
    return {
      userId,
      generatedAt: "2026-03-02T18:15:00.000Z",
      workoutSessionsCount: sessions.length,
      totalTrainingMinutes: sessions.length * 30,
      totalCompletedSets: sessions.reduce(
        (total, session) =>
          total +
          session.exercises.reduce((exerciseTotal, exercise) => exerciseTotal + exercise.sets.length, 0),
        0
      ),
      nutritionLogsCount: logs.length,
      averageCalories:
        logs.length === 0 ? 0 : logs.reduce((total, log) => total + log.calories, 0) / logs.length,
      averageProteinGrams:
        logs.length === 0
          ? 0
          : logs.reduce((total, log) => total + log.proteinGrams, 0) / logs.length,
      averageCarbsGrams:
        logs.length === 0 ? 0 : logs.reduce((total, log) => total + log.carbsGrams, 0) / logs.length,
      averageFatsGrams:
        logs.length === 0 ? 0 : logs.reduce((total, log) => total + log.fatsGrams, 0) / logs.length,
      history: []
    };
  }

  async createAnalyticsEvent(event: AnalyticsEvent): Promise<AnalyticsEvent> {
    this.analyticsEvents.push(event);
    return event;
  }

  async listAnalyticsEvents(userId: string): Promise<AnalyticsEvent[]> {
    return this.analyticsEvents.filter((event) => event.userId === userId);
  }

  async createCrashReport(report: CrashReport): Promise<CrashReport> {
    this.crashReports.push(report);
    return report;
  }

  async listCrashReports(userId: string): Promise<CrashReport[]> {
    return this.crashReports.filter((report) => report.userId === userId);
  }

  async listObservabilitySummary(userId: string): Promise<ObservabilitySummary> {
    const events = this.analyticsEvents.filter((event) => event.userId === userId);
    const reports = this.crashReports.filter((report) => report.userId === userId);
    return {
      userId,
      generatedAt: "2026-03-02T18:25:00.000Z",
      totalAnalyticsEvents: events.length,
      totalCrashReports: reports.length,
      blockedActions: events.filter((event) => event.name === "dashboard_action_blocked").length,
      deniedAccessEvents: events.filter((event) => event.name === "dashboard_domain_access_denied").length,
      fatalCrashReports: reports.filter((report) => report.severity === "fatal").length,
      uniqueCorrelationIds: new Set(
        events
          .map((event) => event.attributes.correlationId)
          .filter((value): value is string => typeof value === "string" && value.length > 0)
      ).size,
      sourceBreakdown: {
        web: events.filter((event) => event.source === "web").length,
        ios: events.filter((event) => event.source === "ios").length,
        backend: events.filter((event) => event.source === "backend").length
      },
      canonicalCoverage: {
        trackedCanonicalEvents: events.filter(
          (event) => String(event.attributes.canonicalEventName ?? "custom") !== "custom"
        ).length,
        customEvents: events.filter(
          (event) => String(event.attributes.canonicalEventName ?? "custom") === "custom"
        ).length
      },
      latestAnalyticsAt:
        events.length === 0
          ? null
          : [...events].sort((left, right) => right.occurredAt.localeCompare(left.occurredAt))[0]
              ?.occurredAt ?? null,
      latestCrashAt:
        reports.length === 0
          ? null
          : [...reports].sort((left, right) => right.occurredAt.localeCompare(left.occurredAt))[0]
              ?.occurredAt ?? null
    };
  }

  async listOperationalAlerts(userId: string): Promise<OperationalAlert[]> {
    const summary = await this.listObservabilitySummary(userId);
    if (summary.fatalCrashReports === 0) {
      return [];
    }
    return [
      {
        id: "ALT-happy-fatal",
        userId,
        code: "fatal_crash_slo_breach",
        severity: "critical",
        state: "open",
        source: "backend",
        summary: "Fatal crash SLO breached.",
        correlationId: "corr-happy-ops",
        runbookId: "RB-fatal-crash",
        ownerOnCall: "backend_oncall",
        serviceLevelObjective: "fatal_crash_reports <= 0",
        currentValue: summary.fatalCrashReports,
        thresholdValue: 0,
        triggeredAt: summary.latestCrashAt ?? summary.generatedAt,
        lastEvaluatedAt: summary.generatedAt
      }
    ];
  }

  async listOperationalRunbooks(): Promise<OperationalRunbook[]> {
    return [
      {
        id: "RB-fatal-crash",
        alertCode: "fatal_crash_slo_breach",
        title: "Fatal crash response",
        objective: "Restore runtime stability.",
        ownerOnCall: "backend_oncall",
        steps: [
          {
            id: "rb-happy-step-1",
            title: "Acknowledge incident",
            ownerRole: "on_call_engineer",
            slaMinutes: 5,
            outcome: "Incident acknowledged."
          }
        ],
        updatedAt: "2026-03-02T18:21:00.000Z"
      }
    ];
  }

  async listStructuredLogs(_: string): Promise<StructuredLog[]> {
    return [];
  }

  async listActivityLog(_: string): Promise<ActivityLogEntry[]> {
    return [];
  }

  async exportForensicAudit(payload: ForensicAuditExportRequest): Promise<ForensicAuditExport> {
    return {
      id: "forensic-happy-1",
      userId: payload.userId,
      format: payload.format,
      status: "completed",
      generatedAt: "2026-03-02T18:32:00.000Z",
      rowCount: 0,
      checksum: "forensichappy1",
      downloadUrl: "https://cdn.flux.training/forensics/forensic-happy-1.csv",
      fromDate: payload.fromDate ?? null,
      toDate: payload.toDate ?? null
    };
  }

  async process(input: SyncQueueProcessInput): Promise<
    SyncQueueProcessResult & {
      idempotency: { key: string; replayed: boolean; ttlSeconds: number };
    }
  > {
    const acceptedIds: string[] = [];
    const rejected: SyncQueueProcessResult["rejected"] = [];

    for (const item of input.items) {
      if (item.userId !== input.userId) {
        rejected.push({ id: item.id, reason: "invalid_user" });
        continue;
      }

      if (item.action.type === "create_training_plan") {
        await this.createTrainingPlan(item.action.payload);
      }
      if (item.action.type === "create_workout_session") {
        await this.createWorkoutSession(item.action.payload);
      }
      if (item.action.type === "create_nutrition_log") {
        await this.createNutritionLog(item.action.payload);
      }
      acceptedIds.push(item.id);
    }

    return {
      acceptedIds,
      rejected,
      idempotency: {
        key: `web-sync:${input.userId}:${acceptedIds.join(",")}`,
        replayed: false,
        ttlSeconds: 300
      }
    };
  }
}

describe("HappyPathE2ESuite", () => {
  it("completes happy path across role access, legal, training, sync, progress and observability", async () => {
    const gateway = new InMemoryHappyPathGateway();
    const queueStore = new InMemoryOfflineQueueStore();
    const roleUseCase = new ManageRoleCapabilitiesUseCase(gateway);
    const legalUseCase = new ManageLegalUseCase(gateway);
    const trainingUseCase = new ManageTrainingUseCase(gateway);
    const nutritionUseCase = new ManageNutritionUseCase(gateway);
    const progressUseCase = new ManageProgressUseCase(gateway);
    const observabilityUseCase = new ManageObservabilityUseCase(gateway);
    const recommendationsUseCase = new ManageRecommendationsUseCase(gateway);
    const queueUseCase = new OfflineSyncQueueUseCase(
      queueStore,
      gateway,
      () => new Date("2026-03-02T18:05:00.000Z"),
      (() => {
        let counter = 0;
        return () => {
          counter += 1;
          return `happy-queue-${counter}`;
        };
      })()
    );

    const roleCapabilities = await roleUseCase.listRoleCapabilities("coach");
    expect(roleUseCase.canAccessDomain(roleCapabilities, "training")).toBe(true);
    expect(roleUseCase.canAccessDomain(roleCapabilities, "onboarding")).toBe(false);

    const consent = await legalUseCase.submitConsent({
      userId: "user-happy-1",
      acceptedAt: "2026-03-02T18:00:00.000Z",
      privacyPolicyAccepted: true,
      termsAccepted: true,
      medicalDisclaimerAccepted: true,
      policyVersion: "v1.0",
      locale: "es-ES",
      source: "web"
    });
    const exportRequest = await legalUseCase.requestDataExport({
      userId: "user-happy-1",
      format: "json"
    });
    const deletion = await legalUseCase.requestDataDeletion({
      userId: "user-happy-1",
      requestedAt: "2026-03-02T18:04:00.000Z",
      reason: "remove_account",
      status: "pending",
      exportRequested: true,
      exportFormat: "json"
    });

    const plan = await trainingUseCase.createTrainingPlan({
      id: "plan-happy-1",
      userId: "user-happy-1",
      name: "Starter",
      weeks: 4,
      days: [
        {
          dayIndex: 1,
          exercises: [{ exerciseId: "squat", targetSets: 4, targetReps: 8 }]
        }
      ]
    });

    await trainingUseCase.createWorkoutSession({
      userId: "user-happy-1",
      planId: plan.id,
      startedAt: "2026-03-02T07:00:00.000Z",
      endedAt: "2026-03-02T07:30:00.000Z",
      exercises: [{ exerciseId: "squat", sets: [{ reps: 8, loadKg: 65, rpe: 8 }] }]
    });

    await nutritionUseCase.createNutritionLog({
      userId: "user-happy-1",
      date: "2026-03-02",
      calories: 2200,
      proteinGrams: 150,
      carbsGrams: 230,
      fatsGrams: 70
    });

    await queueUseCase.queueWorkoutSession("user-happy-1", {
      userId: "user-happy-1",
      planId: plan.id,
      startedAt: "2026-03-02T08:00:00.000Z",
      endedAt: "2026-03-02T08:25:00.000Z",
      exercises: [{ exerciseId: "bench", sets: [{ reps: 10, loadKg: 50, rpe: 7 }] }]
    });
    await queueUseCase.queueNutritionLog("user-happy-1", {
      userId: "user-happy-1",
      date: "2026-03-03",
      calories: 2150,
      proteinGrams: 145,
      carbsGrams: 220,
      fatsGrams: 68
    });

    const pendingBeforeSync = await queueUseCase.listPending("user-happy-1");
    const syncResult = await queueUseCase.syncPending("user-happy-1");
    const progress = await progressUseCase.getSummary("user-happy-1");
    const videos = await trainingUseCase.listExerciseVideos("squat", "es-ES");
    const recommendations = await recommendationsUseCase.listRecommendations(
      "user-happy-1",
      "es-ES"
    );

    await observabilityUseCase.createAnalyticsEvent({
      userId: "user-happy-1",
      name: "happy_path_completed",
      source: "web",
      occurredAt: "2026-03-02T18:10:00.000Z",
      attributes: { planId: plan.id }
    });
    await observabilityUseCase.createCrashReport({
      userId: "user-happy-1",
      source: "web",
      message: "No-op warning",
      stackTrace: "happy-path-e2e-suite.spec.ts",
      severity: "warning",
      occurredAt: "2026-03-02T18:11:00.000Z"
    });

    const analytics = await observabilityUseCase.listAnalyticsEvents("user-happy-1");
    const crashes = await observabilityUseCase.listCrashReports("user-happy-1");
    const observabilitySummary = await observabilityUseCase.listObservabilitySummary(
      "user-happy-1"
    );
    const alerts = await observabilityUseCase.listOperationalAlerts("user-happy-1");
    const runbooks = await observabilityUseCase.listOperationalRunbooks();

    expect(consent.userId).toBe("user-happy-1");
    expect(exportRequest.status).toBe("completed");
    expect(deletion.status).toBe("pending");
    expect(pendingBeforeSync).toHaveLength(2);
    expect(syncResult.acceptedIds).toEqual(["happy-queue-1", "happy-queue-2"]);
    expect(syncResult.rejected).toEqual([]);
    expect(syncResult.idempotency).toEqual({
      key: "web-sync:user-happy-1:happy-queue-1,happy-queue-2",
      replayed: false,
      ttlSeconds: 300
    });
    expect(progress.workoutSessionsCount).toBe(2);
    expect(progress.nutritionLogsCount).toBe(2);
    expect(videos).toHaveLength(1);
    expect(recommendations).toHaveLength(1);
    expect(analytics).toHaveLength(1);
    expect(crashes).toHaveLength(1);
    expect(observabilitySummary.totalAnalyticsEvents).toBe(1);
    expect(observabilitySummary.totalCrashReports).toBe(1);
    expect(alerts).toHaveLength(0);
    expect(runbooks.length).toBeGreaterThan(0);
  });
});
