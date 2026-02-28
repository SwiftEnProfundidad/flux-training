import { describe, expect, it } from "vitest";
import type {
  AnalyticsEvent,
  CrashReport,
  ExerciseVideo,
  HealthScreening,
  NutritionLog,
  TrainingPlan,
  UserProfile,
  WorkoutSessionInput
} from "@flux/contracts";
import { CompleteOnboardingUseCase } from "./complete-onboarding";
import { CreateAnalyticsEventUseCase } from "./create-analytics-event";
import { CreateCrashReportUseCase } from "./create-crash-report";
import { GetProgressSummaryUseCase } from "./get-progress-summary";
import { ListAnalyticsEventsUseCase } from "./list-analytics-events";
import { ListCrashReportsUseCase } from "./list-crash-reports";
import { ProcessSyncQueueUseCase } from "./process-sync-queue";
import { ListExerciseVideosUseCase } from "./list-exercise-videos";
import { GenerateAIRecommendationsUseCase } from "./generate-ai-recommendations";
import type { AnalyticsEventRepository } from "../domain/analytics-event-repository";
import type { CrashReportRepository } from "../domain/crash-report-repository";
import type { ExerciseVideoRepository } from "../domain/exercise-video-repository";
import type { HealthScreeningRepository } from "../domain/health-screening-repository";
import type { NutritionLogRepository } from "../domain/nutrition-log-repository";
import type { TrainingPlanRepository } from "../domain/training-plan-repository";
import type { UserProfileRepository } from "../domain/user-profile-repository";
import type { WorkoutSessionRepository } from "../domain/workout-session-repository";

class InMemoryUserProfileRepository implements UserProfileRepository {
  records: UserProfile[] = [];

  async save(profile: UserProfile): Promise<void> {
    this.records.push(profile);
  }
}

class InMemoryHealthScreeningRepository implements HealthScreeningRepository {
  records: HealthScreening[] = [];

  async save(screening: HealthScreening): Promise<void> {
    this.records.push(screening);
  }
}

class InMemoryTrainingPlanRepository implements TrainingPlanRepository {
  records: TrainingPlan[] = [];

  async save(plan: TrainingPlan): Promise<void> {
    this.records.push(plan);
  }

  async listByUserId(userId: string): Promise<TrainingPlan[]> {
    return this.records.filter((record) => record.userId === userId);
  }
}

class InMemoryWorkoutSessionRepository implements WorkoutSessionRepository {
  records: WorkoutSessionInput[] = [];

  async save(session: WorkoutSessionInput): Promise<void> {
    this.records.push(session);
  }

  async listByUserId(userId: string): Promise<WorkoutSessionInput[]> {
    return this.records.filter((record) => record.userId === userId);
  }
}

class InMemoryNutritionLogRepository implements NutritionLogRepository {
  records: NutritionLog[] = [];

  async save(log: NutritionLog): Promise<void> {
    this.records.push(log);
  }

  async listByUserId(userId: string): Promise<NutritionLog[]> {
    return this.records.filter((record) => record.userId === userId);
  }
}

class InMemoryAnalyticsEventRepository implements AnalyticsEventRepository {
  records: AnalyticsEvent[] = [];

  async save(event: AnalyticsEvent): Promise<void> {
    this.records.push(event);
  }

  async listByUserId(userId: string): Promise<AnalyticsEvent[]> {
    return this.records.filter((record) => record.userId === userId);
  }
}

class InMemoryCrashReportRepository implements CrashReportRepository {
  records: CrashReport[] = [];

  async save(report: CrashReport): Promise<void> {
    this.records.push(report);
  }

  async listByUserId(userId: string): Promise<CrashReport[]> {
    return this.records.filter((record) => record.userId === userId);
  }
}

class InMemoryExerciseVideoRepository implements ExerciseVideoRepository {
  constructor(private readonly records: ExerciseVideo[]) {}

  async listByExerciseID(exerciseID: string, locale: string): Promise<ExerciseVideo[]> {
    return this.records.filter(
      (record) =>
        record.exerciseId === exerciseID &&
        (record.locale === locale || record.locale === "en-US")
    );
  }
}

