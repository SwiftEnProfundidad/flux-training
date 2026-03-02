import {
  accessRoleSchema,
  analyticsEventSchema,
  authRecoveryRequestSchema,
  authRecoveryResultSchema,
  billingInvoiceSchema,
  crashReportSchema,
  dataDeletionRequestSchema,
  goalSchema,
  legalConsentSubmissionSchema,
  supportIncidentSchema,
  syncQueueProcessInputSchema
} from "@flux/contracts";
import { onRequest } from "firebase-functions/v2/https";
import { CreateAnalyticsEventUseCase } from "../application/create-analytics-event";
import { CreateAuthSessionUseCase } from "../application/create-auth-session";
import { RequestAuthRecoveryUseCase } from "../application/request-auth-recovery";
import { CreateCrashReportUseCase } from "../application/create-crash-report";
import { CreateHealthScreeningUseCase } from "../application/create-health-screening";
import { CreateNutritionLogUseCase } from "../application/create-nutrition-log";
import { CreateTrainingPlanUseCase } from "../application/create-training-plan";
import { CompleteOnboardingUseCase } from "../application/complete-onboarding";
import {
  ClientUpdateRequiredError,
  EnsureSupportedClientVersionUseCase
} from "../application/ensure-supported-client-version";
import { RecordLegalConsentUseCase } from "../application/record-legal-consent";
import { RequestDataDeletionUseCase } from "../application/request-data-deletion";
import { ListAnalyticsEventsUseCase } from "../application/list-analytics-events";
import { ListCrashReportsUseCase } from "../application/list-crash-reports";
import { ListTrainingPlansUseCase } from "../application/list-training-plans";
import { ListNutritionLogsUseCase } from "../application/list-nutrition-logs";
import { ListWorkoutSessionsUseCase } from "../application/list-workout-sessions";
import { CreateWorkoutSessionUseCase } from "../application/create-workout-session";
import { GetProgressSummaryUseCase } from "../application/get-progress-summary";
import { ProcessSyncQueueUseCase } from "../application/process-sync-queue";
import { ListExerciseVideosUseCase } from "../application/list-exercise-videos";
import { GenerateAIRecommendationsUseCase } from "../application/generate-ai-recommendations";
import { ListRoleCapabilitiesUseCase } from "../application/list-role-capabilities";
import { ListBillingInvoicesUseCase } from "../application/list-billing-invoices";
import { ListSupportIncidentsUseCase } from "../application/list-support-incidents";
import { FirebaseAuthTokenVerifier } from "../infrastructure/firebase-auth-token-verifier";
import { FirestoreAnalyticsEventRepository } from "../infrastructure/firestore-analytics-event-repository";
import { FirestoreCrashReportRepository } from "../infrastructure/firestore-crash-report-repository";
import { FirestoreHealthScreeningRepository } from "../infrastructure/firestore-health-screening-repository";
import { FirestoreLegalConsentRepository } from "../infrastructure/firestore-legal-consent-repository";
import { FirestoreNutritionLogRepository } from "../infrastructure/firestore-nutrition-log-repository";
import { FirestoreTrainingPlanRepository } from "../infrastructure/firestore-training-plan-repository";
import { FirestoreUserProfileRepository } from "../infrastructure/firestore-user-profile-repository";
import { FirestoreWorkoutSessionRepository } from "../infrastructure/firestore-workout-session-repository";
import { FirestoreDataDeletionRequestRepository } from "../infrastructure/firestore-data-deletion-request-repository";
import { StaticExerciseVideoRepository } from "../infrastructure/static-exercise-video-repository";

