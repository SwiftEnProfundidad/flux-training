import {
  completeOnboarding,
  createAnalyticsEvent,
  createAuthSession,
  createCrashReport,
  createHealthScreening,
  createNutritionLog,
  createTrainingPlan,
  createWorkoutSession,
  evaluateAccessDecision,
  exportForensicAudit,
  getProgressSummary,
  health,
  listAIRecommendations,
  listActivityLog,
  listAnalyticsEvents,
  listBillingInvoices,
  listCrashReports,
  listDataRetentionPolicies,
  listDeniedAccessAudits,
  listExerciseVideos,
  listNutritionLogs,
  listObservabilitySummary,
  listOperationalAlerts,
  listOperationalRunbooks,
  listRoleCapabilities,
  listStructuredLogs,
  listSupportIncidents,
  listTrainingPlans,
  listWorkoutSessions,
  processSyncQueue,
  recordDeniedAccessAudit,
  recordLegalConsent,
  requestAuthRecovery,
  requestDataDeletion,
  requestDataExport
} from "./http";
import { type HttpsFunction } from "firebase-functions/v2/https";

export type BackendHttpHandler = HttpsFunction;

const endpointHandlers: Record<string, BackendHttpHandler> = {
  health,
  createWorkoutSession,
  createAuthSession,
  requestAuthRecovery,
  recordLegalConsent,
  requestDataExport,
  requestDataDeletion,
  listDataRetentionPolicies,
  createHealthScreening,
  completeOnboarding,
  createTrainingPlan,
  listTrainingPlans,
  listWorkoutSessions,
  listExerciseVideos,
  createNutritionLog,
  listNutritionLogs,
  getProgressSummary,
  listAIRecommendations,
  listRoleCapabilities,
  evaluateAccessDecision,
  recordDeniedAccessAudit,
  listDeniedAccessAudits,
  listBillingInvoices,
  listSupportIncidents,
  processSyncQueue,
  createAnalyticsEvent,
  listAnalyticsEvents,
  createCrashReport,
  listCrashReports,
  listObservabilitySummary,
  listOperationalAlerts,
  listOperationalRunbooks,
  listStructuredLogs,
  listActivityLog,
  exportForensicAudit
};

export function resolveVercelEndpointHandler(endpoint: string): BackendHttpHandler | null {
  const normalizedEndpoint = endpoint.trim();
  if (normalizedEndpoint.length === 0) {
    return null;
  }
  return endpointHandlers[normalizedEndpoint] ?? null;
}