describe("CriticalRegressionSuite", () => {
  it("keeps core product flows stable across onboarding, sync, progress and observability", async () => {
    const userProfileRepository = new InMemoryUserProfileRepository();
    const healthScreeningRepository = new InMemoryHealthScreeningRepository();
    const trainingPlanRepository = new InMemoryTrainingPlanRepository();
    const workoutSessionRepository = new InMemoryWorkoutSessionRepository();
    const nutritionLogRepository = new InMemoryNutritionLogRepository();
    const analyticsEventRepository = new InMemoryAnalyticsEventRepository();
    const crashReportRepository = new InMemoryCrashReportRepository();
    const exerciseVideoRepository = new InMemoryExerciseVideoRepository([
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
    ]);

    const completeOnboardingUseCase = new CompleteOnboardingUseCase(
      userProfileRepository,
      healthScreeningRepository
    );
    const processSyncQueueUseCase = new ProcessSyncQueueUseCase(
      trainingPlanRepository,
      workoutSessionRepository,
      nutritionLogRepository
    );
    const getProgressSummaryUseCase = new GetProgressSummaryUseCase(
      workoutSessionRepository,
      nutritionLogRepository
    );
    const createAnalyticsEventUseCase = new CreateAnalyticsEventUseCase(
      analyticsEventRepository
    );
    const listAnalyticsEventsUseCase = new ListAnalyticsEventsUseCase(
      analyticsEventRepository
    );
    const createCrashReportUseCase = new CreateCrashReportUseCase(
      crashReportRepository
    );
    const listCrashReportsUseCase = new ListCrashReportsUseCase(crashReportRepository);
    const listExerciseVideosUseCase = new ListExerciseVideosUseCase(
      exerciseVideoRepository
    );
    const generateAIRecommendationsUseCase = new GenerateAIRecommendationsUseCase(
      () => "2026-02-28T10:15:00.000Z"
    );

    const onboardingResult = await completeOnboardingUseCase.execute({
      userId: "user-1",
      goal: "recomposition",
      onboardingProfile: {
        displayName: "Juan",
        age: 35,
        heightCm: 178,
        weightKg: 84,
        availableDaysPerWeek: 4,
        equipment: ["dumbbells"],
        injuries: []
      },
      responses: [{ questionId: "parq-1", answer: false }]
    });

    const syncResult = await processSyncQueueUseCase.execute("user-1", [
      {
        id: "queue-plan",
        userId: "user-1",
        enqueuedAt: "2026-02-28T10:00:00.000Z",
        action: {
          type: "create_training_plan",
          payload: {
            id: "plan-1",
            userId: "user-1",
            name: "Starter Plan",
            weeks: 4,
            days: [
              {
                dayIndex: 1,
                exercises: [{ exerciseId: "squat", targetSets: 4, targetReps: 8 }]
              }
            ]
          }
        }
      },
      {
        id: "queue-workout",
        userId: "user-1",
        enqueuedAt: "2026-02-28T10:01:00.000Z",
        action: {
          type: "create_workout_session",
          payload: {
            userId: "user-1",
            planId: "plan-1",
            startedAt: "2026-02-28T08:00:00.000Z",
            endedAt: "2026-02-28T08:45:00.000Z",
            exercises: [
              {
                exerciseId: "squat",
                sets: [{ reps: 8, loadKg: 60, rpe: 8 }]
              }
            ]
          }
        }
      },
      {
        id: "queue-nutrition",
        userId: "user-1",
        enqueuedAt: "2026-02-28T10:02:00.000Z",
        action: {
          type: "create_nutrition_log",
          payload: {
            userId: "user-1",
            date: "2026-02-28",
            calories: 2200,
            proteinGrams: 150,
            carbsGrams: 230,
            fatsGrams: 70
          }
        }
      }
    ]);

    const progressSummary = await getProgressSummaryUseCase.execute(
      "user-1",
      "2026-02-28T10:10:00.000Z"
    );

    await createAnalyticsEventUseCase.execute({
      userId: "user-1",
      name: "regression_flow_completed",
      source: "backend",
      occurredAt: "2026-02-28T10:11:00.000Z",
      attributes: { queueProcessed: true }
    });
    const analyticsEvents = await listAnalyticsEventsUseCase.execute("user-1");

    await createCrashReportUseCase.execute({
      userId: "user-1",
      source: "backend",
      message: "Simulated warning for regression",
      stackTrace: "critical-regression-suite.spec.ts",
      severity: "warning",
      occurredAt: "2026-02-28T10:12:00.000Z"
    });
    const crashReports = await listCrashReportsUseCase.execute("user-1");
    const exerciseVideos = await listExerciseVideosUseCase.execute({
      userId: "user-1",
      exerciseId: "squat",
      locale: "es-ES"
    });
    const aiRecommendations = await generateAIRecommendationsUseCase.execute({
      userId: "user-1",
      goal: "recomposition",
      pendingQueueCount: 2,
      daysSinceLastWorkout: 3,
      recentCompletionRate: 0.5,
      locale: "es-ES"
    });

    expect(onboardingResult.profile.id).toBe("user-1");
    expect(userProfileRepository.records).toHaveLength(1);
    expect(healthScreeningRepository.records).toHaveLength(1);
    expect(syncResult.acceptedIds).toEqual([
      "queue-plan",
      "queue-workout",
      "queue-nutrition"
    ]);
    expect(syncResult.rejected).toEqual([]);
    expect(progressSummary.workoutSessionsCount).toBe(1);
    expect(progressSummary.nutritionLogsCount).toBe(1);
    expect(progressSummary.history).toHaveLength(1);
    expect(exerciseVideos).toHaveLength(1);
    expect(aiRecommendations[0]?.priority).toBe("high");
    expect(analyticsEvents).toHaveLength(1);
    expect(crashReports).toHaveLength(1);
  });
});