const repository = new FirestoreWorkoutSessionRepository();
const createWorkoutSessionUseCase = new CreateWorkoutSessionUseCase(repository);
const healthScreeningRepository = new FirestoreHealthScreeningRepository();
const createHealthScreeningUseCase = new CreateHealthScreeningUseCase(
  healthScreeningRepository
);
const userProfileRepository = new FirestoreUserProfileRepository();
const completeOnboardingUseCase = new CompleteOnboardingUseCase(
  userProfileRepository,
  healthScreeningRepository
);
const trainingPlanRepository = new FirestoreTrainingPlanRepository();
const createTrainingPlanUseCase = new CreateTrainingPlanUseCase(trainingPlanRepository);
const listTrainingPlansUseCase = new ListTrainingPlansUseCase(trainingPlanRepository);
const listWorkoutSessionsUseCase = new ListWorkoutSessionsUseCase(repository);
const nutritionLogRepository = new FirestoreNutritionLogRepository();
const createNutritionLogUseCase = new CreateNutritionLogUseCase(nutritionLogRepository);
const listNutritionLogsUseCase = new ListNutritionLogsUseCase(nutritionLogRepository);
const getProgressSummaryUseCase = new GetProgressSummaryUseCase(
  repository,
  nutritionLogRepository
);
const exerciseVideoRepository = new StaticExerciseVideoRepository();
const listExerciseVideosUseCase = new ListExerciseVideosUseCase(exerciseVideoRepository);
const generateAIRecommendationsUseCase = new GenerateAIRecommendationsUseCase();
const listRoleCapabilitiesUseCase = new ListRoleCapabilitiesUseCase();
const listBillingInvoicesUseCase = new ListBillingInvoicesUseCase(
  trainingPlanRepository,
  repository,
  nutritionLogRepository
);
const processSyncQueueUseCase = new ProcessSyncQueueUseCase(
  trainingPlanRepository,
  repository,
  nutritionLogRepository
);
const analyticsEventRepository = new FirestoreAnalyticsEventRepository();
const createAnalyticsEventUseCase = new CreateAnalyticsEventUseCase(
  analyticsEventRepository
);
const listAnalyticsEventsUseCase = new ListAnalyticsEventsUseCase(
  analyticsEventRepository
);
const crashReportRepository = new FirestoreCrashReportRepository();
const createCrashReportUseCase = new CreateCrashReportUseCase(crashReportRepository);
const listCrashReportsUseCase = new ListCrashReportsUseCase(crashReportRepository);
const listSupportIncidentsUseCase = new ListSupportIncidentsUseCase(
  analyticsEventRepository,
  crashReportRepository
);
const authTokenVerifier = new FirebaseAuthTokenVerifier();
const createAuthSessionUseCase = new CreateAuthSessionUseCase(authTokenVerifier);
const requestAuthRecoveryUseCase = new RequestAuthRecoveryUseCase();
const legalConsentRepository = new FirestoreLegalConsentRepository();
const recordLegalConsentUseCase = new RecordLegalConsentUseCase(legalConsentRepository);
const dataDeletionRequestRepository = new FirestoreDataDeletionRequestRepository();
const requestDataDeletionUseCase = new RequestDataDeletionUseCase(
  dataDeletionRequestRepository
);
const ensureSupportedClientVersionUseCase = new EnsureSupportedClientVersionUseCase({
  webMinimumVersion: String(process.env.MIN_WEB_CLIENT_VERSION ?? "0.1.0"),
  iosMinimumVersion: String(process.env.MIN_IOS_CLIENT_VERSION ?? "0.1.0")
});

type HeaderRequest = {
  header(name: string): string | string[] | undefined;
};

type JsonResponse = {
  status(code: number): {
    json(payload: Record<string, unknown>): void;
  };
};

function normalizeHeaderValue(value: string | string[] | undefined): string {
  if (typeof value === "string") {
    return value;
  }
  if (Array.isArray(value) && typeof value[0] === "string") {
    return value[0];
  }
  return "";
}

function parseOptionalPositiveIntegerQuery(value: unknown): number | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }
  const normalized = String(value).trim();
  if (normalized.length === 0) {
    return undefined;
  }
  const numeric = Number.parseInt(normalized, 10);
  if (Number.isNaN(numeric) || numeric <= 0) {
    throw new Error("invalid_limit_query");
  }
  return numeric;
}

function parseOptionalDateQuery(value: unknown): string | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }
  const normalized = String(value).trim();
  if (normalized.length === 0) {
    return undefined;
  }
  const isDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(normalized);
  const isDateTime = Number.isNaN(Date.parse(normalized)) === false;
  if (isDateOnly || isDateTime) {
    return normalized;
  }
  throw new Error("invalid_date_query");
}

function parseOptionalEnumQuery<T extends string>(
  value: unknown,
  validValues: readonly T[]
): T | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }
  const normalized = String(value).trim();
  if (normalized.length === 0) {
    return undefined;
  }
  if (validValues.includes(normalized as T)) {
    return normalized as T;
  }
  throw new Error("invalid_enum_query");
}

