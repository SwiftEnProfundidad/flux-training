import {
  accessRoleSchema,
  analyticsEventSchema,
  authRecoveryRequestSchema,
  authRecoveryResultSchema,
  billingInvoiceSchema,
  crashReportSchema,
  dataExportRequestInputSchema,
  dataExportRequestSchema,
  dataDeletionRequestSchema,
  dataRetentionPolicySchema,
  legalConsentSubmissionSchema,
  supportIncidentSchema,
  roleCapabilitiesSchema,
  syncQueueProcessInputSchema,
  type AccessRole,
  type AIRecommendation,
  type AnalyticsEvent,
  type AuthRecoveryRequest,
  type AuthRecoveryResult,
  type BillingInvoice,
  type CrashReport,
  type DataDeletionRequest,
  type DataExportRequest,
  type DataExportRequestInput,
  type DataRetentionPolicy,
  type ExerciseVideo,
  type Goal,
  type HealthScreening,
  type LegalConsentAudit,
  type LegalConsent,
  type LegalConsentSubmission,
  type NutritionLog,
  type OnboardingProfileInput,
  type OnboardingResult,
  type ParQResponse,
  type ProgressSummary,
  type RoleCapabilities,
  type SupportIncident,
  type SyncQueueItem,
  type SyncQueueProcessResult,
  type TrainingPlan,
  type WorkoutSessionInput
} from "@flux/contracts";
import { CompleteOnboardingUseCase } from "../application/complete-onboarding";
import { CreateAnalyticsEventUseCase } from "../application/create-analytics-event";
import { CreateAuthSessionUseCase } from "../application/create-auth-session";
import { CreateHealthScreeningUseCase } from "../application/create-health-screening";
import { RequestAuthRecoveryUseCase } from "../application/request-auth-recovery";
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
import { ListRoleCapabilitiesUseCase } from "../application/list-role-capabilities";
import { ListBillingInvoicesUseCase } from "../application/list-billing-invoices";
import { ListSupportIncidentsUseCase } from "../application/list-support-incidents";
import { ListDataRetentionPoliciesUseCase } from "../application/list-data-retention-policies";
import { ProcessSyncQueueUseCase } from "../application/process-sync-queue";
import { RecordLegalConsentUseCase } from "../application/record-legal-consent";
import { RequestDataExportUseCase } from "../application/request-data-export";
import { RequestDataDeletionUseCase } from "../application/request-data-deletion";
import type { AnalyticsEventRepository } from "../domain/analytics-event-repository";
import type { AuthTokenVerifier } from "../domain/auth-token-verifier";
import type { CrashReportRepository } from "../domain/crash-report-repository";
import type { DataDeletionRequestRepository } from "../domain/data-deletion-request-repository";
import type { DataExportRequestRepository } from "../domain/data-export-request-repository";
import type { HealthScreeningRepository } from "../domain/health-screening-repository";
import type { LegalConsentAuditRepository } from "../domain/legal-consent-audit-repository";
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

