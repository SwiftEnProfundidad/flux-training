import { describe, expect, it } from "vitest";
import type {
  AnalyticsEvent,
  AuthIdentity,
  CrashReport,
  DataDeletionRequest,
  ExerciseVideo,
  HealthScreening,
  LegalConsent,
  NutritionLog,
  TrainingPlan,
  UserProfile,
  WorkoutSessionInput
} from "@flux/contracts";
import { CompleteOnboardingUseCase } from "./complete-onboarding";
import { CreateAnalyticsEventUseCase } from "./create-analytics-event";
import { CreateAuthSessionUseCase } from "./create-auth-session";
import { CreateCrashReportUseCase } from "./create-crash-report";
import { GenerateAIRecommendationsUseCase } from "./generate-ai-recommendations";
import { GetProgressSummaryUseCase } from "./get-progress-summary";
import { ListAnalyticsEventsUseCase } from "./list-analytics-events";
import { ListCrashReportsUseCase } from "./list-crash-reports";
import { ListExerciseVideosUseCase } from "./list-exercise-videos";
import { ProcessSyncQueueUseCase } from "./process-sync-queue";
import { RecordLegalConsentUseCase } from "./record-legal-consent";
import { RequestAuthRecoveryUseCase } from "./request-auth-recovery";
import { RequestDataDeletionUseCase } from "./request-data-deletion";
import type { AnalyticsEventRepository } from "../domain/analytics-event-repository";
import type { AuthTokenVerifier } from "../domain/auth-token-verifier";
import type { CrashReportRepository } from "../domain/crash-report-repository";
import type { DataDeletionRequestRepository } from "../domain/data-deletion-request-repository";
import type { ExerciseVideoRepository } from "../domain/exercise-video-repository";
import type { HealthScreeningRepository } from "../domain/health-screening-repository";
import type { LegalConsentRepository } from "../domain/legal-consent-repository";
import type { NutritionLogRepository } from "../domain/nutrition-log-repository";
import type { TrainingPlanRepository } from "../domain/training-plan-repository";
import type { UserProfileRepository } from "../domain/user-profile-repository";
import type { WorkoutSessionRepository } from "../domain/workout-session-repository";

class StaticAuthTokenVerifier implements AuthTokenVerifier {
  async verify(): Promise<AuthIdentity> {
    return {
      provider: "apple",
      providerUserId: "user-happy-1",
      email: "happy@flux.app",
      displayName: "Happy User"
    };
  }
}

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

class InMemoryLegalConsentRepository implements LegalConsentRepository {
  records: LegalConsent[] = [];

  async save(consent: LegalConsent): Promise<void> {
    this.records.push(consent);
  }
}

class InMemoryDataDeletionRequestRepository implements DataDeletionRequestRepository {
  records: DataDeletionRequest[] = [];