function createCorrelationIdSeed(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function resolveCorrelationId(request: HeaderRequest): string {
  const requestedCorrelationId = normalizeHeaderValue(request.header("x-correlation-id")).trim();
  if (requestedCorrelationId.length > 0) {
    return requestedCorrelationId;
  }
  return `flux-${createCorrelationIdSeed()}`;
}

function createStandardErrorPayload(
  request: HeaderRequest,
  error: string,
  retryable: boolean
): Record<string, unknown> {
  return {
    error,
    correlationId: resolveCorrelationId(request),
    retryable
  };
}

function sendStandardError(
  request: HeaderRequest,
  response: JsonResponse,
  statusCode: number,
  error: string
): void {
  response.status(statusCode).json(
    createStandardErrorPayload(request, error, statusCode >= 500)
  );
}

function shouldRejectUnsupportedClient(
  request: HeaderRequest,
  response: JsonResponse
): boolean {
  try {
    ensureSupportedClientVersionUseCase.execute({
      platform: normalizeHeaderValue(request.header("x-flux-client-platform")),
      clientVersion: normalizeHeaderValue(request.header("x-flux-client-version"))
    });
    return false;
  } catch (error) {
    if (error instanceof ClientUpdateRequiredError) {
      response.status(426).json({
        ...createStandardErrorPayload(request, error.code, false),
        platform: error.platform,
        minimumVersion: error.minimumVersion
      });
      return true;
    }
    sendStandardError(request, response, 400, "invalid_client_version");
    return true;
  }
}

export const health = onRequest((_request, response) => {
  response.json({ status: "ok" });
});

export const createWorkoutSession = onRequest(async (request, response) => {
  try {
    if (shouldRejectUnsupportedClient(request, response)) {
      return;
    }
    const payload = await createWorkoutSessionUseCase.execute(request.body);
    response.status(201).json({ payload });
  } catch {
    sendStandardError(request, response, 400, "invalid_workout_session_payload");
  }
});

export const createAuthSession = onRequest(async (request, response) => {
  try {
    if (shouldRejectUnsupportedClient(request, response)) {
      return;
    }
    const providerToken = String(request.body?.providerToken ?? "");
    if (providerToken.length === 0) {
      sendStandardError(request, response, 400, "missing_provider_token");
      return;
    }

    const session = await createAuthSessionUseCase.execute(providerToken);
    response.status(201).json({ session });
  } catch {
    sendStandardError(request, response, 401, "invalid_provider_token");
  }
});

export const requestAuthRecovery = onRequest(async (request, response) => {
  try {
    if (shouldRejectUnsupportedClient(request, response)) {
      return;
    }
    const payload = authRecoveryRequestSchema.parse(request.body);
    const result = await requestAuthRecoveryUseCase.execute(payload);
    response.status(201).json({ recovery: authRecoveryResultSchema.parse(result) });
  } catch (error) {
    if (error instanceof Error && error.message === "invalid_recovery_identifier") {
      sendStandardError(request, response, 400, "invalid_recovery_identifier");
      return;
    }
    sendStandardError(request, response, 400, "invalid_auth_recovery_payload");
  }
});

export const recordLegalConsent = onRequest(async (request, response) => {
  try {
    if (shouldRejectUnsupportedClient(request, response)) {
      return;
    }
    const payload = legalConsentSubmissionSchema.parse(request.body);
    const consent = await recordLegalConsentUseCase.execute(payload);
    response.status(201).json({ consent });
  } catch (error) {
    if (error instanceof Error && error.message === "legal_consent_incomplete") {
      sendStandardError(request, response, 400, "legal_consent_incomplete");
      return;
    }
    sendStandardError(request, response, 400, "invalid_legal_consent_payload");
  }
});

export const requestDataDeletion = onRequest(async (request, response) => {
  try {
    if (shouldRejectUnsupportedClient(request, response)) {
      return;
    }
    const payload = dataDeletionRequestSchema.parse(request.body);
    const deletionRequest = await requestDataDeletionUseCase.execute(payload);
    response.status(201).json({ request: deletionRequest });
  } catch {
    sendStandardError(request, response, 400, "invalid_data_deletion_request_payload");
  }
});

export const createHealthScreening = onRequest(async (request, response) => {
  try {
    if (shouldRejectUnsupportedClient(request, response)) {
      return;
    }
    const screening = await createHealthScreeningUseCase.execute({
      userId: String(request.body?.userId ?? ""),
      onboardingProfile: request.body?.onboardingProfile,
      responses: request.body?.responses ?? []
    });
    response.status(201).json({ screening });
  } catch {
    sendStandardError(request, response, 400, "invalid_health_screening_payload");
  }
});

export const completeOnboarding = onRequest(async (request, response) => {
  try {
    if (shouldRejectUnsupportedClient(request, response)) {
      return;
    }
    const result = await completeOnboardingUseCase.execute(request.body);
    response.status(201).json({ result });
  } catch {
    sendStandardError(request, response, 400, "invalid_onboarding_payload");
  }
});

export const createTrainingPlan = onRequest(async (request, response) => {
  try {
    if (shouldRejectUnsupportedClient(request, response)) {
      return;
    }
    const plan = await createTrainingPlanUseCase.execute(request.body);
    response.status(201).json({ plan });
  } catch {
    sendStandardError(request, response, 400, "invalid_training_plan_payload");
  }
});

export const listTrainingPlans = onRequest(async (request, response) => {
  try {
    if (shouldRejectUnsupportedClient(request, response)) {
      return;
    }
    const userId = String(request.query.userId ?? "");
    const plans = await listTrainingPlansUseCase.execute(userId);
    response.status(200).json({ plans });
  } catch {
    sendStandardError(request, response, 400, "invalid_list_training_plans_payload");
  }
});

export const listWorkoutSessions = onRequest(async (request, response) => {
  try {
    if (shouldRejectUnsupportedClient(request, response)) {
      return;
    }
    const userId = String(request.query.userId ?? "");
    const planId =
      request.query.planId === undefined ? undefined : String(request.query.planId);
    const fromDate = parseOptionalDateQuery(request.query.fromDate);
    const toDate = parseOptionalDateQuery(request.query.toDate);
    const limit = parseOptionalPositiveIntegerQuery(request.query.limit);
    const sessions = await listWorkoutSessionsUseCase.execute(userId, planId);
    const sessionsFilteredByFromDate =
      fromDate === undefined
        ? sessions
        : sessions.filter((session) => session.endedAt >= fromDate);
    const sessionsFilteredByRange =
      toDate === undefined
        ? sessionsFilteredByFromDate
        : sessionsFilteredByFromDate.filter((session) => session.endedAt <= toDate);
    const payloadSessions =
      limit === undefined ? sessionsFilteredByRange : sessionsFilteredByRange.slice(0, limit);
    response.status(200).json({ sessions: payloadSessions });
  } catch {
    sendStandardError(request, response, 400, "invalid_list_workout_sessions_payload");
  }
});

export const listExerciseVideos = onRequest(async (request, response) => {
  try {
    if (shouldRejectUnsupportedClient(request, response)) {
      return;
    }
    const userId = String(request.query.userId ?? "");
    const exerciseId = String(request.query.exerciseId ?? "");
    const locale = String(request.query.locale ?? "es-ES");
    const videos = await listExerciseVideosUseCase.execute({
      userId,
      exerciseId,
      locale
    });
    response.status(200).json({ videos });
  } catch {
    sendStandardError(request, response, 400, "invalid_list_exercise_videos_payload");
  }
});

export const createNutritionLog = onRequest(async (request, response) => {
  try {
    if (shouldRejectUnsupportedClient(request, response)) {
      return;
    }
    const log = await createNutritionLogUseCase.execute(request.body);
    response.status(201).json({ log });
  } catch {
    sendStandardError(request, response, 400, "invalid_nutrition_log_payload");
  }
});

export const listNutritionLogs = onRequest(async (request, response) => {
  try {
    if (shouldRejectUnsupportedClient(request, response)) {
      return;
    }
    const userId = String(request.query.userId ?? "");
    const logs = await listNutritionLogsUseCase.execute(userId);
    const fromDate = parseOptionalDateQuery(request.query.fromDate);
    const toDate = parseOptionalDateQuery(request.query.toDate);
    const limit = parseOptionalPositiveIntegerQuery(request.query.limit);
    const logsFilteredByFromDate =
      fromDate === undefined ? logs : logs.filter((log) => log.date >= fromDate);
    const logsFilteredByRange =
      toDate === undefined
        ? logsFilteredByFromDate
        : logsFilteredByFromDate.filter((log) => log.date <= toDate);
    const payloadLogs = limit === undefined ? logsFilteredByRange : logsFilteredByRange.slice(0, limit);
    response.status(200).json({ logs: payloadLogs });
  } catch {
    sendStandardError(request, response, 400, "invalid_list_nutrition_logs_payload");
  }
});

export const getProgressSummary = onRequest(async (request, response) => {
  try {
    if (shouldRejectUnsupportedClient(request, response)) {
      return;
    }
    const userId = String(request.query.userId ?? "");
    const generatedAt = parseOptionalDateQuery(request.query.generatedAt);
    const summary = await getProgressSummaryUseCase.execute(userId, generatedAt);
    response.status(200).json({ summary });
  } catch {
    sendStandardError(request, response, 400, "invalid_get_progress_summary_payload");
  }
});

export const listAIRecommendations = onRequest(async (request, response) => {
  try {
    if (shouldRejectUnsupportedClient(request, response)) {
      return;
    }
    const pendingQueueCount = Number.parseInt(
      String(request.query.pendingQueueCount ?? "0"),
      10
    );
    const daysSinceLastWorkout = Number.parseInt(
      String(request.query.daysSinceLastWorkout ?? "0"),
      10
    );
    const recentCompletionRate = Number.parseFloat(
      String(request.query.recentCompletionRate ?? "1")
    );
    const recommendations = await generateAIRecommendationsUseCase.execute({
      userId: String(request.query.userId ?? ""),
      goal: goalSchema.parse(String(request.query.goal ?? "recomposition")),
      pendingQueueCount: Number.isNaN(pendingQueueCount) ? 0 : pendingQueueCount,
      daysSinceLastWorkout: Number.isNaN(daysSinceLastWorkout) ? 0 : daysSinceLastWorkout,
      recentCompletionRate: Number.isNaN(recentCompletionRate) ? 1 : recentCompletionRate,
      locale: String(request.query.locale ?? "es-ES")
    });
    response.status(200).json({ recommendations });
  } catch {
    sendStandardError(request, response, 400, "invalid_list_ai_recommendations_payload");
  }
});

export const listRoleCapabilities = onRequest(async (request, response) => {
  try {
    if (shouldRejectUnsupportedClient(request, response)) {
      return;
    }
    const role = accessRoleSchema.parse(String(request.query.role ?? "athlete"));
    const capabilities = listRoleCapabilitiesUseCase.execute(role);
    response.status(200).json({ capabilities });
  } catch {
    sendStandardError(request, response, 400, "invalid_list_role_capabilities_payload");
  }
});

export const listBillingInvoices = onRequest(async (request, response) => {
  try {
    if (shouldRejectUnsupportedClient(request, response)) {
      return;
    }
    const userId = String(request.query.userId ?? "");
    const invoices = await listBillingInvoicesUseCase.execute(userId);
    response.status(200).json({ invoices: billingInvoiceSchema.array().parse(invoices) });
  } catch {
    sendStandardError(request, response, 400, "invalid_list_billing_invoices_payload");
  }
});

export const listSupportIncidents = onRequest(async (request, response) => {
  try {
    if (shouldRejectUnsupportedClient(request, response)) {
      return;
    }
    const userId = String(request.query.userId ?? "");
    const incidents = await listSupportIncidentsUseCase.execute(userId);
    response.status(200).json({ incidents: supportIncidentSchema.array().parse(incidents) });
  } catch {
    sendStandardError(request, response, 400, "invalid_list_support_incidents_payload");
  }
});

export const processSyncQueue = onRequest(async (request, response) => {
  try {
    if (shouldRejectUnsupportedClient(request, response)) {
      return;
    }
    const payload = syncQueueProcessInputSchema.parse(request.body);
    const result = await processSyncQueueUseCase.execute(payload.userId, payload.items);
    response.status(200).json({ result });
  } catch {
    sendStandardError(request, response, 400, "invalid_process_sync_queue_payload");
  }
});

export const createAnalyticsEvent = onRequest(async (request, response) => {
  try {
    if (shouldRejectUnsupportedClient(request, response)) {
      return;
    }
    const event = analyticsEventSchema.parse(request.body);
    const payload = await createAnalyticsEventUseCase.execute(event);
    response.status(201).json({ event: payload });
  } catch {
    sendStandardError(request, response, 400, "invalid_analytics_event_payload");
  }
});

export const listAnalyticsEvents = onRequest(async (request, response) => {
  try {
    if (shouldRejectUnsupportedClient(request, response)) {
      return;
    }
    const userId = String(request.query.userId ?? "");
    const events = await listAnalyticsEventsUseCase.execute(userId);
    const sourceFilter = parseOptionalEnumQuery(
      request.query.source,
      ["web", "ios", "backend"] as const
    );
    const domainFilter = String(request.query.domain ?? "").trim().toLowerCase();
    const queryFilter = String(request.query.query ?? "").trim().toLowerCase();
    const limit = parseOptionalPositiveIntegerQuery(request.query.limit);
    const eventsFilteredBySource =
      sourceFilter === undefined
        ? events
        : events.filter((event) => event.source === sourceFilter);
    const eventsFilteredByDomain =
      domainFilter.length === 0
        ? eventsFilteredBySource
        : eventsFilteredBySource.filter((event) =>
            String(event.attributes.domain ?? "").toLowerCase().includes(domainFilter)
          );
    const eventsFilteredByQuery =
      queryFilter.length === 0
        ? eventsFilteredByDomain
        : eventsFilteredByDomain.filter((event) => {
            const reason = String(event.attributes.reason ?? "").toLowerCase();
            const correlationId = String(event.attributes.correlationId ?? "").toLowerCase();
            return (
              event.name.toLowerCase().includes(queryFilter) ||
              reason.includes(queryFilter) ||
              correlationId.includes(queryFilter)
            );
          });
    const payloadEvents =
      limit === undefined ? eventsFilteredByQuery : eventsFilteredByQuery.slice(0, limit);
    response.status(200).json({ events: payloadEvents });
  } catch {
    sendStandardError(request, response, 400, "invalid_list_analytics_events_payload");
  }
});

export const createCrashReport = onRequest(async (request, response) => {
  try {
    if (shouldRejectUnsupportedClient(request, response)) {
      return;
    }
    const report = crashReportSchema.parse(request.body);
    const payload = await createCrashReportUseCase.execute(report);
    response.status(201).json({ report: payload });
  } catch {
    sendStandardError(request, response, 400, "invalid_crash_report_payload");
  }
});

export const listCrashReports = onRequest(async (request, response) => {
  try {
    if (shouldRejectUnsupportedClient(request, response)) {
      return;
    }
    const userId = String(request.query.userId ?? "");
    const reports = await listCrashReportsUseCase.execute(userId);
    const sourceFilter = parseOptionalEnumQuery(
      request.query.source,
      ["web", "ios", "backend"] as const
    );
    const severityFilter = parseOptionalEnumQuery(
      request.query.severity,
      ["warning", "fatal"] as const
    );
    const queryFilter = String(request.query.query ?? "").trim().toLowerCase();
    const limit = parseOptionalPositiveIntegerQuery(request.query.limit);
    const reportsFilteredBySource =
      sourceFilter === undefined
        ? reports
        : reports.filter((report) => report.source === sourceFilter);
    const reportsFilteredBySeverity =
      severityFilter === undefined
        ? reportsFilteredBySource
        : reportsFilteredBySource.filter((report) => report.severity === severityFilter);
    const reportsFilteredByQuery =
      queryFilter.length === 0
        ? reportsFilteredBySeverity
        : reportsFilteredBySeverity.filter((report) => {
            const stackTrace = (report.stackTrace ?? "").toLowerCase();
            return (
              report.message.toLowerCase().includes(queryFilter) ||
              stackTrace.includes(queryFilter)
            );
          });
    const payloadReports =
      limit === undefined ? reportsFilteredByQuery : reportsFilteredByQuery.slice(0, limit);
    response.status(200).json({ reports: payloadReports });
  } catch {
    sendStandardError(request, response, 400, "invalid_list_crash_reports_payload");
  }
});
