import { describe, expect, it } from "vitest";
import type {
  AnalyticsEvent,
  CrashReport,
  ExerciseVideo,
  NutritionLog,
  ProgressSummary,
  SyncQueueItem,
  SyncQueueProcessInput,
  SyncQueueProcessResult,
  TrainingPlan,
  WorkoutSessionInput
} from "@flux/contracts";
import type { NutritionGateway } from "./manage-nutrition";
import type { ObservabilityGateway } from "./manage-observability";
import { ManageObservabilityUseCase } from "./manage-observability";
import type { OfflineQueueStore, OfflineSyncGateway } from "./offline-sync-queue";
import { OfflineSyncQueueUseCase } from "./offline-sync-queue";
import type { ProgressGateway } from "./manage-progress";
import { ManageProgressUseCase } from "./manage-progress";
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

class RecoveryGateway
  implements TrainingGateway, NutritionGateway, ProgressGateway, ObservabilityGateway, OfflineSyncGateway
{
  private readonly plans: TrainingPlan[] = [];
  private readonly sessions: WorkoutSessionInput[] = [];
  private readonly logs: NutritionLog[] = [];
  private readonly analytics: AnalyticsEvent[] = [];
  private readonly crashes: CrashReport[] = [];
  private syncAttempts = 0;

  async createTrainingPlan(input: Omit<TrainingPlan, "createdAt">): Promise<TrainingPlan> {
    const plan = { ...input, createdAt: "2026-03-02T20:00:00.000Z" };
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

  async listExerciseVideos(_: string, __: string): Promise<ExerciseVideo[]> {
    return [];
  }

  async createNutritionLog(log: NutritionLog): Promise<NutritionLog> {
    this.logs.push(log);
    return log;
  }

  async listNutritionLogs(userId: string): Promise<NutritionLog[]> {
    return this.logs.filter((log) => log.userId === userId);
  }

  async getProgressSummary(userId: string): Promise<ProgressSummary> {
    const sessions = this.sessions.filter((session) => session.userId === userId);
    const logs = this.logs.filter((log) => log.userId === userId);
    return {
      userId,
      generatedAt: "2026-03-02T20:05:00.000Z",
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
    this.analytics.push(event);
    return event;
  }

  async listAnalyticsEvents(userId: string): Promise<AnalyticsEvent[]> {
    return this.analytics.filter((event) => event.userId === userId);
  }

  async createCrashReport(report: CrashReport): Promise<CrashReport> {
    this.crashes.push(report);
    return report;
  }

  async listCrashReports(userId: string): Promise<CrashReport[]> {
    return this.crashes.filter((report) => report.userId === userId);
  }

  async process(input: SyncQueueProcessInput): Promise<
    SyncQueueProcessResult & {
      idempotency: { key: string; replayed: boolean; ttlSeconds: number };
    }
  > {
    this.syncAttempts += 1;
    if (this.syncAttempts === 1) {
      return {
        acceptedIds: [],
        rejected: input.items.map((item) => ({ id: item.id, reason: "processing_failed" })),
        idempotency: {
          key: `recovery-sync:${input.userId}`,
          replayed: false,
          ttlSeconds: 300
        }
      };
    }

    for (const item of input.items) {
      if (item.action.type === "create_workout_session") {
        await this.createWorkoutSession(item.action.payload);
      }
      if (item.action.type === "create_nutrition_log") {
        await this.createNutritionLog(item.action.payload);
      }
    }

    return {
      acceptedIds: input.items.map((item) => item.id),
      rejected: [],
      idempotency: {
        key: `recovery-sync:${input.userId}`,
        replayed: true,
        ttlSeconds: 300
      }
    };
  }
}

describe("RecoveryPathE2ESuite", () => {
  it("retries failed offline sync and converges to recovered runtime state", async () => {
    const gateway = new RecoveryGateway();
    const queueStore = new InMemoryOfflineQueueStore();
    const trainingUseCase = new ManageTrainingUseCase(gateway);
    const progressUseCase = new ManageProgressUseCase(gateway);
    const observabilityUseCase = new ManageObservabilityUseCase(gateway);
    const queueUseCase = new OfflineSyncQueueUseCase(
      queueStore,
      gateway,
      () => new Date("2026-03-02T20:01:00.000Z"),
      (() => {
        let counter = 0;
        return () => {
          counter += 1;
          return `recovery-queue-${counter}`;
        };
      })()
    );

    const plan = await trainingUseCase.createTrainingPlan({
      id: "plan-recovery-1",
      userId: "user-recovery-1",
      name: "Recovery Plan",
      weeks: 4,
      days: [
        {
          dayIndex: 1,
          exercises: [{ exerciseId: "squat", targetSets: 4, targetReps: 8 }]
        }
      ]
    });

    await queueUseCase.queueWorkoutSession("user-recovery-1", {
      userId: "user-recovery-1",
      planId: plan.id,
      startedAt: "2026-03-02T08:00:00.000Z",
      endedAt: "2026-03-02T08:30:00.000Z",
      exercises: [{ exerciseId: "squat", sets: [{ reps: 8, loadKg: 60, rpe: 8 }] }]
    });

    const firstSync = await queueUseCase.syncPending("user-recovery-1");
    const pendingAfterFailure = await queueUseCase.listPending("user-recovery-1");
    const secondSync = await queueUseCase.syncPending("user-recovery-1");
    const pendingAfterRecovery = await queueUseCase.listPending("user-recovery-1");
    const progress = await progressUseCase.getSummary("user-recovery-1");

    await observabilityUseCase.createCrashReport({
      userId: "user-recovery-1",
      source: "web",
      message: "Initial sync failure",
      stackTrace: "recovery-path-e2e-suite.spec.ts",
      severity: "warning",
      occurredAt: "2026-03-02T20:02:00.000Z"
    });
    await observabilityUseCase.createAnalyticsEvent({
      userId: "user-recovery-1",
      name: "recovery_path_completed",
      source: "web",
      occurredAt: "2026-03-02T20:03:00.000Z",
      attributes: { recovered: true }
    });

    const crashes = await observabilityUseCase.listCrashReports("user-recovery-1");
    const analytics = await observabilityUseCase.listAnalyticsEvents("user-recovery-1");

    expect(firstSync.acceptedIds).toEqual([]);
    expect(firstSync.rejected).toEqual([
      { id: "recovery-queue-1", reason: "processing_failed" }
    ]);
    expect(firstSync.idempotency).toEqual({
      key: "recovery-sync:user-recovery-1",
      replayed: false,
      ttlSeconds: 300
    });
    expect(pendingAfterFailure).toHaveLength(1);

    expect(secondSync.acceptedIds).toEqual(["recovery-queue-1"]);
    expect(secondSync.rejected).toEqual([]);
    expect(secondSync.idempotency).toEqual({
      key: "recovery-sync:user-recovery-1",
      replayed: true,
      ttlSeconds: 300
    });
    expect(pendingAfterRecovery).toHaveLength(0);
    expect(progress.workoutSessionsCount).toBe(1);
    expect(crashes).toHaveLength(1);
    expect(analytics).toHaveLength(1);
  });
});
