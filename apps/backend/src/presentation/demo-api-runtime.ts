import {
  analyticsEventSchema,
  crashReportSchema,
  dataDeletionRequestSchema,
  legalConsentSubmissionSchema,
  syncQueueProcessInputSchema,
  type AIRecommendation,
  type AnalyticsEvent,
  type CrashReport,
  type DataDeletionRequest,
  type ExerciseVideo,
  type Goal,
  type LegalConsent,
  type LegalConsentSubmission,
  type NutritionLog,
  type OnboardingResult,
  type ProgressSummary,
  type SyncQueueItem,
  type SyncQueueProcessResult,
  type TrainingPlan,
  type WorkoutSessionInput
} from "@flux/contracts";
import { CompleteOnboardingUseCase } from "../application/complete-onboarding";
import { CreateAnalyticsEventUseCase } from "../application/create-analytics-event";
import { CreateAuthSessionUseCase } from "../application/create-auth-session";
import { CreateCrashReportUseCase } from "../application/create-crash-report";
import { CreateNutritionLogUseCase } from "../application/create-nutrition-log";
import { CreateTrainingPlanUseCase } from "../application/create-training-plan";
import { CreateWorkoutSessionUseCase } from "../application/create-workout-session";
import { GenerateAIRecommendationsUseCase } from "../application/generate-ai-recommendations";
import { GetProgressSummaryUseCase } from "../application/get-progress-summary";
import { ListAnalyticsEventsUseCase } from "../application/list-analytics-events";
import { ListCrashReportsUseCase } from "../application/list-crash-reports";
import { ListExerciseVideosUseCase } from "../application/list-exercise-videos";
import { ListNutritionLogsUseCase } from "../application/list-nutrition-logs";
import { ListTrainingPlansUseCase } from "../application/list-training-plans";
import { ListWorkoutSessionsUseCase } from "../application/list-workout-sessions";
import { ProcessSyncQueueUseCase } from "../application/process-sync-queue";
import { RecordLegalConsentUseCase } from "../application/record-legal-consent";
import { RequestDataDeletionUseCase } from "../application/request-data-deletion";
import type { AnalyticsEventRepository } from "../domain/analytics-event-repository";
import type { AuthTokenVerifier } from "../domain/auth-token-verifier";
import type { CrashReportRepository } from "../domain/crash-report-repository";
import type { DataDeletionRequestRepository } from "../domain/data-deletion-request-repository";
import type { HealthScreeningRepository } from "../domain/health-screening-repository";
import type { LegalConsentRepository } from "../domain/legal-consent-repository";
import type { NutritionLogRepository } from "../domain/nutrition-log-repository";
import type { TrainingPlanRepository } from "../domain/training-plan-repository";
import type { UserProfileRepository } from "../domain/user-profile-repository";
import type { WorkoutSessionRepository } from "../domain/workout-session-repository";
import { StaticExerciseVideoRepository } from "../infrastructure/static-exercise-video-repository";

type ListExerciseVideosInput = {
  userId: string;
  exerciseId: string;
  locale: string;
};

type ListAIRecommendationsInput = {
  userId: string;
  goal: Goal;
  pendingQueueCount: number;
  daysSinceLastWorkout: number;
  recentCompletionRate: number;
  locale: string;
};

class InMemoryUserProfileRepository implements UserProfileRepository {
  private readonly records: OnboardingResult["profile"][] = [];

  async save(profile: OnboardingResult["profile"]): Promise<void> {
    this.records.push(profile);
  }
}

class InMemoryHealthScreeningRepository implements HealthScreeningRepository {
  private readonly records: OnboardingResult["screening"][] = [];

  async save(screening: OnboardingResult["screening"]): Promise<void> {
    this.records.push(screening);
  }
}

class InMemoryTrainingPlanRepository implements TrainingPlanRepository {
  private readonly records: TrainingPlan[] = [];

  async save(plan: TrainingPlan): Promise<void> {
    const existingIndex = this.records.findIndex((record) => record.id === plan.id);
    if (existingIndex >= 0) {
      this.records[existingIndex] = plan;
      return;
    }
    this.records.push(plan);
  }

  async listByUserId(userId: string): Promise<TrainingPlan[]> {
    return this.records.filter((record) => record.userId === userId);
  }
}

class InMemoryWorkoutSessionRepository implements WorkoutSessionRepository {
  private readonly records: WorkoutSessionInput[] = [];

  async save(session: WorkoutSessionInput): Promise<void> {
    this.records.push(session);
  }

  async listByUserId(userId: string): Promise<WorkoutSessionInput[]> {
    return this.records.filter((record) => record.userId === userId);
  }
}

