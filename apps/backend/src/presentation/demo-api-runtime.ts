import {
  accessDecisionInputSchema,
  accessDecisionResultSchema,
  accessRoleSchema,
  activityLogEntrySchema,
  analyticsEventSchema,
  authRecoveryRequestSchema,
  authRecoveryResultSchema,
  billingInvoiceSchema,
  crashReportSchema,
  dataExportRequestInputSchema,
  dataExportRequestSchema,
  dataDeletionRequestSchema,
  dataRetentionPolicySchema,
  observabilitySummarySchema,
  operationalAlertSchema,
  operationalRunbookSchema,
  deniedAccessAuditInputSchema,
  deniedAccessAuditSchema,
  forensicAuditExportRequestSchema,
  forensicAuditExportSchema,
  legalConsentSubmissionSchema,
  structuredLogSchema,
  supportIncidentSchema,
  roleCapabilitiesSchema,
  syncQueueProcessInputSchema,
  type ActivityLogEntry,
  type AccessDecisionInput,
  type AccessDecisionResult,
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
  type DeniedAccessAudit,
  type DeniedAccessAuditInput,
  type ExerciseVideo,
  type ForensicAuditExport,
  type ForensicAuditExportRequest,
  type Goal,
  type HealthScreening,
  type LegalConsentAudit,
  type LegalConsent,
  type LegalConsentSubmission,
  type NutritionLog,
  type ObservabilitySummary,
  type OperationalAlert,
  type OperationalRunbook,
  type OnboardingProfileInput,
  type OnboardingResult,
  type ParQResponse,
  type ProgressSummary,
  type RoleCapabilities,
  type StructuredLog,
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
import { ListObservabilitySummaryUseCase } from "../application/list-observability-summary";
import { ListOperationalAlertsUseCase } from "../application/list-operational-alerts";
import { ListOperationalRunbooksUseCase } from "../application/list-operational-runbooks";
import { ListStructuredLogsUseCase, type StructuredLogListOptions } from "../application/list-structured-logs";
import { ProcessSyncQueueUseCase } from "../application/process-sync-queue";
import { RecordLegalConsentUseCase } from "../application/record-legal-consent";
import { RecordDeniedAccessAuditUseCase } from "../application/record-denied-access-audit";
import { RequestDataExportUseCase } from "../application/request-data-export";
import { RequestDataDeletionUseCase } from "../application/request-data-deletion";
import { EvaluateRoleAccessUseCase } from "../application/evaluate-role-access";
import { ListDeniedAccessAuditsUseCase } from "../application/list-denied-access-audits";
import { ListActivityLogUseCase, type ActivityLogListOptions } from "../application/list-activity-log";
import { ExportForensicAuditUseCase } from "../application/export-forensic-audit";
import type { AnalyticsEventRepository } from "../domain/analytics-event-repository";
import type { AuthTokenVerifier } from "../domain/auth-token-verifier";
import type { CrashReportRepository } from "../domain/crash-report-repository";
import type { DataDeletionRequestRepository } from "../domain/data-deletion-request-repository";
import type { DataExportRequestRepository } from "../domain/data-export-request-repository";
import type { DeniedAccessAuditRepository } from "../domain/denied-access-audit-repository";
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

type RuntimeProfileEntry = {
  endpoint: string;
  calls: number;
  cacheHits: number;
  averageMs: number;
  maxMs: number;
  lastMs: number;
};

type RuntimeProfileAccumulator = {
  calls: number;
  cacheHits: number;
  totalMs: number;
  maxMs: number;
  lastMs: number;
};

type RuntimeCacheEntry<T> = {
  expiresAt: number;
  value: T;
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
  private readonly recordsById = new Map<string, TrainingPlan>();
  private readonly recordsByUserId = new Map<string, TrainingPlan[]>();

  async save(plan: TrainingPlan): Promise<void> {
    const existing = this.recordsById.get(plan.id);
    if (existing !== undefined && existing.userId !== plan.userId) {
      const oldUserPlans = this.recordsByUserId.get(existing.userId);
      if (oldUserPlans !== undefined) {
        this.recordsByUserId.set(
          existing.userId,
          oldUserPlans.filter((record) => record.id !== plan.id)
        );
      }
    }

    this.recordsById.set(plan.id, plan);

    const userPlans = this.recordsByUserId.get(plan.userId) ?? [];
    const existingIndex = userPlans.findIndex((record) => record.id === plan.id);
    if (existingIndex >= 0) {
      userPlans[existingIndex] = plan;
    } else {
      userPlans.push(plan);
    }
    this.recordsByUserId.set(plan.userId, userPlans);
  }

  async listByUserId(userId: string): Promise<TrainingPlan[]> {
    const records = this.recordsByUserId.get(userId) ?? [];
    return [...records];
  }
}

class InMemoryWorkoutSessionRepository implements WorkoutSessionRepository {
  private readonly recordsByUserId = new Map<string, WorkoutSessionInput[]>();

  async save(session: WorkoutSessionInput): Promise<void> {
    const userSessions = this.recordsByUserId.get(session.userId) ?? [];
    userSessions.push(session);
    this.recordsByUserId.set(session.userId, userSessions);
  }

  async listByUserId(userId: string): Promise<WorkoutSessionInput[]> {
    const records = this.recordsByUserId.get(userId) ?? [];
    return [...records];
  }
}

class InMemoryNutritionLogRepository implements NutritionLogRepository {
  private readonly recordsByUserId = new Map<string, NutritionLog[]>();

  async save(log: NutritionLog): Promise<void> {
    const userLogs = this.recordsByUserId.get(log.userId) ?? [];
    userLogs.push(log);
    this.recordsByUserId.set(log.userId, userLogs);
  }

  async listByUserId(userId: string): Promise<NutritionLog[]> {
    const records = this.recordsByUserId.get(userId) ?? [];
    return [...records];
  }
}

class InMemoryAnalyticsEventRepository implements AnalyticsEventRepository {
  private readonly recordsByUserId = new Map<string, AnalyticsEvent[]>();

  async save(event: AnalyticsEvent): Promise<void> {
    const userEvents = this.recordsByUserId.get(event.userId) ?? [];
    userEvents.push(event);
    this.recordsByUserId.set(event.userId, userEvents);
  }

  async listByUserId(userId: string): Promise<AnalyticsEvent[]> {
    const records = this.recordsByUserId.get(userId) ?? [];
    return [...records];
  }
}

class InMemoryCrashReportRepository implements CrashReportRepository {
  private readonly recordsByUserId = new Map<string, CrashReport[]>();

  async save(report: CrashReport): Promise<void> {
    const userReports = this.recordsByUserId.get(report.userId) ?? [];
    userReports.push(report);
    this.recordsByUserId.set(report.userId, userReports);
  }

  async listByUserId(userId: string): Promise<CrashReport[]> {
    const records = this.recordsByUserId.get(userId) ?? [];
    return [...records];
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

class InMemoryDeniedAccessAuditRepository implements DeniedAccessAuditRepository {
  private readonly recordsByUserId = new Map<string, DeniedAccessAudit[]>();

  async save(audit: DeniedAccessAudit): Promise<void> {
    const userAudits = this.recordsByUserId.get(audit.userId) ?? [];
    userAudits.push(audit);
    this.recordsByUserId.set(audit.userId, userAudits);
  }

  async listByUserId(userId: string): Promise<DeniedAccessAudit[]> {
    const records = this.recordsByUserId.get(userId) ?? [];
    return [...records];
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
  evaluateAccessDecision(payload: AccessDecisionInput): Promise<AccessDecisionResult>;
  recordDeniedAccessAudit(payload: DeniedAccessAuditInput): Promise<DeniedAccessAudit>;
  listDeniedAccessAudits(userId: string): Promise<DeniedAccessAudit[]>;
  listObservabilitySummary(userId: string): Promise<ObservabilitySummary>;
  listOperationalAlerts(userId: string): Promise<OperationalAlert[]>;
  listOperationalRunbooks(): Promise<OperationalRunbook[]>;
  listStructuredLogs(userId: string, options?: StructuredLogListOptions): Promise<StructuredLog[]>;
  listActivityLog(userId: string, options?: ActivityLogListOptions): Promise<ActivityLogEntry[]>;
  exportForensicAudit(payload: ForensicAuditExportRequest): Promise<ForensicAuditExport>;
  listBillingInvoices(userId: string): Promise<BillingInvoice[]>;
  listSupportIncidents(userId: string): Promise<SupportIncident[]>;
  listRuntimeProfiles(): RuntimeProfileEntry[];
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
  const deniedAccessAuditRepository = new InMemoryDeniedAccessAuditRepository();
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
  const evaluateRoleAccessUseCase = new EvaluateRoleAccessUseCase(
    listRoleCapabilitiesUseCase
  );
  const recordDeniedAccessAuditUseCase = new RecordDeniedAccessAuditUseCase(
    deniedAccessAuditRepository
  );
  const listDeniedAccessAuditsUseCase = new ListDeniedAccessAuditsUseCase(
    deniedAccessAuditRepository
  );
  const listBillingInvoicesUseCase = new ListBillingInvoicesUseCase(
    trainingPlanRepository,
    workoutSessionRepository,
    nutritionLogRepository
  );
  const listSupportIncidentsUseCase = new ListSupportIncidentsUseCase(
    analyticsEventRepository,
    crashReportRepository
  );
  const listObservabilitySummaryUseCase = new ListObservabilitySummaryUseCase(
    analyticsEventRepository,
    crashReportRepository
  );
  const listStructuredLogsUseCase = new ListStructuredLogsUseCase(
    analyticsEventRepository,
    crashReportRepository,
    deniedAccessAuditRepository
  );
  const listActivityLogUseCase = new ListActivityLogUseCase(
    analyticsEventRepository,
    deniedAccessAuditRepository,
    crashReportRepository
  );
  const exportForensicAuditUseCase = new ExportForensicAuditUseCase(
    listStructuredLogsUseCase,
    listActivityLogUseCase
  );
  const listOperationalAlertsUseCase = new ListOperationalAlertsUseCase(
    listObservabilitySummaryUseCase,
    listSupportIncidentsUseCase
  );
  const listOperationalRunbooksUseCase = new ListOperationalRunbooksUseCase();
  const runtimeProfiles = new Map<string, RuntimeProfileAccumulator>();
  const runtimeCache = new Map<string, RuntimeCacheEntry<unknown>>();
  const runtimeCacheTtlMs = 20_000;

  function registerRuntimeProfile(endpoint: string, elapsedMs: number, cacheHit: boolean): void {
    const current = runtimeProfiles.get(endpoint) ?? {
      calls: 0,
      cacheHits: 0,
      totalMs: 0,
      maxMs: 0,
      lastMs: 0
    };
    const next: RuntimeProfileAccumulator = {
      calls: current.calls + 1,
      cacheHits: current.cacheHits + (cacheHit ? 1 : 0),
      totalMs: current.totalMs + elapsedMs,
      maxMs: Math.max(current.maxMs, elapsedMs),
      lastMs: elapsedMs
    };
    runtimeProfiles.set(endpoint, next);
  }

  function makeCacheKey(endpoint: string, keyParts: (string | number | boolean | undefined)[]): string {
    return `${endpoint}:${JSON.stringify(keyParts)}`;
  }

  function clearRuntimeCache(): void {
    runtimeCache.clear();
  }

  async function executeProfiled<T>(endpoint: string, task: () => Promise<T>): Promise<T> {
    const startedAt = Date.now();
    const result = await task();
    registerRuntimeProfile(endpoint, Date.now() - startedAt, false);
    return result;
  }

  async function executeProfiledCached<T>(
    endpoint: string,
    keyParts: (string | number | boolean | undefined)[],
    task: () => Promise<T>,
    ttlMs: number = runtimeCacheTtlMs
  ): Promise<T> {
    const now = Date.now();
    const cacheKey = makeCacheKey(endpoint, keyParts);
    const cached = runtimeCache.get(cacheKey);
    if (cached !== undefined && cached.expiresAt > now) {
      registerRuntimeProfile(endpoint, 0, true);
      return cached.value as T;
    }

    const startedAt = now;
    const result = await task();
    runtimeCache.set(cacheKey, {
      expiresAt: now + ttlMs,
      value: result
    });
    registerRuntimeProfile(endpoint, Date.now() - startedAt, false);
    return result;
  }

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
      const createdPlan = await executeProfiled("createTrainingPlan", () =>
        createTrainingPlanUseCase.execute(payload)
      );
      clearRuntimeCache();
      return createdPlan;
    },

    async listTrainingPlans(userId: string) {
      return executeProfiledCached("listTrainingPlans", [userId], () =>
        listTrainingPlansUseCase.execute(userId)
      );
    },

    async createWorkoutSession(payload: WorkoutSessionInput) {
      const session = await executeProfiled("createWorkoutSession", () =>
        createWorkoutSessionUseCase.execute(payload)
      );
      clearRuntimeCache();
      return session;
    },

    async listWorkoutSessions(userId: string, planId?: string, options?: DateRangeListOptions) {
      return executeProfiledCached(
        "listWorkoutSessions",
        [userId, planId ?? "", options?.fromDate, options?.toDate, options?.limit],
        async () => {
          const sessions = await listWorkoutSessionsUseCase.execute(userId, planId);
          return filterByDateRangeAndLimit(sessions, options, (session) => session.endedAt);
        }
      );
    },

    async createNutritionLog(payload: NutritionLog) {
      const nutritionLog = await executeProfiled("createNutritionLog", () =>
        createNutritionLogUseCase.execute(payload)
      );
      clearRuntimeCache();
      return nutritionLog;
    },

    async listNutritionLogs(userId: string, options?: DateRangeListOptions) {
      return executeProfiledCached(
        "listNutritionLogs",
        [userId, options?.fromDate, options?.toDate, options?.limit],
        async () => {
          const logs = await listNutritionLogsUseCase.execute(userId);
          return filterByDateRangeAndLimit(logs, options, (log) => log.date);
        }
      );
    },

    async getProgressSummary(userId: string, generatedAt?: string) {
      return executeProfiledCached(
        "getProgressSummary",
        [userId, generatedAt ?? "-"],
        () => getProgressSummaryUseCase.execute(userId, generatedAt),
        8_000
      );
    },

    async processSyncQueue(input: { userId: string; items: SyncQueueItem[] }) {
      const parsedInput = syncQueueProcessInputSchema.parse(input);
      const result = await executeProfiled("processSyncQueue", () =>
        processSyncQueueUseCase.execute(parsedInput.userId, parsedInput.items)
      );
      clearRuntimeCache();
      return result;
    },

    async createAnalyticsEvent(payload: AnalyticsEvent) {
      const event = await executeProfiled("createAnalyticsEvent", () =>
        createAnalyticsEventUseCase.execute(analyticsEventSchema.parse(payload))
      );
      clearRuntimeCache();
      return event;
    },

    async listAnalyticsEvents(userId: string) {
      return executeProfiledCached("listAnalyticsEvents", [userId], () =>
        listAnalyticsEventsUseCase.execute(userId)
      );
    },

    async createCrashReport(payload: CrashReport) {
      const report = await executeProfiled("createCrashReport", () =>
        createCrashReportUseCase.execute(crashReportSchema.parse(payload))
      );
      clearRuntimeCache();
      return report;
    },

    async listCrashReports(userId: string) {
      return executeProfiledCached("listCrashReports", [userId], () =>
        listCrashReportsUseCase.execute(userId)
      );
    },

    async recordLegalConsent(payload: LegalConsentSubmission) {
      const consent = await executeProfiled("recordLegalConsent", () =>
        recordLegalConsentUseCase.execute(legalConsentSubmissionSchema.parse(payload))
      );
      clearRuntimeCache();
      return consent;
    },

    async requestDataExport(payload: DataExportRequestInput) {
      const parsedPayload = dataExportRequestInputSchema.parse(payload);
      const request = await executeProfiled("requestDataExport", () =>
        requestDataExportUseCase.execute(parsedPayload)
      );
      clearRuntimeCache();
      return dataExportRequestSchema.parse(request);
    },

    async requestDataDeletion(payload: DataDeletionRequest) {
      const request = await executeProfiled("requestDataDeletion", () =>
        requestDataDeletionUseCase.execute(dataDeletionRequestSchema.parse(payload))
      );
      clearRuntimeCache();
      return request;
    },

    async listDataRetentionPolicies() {
      return executeProfiledCached("listDataRetentionPolicies", ["global"], async () =>
        dataRetentionPolicySchema
          .array()
          .parse(listDataRetentionPoliciesUseCase.execute())
      );
    },

    async listExerciseVideos(input: ListExerciseVideosInput) {
      return executeProfiledCached(
        "listExerciseVideos",
        [input.userId, input.exerciseId, input.locale],
        () =>
          listExerciseVideosUseCase.execute({
            userId: input.userId,
            exerciseId: input.exerciseId,
            locale: input.locale
          })
      );
    },

    async listAIRecommendations(input: ListAIRecommendationsInput) {
      return executeProfiledCached(
        "listAIRecommendations",
        [
          input.userId,
          input.goal,
          input.pendingQueueCount,
          input.daysSinceLastWorkout,
          input.recentCompletionRate,
          input.locale
        ],
        () => generateAIRecommendationsUseCase.execute(input),
        8_000
      );
    },

    async listRoleCapabilities(role: AccessRole) {
      const parsedRole = accessRoleSchema.parse(role);
      return executeProfiledCached("listRoleCapabilities", [parsedRole], async () =>
        roleCapabilitiesSchema.parse(listRoleCapabilitiesUseCase.execute(parsedRole))
      );
    },

    async evaluateAccessDecision(payload: AccessDecisionInput) {
      const parsedPayload = accessDecisionInputSchema.parse(payload);
      return accessDecisionResultSchema.parse(evaluateRoleAccessUseCase.execute(parsedPayload));
    },

    async recordDeniedAccessAudit(payload: DeniedAccessAuditInput) {
      const parsedPayload = deniedAccessAuditInputSchema.parse(payload);
      const audit = await executeProfiled("recordDeniedAccessAudit", () =>
        recordDeniedAccessAuditUseCase.execute(parsedPayload)
      );
      clearRuntimeCache();
      return deniedAccessAuditSchema.parse(audit);
    },

    async listDeniedAccessAudits(userId: string) {
      return executeProfiledCached("listDeniedAccessAudits", [userId], async () =>
        deniedAccessAuditSchema
          .array()
          .parse(await listDeniedAccessAuditsUseCase.execute(userId))
      );
    },

    async listObservabilitySummary(userId: string) {
      return executeProfiledCached(
        "listObservabilitySummary",
        [userId],
        async () =>
          observabilitySummarySchema.parse(await listObservabilitySummaryUseCase.execute(userId)),
        8_000
      );
    },

    async listOperationalAlerts(userId: string) {
      return executeProfiledCached(
        "listOperationalAlerts",
        [userId],
        async () =>
          operationalAlertSchema.array().parse(
            await listOperationalAlertsUseCase.execute(userId)
          ),
        8_000
      );
    },

    async listOperationalRunbooks() {
      return executeProfiledCached("listOperationalRunbooks", ["global"], async () =>
        operationalRunbookSchema.array().parse(listOperationalRunbooksUseCase.execute())
      );
    },

    async listStructuredLogs(userId: string, options?: StructuredLogListOptions) {
      return executeProfiledCached(
        "listStructuredLogs",
        [
          userId,
          options?.fromDate,
          options?.toDate,
          options?.limit,
          options?.level,
          options?.category,
          options?.source,
          options?.query
        ],
        async () =>
          structuredLogSchema
            .array()
            .parse(await listStructuredLogsUseCase.execute(userId, options)),
        8_000
      );
    },

    async listActivityLog(userId: string, options?: ActivityLogListOptions) {
      return executeProfiledCached(
        "listActivityLog",
        [
          userId,
          options?.fromDate,
          options?.toDate,
          options?.limit,
          options?.action,
          options?.outcome,
          options?.source,
          options?.query
        ],
        async () =>
          activityLogEntrySchema
            .array()
            .parse(await listActivityLogUseCase.execute(userId, options)),
        8_000
      );
    },

    async exportForensicAudit(payload: ForensicAuditExportRequest) {
      const parsedPayload = forensicAuditExportRequestSchema.parse(payload);
      return executeProfiled("exportForensicAudit", async () =>
        forensicAuditExportSchema.parse(await exportForensicAuditUseCase.execute(parsedPayload))
      );
    },

    async listBillingInvoices(userId: string) {
      return executeProfiledCached("listBillingInvoices", [userId], async () => {
        const invoices = await listBillingInvoicesUseCase.execute(userId);
        return billingInvoiceSchema.array().parse(invoices);
      });
    },

    async listSupportIncidents(userId: string) {
      return executeProfiledCached("listSupportIncidents", [userId], async () => {
        const incidents = await listSupportIncidentsUseCase.execute(userId);
        return supportIncidentSchema.array().parse(incidents);
      });
    },

    listRuntimeProfiles() {
      return Array.from(runtimeProfiles.entries())
        .map(([endpoint, profile]) => ({
          endpoint,
          calls: profile.calls,
          cacheHits: profile.cacheHits,
          averageMs: Math.round((profile.totalMs / Math.max(profile.calls, 1)) * 100) / 100,
          maxMs: profile.maxMs,
          lastMs: profile.lastMs
        }))
        .sort((left, right) => left.endpoint.localeCompare(right.endpoint));
    }
  };
}