type DateRangeListOptions = {
  fromDate?: string | undefined;
  toDate?: string | undefined;
  limit?: number | undefined;
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

class InMemoryLegalConsentAuditRepository implements LegalConsentAuditRepository {
  private readonly records: LegalConsentAudit[] = [];

  async save(entry: LegalConsentAudit): Promise<void> {
    this.records.push(entry);
  }
}

class InMemoryDataDeletionRequestRepository implements DataDeletionRequestRepository {
  private readonly records: DataDeletionRequest[] = [];

  async save(request: DataDeletionRequest): Promise<void> {
    this.records.push(request);
  }
}

class InMemoryDataExportRequestRepository implements DataExportRequestRepository {
  private readonly records: DataExportRequest[] = [];

  async save(request: DataExportRequest): Promise<void> {
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

function filterByDateRangeAndLimit<T>(
  records: T[],
  options: DateRangeListOptions | undefined,
  dateResolver: (record: T) => string
): T[] {
  if (options === undefined) {
    return records;
  }

  const filteredByFromDate =
    options.fromDate === undefined
      ? records
      : records.filter((record) => dateResolver(record) >= options.fromDate!);

  const filteredByRange =
    options.toDate === undefined
      ? filteredByFromDate
      : filteredByFromDate.filter((record) => dateResolver(record) <= options.toDate!);

  if (options.limit === undefined) {
    return filteredByRange;
  }

  return filteredByRange.slice(0, options.limit);
}

export type DemoApiRuntime = {
  createAuthSession(providerToken: string): Promise<Awaited<ReturnType<CreateAuthSessionUseCase["execute"]>>>;
  requestAuthRecovery(payload: AuthRecoveryRequest): Promise<AuthRecoveryResult>;
  createHealthScreening(payload: {
    userId: string;
    onboardingProfile: OnboardingProfileInput;
    responses: ParQResponse[];
  }): Promise<HealthScreening>;
  completeOnboarding(payload: unknown): Promise<OnboardingResult>;
  createTrainingPlan(payload: Omit<TrainingPlan, "createdAt">): Promise<TrainingPlan>;
  listTrainingPlans(userId: string): Promise<TrainingPlan[]>;
  createWorkoutSession(payload: WorkoutSessionInput): Promise<WorkoutSessionInput>;
  listWorkoutSessions(
    userId: string,
    planId?: string,
    options?: DateRangeListOptions
  ): Promise<WorkoutSessionInput[]>;
  createNutritionLog(payload: NutritionLog): Promise<NutritionLog>;
  listNutritionLogs(userId: string, options?: DateRangeListOptions): Promise<NutritionLog[]>;
  getProgressSummary(userId: string, generatedAt?: string): Promise<ProgressSummary>;
  processSyncQueue(input: { userId: string; items: SyncQueueItem[] }): Promise<SyncQueueProcessResult>;
  createAnalyticsEvent(payload: AnalyticsEvent): Promise<AnalyticsEvent>;
  listAnalyticsEvents(userId: string): Promise<AnalyticsEvent[]>;
  createCrashReport(payload: CrashReport): Promise<CrashReport>;
  listCrashReports(userId: string): Promise<CrashReport[]>;
  recordLegalConsent(payload: LegalConsentSubmission): Promise<LegalConsent>;
  requestDataExport(payload: DataExportRequestInput): Promise<DataExportRequest>;
  requestDataDeletion(payload: DataDeletionRequest): Promise<DataDeletionRequest>;
  listDataRetentionPolicies(): Promise<DataRetentionPolicy[]>;
  listExerciseVideos(input: ListExerciseVideosInput): Promise<ExerciseVideo[]>;
  listAIRecommendations(input: ListAIRecommendationsInput): Promise<AIRecommendation[]>;
  listRoleCapabilities(role: AccessRole): Promise<RoleCapabilities>;
  listBillingInvoices(userId: string): Promise<BillingInvoice[]>;
  listSupportIncidents(userId: string): Promise<SupportIncident[]>;
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
  const legalConsentAuditRepository = new InMemoryLegalConsentAuditRepository();
  const dataExportRequestRepository = new InMemoryDataExportRequestRepository();
  const dataDeletionRequestRepository = new InMemoryDataDeletionRequestRepository();
  const exerciseVideoRepository = new StaticExerciseVideoRepository();

  const createAuthSessionUseCase = new CreateAuthSessionUseCase(new DemoAuthTokenVerifier());
  const createHealthScreeningUseCase = new CreateHealthScreeningUseCase(
    healthScreeningRepository
  );
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
  const recordLegalConsentUseCase = new RecordLegalConsentUseCase(
    legalConsentRepository,
    legalConsentAuditRepository
  );
  const requestDataExportUseCase = new RequestDataExportUseCase(
    dataExportRequestRepository
  );
  const requestDataDeletionUseCase = new RequestDataDeletionUseCase(
    dataDeletionRequestRepository
  );
  const listDataRetentionPoliciesUseCase = new ListDataRetentionPoliciesUseCase();
  const requestAuthRecoveryUseCase = new RequestAuthRecoveryUseCase();
  const listExerciseVideosUseCase = new ListExerciseVideosUseCase(exerciseVideoRepository);
  const generateAIRecommendationsUseCase = new GenerateAIRecommendationsUseCase();
  const listRoleCapabilitiesUseCase = new ListRoleCapabilitiesUseCase();
  const listBillingInvoicesUseCase = new ListBillingInvoicesUseCase(
    trainingPlanRepository,
    workoutSessionRepository,
    nutritionLogRepository
  );
  const listSupportIncidentsUseCase = new ListSupportIncidentsUseCase(
    analyticsEventRepository,
    crashReportRepository
  );

  return {
    async createAuthSession(providerToken: string) {
      return createAuthSessionUseCase.execute(providerToken);
    },

    async requestAuthRecovery(payload: AuthRecoveryRequest) {
      const parsedPayload = authRecoveryRequestSchema.parse(payload);
      const result = await requestAuthRecoveryUseCase.execute(parsedPayload);
      return authRecoveryResultSchema.parse(result);
    },

    async createHealthScreening(payload: {
      userId: string;
      onboardingProfile: OnboardingProfileInput;
      responses: ParQResponse[];
    }) {
      return createHealthScreeningUseCase.execute({
        userId: payload.userId,
        onboardingProfile: payload.onboardingProfile,
        responses: payload.responses
      });
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

    async listWorkoutSessions(userId: string, planId?: string, options?: DateRangeListOptions) {
      const sessions = await listWorkoutSessionsUseCase.execute(userId, planId);
      const filteredByDate = filterByDateRangeAndLimit(
        sessions,
        options,
        (session) => session.endedAt
      );
      if (planId === undefined || planId.length === 0) {
        return filteredByDate;
      }
      return filteredByDate.filter((session) => session.planId === planId);
    },

    async createNutritionLog(payload: NutritionLog) {
      return createNutritionLogUseCase.execute(payload);
    },

    async listNutritionLogs(userId: string, options?: DateRangeListOptions) {
      const logs = await listNutritionLogsUseCase.execute(userId);
      return filterByDateRangeAndLimit(logs, options, (log) => log.date);
    },

    async getProgressSummary(userId: string, generatedAt?: string) {
      return getProgressSummaryUseCase.execute(userId, generatedAt);
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

    async requestDataExport(payload: DataExportRequestInput) {
      const parsedPayload = dataExportRequestInputSchema.parse(payload);
      const request = await requestDataExportUseCase.execute(parsedPayload);
      return dataExportRequestSchema.parse(request);
    },

    async requestDataDeletion(payload: DataDeletionRequest) {
      return requestDataDeletionUseCase.execute(dataDeletionRequestSchema.parse(payload));
    },

    async listDataRetentionPolicies() {
      return dataRetentionPolicySchema
        .array()
        .parse(listDataRetentionPoliciesUseCase.execute());
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
    },

    async listRoleCapabilities(role: AccessRole) {
      const parsedRole = accessRoleSchema.parse(role);
      return roleCapabilitiesSchema.parse(listRoleCapabilitiesUseCase.execute(parsedRole));
    },

    async listBillingInvoices(userId: string) {
      const invoices = await listBillingInvoicesUseCase.execute(userId);
      return billingInvoiceSchema.array().parse(invoices);
    },

    async listSupportIncidents(userId: string) {
      const incidents = await listSupportIncidentsUseCase.execute(userId);
      return supportIncidentSchema.array().parse(incidents);
    }
  };
}