class InMemoryNutritionLogRepository implements NutritionLogRepository {
  private readonly records: NutritionLog[] = [];

  async save(log: NutritionLog): Promise<void> {
    this.records.push(log);
  }

  async listByUserId(userId: string): Promise<NutritionLog[]> {
    return this.records.filter((record) => record.userId === userId);
  }
}

class InMemoryAnalyticsEventRepository implements AnalyticsEventRepository {
  private readonly records: AnalyticsEvent[] = [];

  async save(event: AnalyticsEvent): Promise<void> {
    this.records.push(event);
  }

  async listByUserId(userId: string): Promise<AnalyticsEvent[]> {
    return this.records.filter((record) => record.userId === userId);
  }
}

class InMemoryCrashReportRepository implements CrashReportRepository {
  private readonly records: CrashReport[] = [];

  async save(report: CrashReport): Promise<void> {
    this.records.push(report);
  }

  async listByUserId(userId: string): Promise<CrashReport[]> {
    return this.records.filter((record) => record.userId === userId);
  }
}

class InMemoryLegalConsentRepository implements LegalConsentRepository {
  private readonly records: LegalConsent[] = [];

  async save(consent: LegalConsent): Promise<void> {
    this.records.push(consent);
  }
}

class InMemoryDataDeletionRequestRepository implements DataDeletionRequestRepository {
  private readonly records: DataDeletionRequest[] = [];

  async save(request: DataDeletionRequest): Promise<void> {
    this.records.push(request);
  }
}

class DemoAuthTokenVerifier implements AuthTokenVerifier {
  async verify(providerToken: string) {
    const token = providerToken.trim();
    if (token.length === 0) {
      throw new Error("invalid_provider_token");
    }

    if (token.includes("@")) {
      return {
        provider: "email" as const,
        providerUserId: "demo-user",
        email: token,
        displayName: "Demo User"
      };
    }

    return {
      provider: "apple" as const,
      providerUserId: "demo-user",
      email: "demo@flux.training",
      displayName: "Demo User"
    };
  }
}

export type DemoApiRuntime = {
  createAuthSession(providerToken: string): Promise<Awaited<ReturnType<CreateAuthSessionUseCase["execute"]>>>;
  completeOnboarding(payload: unknown): Promise<OnboardingResult>;
  createTrainingPlan(payload: Omit<TrainingPlan, "createdAt">): Promise<TrainingPlan>;
  listTrainingPlans(userId: string): Promise<TrainingPlan[]>;
  createWorkoutSession(payload: WorkoutSessionInput): Promise<WorkoutSessionInput>;
  listWorkoutSessions(userId: string, planId?: string): Promise<WorkoutSessionInput[]>;
  createNutritionLog(payload: NutritionLog): Promise<NutritionLog>;
  listNutritionLogs(userId: string): Promise<NutritionLog[]>;
  getProgressSummary(userId: string): Promise<ProgressSummary>;
  processSyncQueue(input: { userId: string; items: SyncQueueItem[] }): Promise<SyncQueueProcessResult>;
  createAnalyticsEvent(payload: AnalyticsEvent): Promise<AnalyticsEvent>;
  listAnalyticsEvents(userId: string): Promise<AnalyticsEvent[]>;
  createCrashReport(payload: CrashReport): Promise<CrashReport>;
  listCrashReports(userId: string): Promise<CrashReport[]>;
  recordLegalConsent(payload: LegalConsentSubmission): Promise<LegalConsent>;
  requestDataDeletion(payload: DataDeletionRequest): Promise<DataDeletionRequest>;
  listExerciseVideos(input: ListExerciseVideosInput): Promise<ExerciseVideo[]>;
  listAIRecommendations(input: ListAIRecommendationsInput): Promise<AIRecommendation[]>;
};

