import { describe, expect, it } from "vitest";
import type {
  AIRecommendation,
  AccessRole,
  AnalyticsEvent,
  CrashReport,
  DataDeletionRequest,
  DataExportRequest,
  DataExportRequestInput,
  ExerciseVideo,
  LegalConsentSubmission,
  NutritionLog,
  ProgressSummary,
  RoleCapabilities,
  SyncQueueItem,
  SyncQueueProcessInput,
  SyncQueueProcessResult,
  TrainingPlan,
  WorkoutSessionInput
} from "@flux/contracts";
import type { LegalGateway } from "./manage-legal";
import { ManageLegalUseCase } from "./manage-legal";
import type { NutritionGateway } from "./manage-nutrition";
import type { ObservabilityGateway } from "./manage-observability";
import { ManageObservabilityUseCase } from "./manage-observability";
import type { OfflineQueueStore, OfflineSyncGateway } from "./offline-sync-queue";
import { OfflineSyncQueueUseCase } from "./offline-sync-queue";
import { ManageProgressUseCase } from "./manage-progress";
import type { ProgressGateway } from "./manage-progress";
import type { RecommendationsGateway, RecommendationsRequest } from "./manage-recommendations";
import type { RoleCapabilitiesGateway } from "./manage-role-capabilities";
import { ManageRoleCapabilitiesUseCase } from "./manage-role-capabilities";
import type { TrainingGateway } from "./manage-training";

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

class EdgeCaseGateway
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
  async listRoleCapabilities(role: AccessRole): Promise<RoleCapabilities> {
    return {
      role,
      allowedDomains: ["training", "progress", "operations"],
      permissions: [
        {
          domain: "training",
          actions: ["view", "create", "update", "approve"],
          conditions: { requiresOwnership: false, requiresMedicalConsent: true }
        },
        {
          domain: "progress",
          actions: ["view"],
          conditions: { requiresOwnership: false, requiresMedicalConsent: false }
        },
        {
          domain: "operations",
          actions: ["view", "assign"],
          conditions: { requiresOwnership: false, requiresMedicalConsent: false }
        }
      ],
      issuedAt: "2026-03-02T19:00:00.000Z"
    };
  }

  async submitConsent(input: LegalConsentSubmission): Promise<LegalConsentSubmission> {
    return input;
  }

  async requestDataExport(input: DataExportRequestInput): Promise<DataExportRequest> {
    return {
      id: "exp-edge-1",
      userId: input.userId,
      requestedAt: input.requestedAt ?? "2026-03-02T19:03:30.000Z",
      format: input.format,
      status: "completed",
      downloadUrl: `https://cdn.flux.training/exports/${input.userId}/exp-edge-1.${input.format}`,
      expiresAt: "2026-03-03T19:03:30.000Z"
    };
  }

  async requestDataDeletion(input: DataDeletionRequest): Promise<DataDeletionRequest> {
    return input;
  }

  async createTrainingPlan(input: Omit<TrainingPlan, "createdAt">): Promise<TrainingPlan> {
    return { ...input, createdAt: "2026-03-02T19:01:00.000Z" };
  }

  async listTrainingPlans(_: string): Promise<TrainingPlan[]> {
    return [];
  }

  async createWorkoutSession(input: WorkoutSessionInput): Promise<WorkoutSessionInput> {
    return input;
  }

  async listWorkoutSessions(_: string, __?: string): Promise<WorkoutSessionInput[]> {
    return [];
  }

  async listExerciseVideos(_: string, __: string): Promise<ExerciseVideo[]> {
    return [];
  }

  async listRecommendations(_: RecommendationsRequest): Promise<AIRecommendation[]> {
    return [];
  }

  async createNutritionLog(log: NutritionLog): Promise<NutritionLog> {
    return log;
  }

  async listNutritionLogs(_: string): Promise<NutritionLog[]> {
    return [];
  }

  async getProgressSummary(userId: string): Promise<ProgressSummary> {
    return {
      userId,
      generatedAt: "2026-03-02T19:02:00.000Z",
      workoutSessionsCount: 0,
      totalTrainingMinutes: 0,
      totalCompletedSets: 0,
      nutritionLogsCount: 0,
      averageCalories: 0,
      averageProteinGrams: 0,
      averageCarbsGrams: 0,
      averageFatsGrams: 0,
      history: []
    };
  }

  async createAnalyticsEvent(event: AnalyticsEvent): Promise<AnalyticsEvent> {
    return event;
  }

  async listAnalyticsEvents(_: string): Promise<AnalyticsEvent[]> {
    return [];
  }

  async createCrashReport(report: CrashReport): Promise<CrashReport> {
    return report;
  }

  async listCrashReports(_: string): Promise<CrashReport[]> {
    return [];
  }

  async process(input: SyncQueueProcessInput): Promise<
    SyncQueueProcessResult & {
      idempotency: { key: string; replayed: boolean; ttlSeconds: number };
    }
  > {
    return {
      acceptedIds: [],
      rejected: input.items.map((item) => ({ id: item.id, reason: "processing_failed" })),
      idempotency: {
        key: `edge-sync:${input.userId}:${input.items.length}`,
        replayed: false,
        ttlSeconds: 300
      }
    };
  }
}

