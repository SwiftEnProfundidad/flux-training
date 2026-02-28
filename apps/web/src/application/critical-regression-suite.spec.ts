import { describe, expect, it } from "vitest";
import type {
  AIRecommendation,
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
import { ManageNutritionUseCase } from "./manage-nutrition";
import type { ObservabilityGateway } from "./manage-observability";
import { ManageObservabilityUseCase } from "./manage-observability";
import type { OfflineQueueStore, OfflineSyncGateway } from "./offline-sync-queue";
import { OfflineSyncQueueUseCase } from "./offline-sync-queue";
import type { ProgressGateway } from "./manage-progress";
import { ManageProgressUseCase } from "./manage-progress";
import type { RecommendationsGateway, RecommendationsRequest } from "./manage-recommendations";
import { ManageRecommendationsUseCase } from "./manage-recommendations";
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

class InMemoryPlatformGateway
  implements
    TrainingGateway,
    NutritionGateway,
    ProgressGateway,
    ObservabilityGateway,
    OfflineSyncGateway,
    RecommendationsGateway
{
  private readonly plans: TrainingPlan[] = [];
  private readonly sessions: WorkoutSessionInput[] = [];
  private readonly nutritionLogs: NutritionLog[] = [];
  private readonly analyticsEvents: AnalyticsEvent[] = [];
  private readonly crashReports: CrashReport[] = [];
  private readonly recommendations: AIRecommendation[] = [
    {
      id: "rec-001",
      userId: "user-1",
      title: "Completa una sesion corta hoy",
      rationale: "Dos dias sin entrenar reducen adherencia semanal.",
      priority: "high",
      category: "training",
      expectedImpact: "retention",
      actionLabel: "Iniciar sesion de 20 min",
      generatedAt: "2026-03-01T10:00:00.000Z"
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

  async createTrainingPlan(input: Omit<TrainingPlan, "createdAt">): Promise<TrainingPlan> {
    const plan = { ...input, createdAt: "2026-03-01T10:00:00.000Z" };
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
      generatedAt: "2026-03-01T10:10:00.000Z",
      workoutSessionsCount: sessions.length,
      totalTrainingMinutes: sessions.length * 30,
      totalCompletedSets: sessions.reduce(
        (total, session) => total + session.exercises.reduce((exerciseTotal, exercise) => exerciseTotal + exercise.sets.length, 0),
        0
      ),
      nutritionLogsCount: logs.length,
      averageCalories:
        logs.length === 0
          ? 0
          : logs.reduce((total, log) => total + log.calories, 0) / logs.length,
      averageProteinGrams:
        logs.length === 0
          ? 0
          : logs.reduce((total, log) => total + log.proteinGrams, 0) / logs.length,
      averageCarbsGrams:
        logs.length === 0
          ? 0
          : logs.reduce((total, log) => total + log.carbsGrams, 0) / logs.length,
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

  async process(input: SyncQueueProcessInput): Promise<SyncQueueProcessResult> {
    const acceptedIds: string[] = [];
    const rejected: SyncQueueProcessResult["rejected"] = [];

    for (const item of input.items) {
      try {
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
      } catch {
        rejected.push({ id: item.id, reason: "processing_failed" });
      }
    }

    return { acceptedIds, rejected };
  }
}

describe("CriticalRegressionSuite", () => {
  it("keeps critical web use cases stable across sync, progress and observability", async () => {
    const gateway = new InMemoryPlatformGateway();
    const trainingUseCase = new ManageTrainingUseCase(gateway);
    const nutritionUseCase = new ManageNutritionUseCase(gateway);
    const progressUseCase = new ManageProgressUseCase(gateway);
    const observabilityUseCase = new ManageObservabilityUseCase(gateway);
    const recommendationsUseCase = new ManageRecommendationsUseCase(gateway);
    const queueUseCase = new OfflineSyncQueueUseCase(
      new InMemoryOfflineQueueStore(),
      gateway,
      () => new Date("2026-03-01T10:05:00.000Z"),
      (() => {
        let counter = 0;
        return () => {
          counter += 1;
          return `queue-${counter}`;
        };
      })()
    );

    const plan = await trainingUseCase.createTrainingPlan({
      id: "plan-1",
      userId: "user-1",
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
      userId: "user-1",
      planId: plan.id,
      startedAt: "2026-03-01T08:00:00.000Z",
      endedAt: "2026-03-01T08:30:00.000Z",
      exercises: [{ exerciseId: "squat", sets: [{ reps: 8, loadKg: 60, rpe: 8 }] }]
    });

    await nutritionUseCase.createNutritionLog({
      userId: "user-1",
      date: "2026-03-01",
      calories: 2200,
      proteinGrams: 150,
      carbsGrams: 230,
      fatsGrams: 70
    });

    await queueUseCase.queueWorkoutSession("user-1", {
      userId: "user-1",
      planId: plan.id,
      startedAt: "2026-03-01T09:00:00.000Z",
      endedAt: "2026-03-01T09:30:00.000Z",
      exercises: [{ exerciseId: "bench", sets: [{ reps: 10, loadKg: 50, rpe: 7 }] }]
    });

    const pendingBeforeSync = await queueUseCase.listPending("user-1");
    const syncResult = await queueUseCase.syncPending("user-1");
    const progress = await progressUseCase.getSummary("user-1");
    const videos = await trainingUseCase.listExerciseVideos("squat", "es-ES");
    const recommendations = await recommendationsUseCase.listRecommendations("user-1", "es-ES");

    await observabilityUseCase.createAnalyticsEvent({
      userId: "user-1",
      name: "critical_regression_passed",
      source: "web",
      occurredAt: "2026-03-01T10:15:00.000Z",
      attributes: { planId: plan.id }
    });
    await observabilityUseCase.createCrashReport({
      userId: "user-1",
      source: "web",
      message: "Simulated warning",
      stackTrace: "critical-regression-suite.spec.ts",
      severity: "warning",
      occurredAt: "2026-03-01T10:16:00.000Z"
    });

    const analytics = await observabilityUseCase.listAnalyticsEvents("user-1");
    const crashes = await observabilityUseCase.listCrashReports("user-1");

    expect(pendingBeforeSync).toHaveLength(1);
    expect(syncResult.acceptedIds).toEqual(["queue-1"]);
    expect(syncResult.rejected).toEqual([]);
    expect(progress.workoutSessionsCount).toBe(2);
    expect(progress.nutritionLogsCount).toBe(1);
    expect(videos).toHaveLength(1);
    expect(recommendations).toHaveLength(1);
    expect(analytics).toHaveLength(1);
    expect(crashes).toHaveLength(1);
  });
});