export function createDemoApiRuntime(): DemoApiRuntime {
  const userProfileRepository = new InMemoryUserProfileRepository();
  const healthScreeningRepository = new InMemoryHealthScreeningRepository();
  const trainingPlanRepository = new InMemoryTrainingPlanRepository();
  const workoutSessionRepository = new InMemoryWorkoutSessionRepository();
  const nutritionLogRepository = new InMemoryNutritionLogRepository();
  const analyticsEventRepository = new InMemoryAnalyticsEventRepository();
  const crashReportRepository = new InMemoryCrashReportRepository();
  const legalConsentRepository = new InMemoryLegalConsentRepository();
  const dataDeletionRequestRepository = new InMemoryDataDeletionRequestRepository();
  const exerciseVideoRepository = new StaticExerciseVideoRepository();

  const createAuthSessionUseCase = new CreateAuthSessionUseCase(new DemoAuthTokenVerifier());
  const completeOnboardingUseCase = new CompleteOnboardingUseCase(
    userProfileRepository,
    healthScreeningRepository
  );
  const createTrainingPlanUseCase = new CreateTrainingPlanUseCase(trainingPlanRepository);
  const listTrainingPlansUseCase = new ListTrainingPlansUseCase(trainingPlanRepository);
  const createWorkoutSessionUseCase = new CreateWorkoutSessionUseCase(workoutSessionRepository);
  const listWorkoutSessionsUseCase = new ListWorkoutSessionsUseCase(workoutSessionRepository);
  const createNutritionLogUseCase = new CreateNutritionLogUseCase(nutritionLogRepository);
  const listNutritionLogsUseCase = new ListNutritionLogsUseCase(nutritionLogRepository);
  const getProgressSummaryUseCase = new GetProgressSummaryUseCase(
    workoutSessionRepository,
    nutritionLogRepository
  );
  const processSyncQueueUseCase = new ProcessSyncQueueUseCase(
    trainingPlanRepository,
    workoutSessionRepository,
    nutritionLogRepository
  );
  const createAnalyticsEventUseCase = new CreateAnalyticsEventUseCase(
    analyticsEventRepository
  );
  const listAnalyticsEventsUseCase = new ListAnalyticsEventsUseCase(
    analyticsEventRepository
  );
  const createCrashReportUseCase = new CreateCrashReportUseCase(crashReportRepository);
  const listCrashReportsUseCase = new ListCrashReportsUseCase(crashReportRepository);
  const recordLegalConsentUseCase = new RecordLegalConsentUseCase(legalConsentRepository);
  const requestDataDeletionUseCase = new RequestDataDeletionUseCase(
    dataDeletionRequestRepository
  );
  const listExerciseVideosUseCase = new ListExerciseVideosUseCase(exerciseVideoRepository);
  const generateAIRecommendationsUseCase = new GenerateAIRecommendationsUseCase();

  return {
    async createAuthSession(providerToken: string) {
      return createAuthSessionUseCase.execute(providerToken);
    },

    async completeOnboarding(payload: unknown) {
      return completeOnboardingUseCase.execute(payload);
    },

    async createTrainingPlan(payload: Omit<TrainingPlan, "createdAt">) {
      return createTrainingPlanUseCase.execute(payload);
    },

    async listTrainingPlans(userId: string) {
      return listTrainingPlansUseCase.execute(userId);
    },

    async createWorkoutSession(payload: WorkoutSessionInput) {
      return createWorkoutSessionUseCase.execute(payload);
    },

    async listWorkoutSessions(userId: string, planId?: string) {
      const sessions = await listWorkoutSessionsUseCase.execute(userId, planId);
      if (planId === undefined || planId.length === 0) {
        return sessions;
      }
      return sessions.filter((session) => session.planId === planId);
    },

    async createNutritionLog(payload: NutritionLog) {
      return createNutritionLogUseCase.execute(payload);
    },

    async listNutritionLogs(userId: string) {
      return listNutritionLogsUseCase.execute(userId);
    },

    async getProgressSummary(userId: string) {
      return getProgressSummaryUseCase.execute(userId);
    },

    async processSyncQueue(input: { userId: string; items: SyncQueueItem[] }) {
      const parsedInput = syncQueueProcessInputSchema.parse(input);
      return processSyncQueueUseCase.execute(parsedInput.userId, parsedInput.items);
    },

    async createAnalyticsEvent(payload: AnalyticsEvent) {
      return createAnalyticsEventUseCase.execute(analyticsEventSchema.parse(payload));
    },

    async listAnalyticsEvents(userId: string) {
      return listAnalyticsEventsUseCase.execute(userId);
    },

    async createCrashReport(payload: CrashReport) {
      return createCrashReportUseCase.execute(crashReportSchema.parse(payload));
    },

    async listCrashReports(userId: string) {
      return listCrashReportsUseCase.execute(userId);
    },

    async recordLegalConsent(payload: LegalConsentSubmission) {
      return recordLegalConsentUseCase.execute(legalConsentSubmissionSchema.parse(payload));
    },

    async requestDataDeletion(payload: DataDeletionRequest) {
      return requestDataDeletionUseCase.execute(dataDeletionRequestSchema.parse(payload));
    },

    async listExerciseVideos(input: ListExerciseVideosInput) {
      return listExerciseVideosUseCase.execute({
        userId: input.userId,
        exerciseId: input.exerciseId,
        locale: input.locale
      });
    },

    async listAIRecommendations(input: ListAIRecommendationsInput) {
      return generateAIRecommendationsUseCase.execute(input);
    }
  };
}