  async save(request: DataDeletionRequest): Promise<void> {
    this.records.push(request);
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

describe("HappyPathE2ESuite", () => {
  it("completes auth, onboarding, legal, sync and observability on the enterprise happy path", async () => {
    const userProfileRepository = new InMemoryUserProfileRepository();
    const healthScreeningRepository = new InMemoryHealthScreeningRepository();
    const legalConsentRepository = new InMemoryLegalConsentRepository();
    const dataDeletionRepository = new InMemoryDataDeletionRequestRepository();
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

    const createAuthSessionUseCase = new CreateAuthSessionUseCase(
      new StaticAuthTokenVerifier()
    );
    const requestAuthRecoveryUseCase = new RequestAuthRecoveryUseCase(
      () => "2026-03-02T18:00:00.000Z"
    );
    const completeOnboardingUseCase = new CompleteOnboardingUseCase(
      userProfileRepository,
      healthScreeningRepository
    );
    const recordLegalConsentUseCase = new RecordLegalConsentUseCase(
      legalConsentRepository
    );
    const requestDataDeletionUseCase = new RequestDataDeletionUseCase(
      dataDeletionRepository
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
      () => "2026-03-02T18:15:00.000Z"
    );

    const authSession = await createAuthSessionUseCase.execute("provider-token-happy");
    const recovery = await requestAuthRecoveryUseCase.execute({
      channel: "email",
      identifier: "happy@flux.app"
    });

    const onboardingResult = await completeOnboardingUseCase.execute({
      userId: authSession.userId,
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

    const legalConsent = await recordLegalConsentUseCase.execute({
      userId: authSession.userId,
      acceptedAt: "2026-03-02T18:02:00.000Z",
      privacyPolicyAccepted: true,
      termsAccepted: true,
      medicalDisclaimerAccepted: true
    });

    const syncResult = await processSyncQueueUseCase.execute(authSession.userId, [
      {
        id: "queue-plan",
        userId: authSession.userId,
        enqueuedAt: "2026-03-02T18:03:00.000Z",
        action: {
          type: "create_training_plan",
          payload: {
            id: "plan-happy-1",
            userId: authSession.userId,
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
        userId: authSession.userId,
        enqueuedAt: "2026-03-02T18:04:00.000Z",
        action: {
          type: "create_workout_session",
          payload: {
            userId: authSession.userId,
            planId: "plan-happy-1",
            startedAt: "2026-03-02T07:00:00.000Z",
            endedAt: "2026-03-02T07:40:00.000Z",
            exercises: [
              {
                exerciseId: "squat",
                sets: [{ reps: 8, loadKg: 65, rpe: 8 }]
              }
            ]
          }
        }
      },
      {
        id: "queue-nutrition",
        userId: authSession.userId,
        enqueuedAt: "2026-03-02T18:05:00.000Z",
        action: {
          type: "create_nutrition_log",
          payload: {
            userId: authSession.userId,
            date: "2026-03-02",
            calories: 2200,
            proteinGrams: 150,
            carbsGrams: 230,
            fatsGrams: 70
          }
        }
      }
    ]);

    const progress = await getProgressSummaryUseCase.execute(
      authSession.userId,
      "2026-03-02T18:10:00.000Z"
    );
    const videos = await listExerciseVideosUseCase.execute({
      userId: authSession.userId,
      exerciseId: "squat",
      locale: "es-ES"
    });
    const recommendations = await generateAIRecommendationsUseCase.execute({
      userId: authSession.userId,
      goal: "recomposition",
      pendingQueueCount: 0,
      daysSinceLastWorkout: 2,
      recentCompletionRate: 0.82,
      locale: "es-ES"
    });

    const analytics = await createAnalyticsEventUseCase.execute({
      userId: authSession.userId,
      name: "happy_path_completed",
      source: "backend",
      occurredAt: "2026-03-02T18:12:00.000Z",
      attributes: { flow: "v3-p4-t2-1" }
    });
    const crash = await createCrashReportUseCase.execute({
      userId: authSession.userId,
      source: "backend",
      message: "No-op warning",
      stackTrace: "happy-path-e2e-suite.spec.ts",
      severity: "warning",
      occurredAt: "2026-03-02T18:13:00.000Z"
    });
    const listedAnalytics = await listAnalyticsEventsUseCase.execute(authSession.userId);
    const listedCrashes = await listCrashReportsUseCase.execute(authSession.userId);

    const deletion = await requestDataDeletionUseCase.execute({
      userId: authSession.userId,
      requestedAt: "2026-03-02T18:14:00.000Z",
      reason: "user_request",
      status: "pending"
    });

    expect(authSession.userId).toBe("user-happy-1");
    expect(recovery.status).toBe("recovery_sent_email");
    expect(onboardingResult.profile.id).toBe("user-happy-1");
    expect(legalConsent.userId).toBe("user-happy-1");
    expect(syncResult.acceptedIds).toEqual(["queue-plan", "queue-workout", "queue-nutrition"]);
    expect(syncResult.rejected).toEqual([]);
    expect(progress.workoutSessionsCount).toBe(1);
    expect(progress.nutritionLogsCount).toBe(1);
    expect(videos).toHaveLength(1);
    expect(recommendations.length).toBeGreaterThan(0);
    expect(analytics.name).toBe("happy_path_completed");
    expect(crash.severity).toBe("warning");
    expect(listedAnalytics).toHaveLength(1);
    expect(listedCrashes).toHaveLength(1);
    expect(deletion.status).toBe("pending");
    expect(legalConsentRepository.records).toHaveLength(1);
    expect(dataDeletionRepository.records).toHaveLength(1);
  });
});