describe("EdgeCaseE2ESuite", () => {
  it("enforces validation and keeps deterministic behavior on denied/failed edge cases", async () => {
    const gateway = new EdgeCaseGateway();
    const queueStore = new InMemoryOfflineQueueStore();
    const roleUseCase = new ManageRoleCapabilitiesUseCase(gateway);
    const legalUseCase = new ManageLegalUseCase(gateway);
    const progressUseCase = new ManageProgressUseCase(gateway);
    const observabilityUseCase = new ManageObservabilityUseCase(gateway);
    const queueUseCase = new OfflineSyncQueueUseCase(
      queueStore,
      gateway,
      () => new Date("2026-03-02T19:03:00.000Z"),
      (() => {
        let counter = 0;
        return () => {
          counter += 1;
          return `edge-queue-${counter}`;
        };
      })()
    );

    await expect(roleUseCase.listRoleCapabilities("invalid-role")).rejects.toThrow();
    const coachCapabilities = await roleUseCase.listRoleCapabilities("coach");
    expect(roleUseCase.canAccessDomain(coachCapabilities, "training")).toBe(true);
    await expect(() => roleUseCase.canAccessDomain(coachCapabilities, "invalid-domain")).toThrow();

    await expect(
      legalUseCase.requestDataDeletion({
        userId: "",
        requestedAt: "2026-03-02T19:04:00.000Z",
        reason: "remove_account",
        status: "pending",
        exportRequested: true,
        exportFormat: "json"
      })
    ).rejects.toThrow();

    await expect(progressUseCase.getSummary("")).rejects.toThrow("missing_user_id");
    await expect(observabilityUseCase.listAnalyticsEvents("")).rejects.toThrow(
      "missing_user_id"
    );

    await queueUseCase.queueWorkoutSession("user-edge-1", {
      userId: "user-edge-1",
      planId: "plan-edge-1",
      startedAt: "2026-03-02T07:00:00.000Z",
      endedAt: "2026-03-02T07:20:00.000Z",
      exercises: [{ exerciseId: "squat", sets: [{ reps: 6, loadKg: 40, rpe: 9 }] }]
    });

    const pendingBefore = await queueUseCase.listPending("user-edge-1");
    const syncResult = await queueUseCase.syncPending("user-edge-1");
    const pendingAfter = await queueUseCase.listPending("user-edge-1");

    expect(pendingBefore).toHaveLength(1);
    expect(syncResult.acceptedIds).toEqual([]);
    expect(syncResult.rejected).toEqual([
      { id: "edge-queue-1", reason: "processing_failed" }
    ]);
    expect(syncResult.idempotency).toEqual({
      key: "edge-sync:user-edge-1:1",
      replayed: false,
      ttlSeconds: 300
    });
    expect(pendingAfter).toHaveLength(1);
  });
});
