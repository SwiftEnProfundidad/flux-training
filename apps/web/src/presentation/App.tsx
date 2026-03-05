import { memo, useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import {
  AccessRole,
  ActivityLogEntry,
  AIRecommendation,
  AnalyticsEvent,
  AuthSession,
  CrashReport,
  ExerciseVideo,
  ForensicAuditExport,
  Goal,
  NutritionLog,
  ObservabilitySummary,
  OperationalAlert,
  OperationalRunbook,
  ProgressSummary,
  StructuredLog,
  TrainingPlan,
  WorkoutSessionInput,
  RoleCapabilities
} from "@flux/contracts";
import { ManageAccessControlUseCase } from "../application/manage-access-control";
import { CompleteOnboardingUseCase } from "../application/complete-onboarding";
import { ManageNutritionUseCase } from "../application/manage-nutrition";
import { ManageObservabilityUseCase } from "../application/manage-observability";
import { OfflineSyncQueueUseCase } from "../application/offline-sync-queue";
import { ManageLegalUseCase } from "../application/manage-legal";
import { ManageProgressUseCase } from "../application/manage-progress";
import { ManageTrainingUseCase } from "../application/manage-training";
import { ManageRecommendationsUseCase } from "../application/manage-recommendations";
import { ManageRoleCapabilitiesUseCase } from "../application/manage-role-capabilities";
import { CreateAuthSessionUseCase } from "../domain/auth";
import { firebaseAuthGateway } from "../infrastructure/firebase-auth-client";
import { localStorageOfflineQueueStore } from "../infrastructure/local-storage-offline-queue-store";
import { apiNutritionGateway } from "../infrastructure/nutrition-client";
import { apiObservabilityGateway } from "../infrastructure/observability-client";
import { apiOnboardingGateway } from "../infrastructure/onboarding-client";
import { apiOfflineSyncGateway } from "../infrastructure/sync-client";
import { apiProgressGateway } from "../infrastructure/progress-client";
import { apiTrainingGateway } from "../infrastructure/training-client";
import { apiRecommendationsGateway } from "../infrastructure/recommendations-client";
import { apiRoleCapabilitiesGateway } from "../infrastructure/role-capabilities-client";
import { apiAccessControlGateway } from "../infrastructure/access-control-client";
import {
  isClientUpdateRequiredError,
  setApiAccessRole,
  setApiAuthSession
} from "../infrastructure/api-client";
import { apiLegalGateway } from "../infrastructure/legal-client";
import { buildUXReadinessSnapshot, type UXReadinessSnapshot } from "./ux-readiness";
import {
  createTranslator,
  goalLabel,
  humanizeStatus,
  readinessLabel,
  resolveLanguage,
  type AppLanguage
} from "./i18n";
import {
  applyDashboardDomainToURL,
  dashboardRoles,
  getVisibleModules,
  readDashboardDomainFromURL,
  resolveDashboardRole,
  resolveDashboardDomain,
  type DashboardDomain,
  type DashboardModule,
  type DashboardRole
} from "./dashboard-domains";
import { createDashboardHomeLaneScreenModel } from "./dashboard-home-lane-contract";
import { createAlertCenterLaneScreenModel } from "./alert-center-lane-contract";
import { createSystemStatusLaneScreenModel } from "./system-status-lane-contract";
import {
  createAccessGateLaneScreenModel,
  type WebLane
} from "./access-gate-lane-contract";
import { createSignInLaneScreenModel } from "./sign-in-lane-contract";
import { createQuickActionsLaneScreenModel } from "./quick-actions-lane-contract";
import { createDashboardKpisLaneScreenModel } from "./dashboard-kpis-lane-contract";
import { createReadinessMonitorLaneScreenModel } from "./readiness-monitor-lane-contract";
import { createAlertsFullLaneScreenModel } from "./alerts-full-lane-contract";
import { createRecentActivityScreenModel } from "./recent-activity-contract";
import { createShortcutsScreenModel } from "./shortcuts-contract";
import { createAnalyticsOverviewScreenModel } from "./analytics-overview-contract";
import { createProgressTrendsScreenModel } from "./progress-trends-contract";
import { createCohortAnalysisScreenModel } from "./cohort-analysis-contract";
import { createAthleteFiltersScreenModel } from "./athlete-filters-contract";
import { createAthletesListScreenModel } from "./athletes-list-contract";
import { createAthleteDetailScreenModel } from "./athlete-detail-contract";
import { createSessionHistoryScreenModel } from "./session-history-contract";
import { createCompareProgressScreenModel } from "./compare-progress-contract";
import { createCoachNotesScreenModel } from "./coach-notes-contract";
import { createAIInsightsScreenModel } from "./ai-insights-contract";
import { createNutritionOverviewScreenModel } from "./nutrition-overview-contract";
import { createDailyLogReviewScreenModel } from "./daily-log-review-contract";
import { createDeviationAlertsScreenModel } from "./deviation-alerts-contract";
import { createNutritionCoachViewScreenModel } from "./nutrition-coach-view-contract";
import { createCohortNutritionScreenModel } from "./cohort-nutrition-contract";
import { createNutritionLogDetailScreenModel } from "./nutrition-log-detail-contract";
import { createPlansListScreenModel } from "./plans-list-contract";
import { createPlanBuilderScreenModel } from "./plan-builder-contract";
import { createPlanTemplatesScreenModel } from "./plan-templates-contract";
import { createPublishReviewScreenModel } from "./publish-review-contract";
import { createSessionDetailScreenModel } from "./session-detail-contract";
import { createPlanAssignmentScreenModel } from "./plan-assignment-contract";
import { createExerciseLibraryScreenModel } from "./exercise-library-contract";
import { createExerciseDetailScreenModel } from "./exercise-detail-contract";
import { createAdminUsersScreenModel } from "./admin-users-contract";
import { createAuditTrailScreenModel } from "./audit-trail-contract";
import { createBillingOverviewScreenModel } from "./billing-overview-contract";
import { createSupportIncidentsScreenModel } from "./support-incidents-contract";
import { createLegalComplianceScreenModel } from "./legal-compliance-contract";
import {
  createInitialDomainRuntimeStates,
  resetRuntimeStateForActiveDomain,
  resolveActiveDomainRuntimeState,
  setRuntimeStateForActiveDomain,
  type DomainRuntimeStates,
  type EnterpriseRuntimeState
} from "./runtime-states";
import {
  createDefaultAuthScreenModel,
  createDefaultOnboardingScreenModel
} from "./auth-onboarding-contract";
import { createDefaultDailyTrainingVideoScreenModel } from "./daily-training-video-contract";
import { createDefaultNutritionProgressAIScreenModel } from "./nutrition-progress-ai-contract";
import { createDefaultSettingsLegalScreenModel } from "./settings-legal-contract";
import {
  resolveBlockedActionRoute,
  resolveDomainPayloadValidation
} from "./blocked-action-contract";
import {
  createRuntimeObservabilitySession,
  nextCorrelationId,
  nextDeniedEventAttributes,
  nextEventAttributes
} from "./runtime-observability";
import {
  resolveDomainAccessDecision,
  type RoleCapabilitiesStatus
} from "./role-domain-access";
import {
  buildAthleteOperationsRows,
  filterAthleteOperationsRows,
  sortAthleteOperationsRows,
  type AthleteSortMode
} from "./core-operations";
import {
  buildGovernancePrincipals,
  buildRoleCapabilityCoverage,
  filterGovernancePrincipals,
  isAdminRole,
  type GovernanceRoleFilter
} from "./admin-governance";
import {
  buildProgressHistoryRows,
  filterNutritionLogs,
  filterProgressHistoryRows,
  sortNutritionLogs,
  sortProgressHistoryRows,
  type NutritionSortMode,
  type ProgressSortMode
} from "./nutrition-progress-operations";
import {
  buildAuditTimelineRows,
  exportAuditTimelineRowsToCSV,
  filterAuditTimelineRows,
  type AuditCategoryFilter,
  type AuditSeverityFilter,
  type AuditSourceFilter
} from "./audit-compliance";
import {
  applySupportIncidentStateOverrides,
  buildBillingInvoiceRows,
  buildSupportIncidentRows,
  filterBillingInvoiceRows,
  filterSupportIncidentRows,
  type BillingInvoiceStatusFilter,
  type SupportIncidentSeverityFilter,
  type SupportIncidentState,
  type SupportIncidentStateFilter
} from "./billing-support";
import {
  deriveModuleRuntimeStatus,
  type ModuleRuntimeStatus
} from "./module-runtime-status";
import "./app.css";

type SessionStatus = "idle" | "loading" | "saved" | "queued" | "validation_error" | "error";
type AuthStatus =
  | "signed_out"
  | "loading"
  | "validation_error"
  | "auth_error"
  | "session_required"
  | "recovery_sent_email"
  | "recovery_sent_sms"
  | `signed_in:${string}`;
type OnboardingStatus =
  | "idle"
  | "loading"
  | "saved"
  | "validation_error"
  | "consent_required"
  | "error";
type TrainingStatus =
  | "idle"
  | "loading"
  | "saved"
  | "loaded"
  | "queued"
  | "validation_error"
  | "error";
type NutritionStatus = ModuleRuntimeStatus;
type ProgressStatus = ModuleRuntimeStatus;
type SyncStatus = "idle" | "loading" | "synced" | "error";
type SyncIdempotencyMetadata = {
  key: string;
  replayed: boolean;
  ttlSeconds: number;
};
type NutritionDeviationSeverity = "high" | "medium";
type NutritionDeviationReason = "calories" | "protein";
type NutritionDeviationAlert = {
  id: string;
  date: string;
  severity: NutritionDeviationSeverity;
  reason: NutritionDeviationReason;
  calories: number;
  proteinGrams: number;
};
type CohortNutritionRow = {
  athleteId: string;
  logsCount: number;
  averageCalories: number;
  averageProteinGrams: number;
  riskLevel: "attention" | "normal";
};
type PlanBuilderTemplate = "strength" | "hypertrophy" | "recomposition";
type PlanTemplateOption = {
  template: PlanBuilderTemplate;
  weeks: number;
  daysPerWeek: number;
  focus: string;
};
type PublishChecklistItem = {
  id: string;
  label: string;
  valid: boolean;
};
type ObservabilityStatus =
  | "idle"
  | "loading"
  | "event_saved"
  | "crash_saved"
  | "loaded"
  | "error";
type ReleaseCompatibilityStatus = "compatible" | "upgrade_required";
type LegalStatus =
  | "idle"
  | "loading"
  | "saved"
  | "consent_required"
  | "deletion_requested"
  | "exported"
  | "error";
type SettingsStatus = "idle" | "loading" | "saved";
type VideoStatus = "idle" | "loading" | "loaded" | "error";
type RecommendationsStatus = "idle" | "loading" | "loaded" | "empty" | "error";
type OperationsStatus = ModuleRuntimeStatus;
type ObservabilityCollectionsPayload = {
  events: AnalyticsEvent[];
  crashReports: CrashReport[];
  summary: ObservabilitySummary;
  alerts: OperationalAlert[];
  runbooks: OperationalRunbook[];
  structuredLogs: StructuredLog[];
  activityLog: ActivityLogEntry[];
};

const languageStorageKey = "flux_training_language";
const dashboardDomainStorageKey = "flux_training_dashboard_domain";
const dashboardRoleStorageKey = "flux_training_dashboard_role";
const denseTableInitialRows = 24;
const denseTableRowsStep = 24;

function createSessionSelectionKey(session: WorkoutSessionInput, index: number): string {
  return `${session.userId}|${session.planId}|${session.startedAt}|${session.endedAt}|${index}`;
}

function createAssignedPlanId(
  basePlanId: string,
  athleteId: string,
  index: number,
  assignedAtTimestamp: number
): string {
  return `${basePlanId}-assigned-${athleteId}-${assignedAtTimestamp}-${index}`;
}

export function App() {
  const createAuthSessionUseCase = useMemo(
    () => new CreateAuthSessionUseCase(firebaseAuthGateway),
    []
  );
  const completeOnboardingUseCase = useMemo(
    () => new CompleteOnboardingUseCase(apiOnboardingGateway),
    []
  );
  const manageTrainingUseCase = useMemo(() => new ManageTrainingUseCase(apiTrainingGateway), []);
  const manageNutritionUseCase = useMemo(
    () => new ManageNutritionUseCase(apiNutritionGateway),
    []
  );
  const manageLegalUseCase = useMemo(() => new ManageLegalUseCase(apiLegalGateway), []);
  const manageObservabilityUseCase = useMemo(
    () => new ManageObservabilityUseCase(apiObservabilityGateway),
    []
  );
  const offlineSyncQueueUseCase = useMemo(
    () => new OfflineSyncQueueUseCase(localStorageOfflineQueueStore, apiOfflineSyncGateway),
    []
  );
  const manageProgressUseCase = useMemo(() => new ManageProgressUseCase(apiProgressGateway), []);
  const manageRecommendationsUseCase = useMemo(
    () => new ManageRecommendationsUseCase(apiRecommendationsGateway),
    []
  );
  const manageRoleCapabilitiesUseCase = useMemo(
    () => new ManageRoleCapabilitiesUseCase(apiRoleCapabilitiesGateway),
    []
  );
  const manageAccessControlUseCase = useMemo(
    () => new ManageAccessControlUseCase(apiAccessControlGateway),
    []
  );
  const authScreenDefaults = useMemo(() => createDefaultAuthScreenModel(), []);
  const onboardingScreenDefaults = useMemo(() => createDefaultOnboardingScreenModel(), []);
  const dailyTrainingVideoDefaults = useMemo(
    () => createDefaultDailyTrainingVideoScreenModel(),
    []
  );
  const nutritionProgressAIDefaults = useMemo(
    () => createDefaultNutritionProgressAIScreenModel(),
    []
  );
  const settingsLegalDefaults = useMemo(() => createDefaultSettingsLegalScreenModel(), []);

  const [authStatus, setAuthStatus] = useState<AuthStatus>("signed_out");
  const [activeSession, setActiveSession] = useState<AuthSession | null>(null);
  const [onboardingStatus, setOnboardingStatus] = useState<OnboardingStatus>("idle");
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>("idle");
  const [trainingStatus, setTrainingStatus] = useState<TrainingStatus>("idle");
  const [nutritionStatus, setNutritionStatus] = useState<NutritionStatus>("idle");
  const [progressStatus, setProgressStatus] = useState<ProgressStatus>("idle");
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("idle");
  const [lastSyncIdempotency, setLastSyncIdempotency] =
    useState<SyncIdempotencyMetadata | null>(null);
  const [observabilityStatus, setObservabilityStatus] = useState<ObservabilityStatus>("idle");
  const [releaseCompatibilityStatus, setReleaseCompatibilityStatus] =
    useState<ReleaseCompatibilityStatus>("compatible");
  const [legalStatus, setLegalStatus] = useState<LegalStatus>("idle");
  const [settingsStatus, setSettingsStatus] = useState<SettingsStatus>("idle");

  const [email, setEmail] = useState(authScreenDefaults.email);
  const [password, setPassword] = useState(authScreenDefaults.password);
  const [displayName, setDisplayName] = useState("Juan");
  const [age, setAge] = useState("35");
  const [heightCm, setHeightCm] = useState("178");
  const [weightKg, setWeightKg] = useState("84");
  const [availableDaysPerWeek, setAvailableDaysPerWeek] = useState("4");
  const [goal, setGoal] = useState<Goal>(onboardingScreenDefaults.goal);
  const [parQ1, setParQ1] = useState(onboardingScreenDefaults.parQ1);
  const [parQ2, setParQ2] = useState(onboardingScreenDefaults.parQ2);
  const [privacyPolicyAccepted, setPrivacyPolicyAccepted] = useState(
    onboardingScreenDefaults.privacyPolicyAccepted
  );
  const [termsAccepted, setTermsAccepted] = useState(onboardingScreenDefaults.termsAccepted);
  const [medicalDisclaimerAccepted, setMedicalDisclaimerAccepted] = useState(
    onboardingScreenDefaults.medicalDisclaimerAccepted
  );
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    settingsLegalDefaults.notificationsEnabled
  );
  const [watchSyncEnabled, setWatchSyncEnabled] = useState(settingsLegalDefaults.watchSyncEnabled);
  const [calendarSyncEnabled, setCalendarSyncEnabled] = useState(
    settingsLegalDefaults.calendarSyncEnabled
  );

  const [planName, setPlanName] = useState(dailyTrainingVideoDefaults.planName || "Starter Plan");
  const [planBuilderWeeksInput, setPlanBuilderWeeksInput] = useState("4");
  const [planBuilderDaysInput, setPlanBuilderDaysInput] = useState("3");
  const [planBuilderTemplate, setPlanBuilderTemplate] =
    useState<PlanBuilderTemplate>("recomposition");
  const [planTemplatesStatus, setPlanTemplatesStatus] = useState<ModuleRuntimeStatus>("idle");
  const [selectedPlanTemplate, setSelectedPlanTemplate] = useState<PlanBuilderTemplate | "">("");
  const [publishReviewStatus, setPublishReviewStatus] = useState<ModuleRuntimeStatus>("idle");
  const [publishChecklistAcknowledged, setPublishChecklistAcknowledged] = useState(false);
  const [publishedPlanId, setPublishedPlanId] = useState<string | null>(null);
  const [plans, setPlans] = useState<TrainingPlan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState(dailyTrainingVideoDefaults.selectedPlanId);
  const [sessions, setSessions] = useState<WorkoutSessionInput[]>(dailyTrainingVideoDefaults.sessions);
  const [selectedSessionKey, setSelectedSessionKey] = useState("");
  const [nutritionDate, setNutritionDate] = useState("2026-02-26");
  const [calories, setCalories] = useState("2200");
  const [proteinGrams, setProteinGrams] = useState("150");
  const [carbsGrams, setCarbsGrams] = useState("230");
  const [fatsGrams, setFatsGrams] = useState("70");
  const [nutritionDateFilter, setNutritionDateFilter] = useState("");
  const [nutritionMinProteinFilter, setNutritionMinProteinFilter] = useState("");
  const [nutritionMaxCaloriesFilter, setNutritionMaxCaloriesFilter] = useState("");
  const [nutritionSortMode, setNutritionSortMode] = useState<NutritionSortMode>("date_desc");
  const [selectedNutritionLogKey, setSelectedNutritionLogKey] = useState<string | null>(null);
  const [progressMinSessionsFilter, setProgressMinSessionsFilter] = useState("");
  const [progressSortMode, setProgressSortMode] = useState<ProgressSortMode>("date_desc");
  const [nutritionLogs, setNutritionLogs] = useState<NutritionLog[]>(
    nutritionProgressAIDefaults.nutritionLogs
  );
  const [progressSummary, setProgressSummary] = useState<ProgressSummary | null>(
    nutritionProgressAIDefaults.progressSummary
  );
  const [pendingQueueCount, setPendingQueueCount] = useState(0);
  const [lastSyncRejectedCount, setLastSyncRejectedCount] = useState(0);
  const [analyticsEvents, setAnalyticsEvents] = useState<AnalyticsEvent[]>([]);
  const [crashReports, setCrashReports] = useState<CrashReport[]>([]);
  const [observabilitySummary, setObservabilitySummary] = useState<ObservabilitySummary | null>(
    null
  );
  const [structuredLogs, setStructuredLogs] = useState<StructuredLog[]>([]);
  const [activityLogEntries, setActivityLogEntries] = useState<ActivityLogEntry[]>([]);
  const [forensicExportResult, setForensicExportResult] = useState<ForensicAuditExport | null>(
    null
  );
  const [operationalAlerts, setOperationalAlerts] = useState<OperationalAlert[]>([]);
  const [operationalRunbooks, setOperationalRunbooks] = useState<OperationalRunbook[]>([]);
  const [exerciseVideos, setExerciseVideos] = useState<ExerciseVideo[]>([]);
  const [videoStatus, setVideoStatus] = useState<VideoStatus>("idle");
  const [selectedExerciseForVideos, setSelectedExerciseForVideos] = useState(
    dailyTrainingVideoDefaults.selectedExercise
  );
  const [selectedExerciseVideoId, setSelectedExerciseVideoId] = useState("");
  const [videoLocale, setVideoLocale] = useState(dailyTrainingVideoDefaults.videoLocale);
  const [recommendationsStatus, setRecommendationsStatus] =
    useState<RecommendationsStatus>("idle");
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>(
    nutritionProgressAIDefaults.recommendations
  );
  const [operationsStatus, setOperationsStatus] = useState<OperationsStatus>("idle");
  const [athleteSearch, setAthleteSearch] = useState("");
  const [athleteSortMode, setAthleteSortMode] = useState<AthleteSortMode>("sessions");
  const [selectedAthleteIds, setSelectedAthleteIds] = useState<string[]>([]);
  const [governanceStatus, setGovernanceStatus] = useState<ModuleRuntimeStatus>("idle");
  const [governanceSearch, setGovernanceSearch] = useState("");
  const [governanceRoleFilter, setGovernanceRoleFilter] =
    useState<GovernanceRoleFilter>("all");
  const [governanceSelectedPrincipalIds, setGovernanceSelectedPrincipalIds] = useState<string[]>([]);
  const [governanceHasValidationError, setGovernanceHasValidationError] = useState(false);
  const [assignedRolesByPrincipal, setAssignedRolesByPrincipal] = useState<
    Record<string, DashboardRole>
  >({});
  const [capabilitiesByRole, setCapabilitiesByRole] = useState<
    Partial<Record<DashboardRole, RoleCapabilities | null>>
  >({});
  const [auditStatus, setAuditStatus] = useState<ModuleRuntimeStatus>("idle");
  const [auditQuery, setAuditQuery] = useState("");
  const [auditSourceFilter, setAuditSourceFilter] = useState<AuditSourceFilter>("all");
  const [auditCategoryFilter, setAuditCategoryFilter] = useState<AuditCategoryFilter>("all");
  const [auditSeverityFilter, setAuditSeverityFilter] = useState<AuditSeverityFilter>("all");
  const [auditDomainFilter, setAuditDomainFilter] = useState("");
  const [billingSupportStatus, setBillingSupportStatus] = useState<ModuleRuntimeStatus>("idle");
  const [billingSupportSearch, setBillingSupportSearch] = useState("");
  const [billingDomainFilter, setBillingDomainFilter] = useState("");
  const [billingInvoiceStatusFilter, setBillingInvoiceStatusFilter] =
    useState<BillingInvoiceStatusFilter>("all");
  const [billingIncidentStateFilter, setBillingIncidentStateFilter] =
    useState<SupportIncidentStateFilter>("all");
  const [billingIncidentSeverityFilter, setBillingIncidentSeverityFilter] =
    useState<SupportIncidentSeverityFilter>("all");
  const [billingSelectedIncidentIds, setBillingSelectedIncidentIds] = useState<string[]>([]);
  const [billingIncidentStateOverrides, setBillingIncidentStateOverrides] = useState<
    Record<string, SupportIncidentState>
  >({});
  const [billingHasValidationError, setBillingHasValidationError] = useState(false);
  const [athleteRowsVisibleCount, setAthleteRowsVisibleCount] = useState(denseTableInitialRows);
  const [governanceRowsVisibleCount, setGovernanceRowsVisibleCount] = useState(
    denseTableInitialRows
  );
  const [auditRowsVisibleCount, setAuditRowsVisibleCount] = useState(denseTableInitialRows);
  const [billingInvoiceRowsVisibleCount, setBillingInvoiceRowsVisibleCount] = useState(
    denseTableInitialRows
  );
  const [billingIncidentRowsVisibleCount, setBillingIncidentRowsVisibleCount] = useState(
    denseTableInitialRows
  );
  const activeUserId = activeSession?.userId.trim() ?? "";
  const hasAuthenticatedSession = activeUserId.length > 0;
  const isAuthLoading = authStatus === "loading";
  const [webLane, setWebLane] = useState<WebLane>("main");
  const isQAMode = useMemo(() => readWebRuntimeMode() === "qa", []);
  const [language, setLanguage] = useState<AppLanguage>(() =>
    resolveLanguage(readLanguagePreference())
  );
  const [activeDomain, setActiveDomain] = useState<DashboardDomain>(() =>
    readDomainPreference()
  );
  const [activeRole, setActiveRole] = useState<DashboardRole>(() =>
    readRolePreference()
  );
  const [roleCapabilities, setRoleCapabilities] = useState<RoleCapabilities | null>(null);
  const [roleCapabilitiesStatus, setRoleCapabilitiesStatus] =
    useState<RoleCapabilitiesStatus>("idle");
  const [domainRuntimeStates, setDomainRuntimeStates] = useState<DomainRuntimeStates>(() =>
    createInitialDomainRuntimeStates()
  );
  const [dashboardHomeRuntimeStateOverride, setDashboardHomeRuntimeStateOverride] =
    useState<EnterpriseRuntimeState | null>(null);
  const [roleCapabilitiesReloadNonce, setRoleCapabilitiesReloadNonce] = useState(0);
  const isInitialDomainRender = useRef(true);
  const isInitialRoleRender = useRef(true);
  const runtimeObservabilitySessionRef = useRef(createRuntimeObservabilitySession());
  const observabilityCollectionsCacheRef = useRef<{
    loadedAt: number;
    payload: ObservabilityCollectionsPayload;
  } | null>(null);

  const translate = useMemo(() => createTranslator(language), [language]);
  const deferredAthleteSearch = useDeferredValue(athleteSearch);
  const deferredGovernanceSearch = useDeferredValue(governanceSearch);
  const deferredAuditQuery = useDeferredValue(auditQuery);
  const deferredAuditDomainFilter = useDeferredValue(auditDomainFilter);
  const deferredBillingSupportSearch = useDeferredValue(billingSupportSearch);
  const deferredBillingDomainFilter = useDeferredValue(billingDomainFilter);
  const deferredNutritionDateFilter = useDeferredValue(nutritionDateFilter);
  const deferredNutritionMinProteinFilter = useDeferredValue(nutritionMinProteinFilter);
  const deferredNutritionMaxCaloriesFilter = useDeferredValue(nutritionMaxCaloriesFilter);
  const deferredProgressMinSessionsFilter = useDeferredValue(progressMinSessionsFilter);

  const readiness = buildUXReadinessSnapshot({
    authStatus,
    onboardingStatus,
    trainingStatus,
    nutritionStatus,
    progressStatus,
    syncStatus,
    observabilityStatus,
    pendingQueueCount,
    releaseCompatibilityStatus
  });

  const domainTabs: Array<{ id: DashboardDomain; label: string }> = [
    { id: "all", label: translate("domainAll") },
    { id: "onboarding", label: translate("domainOnboarding") },
    { id: "training", label: translate("domainTraining") },
    { id: "nutrition", label: translate("domainNutrition") },
    { id: "progress", label: translate("domainProgress") },
    { id: "operations", label: translate("domainOperations") }
  ];
  const roleOptions: Array<{ id: DashboardRole; label: string }> = [
    { id: "athlete", label: translate("roleAthlete") },
    { id: "coach", label: translate("roleCoach") },
    { id: "admin", label: translate("roleAdmin") }
  ];
  const normalizeDomainForMode = useCallback(
    (domain: DashboardDomain): DashboardDomain => {
      if (isQAMode) {
        return domain;
      }
      if (
        domain === "onboarding" ||
        domain === "training" ||
        domain === "nutrition" ||
        domain === "progress"
      ) {
        return domain;
      }
      return "onboarding";
    },
    [isQAMode]
  );
  const activeDomainForUI = normalizeDomainForMode(activeDomain);
  const domainTabsForUI = useMemo(
    () =>
      isQAMode
        ? domainTabs
        : domainTabs.filter(
            (tab) =>
              tab.id === "onboarding" ||
              tab.id === "training" ||
              tab.id === "nutrition" ||
              tab.id === "progress"
          ),
    [domainTabs, isQAMode]
  );
  const productVisibleModules = useMemo<DashboardModule[]>(
    () => [
      "onboarding",
      "training",
      "recommendations",
      "nutrition",
      "progress",
      "offlineSync",
      "settings",
      "legal"
    ],
    []
  );
  const visibleModulesForDomain = useMemo(
    () => (isQAMode ? getVisibleModules(activeDomainForUI) : productVisibleModules),
    [activeDomainForUI, isQAMode, productVisibleModules]
  );
  const visibleModulesForDomainSet = useMemo(
    () => new Set<DashboardModule>(visibleModulesForDomain),
    [visibleModulesForDomain]
  );
  const isModuleVisibleForUI = useCallback(
    (module: DashboardModule) => visibleModulesForDomainSet.has(module),
    [visibleModulesForDomainSet]
  );
  const activeDomainRuntimeState = resolveActiveDomainRuntimeState(
    activeDomainForUI,
    domainRuntimeStates
  );
  const runtimeStateForUI: EnterpriseRuntimeState = isQAMode ? activeDomainRuntimeState : "success";
  const canRenderOperationalModules =
    hasAuthenticatedSession && runtimeStateForUI === "success";
  const effectiveDashboardHomeRuntimeState =
    isQAMode ? dashboardHomeRuntimeStateOverride ?? activeDomainRuntimeState : "success";
  const dashboardHomeScreenModel = useMemo(
    () =>
      createDashboardHomeLaneScreenModel({
        lane: webLane,
        hasAuthenticatedSession,
        activeDomain: activeDomainForUI,
        activeDomainRuntimeState: effectiveDashboardHomeRuntimeState,
        visibleModulesCount: visibleModulesForDomain.length
      }),
    [
      activeDomainForUI,
      effectiveDashboardHomeRuntimeState,
      hasAuthenticatedSession,
      visibleModulesForDomain.length,
      webLane
    ]
  );
  const accessGateScreenModel = useMemo(
    () =>
      createAccessGateLaneScreenModel({
        lane: webLane,
        hasAuthenticatedSession,
        authStatus
      }),
    [authStatus, hasAuthenticatedSession, webLane]
  );
  const signInScreenModel = useMemo(
    () =>
      createSignInLaneScreenModel({
        lane: webLane,
        authStatus
      }),
    [authStatus, webLane]
  );
  const accessGateAppleActionId =
    webLane === "main" ? "web.accessGate.apple" : "web.light.accessGate.apple";
  const accessGateEmailActionId =
    webLane === "main" ? "web.accessGate.email" : "web.light.accessGate.email";
  const quickActionsScreenModel = useMemo(
    () =>
      createQuickActionsLaneScreenModel({
        lane: webLane,
        dashboardHomeStatus: dashboardHomeScreenModel.status,
        trainingStatus,
        nutritionStatus,
        progressStatus,
        recommendationsStatus,
        syncStatus
      }),
    [
      dashboardHomeScreenModel.status,
      nutritionStatus,
      progressStatus,
      recommendationsStatus,
      syncStatus,
      trainingStatus,
      webLane
    ]
  );
  const openOperationalAlerts = useMemo(
    () => operationalAlerts.filter((alert) => alert.state !== "resolved"),
    [operationalAlerts]
  );
  const runbookTitleById = useMemo(
    () =>
      operationalRunbooks.reduce<Record<string, string>>((acc, runbook) => {
        acc[runbook.id] = runbook.title;
        return acc;
      }, {}),
    [operationalRunbooks]
  );
  const recentActivityRows = useMemo(
    () =>
      [...activityLogEntries].sort(
        (left, right) => Date.parse(right.occurredAt) - Date.parse(left.occurredAt)
      ),
    [activityLogEntries]
  );
  const latestRecentActivityRow = recentActivityRows.at(0);
  const dashboardKpisScreenModel = useMemo(
    () =>
      createDashboardKpisLaneScreenModel({
        lane: webLane,
        dashboardHomeStatus: dashboardHomeScreenModel.status,
        plansCount: plans.length,
        sessionsCount: sessions.length,
        nutritionLogsCount: nutritionLogs.length,
        recommendationsCount: recommendations.length,
        openAlertsCount: openOperationalAlerts.length,
        pendingQueueCount
      }),
    [
      dashboardHomeScreenModel.status,
      nutritionLogs.length,
      openOperationalAlerts.length,
      pendingQueueCount,
      plans.length,
      recommendations.length,
      sessions.length,
      webLane
    ]
  );
  const readinessMonitorScreenModel = useMemo(
    () =>
      createReadinessMonitorLaneScreenModel({
        lane: webLane,
        dashboardHomeStatus: dashboardHomeScreenModel.status,
        readinessScore: readiness.score,
        authStatus
      }),
    [authStatus, dashboardHomeScreenModel.status, readiness.score, webLane]
  );
  const alertsFullScreenModel = useMemo(
    () =>
      createAlertsFullLaneScreenModel({
        lane: webLane,
        dashboardHomeStatus: dashboardHomeScreenModel.status,
        observabilityStatus,
        openAlertsCount: openOperationalAlerts.length,
        runbooksCount: operationalRunbooks.length
      }),
    [
      dashboardHomeScreenModel.status,
      observabilityStatus,
      openOperationalAlerts.length,
      operationalRunbooks.length,
      webLane
    ]
  );
  const recentActivityScreenModel = useMemo(
    () =>
      createRecentActivityScreenModel({
        dashboardHomeStatus: dashboardHomeScreenModel.status,
        observabilityStatus,
        activityEntriesCount: recentActivityRows.length
      }),
    [dashboardHomeScreenModel.status, observabilityStatus, recentActivityRows.length]
  );
  const shortcutsScreenModel = useMemo(
    () =>
      createShortcutsScreenModel({
        dashboardHomeStatus: dashboardHomeScreenModel.status,
        roleCapabilitiesStatus,
        visibleModulesCount: visibleModulesForDomain.length
      }),
    [dashboardHomeScreenModel.status, roleCapabilitiesStatus, visibleModulesForDomain.length]
  );
  const analyticsOverviewScreenModel = useMemo(
    () =>
      createAnalyticsOverviewScreenModel({
        dashboardHomeStatus: dashboardHomeScreenModel.status,
        observabilityStatus,
        analyticsEventsCount: analyticsEvents.length,
        crashReportsCount: crashReports.length
      }),
    [
      analyticsEvents.length,
      crashReports.length,
      dashboardHomeScreenModel.status,
      observabilityStatus
    ]
  );
  const progressTrendsScreenModel = useMemo(
    () =>
      createProgressTrendsScreenModel({
        dashboardHomeStatus: dashboardHomeScreenModel.status,
        progressStatus,
        historyCount: progressSummary?.history.length ?? 0
      }),
    [dashboardHomeScreenModel.status, progressStatus, progressSummary?.history.length]
  );
  const alertCenterScreenModel = useMemo(
    () =>
      createAlertCenterLaneScreenModel({
        lane: webLane,
        dashboardHomeStatus: dashboardHomeScreenModel.status,
        observabilityStatus,
        openAlertsCount: openOperationalAlerts.length
      }),
    [dashboardHomeScreenModel.status, observabilityStatus, openOperationalAlerts.length, webLane]
  );
  const systemStatusScreenModel = useMemo(
    () =>
      createSystemStatusLaneScreenModel({
        lane: webLane,
        dashboardHomeStatus: dashboardHomeScreenModel.status,
        releaseCompatibilityStatus,
        roleCapabilitiesStatus,
        pendingQueueCount,
        syncStatus
      }),
    [
      dashboardHomeScreenModel.status,
      webLane,
      pendingQueueCount,
      releaseCompatibilityStatus,
      roleCapabilitiesStatus,
      syncStatus
    ]
  );
  const athleteOperationRowsBase = useMemo(
    () => buildAthleteOperationsRows(plans, sessions, nutritionLogs, progressSummary),
    [plans, sessions, nutritionLogs, progressSummary]
  );
  const cohortAttentionCount = useMemo(
    () => athleteOperationRowsBase.filter((row) => row.riskLevel === "attention").length,
    [athleteOperationRowsBase]
  );
  const cohortNormalCount = useMemo(
    () => athleteOperationRowsBase.length - cohortAttentionCount,
    [athleteOperationRowsBase.length, cohortAttentionCount]
  );
  const cohortAverageSessions = useMemo(() => {
    if (athleteOperationRowsBase.length === 0) {
      return 0;
    }
    const totalSessions = athleteOperationRowsBase.reduce(
      (accumulator, row) => accumulator + row.sessionsCount,
      0
    );
    return Number((totalSessions / athleteOperationRowsBase.length).toFixed(1));
  }, [athleteOperationRowsBase]);
  const cohortAverageNutritionLogs = useMemo(() => {
    if (athleteOperationRowsBase.length === 0) {
      return 0;
    }
    const totalNutritionLogs = athleteOperationRowsBase.reduce(
      (accumulator, row) => accumulator + row.nutritionLogsCount,
      0
    );
    return Number((totalNutritionLogs / athleteOperationRowsBase.length).toFixed(1));
  }, [athleteOperationRowsBase]);
  const athleteOperationRows = useMemo(
    () =>
      sortAthleteOperationsRows(
        filterAthleteOperationsRows(athleteOperationRowsBase, deferredAthleteSearch),
        athleteSortMode
      ),
    [athleteOperationRowsBase, athleteSortMode, deferredAthleteSearch]
  );
  const athletesListScreenModel = useMemo(
    () =>
      createAthletesListScreenModel({
        lane: webLane,
        dashboardHomeStatus: dashboardHomeScreenModel.status,
        operationsStatus,
        rowsCount: athleteOperationRows.length
      }),
    [athleteOperationRows.length, dashboardHomeScreenModel.status, operationsStatus, webLane]
  );
  const athleteFiltersScreenModel = useMemo(
    () =>
      createAthleteFiltersScreenModel({
        lane: webLane,
        dashboardHomeStatus: dashboardHomeScreenModel.status,
        operationsStatus,
        rowsCount: athleteOperationRows.length
      }),
    [athleteOperationRows.length, dashboardHomeScreenModel.status, operationsStatus, webLane]
  );
  const selectedAthleteDetailRow = useMemo(() => {
    const selectedAthleteId = selectedAthleteIds[0];
    if (selectedAthleteId === undefined) {
      return null;
    }
    return athleteOperationRows.find((row) => row.athleteId === selectedAthleteId) ?? null;
  }, [athleteOperationRows, selectedAthleteIds]);
  const selectedAthleteSessionHistoryRows = useMemo(() => {
    const selectedAthleteId = selectedAthleteIds[0];
    if (selectedAthleteId === undefined) {
      return [];
    }
    return sessions
      .filter((session) => session.userId === selectedAthleteId)
      .sort((left, right) => right.endedAt.localeCompare(left.endedAt));
  }, [selectedAthleteIds, sessions]);
  const selectedAthleteCoachNotesRows = useMemo(() => {
    const selectedAthleteId = selectedAthleteIds[0];
    if (selectedAthleteId === undefined) {
      return [];
    }
    const sessionNotes = selectedAthleteSessionHistoryRows.map((session, index) => ({
      id: `session-${session.planId}-${session.startedAt}-${index}`,
      occurredAt: session.endedAt,
      source: "web",
      outcome: "success",
      summary: `plan ${session.planId} · exercises ${session.exercises.length}`
    }));
    const activityNotes = activityLogEntries
      .filter((entry) => entry.userId === selectedAthleteId)
      .map((entry) => ({
        id: entry.id,
        occurredAt: entry.occurredAt,
        source: entry.source,
        outcome: entry.outcome,
        summary: entry.summary
      }));
    return [...activityNotes, ...sessionNotes]
      .sort((left, right) => right.occurredAt.localeCompare(left.occurredAt))
      .slice(0, 12);
  }, [activityLogEntries, selectedAthleteIds, selectedAthleteSessionHistoryRows]);
  const athleteDetailScreenModel = useMemo(
    () =>
      createAthleteDetailScreenModel({
        lane: webLane,
        dashboardHomeStatus: dashboardHomeScreenModel.status,
        operationsStatus,
        selectedAthleteCount: selectedAthleteIds.length
      }),
    [dashboardHomeScreenModel.status, operationsStatus, selectedAthleteIds.length, webLane]
  );
  const sessionHistoryScreenModel = useMemo(
    () =>
      createSessionHistoryScreenModel({
        lane: webLane,
        dashboardHomeStatus: dashboardHomeScreenModel.status,
        sessionStatus,
        selectedAthleteCount: selectedAthleteIds.length,
        rowsCount: selectedAthleteSessionHistoryRows.length
      }),
    [
      dashboardHomeScreenModel.status,
      webLane,
      selectedAthleteIds.length,
      selectedAthleteSessionHistoryRows.length,
      sessionStatus
    ]
  );
  const compareProgressScreenModel = useMemo(
    () =>
      createCompareProgressScreenModel({
        lane: webLane,
        dashboardHomeStatus: dashboardHomeScreenModel.status,
        progressStatus,
        selectedAthleteCount: selectedAthleteIds.length,
        cohortSize: athleteOperationRowsBase.length
      }),
    [
      athleteOperationRowsBase.length,
      dashboardHomeScreenModel.status,
      progressStatus,
      selectedAthleteIds.length,
      webLane
    ]
  );
  const coachNotesScreenModel = useMemo(
    () =>
      createCoachNotesScreenModel({
        lane: webLane,
        dashboardHomeStatus: dashboardHomeScreenModel.status,
        operationsStatus,
        selectedAthleteCount: selectedAthleteIds.length,
        notesCount: selectedAthleteCoachNotesRows.length
      }),
    [
      dashboardHomeScreenModel.status,
      operationsStatus,
      selectedAthleteCoachNotesRows.length,
      selectedAthleteIds.length,
      webLane
    ]
  );
  const cohortAnalysisScreenModel = useMemo(
    () =>
      createCohortAnalysisScreenModel({
        dashboardHomeStatus: dashboardHomeScreenModel.status,
        operationsStatus,
        cohortSize: athleteOperationRowsBase.length
      }),
    [dashboardHomeScreenModel.status, operationsStatus, athleteOperationRowsBase.length]
  );
  const aiInsightsScreenModel = useMemo(
    () =>
      createAIInsightsScreenModel({
        dashboardHomeStatus: dashboardHomeScreenModel.status,
        recommendationsStatus,
        recommendationsCount: recommendations.length
      }),
    [dashboardHomeScreenModel.status, recommendations.length, recommendationsStatus]
  );
  const governancePrincipalsBase = useMemo(
    () =>
      buildGovernancePrincipals({
        operatorId: activeUserId,
        activeRole,
        plans,
        sessions,
        nutritionLogs,
        assignedRolesByPrincipal
      }),
    [activeRole, activeUserId, assignedRolesByPrincipal, nutritionLogs, plans, sessions]
  );
  const governancePrincipals = useMemo(
    () =>
      filterGovernancePrincipals(
        governancePrincipalsBase,
        deferredGovernanceSearch,
        governanceRoleFilter
      ),
    [deferredGovernanceSearch, governancePrincipalsBase, governanceRoleFilter]
  );
  const governanceRoleCoverage = useMemo(
    () => buildRoleCapabilityCoverage(capabilitiesByRole),
    [capabilitiesByRole]
  );
  const adminUsersScreenModel = useMemo(
    () =>
      createAdminUsersScreenModel({
        dashboardHomeStatus: dashboardHomeScreenModel.status,
        governanceStatus,
        isAdminRole: isAdminRole(activeRole),
        principalsCount: governancePrincipals.length
      }),
    [
      activeRole,
      dashboardHomeScreenModel.status,
      governancePrincipals.length,
      governanceStatus
    ]
  );
  const auditTimelineRowsBase = useMemo(
    () => buildAuditTimelineRows(analyticsEvents, crashReports),
    [analyticsEvents, crashReports]
  );
  const auditTimelineRows = useMemo(
    () =>
      filterAuditTimelineRows(auditTimelineRowsBase, {
        query: deferredAuditQuery,
        source: auditSourceFilter,
        category: auditCategoryFilter,
        severity: auditSeverityFilter,
        domain: deferredAuditDomainFilter
      }),
    [
      auditCategoryFilter,
      auditSeverityFilter,
      auditSourceFilter,
      auditTimelineRowsBase,
      deferredAuditDomainFilter,
      deferredAuditQuery
    ]
  );
  const auditTrailScreenModel = useMemo(
    () =>
      createAuditTrailScreenModel({
        dashboardHomeStatus: dashboardHomeScreenModel.status,
        auditStatus,
        rowsCount: auditTimelineRows.length
      }),
    [auditStatus, auditTimelineRows.length, dashboardHomeScreenModel.status]
  );
  const billingInvoiceRowsBase = useMemo(
    () => buildBillingInvoiceRows(plans, sessions, nutritionLogs),
    [nutritionLogs, plans, sessions]
  );
  const billingInvoiceRows = useMemo(
    () =>
      filterBillingInvoiceRows(billingInvoiceRowsBase, {
        query: deferredBillingSupportSearch,
        invoiceStatus: billingInvoiceStatusFilter
      }),
    [billingInvoiceRowsBase, billingInvoiceStatusFilter, deferredBillingSupportSearch]
  );
  const supportIncidentRowsBase = useMemo(
    () => buildSupportIncidentRows(analyticsEvents, crashReports),
    [analyticsEvents, crashReports]
  );
  const supportIncidentRows = useMemo(() => {
    const withOverrides = applySupportIncidentStateOverrides(
      supportIncidentRowsBase,
      billingIncidentStateOverrides
    );
    return filterSupportIncidentRows(withOverrides, {
      query: deferredBillingSupportSearch,
      domain: deferredBillingDomainFilter,
      state: billingIncidentStateFilter,
      severity: billingIncidentSeverityFilter
    });
  }, [
    billingIncidentSeverityFilter,
    billingIncidentStateFilter,
    billingIncidentStateOverrides,
    deferredBillingDomainFilter,
    deferredBillingSupportSearch,
    supportIncidentRowsBase
  ]);
  const billingOverviewScreenModel = useMemo(
    () =>
      createBillingOverviewScreenModel({
        dashboardHomeStatus: dashboardHomeScreenModel.status,
        billingSupportStatus,
        invoicesCount: billingInvoiceRows.length,
        incidentsCount: supportIncidentRows.length
      }),
    [
      billingSupportStatus,
      billingInvoiceRows.length,
      dashboardHomeScreenModel.status,
      supportIncidentRows.length
    ]
  );
  const supportIncidentsScreenModel = useMemo(
    () =>
      createSupportIncidentsScreenModel({
        dashboardHomeStatus: dashboardHomeScreenModel.status,
        billingSupportStatus,
        incidentsCount: supportIncidentRows.length
      }),
    [billingSupportStatus, dashboardHomeScreenModel.status, supportIncidentRows.length]
  );
  const legalComplianceScreenModel = useMemo(
    () =>
      createLegalComplianceScreenModel({
        dashboardHomeStatus: dashboardHomeScreenModel.status,
        legalStatus,
        privacyPolicyAccepted,
        termsAccepted,
        medicalDisclaimerAccepted
      }),
    [
      dashboardHomeScreenModel.status,
      legalStatus,
      medicalDisclaimerAccepted,
      privacyPolicyAccepted,
      termsAccepted
    ]
  );
  const planBuilderWeeksParsed = useMemo(
    () => parseOptionalNumber(planBuilderWeeksInput),
    [planBuilderWeeksInput]
  );
  const planBuilderDaysParsed = useMemo(
    () => parseOptionalNumber(planBuilderDaysInput),
    [planBuilderDaysInput]
  );
  const normalizedPlanBuilderWeeks = useMemo(() => {
    if (
      planBuilderWeeksParsed.isValid === false ||
      planBuilderWeeksParsed.value === null ||
      Number.isInteger(planBuilderWeeksParsed.value) === false
    ) {
      return null;
    }
    return Math.min(24, Math.max(1, planBuilderWeeksParsed.value));
  }, [planBuilderWeeksParsed.isValid, planBuilderWeeksParsed.value]);
  const normalizedPlanBuilderDays = useMemo(() => {
    if (
      planBuilderDaysParsed.isValid === false ||
      planBuilderDaysParsed.value === null ||
      Number.isInteger(planBuilderDaysParsed.value) === false
    ) {
      return null;
    }
    return Math.min(7, Math.max(1, planBuilderDaysParsed.value));
  }, [planBuilderDaysParsed.isValid, planBuilderDaysParsed.value]);
  const hasPlanBuilderValidationError =
    normalizedPlanBuilderWeeks === null || normalizedPlanBuilderDays === null;
  const planBuilderDayExercises = useMemo(() => {
    if (planBuilderTemplate === "strength") {
      return [
        { exerciseId: "bench-press", targetSets: 5, targetReps: 5 },
        { exerciseId: "goblet-squat", targetSets: 5, targetReps: 6 }
      ];
    }
    if (planBuilderTemplate === "hypertrophy") {
      return [
        { exerciseId: "bench-press", targetSets: 4, targetReps: 10 },
        { exerciseId: "goblet-squat", targetSets: 4, targetReps: 12 }
      ];
    }
    return [
      { exerciseId: "goblet-squat", targetSets: 4, targetReps: 10 },
      { exerciseId: "bench-press", targetSets: 4, targetReps: 8 }
    ];
  }, [planBuilderTemplate]);
  const planBuilderPreviewDays = useMemo(() => {
    if (normalizedPlanBuilderDays === null) {
      return [];
    }
    return Array.from({ length: normalizedPlanBuilderDays }, (_, index) => ({
      dayIndex: index + 1,
      exercises: planBuilderDayExercises
    }));
  }, [normalizedPlanBuilderDays, planBuilderDayExercises]);
  const plansListScreenModel = useMemo(
    () =>
      createPlansListScreenModel({
        dashboardHomeStatus: dashboardHomeScreenModel.status,
        trainingStatus,
        plansCount: plans.length
      }),
    [dashboardHomeScreenModel.status, plans.length, trainingStatus]
  );
  const planBuilderScreenModel = useMemo(
    () =>
      createPlanBuilderScreenModel({
        dashboardHomeStatus: dashboardHomeScreenModel.status,
        trainingStatus,
        hasValidationError: hasPlanBuilderValidationError
      }),
    [dashboardHomeScreenModel.status, hasPlanBuilderValidationError, trainingStatus]
  );
  const planTemplateOptions = useMemo<PlanTemplateOption[]>(
    () => [
      {
        template: "strength",
        weeks: 6,
        daysPerWeek: 4,
        focus: translate("planTemplatesStrengthFocus")
      },
      {
        template: "hypertrophy",
        weeks: 8,
        daysPerWeek: 5,
        focus: translate("planTemplatesHypertrophyFocus")
      },
      {
        template: "recomposition",
        weeks: 8,
        daysPerWeek: 4,
        focus: translate("planTemplatesRecompositionFocus")
      }
    ],
    [translate]
  );
  const selectedPlanTemplateOption = useMemo(
    () => planTemplateOptions.find((option) => option.template === selectedPlanTemplate) ?? null,
    [planTemplateOptions, selectedPlanTemplate]
  );
  const planTemplatesScreenModel = useMemo(
    () =>
      createPlanTemplatesScreenModel({
        dashboardHomeStatus: dashboardHomeScreenModel.status,
        trainingStatus,
        planTemplatesStatus,
        templatesCount: planTemplateOptions.length,
        hasSelectedTemplate: selectedPlanTemplateOption !== null
      }),
    [
      dashboardHomeScreenModel.status,
      planTemplateOptions.length,
      planTemplatesStatus,
      selectedPlanTemplateOption,
      trainingStatus
    ]
  );
  const selectedPlan = useMemo(
    () => plans.find((plan) => plan.id === selectedPlanId) ?? null,
    [plans, selectedPlanId]
  );
  const publishChecklistItems = useMemo<PublishChecklistItem[]>(
    () => [
      {
        id: "plan_selected",
        label: translate("publishReviewCheckPlan"),
        valid: selectedPlan !== null
      },
      {
        id: "template_selected",
        label: translate("publishReviewCheckTemplate"),
        valid: selectedPlanTemplateOption !== null
      },
      {
        id: "configuration_valid",
        label: translate("publishReviewCheckConfiguration"),
        valid: hasPlanBuilderValidationError === false
      },
      {
        id: "athlete_target",
        label: translate("publishReviewCheckAthletes"),
        valid: selectedAthleteIds.length > 0
      }
    ],
    [
      hasPlanBuilderValidationError,
      selectedAthleteIds.length,
      selectedPlan,
      selectedPlanTemplateOption,
      translate
    ]
  );
  const isPublishChecklistReady = publishChecklistItems.every((item) => item.valid);
  const publishReviewScreenModel = useMemo(
    () =>
      createPublishReviewScreenModel({
        dashboardHomeStatus: dashboardHomeScreenModel.status,
        trainingStatus,
        publishReviewStatus,
        hasSelectedPlan: selectedPlan !== null,
        isChecklistReady: isPublishChecklistReady
      }),
    [
      dashboardHomeScreenModel.status,
      isPublishChecklistReady,
      publishReviewStatus,
      selectedPlan,
      trainingStatus
    ]
  );
  const sessionSelectionRows = useMemo(
    () =>
      sessions.map((session, index) => ({
        key: createSessionSelectionKey(session, index),
        session
      })),
    [sessions]
  );
  const selectedSession = useMemo(
    () =>
      sessionSelectionRows.find((row) => row.key === selectedSessionKey)?.session ?? null,
    [selectedSessionKey, sessionSelectionRows]
  );
  const hasSelectedSession = selectedSession !== null;
  const selectedSessionPrimaryExerciseId = selectedSession?.exercises[0]?.exerciseId ?? null;
  const sessionDetailScreenModel = useMemo(
    () =>
      createSessionDetailScreenModel({
        dashboardHomeStatus: dashboardHomeScreenModel.status,
        trainingStatus,
        sessionStatus,
        sessionsCount: sessionSelectionRows.length,
        hasSelectedSession
      }),
    [
      dashboardHomeScreenModel.status,
      hasSelectedSession,
      sessionSelectionRows.length,
      sessionStatus,
      trainingStatus
    ]
  );
  const planAssignmentScreenModel = useMemo(
    () =>
      createPlanAssignmentScreenModel({
        dashboardHomeStatus: dashboardHomeScreenModel.status,
        trainingStatus,
        operationsStatus,
        hasSelectedPlan: selectedPlan !== null,
        selectedAthletesCount: selectedAthleteIds.length
      }),
    [
      dashboardHomeScreenModel.status,
      operationsStatus,
      selectedAthleteIds.length,
      selectedPlan,
      trainingStatus
    ]
  );
  const exerciseLibraryScreenModel = useMemo(
    () =>
      createExerciseLibraryScreenModel({
        dashboardHomeStatus: dashboardHomeScreenModel.status,
        videoStatus,
        videosCount: exerciseVideos.length
      }),
    [dashboardHomeScreenModel.status, exerciseVideos.length, videoStatus]
  );
  const selectedExerciseVideo = useMemo(
    () => exerciseVideos.find((video) => video.id === selectedExerciseVideoId) ?? null,
    [exerciseVideos, selectedExerciseVideoId]
  );
  const exerciseDetailScreenModel = useMemo(
    () =>
      createExerciseDetailScreenModel({
        dashboardHomeStatus: dashboardHomeScreenModel.status,
        videoStatus,
        videosCount: exerciseVideos.length,
        hasSelectedVideo: selectedExerciseVideo !== null
      }),
    [dashboardHomeScreenModel.status, exerciseVideos.length, selectedExerciseVideo, videoStatus]
  );
  const nutritionMinProteinFilterParsed = useMemo(
    () => parseOptionalNumber(deferredNutritionMinProteinFilter),
    [deferredNutritionMinProteinFilter]
  );
  const nutritionMaxCaloriesFilterParsed = useMemo(
    () => parseOptionalNumber(deferredNutritionMaxCaloriesFilter),
    [deferredNutritionMaxCaloriesFilter]
  );
  const progressMinSessionsFilterParsed = useMemo(
    () => parseOptionalNumber(deferredProgressMinSessionsFilter),
    [deferredProgressMinSessionsFilter]
  );
  const hasNutritionFilterValidationError =
    !nutritionMinProteinFilterParsed.isValid || !nutritionMaxCaloriesFilterParsed.isValid;
  const hasProgressFilterValidationError = !progressMinSessionsFilterParsed.isValid;
  const filteredNutritionLogs = useMemo(() => {
    const filtered = filterNutritionLogs(nutritionLogs, {
      queryDate: deferredNutritionDateFilter,
      minProteinGrams: nutritionMinProteinFilterParsed.value,
      maxCalories: nutritionMaxCaloriesFilterParsed.value
    });
    return sortNutritionLogs(filtered, nutritionSortMode);
  }, [
    deferredNutritionDateFilter,
    nutritionLogs,
    nutritionMinProteinFilterParsed.value,
    nutritionMaxCaloriesFilterParsed.value,
    nutritionSortMode
  ]);
  const nutritionLogOptionRows = useMemo(
    () =>
      filteredNutritionLogs.map((log, index) => ({
        key: `${log.userId}-${log.date}-${index}`,
        log
      })),
    [filteredNutritionLogs]
  );
  const selectedNutritionLogOption = useMemo(() => {
    if (nutritionLogOptionRows.length === 0) {
      return null;
    }
    if (selectedNutritionLogKey === null) {
      return nutritionLogOptionRows[0];
    }
    return (
      nutritionLogOptionRows.find((row) => row.key === selectedNutritionLogKey) ??
      nutritionLogOptionRows[0]
    );
  }, [nutritionLogOptionRows, selectedNutritionLogKey]);
  const selectedNutritionLog = selectedNutritionLogOption?.log ?? null;
  const nutritionOverviewScreenModel = useMemo(
    () =>
      createNutritionOverviewScreenModel({
        dashboardHomeStatus: dashboardHomeScreenModel.status,
        nutritionStatus,
        logsCount: nutritionLogs.length,
        filteredLogsCount: filteredNutritionLogs.length
      }),
    [
      dashboardHomeScreenModel.status,
      filteredNutritionLogs.length,
      nutritionLogs.length,
      nutritionStatus
    ]
  );
  const dailyLogReviewScreenModel = useMemo(
    () =>
      createDailyLogReviewScreenModel({
        dashboardHomeStatus: dashboardHomeScreenModel.status,
        nutritionStatus,
        filteredLogsCount: filteredNutritionLogs.length
      }),
    [dashboardHomeScreenModel.status, filteredNutritionLogs.length, nutritionStatus]
  );
  const nutritionLogDetailScreenModel = useMemo(
    () =>
      createNutritionLogDetailScreenModel({
        dashboardHomeStatus: dashboardHomeScreenModel.status,
        nutritionStatus,
        logsCount: nutritionLogOptionRows.length,
        hasSelectedLog: selectedNutritionLog !== null
      }),
    [
      dashboardHomeScreenModel.status,
      nutritionLogOptionRows.length,
      nutritionStatus,
      selectedNutritionLog
    ]
  );
  const nutritionDeviationAlerts = useMemo<NutritionDeviationAlert[]>(
    () =>
      filteredNutritionLogs
        .flatMap((log) => {
          const alerts: NutritionDeviationAlert[] = [];

          if (log.calories >= 2800 || log.calories <= 1300) {
            alerts.push({
              id: `${log.userId}-${log.date}-calories`,
              date: log.date,
              severity: log.calories >= 3000 || log.calories <= 1200 ? "high" : "medium",
              reason: "calories",
              calories: log.calories,
              proteinGrams: log.proteinGrams
            });
          }

          if (log.proteinGrams <= 80) {
            alerts.push({
              id: `${log.userId}-${log.date}-protein`,
              date: log.date,
              severity: log.proteinGrams <= 60 ? "high" : "medium",
              reason: "protein",
              calories: log.calories,
              proteinGrams: log.proteinGrams
            });
          }

          return alerts;
        })
        .slice(0, 10),
    [filteredNutritionLogs]
  );
  const deviationAlertsScreenModel = useMemo(
    () =>
      createDeviationAlertsScreenModel({
        dashboardHomeStatus: dashboardHomeScreenModel.status,
        nutritionStatus,
        alertsCount: nutritionDeviationAlerts.length
      }),
    [dashboardHomeScreenModel.status, nutritionDeviationAlerts.length, nutritionStatus]
  );
  const nutritionCoachRows = useMemo(
    () =>
      [...athleteOperationRows]
        .sort((left, right) => {
          if (left.riskLevel !== right.riskLevel) {
            return left.riskLevel === "attention" ? -1 : 1;
          }
          if (right.nutritionLogsCount !== left.nutritionLogsCount) {
            return right.nutritionLogsCount - left.nutritionLogsCount;
          }
          return left.athleteId.localeCompare(right.athleteId);
        })
        .slice(0, 6),
    [athleteOperationRows]
  );
  const nutritionCoachAtRiskCount = useMemo(
    () => athleteOperationRows.filter((row) => row.riskLevel === "attention").length,
    [athleteOperationRows]
  );
  const nutritionCoachViewScreenModel = useMemo(
    () =>
      createNutritionCoachViewScreenModel({
        dashboardHomeStatus: dashboardHomeScreenModel.status,
        nutritionStatus,
        logsCount: nutritionLogs.length,
        atRiskAthletesCount: nutritionCoachAtRiskCount
      }),
    [
      dashboardHomeScreenModel.status,
      nutritionCoachAtRiskCount,
      nutritionLogs.length,
      nutritionStatus
    ]
  );
  const cohortNutritionRows = useMemo<CohortNutritionRow[]>(() => {
    const groupedRows = new Map<
      string,
      { logsCount: number; caloriesSum: number; proteinSum: number }
    >();

    for (const log of filteredNutritionLogs) {
      const current = groupedRows.get(log.userId) ?? {
        logsCount: 0,
        caloriesSum: 0,
        proteinSum: 0
      };
      groupedRows.set(log.userId, {
        logsCount: current.logsCount + 1,
        caloriesSum: current.caloriesSum + log.calories,
        proteinSum: current.proteinSum + log.proteinGrams
      });
    }

    return Array.from(groupedRows.entries())
      .map(([athleteId, row]) => {
        const averageCalories = Number((row.caloriesSum / row.logsCount).toFixed(0));
        const averageProteinGrams = Number((row.proteinSum / row.logsCount).toFixed(0));
        const riskLevel =
          averageCalories >= 2800 || averageCalories <= 1300 || averageProteinGrams <= 90
            ? "attention"
            : "normal";
        return {
          athleteId,
          logsCount: row.logsCount,
          averageCalories,
          averageProteinGrams,
          riskLevel
        } satisfies CohortNutritionRow;
      })
      .sort((left, right) => {
        if (left.riskLevel !== right.riskLevel) {
          return left.riskLevel === "attention" ? -1 : 1;
        }
        if (right.logsCount !== left.logsCount) {
          return right.logsCount - left.logsCount;
        }
        return left.athleteId.localeCompare(right.athleteId);
      })
      .slice(0, 6);
  }, [filteredNutritionLogs]);
  const cohortNutritionScreenModel = useMemo(
    () =>
      createCohortNutritionScreenModel({
        dashboardHomeStatus: dashboardHomeScreenModel.status,
        nutritionStatus,
        rowsCount: cohortNutritionRows.length
      }),
    [cohortNutritionRows.length, dashboardHomeScreenModel.status, nutritionStatus]
  );
  const filteredProgressHistory = useMemo(() => {
    const rows = buildProgressHistoryRows(progressSummary);
    const filtered = filterProgressHistoryRows(rows, progressMinSessionsFilterParsed.value);
    return sortProgressHistoryRows(filtered, progressSortMode);
  }, [progressSummary, progressMinSessionsFilterParsed.value, progressSortMode]);
  const selectedAthleteIdSet = useMemo(() => new Set(selectedAthleteIds), [selectedAthleteIds]);
  const selectedAthleteRows = useMemo(
    () => athleteOperationRows.filter((row) => selectedAthleteIdSet.has(row.athleteId)),
    [athleteOperationRows, selectedAthleteIdSet]
  );
  const atRiskAthleteRows = useMemo(
    () => athleteOperationRows.filter((row) => row.riskLevel === "attention"),
    [athleteOperationRows]
  );
  const selectedGovernancePrincipalIdSet = useMemo(
    () => new Set(governanceSelectedPrincipalIds),
    [governanceSelectedPrincipalIds]
  );
  const selectedBillingIncidentIdSet = useMemo(
    () => new Set(billingSelectedIncidentIds),
    [billingSelectedIncidentIds]
  );
  const visibleAthleteRows = useMemo(
    () => athleteOperationRows.slice(0, athleteRowsVisibleCount),
    [athleteOperationRows, athleteRowsVisibleCount]
  );
  const visibleGovernanceRows = useMemo(
    () => governancePrincipals.slice(0, governanceRowsVisibleCount),
    [governancePrincipals, governanceRowsVisibleCount]
  );
  const visibleAuditRows = useMemo(
    () => auditTimelineRows.slice(0, auditRowsVisibleCount),
    [auditRowsVisibleCount, auditTimelineRows]
  );
  const visibleBillingInvoiceRows = useMemo(
    () => billingInvoiceRows.slice(0, billingInvoiceRowsVisibleCount),
    [billingInvoiceRows, billingInvoiceRowsVisibleCount]
  );
  const visibleBillingIncidentRows = useMemo(
    () => supportIncidentRows.slice(0, billingIncidentRowsVisibleCount),
    [billingIncidentRowsVisibleCount, supportIncidentRows]
  );
  const hasMoreAthleteRows = visibleAthleteRows.length < athleteOperationRows.length;
  const hasMoreGovernanceRows = visibleGovernanceRows.length < governancePrincipals.length;
  const hasMoreAuditRows = visibleAuditRows.length < auditTimelineRows.length;
  const hasMoreBillingInvoiceRows =
    visibleBillingInvoiceRows.length < billingInvoiceRows.length;
  const hasMoreBillingIncidentRows =
    visibleBillingIncidentRows.length < supportIncidentRows.length;

  async function refreshPendingQueue(): Promise<void> {
    if (hasAuthenticatedSession === false) {
      setPendingQueueCount(0);
      return;
    }
    const pending = await offlineSyncQueueUseCase.listPending(activeUserId);
    setPendingQueueCount(pending.length);
  }

  function resolveAuthenticatedUserId(
    domain: DashboardDomain
  ): string | null {
    if (hasAuthenticatedSession) {
      return activeUserId;
    }

    setAuthStatus("session_required");
    setDomainRuntimeStates((currentStates) =>
      setRuntimeStateForActiveDomain(domain, "denied", currentStates)
    );
    return null;
  }

  function shouldStopForUpgrade(error: unknown): boolean {
    if (isClientUpdateRequiredError(error)) {
      setReleaseCompatibilityStatus("upgrade_required");
      return true;
    }
    return false;
  }

  function resolveFailureRuntimeState(error: unknown): EnterpriseRuntimeState {
    if (error instanceof TypeError) {
      return "offline";
    }
    if (error instanceof Error) {
      const code = error.message.trim().toLowerCase();
      if (code === "failed to fetch" || code.includes("network")) {
        return "offline";
      }
      if (
        code === "missing_authorization_bearer" ||
        code === "invalid_authorization_bearer" ||
        code.endsWith("_denied") ||
        code === "ownership_required" ||
        code === "medical_consent_required"
      ) {
        return "denied";
      }
    }
    return "error";
  }

  function markDomainFailure(domain: DashboardDomain, error: unknown): void {
    const failureState = resolveFailureRuntimeState(error);
    setDomainRuntimeStates((currentStates) =>
      setRuntimeStateForActiveDomain(domain, failureState, currentStates)
    );
  }

  function markDomainSuccess(domain: DashboardDomain): void {
    setDomainRuntimeStates((currentStates) =>
      setRuntimeStateForActiveDomain(domain, "success", currentStates)
    );
  }

  function hasValidEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }

  function parseOptionalNumber(value: string): { value: number | null; isValid: boolean } {
    const trimmedValue = value.trim();
    if (trimmedValue.length === 0) {
      return { value: null, isValid: true };
    }
    const numericValue = Number(trimmedValue);
    if (Number.isFinite(numericValue)) {
      return { value: numericValue, isValid: true };
    }
    return { value: null, isValid: false };
  }

  function invoiceStatusLabel(status: BillingInvoiceStatusFilter): string {
    switch (status) {
      case "draft":
        return translate("billingInvoiceStatusDraft");
      case "open":
        return translate("billingInvoiceStatusOpen");
      case "paid":
        return translate("billingInvoiceStatusPaid");
      case "overdue":
        return translate("billingInvoiceStatusOverdue");
      default:
        return translate("billingFilterAllInvoiceStatuses");
    }
  }

  function incidentStateLabel(status: SupportIncidentStateFilter): string {
    switch (status) {
      case "open":
        return translate("billingIncidentStateOpen");
      case "in_progress":
        return translate("billingIncidentStateInProgress");
      case "resolved":
        return translate("billingIncidentStateResolved");
      default:
        return translate("billingFilterAllIncidentStates");
    }
  }

  function incidentSeverityLabel(status: SupportIncidentSeverityFilter): string {
    switch (status) {
      case "high":
        return translate("billingIncidentSeverityHigh");
      case "medium":
        return translate("billingIncidentSeverityMedium");
      case "low":
        return translate("billingIncidentSeverityLow");
      default:
        return translate("billingFilterAllIncidentSeverities");
    }
  }

  useEffect(() => {
    void refreshPendingQueue();
  }, [activeUserId]);

  useEffect(() => {
    persistLanguagePreference(language);
  }, [language]);

  useEffect(() => {
    if (isQAMode) {
      return;
    }
    if (webLane !== "main") {
      setWebLane("main");
    }
    if (dashboardHomeRuntimeStateOverride !== null) {
      setDashboardHomeRuntimeStateOverride(null);
    }
    if (activeDomain === "all" || activeDomain === "operations") {
      setActiveDomain("onboarding");
    }
    setDomainRuntimeStates(createInitialDomainRuntimeStates());
  }, [activeDomain, dashboardHomeRuntimeStateOverride, isQAMode, webLane]);

  useEffect(() => {
    persistDomainPreference(activeDomain);
    if (isQAMode) {
      persistDomainQueryParam(activeDomain);
    } else {
      clearDomainQueryParam();
    }
    if (isInitialDomainRender.current) {
      isInitialDomainRender.current = false;
      return;
    }
    void trackDomainChange(activeDomain);
  }, [activeDomain, isQAMode]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    function handlePopState(): void {
      const domainFromURL = readDashboardDomainFromURL(window.location.href);
      if (domainFromURL !== null) {
        setActiveDomain(normalizeDomainForMode(domainFromURL));
      }
    }
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [normalizeDomainForMode]);

  useEffect(() => {
    if (nutritionLogOptionRows.length === 0) {
      if (selectedNutritionLogKey !== null) {
        setSelectedNutritionLogKey(null);
      }
      return;
    }

    if (selectedNutritionLogKey === null) {
      setSelectedNutritionLogKey(nutritionLogOptionRows[0]?.key ?? null);
      return;
    }

    const stillExists = nutritionLogOptionRows.some((row) => row.key === selectedNutritionLogKey);
    if (!stillExists) {
      setSelectedNutritionLogKey(nutritionLogOptionRows[0]?.key ?? null);
    }
  }, [nutritionLogOptionRows, selectedNutritionLogKey]);

  useEffect(() => {
    if (exerciseVideos.length === 0) {
      if (selectedExerciseVideoId !== "") {
        setSelectedExerciseVideoId("");
      }
      return;
    }

    if (selectedExerciseVideoId === "") {
      setSelectedExerciseVideoId(exerciseVideos[0]?.id ?? "");
      return;
    }

    const stillExists = exerciseVideos.some((video) => video.id === selectedExerciseVideoId);
    if (!stillExists) {
      setSelectedExerciseVideoId(exerciseVideos[0]?.id ?? "");
    }
  }, [exerciseVideos, selectedExerciseVideoId]);

  useEffect(() => {
    setSelectedAthleteIds((current) =>
      current.filter((athleteId) =>
        athleteOperationRows.some((row) => row.athleteId === athleteId)
      )
    );
    setOperationsStatus((current) =>
      deriveModuleRuntimeStatus({
        activeDomain,
        moduleDomain: "operations",
        activeDomainRuntimeState,
        hasValidationError: false,
        totalItems: athleteOperationRowsBase.length,
        filteredItems: athleteOperationRows.length,
        currentStatus: current
      })
    );
  }, [
    activeDomain,
    activeDomainRuntimeState,
    athleteOperationRowsBase.length,
    athleteOperationRows
  ]);

  useEffect(() => {
    setGovernanceSelectedPrincipalIds((current) =>
      current.filter((principalId) =>
        governancePrincipals.some((principal) => principal.userId === principalId)
      )
    );
    setGovernanceStatus((current) =>
      deriveModuleRuntimeStatus({
        activeDomain,
        moduleDomain: "operations",
        activeDomainRuntimeState,
        hasValidationError: governanceHasValidationError,
        totalItems: governancePrincipalsBase.length,
        filteredItems: governancePrincipals.length,
        currentStatus: current
      })
    );
  }, [
    activeDomain,
    activeDomainRuntimeState,
    governanceHasValidationError,
    governancePrincipals,
    governancePrincipalsBase.length
  ]);

  useEffect(() => {
    setAuditStatus((current) =>
      deriveModuleRuntimeStatus({
        activeDomain,
        moduleDomain: "operations",
        activeDomainRuntimeState,
        hasValidationError: false,
        totalItems: auditTimelineRowsBase.length,
        filteredItems: auditTimelineRows.length,
        currentStatus: current
      })
    );
  }, [
    activeDomain,
    activeDomainRuntimeState,
    auditTimelineRows.length,
    auditTimelineRowsBase.length
  ]);

  useEffect(() => {
    setBillingSelectedIncidentIds((current) =>
      current.filter((incidentId) =>
        supportIncidentRows.some((incident) => incident.id === incidentId)
      )
    );
    setBillingSupportStatus((current) =>
      deriveModuleRuntimeStatus({
        activeDomain,
        moduleDomain: "operations",
        activeDomainRuntimeState,
        hasValidationError: billingHasValidationError,
        totalItems: billingInvoiceRowsBase.length + supportIncidentRowsBase.length,
        filteredItems: billingInvoiceRows.length + supportIncidentRows.length,
        currentStatus: current
      })
    );
  }, [
    activeDomain,
    activeDomainRuntimeState,
    billingHasValidationError,
    billingInvoiceRows.length,
    billingInvoiceRowsBase.length,
    supportIncidentRows,
    supportIncidentRowsBase.length
  ]);

  useEffect(() => {
    setNutritionStatus((current) =>
      deriveModuleRuntimeStatus({
        activeDomain,
        moduleDomain: "nutrition",
        activeDomainRuntimeState,
        hasValidationError: hasNutritionFilterValidationError,
        totalItems: nutritionLogs.length,
        filteredItems: filteredNutritionLogs.length,
        currentStatus: current
      })
    );
  }, [
    activeDomain,
    activeDomainRuntimeState,
    filteredNutritionLogs.length,
    hasNutritionFilterValidationError,
    nutritionLogs.length
  ]);

  useEffect(() => {
    setProgressStatus((current) =>
      deriveModuleRuntimeStatus({
        activeDomain,
        moduleDomain: "progress",
        activeDomainRuntimeState,
        hasValidationError: hasProgressFilterValidationError,
        totalItems: progressSummary?.history.length ?? 0,
        filteredItems: filteredProgressHistory.length,
        currentStatus: current
      })
    );
  }, [
    activeDomain,
    activeDomainRuntimeState,
    filteredProgressHistory.length,
    hasProgressFilterValidationError,
    progressSummary?.history.length
  ]);

  useEffect(() => {
    setAthleteRowsVisibleCount((current) =>
      normalizeVisibleRows(current, athleteOperationRows.length)
    );
  }, [athleteOperationRows.length]);

  useEffect(() => {
    setGovernanceRowsVisibleCount((current) =>
      normalizeVisibleRows(current, governancePrincipals.length)
    );
  }, [governancePrincipals.length]);

  useEffect(() => {
    setAuditRowsVisibleCount((current) => normalizeVisibleRows(current, auditTimelineRows.length));
  }, [auditTimelineRows.length]);

  useEffect(() => {
    setBillingInvoiceRowsVisibleCount((current) =>
      normalizeVisibleRows(current, billingInvoiceRows.length)
    );
  }, [billingInvoiceRows.length]);

  useEffect(() => {
    setBillingIncidentRowsVisibleCount((current) =>
      normalizeVisibleRows(current, supportIncidentRows.length)
    );
  }, [supportIncidentRows.length]);

  useEffect(() => {
    let isCancelled = false;

    async function loadRoleCapabilities() {
      if (isQAMode === false) {
        const now = new Date().toISOString();
        const permissions = [
          {
            domain: "onboarding" as const,
            actions: ["view", "create", "update"] as const,
            conditions: {
              requiresOwnership: false,
              requiresMedicalConsent: false
            }
          },
          {
            domain: "training" as const,
            actions: ["view", "create", "update"] as const,
            conditions: {
              requiresOwnership: false,
              requiresMedicalConsent: false
            }
          },
          {
            domain: "nutrition" as const,
            actions: ["view", "create", "update"] as const,
            conditions: {
              requiresOwnership: false,
              requiresMedicalConsent: false
            }
          },
          {
            domain: "progress" as const,
            actions: ["view", "update", "export"] as const,
            conditions: {
              requiresOwnership: false,
              requiresMedicalConsent: false
            }
          },
          {
            domain: "operations" as const,
            actions: activeRole === "admin" ? (["view", "create", "update", "approve", "assign", "export"] as const) : (["view"] as const),
            conditions: {
              requiresOwnership: false,
              requiresMedicalConsent: false
            }
          }
        ];
        setRoleCapabilities({
          role: activeRole as AccessRole,
          allowedDomains: ["all", "onboarding", "training", "nutrition", "progress", "operations"],
          permissions: permissions.map((permission) => ({
            domain: permission.domain,
            actions: [...permission.actions],
            conditions: permission.conditions
          })),
          issuedAt: now
        });
        setRoleCapabilitiesStatus("loaded");
        return;
      }

      setRoleCapabilitiesStatus("loading");
      try {
        const capabilities = await manageRoleCapabilitiesUseCase.listRoleCapabilities(
          activeRole as AccessRole
        );
        if (isCancelled) {
          return;
        }
        setRoleCapabilities(capabilities);
        setRoleCapabilitiesStatus("loaded");
      } catch {
        if (isCancelled) {
          return;
        }
        setRoleCapabilities(null);
        setRoleCapabilitiesStatus("error");
      }
    }

    void loadRoleCapabilities();

    return () => {
      isCancelled = true;
    };
  }, [activeRole, isQAMode, manageRoleCapabilitiesUseCase, roleCapabilitiesReloadNonce]);

  useEffect(() => {
    setDashboardHomeRuntimeStateOverride(null);
  }, [activeDomain, hasAuthenticatedSession]);

  useEffect(() => {
    if (activeDomain === "all") {
      return;
    }
    const decision = resolveDomainAccessDecision(
      activeDomain,
      roleCapabilitiesStatus,
      roleCapabilities
    );
    setDomainRuntimeStates((currentStates) => {
      const currentState = currentStates[activeDomain];
      if (decision === "pending" && currentState !== "loading") {
        return { ...currentStates, [activeDomain]: "loading" };
      }
      if (decision === "error" && currentState !== "error") {
        return { ...currentStates, [activeDomain]: "error" };
      }
      if (decision === "denied" && currentState !== "denied") {
        const correlationId = nextCorrelationId(
          runtimeObservabilitySessionRef.current,
          activeDomain,
          "role_capabilities_sync"
        );
        void trackDeniedDomainAccess(activeDomain, "role_capabilities_sync", correlationId);
        void trackBlockedAction(
          activeDomain,
          "role_capabilities_sync",
          "domain_denied",
          correlationId
        );
        return { ...currentStates, [activeDomain]: "denied" };
      }
      if (decision === "allowed" && (currentState === "denied" || currentState === "loading")) {
        return { ...currentStates, [activeDomain]: "success" };
      }
      return currentStates;
    });
  }, [activeDomain, roleCapabilities, roleCapabilitiesStatus]);

  useEffect(() => {
    setApiAccessRole(activeRole as AccessRole);
    persistRolePreference(activeRole);
    if (isInitialRoleRender.current) {
      isInitialRoleRender.current = false;
      return;
    }
    void trackRoleChange(activeRole);
  }, [activeRole]);

  useEffect(() => {
    setApiAuthSession(activeSession);
  }, [activeSession]);

  async function handleAppleSignIn() {
    setAuthStatus("loading");
    try {
      const session = await createAuthSessionUseCase.executeWithApple();
      setActiveSession(session);
      setAuthStatus(`signed_in:${session.identity.provider}`);
      markDomainSuccess("onboarding");
    } catch (error) {
      if (shouldStopForUpgrade(error)) {
        return;
      }
      setActiveSession(null);
      setAuthStatus("auth_error");
      markDomainFailure("onboarding", error);
    }
  }

  async function handleEmailSignIn() {
    setAuthStatus("loading");
    if (!hasValidEmail(email) || password.trim().length < 6) {
      setAuthStatus("validation_error");
      return;
    }
    try {
      const session = await createAuthSessionUseCase.executeWithEmail(email, password);
      setActiveSession(session);
      setAuthStatus(`signed_in:${session.identity.provider}`);
      markDomainSuccess("onboarding");
    } catch (error) {
      if (shouldStopForUpgrade(error)) {
        return;
      }
      setActiveSession(null);
      setAuthStatus("auth_error");
      markDomainFailure("onboarding", error);
    }
  }

  function handleEmailRecovery(channel: "email" | "sms") {
    if (!hasValidEmail(email)) {
      setAuthStatus("validation_error");
      return;
    }
    setAuthStatus(channel === "email" ? "recovery_sent_email" : "recovery_sent_sms");
  }

  async function handleCompleteOnboarding() {
    setOnboardingStatus("loading");
    const authenticatedUserId = resolveAuthenticatedUserId("onboarding");
    if (authenticatedUserId === null) {
      setOnboardingStatus("error");
      return;
    }
    if (!privacyPolicyAccepted || !termsAccepted || !medicalDisclaimerAccepted) {
      setOnboardingStatus("consent_required");
      return;
    }
    if (
      displayName.trim().length === 0 ||
      Number.isNaN(Number(age)) ||
      Number.isNaN(Number(heightCm)) ||
      Number.isNaN(Number(weightKg)) ||
      Number.isNaN(Number(availableDaysPerWeek))
    ) {
      setOnboardingStatus("validation_error");
      return;
    }
    try {
      await completeOnboardingUseCase.execute({
        userId: authenticatedUserId,
        goal,
        onboardingProfile: {
          displayName,
          age: Number(age),
          heightCm: Number(heightCm),
          weightKg: Number(weightKg),
          availableDaysPerWeek: Number(availableDaysPerWeek),
          equipment: ["dumbbells"],
          injuries: []
        },
        responses: [
          { questionId: "parq-1", answer: parQ1 },
          { questionId: "parq-2", answer: parQ2 }
        ]
      });
      setOnboardingStatus("saved");
      markDomainSuccess("onboarding");
    } catch (error) {
      if (shouldStopForUpgrade(error)) {
        return;
      }
      setOnboardingStatus("validation_error");
      markDomainFailure("onboarding", error);
    }
  }

  async function handleSubmitLegalConsent() {
    setLegalStatus("loading");
    const authenticatedUserId = resolveAuthenticatedUserId("onboarding");
    if (authenticatedUserId === null) {
      setLegalStatus("error");
      return;
    }
    if (!privacyPolicyAccepted || !termsAccepted || !medicalDisclaimerAccepted) {
      setLegalStatus("consent_required");
      return;
    }
    try {
      await manageLegalUseCase.submitConsent({
        userId: authenticatedUserId,
        acceptedAt: new Date().toISOString(),
        privacyPolicyAccepted,
        termsAccepted,
        medicalDisclaimerAccepted,
        policyVersion: "v1.0",
        locale: language === "es" ? "es-ES" : "en-US",
        source: "web"
      });
      setLegalStatus("saved");
      markDomainSuccess("onboarding");
    } catch (error) {
      if (shouldStopForUpgrade(error)) {
        return;
      }
      setLegalStatus("error");
      markDomainFailure("onboarding", error);
    }
  }

  async function handleRequestDataDeletion() {
    setLegalStatus("loading");
    const authenticatedUserId = resolveAuthenticatedUserId("onboarding");
    if (authenticatedUserId === null) {
      setLegalStatus("error");
      return;
    }
    if (!privacyPolicyAccepted || !termsAccepted || !medicalDisclaimerAccepted) {
      setLegalStatus("consent_required");
      return;
    }
    try {
      await manageLegalUseCase.requestDataDeletion({
        userId: authenticatedUserId,
        requestedAt: new Date().toISOString(),
        reason: "user_request",
        status: "pending",
        exportRequested: true,
        exportFormat: "json"
      });
      setLegalStatus("deletion_requested");
      markDomainSuccess("onboarding");
    } catch (error) {
      if (shouldStopForUpgrade(error)) {
        return;
      }
      setLegalStatus("error");
      markDomainFailure("onboarding", error);
    }
  }

  function handleSaveSettings() {
    setSettingsStatus("loading");
    setSettingsStatus("saved");
  }

  async function handleExportData() {
    setLegalStatus("loading");
    const authenticatedUserId = resolveAuthenticatedUserId("onboarding");
    if (authenticatedUserId === null) {
      setLegalStatus("error");
      return;
    }
    if (!privacyPolicyAccepted || !termsAccepted) {
      setLegalStatus("consent_required");
      return;
    }
    try {
      await manageLegalUseCase.requestDataExport({
        userId: authenticatedUserId,
        requestedAt: new Date().toISOString(),
        format: "json"
      });
      setLegalStatus("exported");
      markDomainSuccess("onboarding");
    } catch (error) {
      if (shouldStopForUpgrade(error)) {
        return;
      }
      setLegalStatus("error");
      markDomainFailure("onboarding", error);
    }
  }

  async function handleCreatePlan() {
    const authenticatedUserId = resolveAuthenticatedUserId("training");
    if (authenticatedUserId === null) {
      setTrainingStatus("error");
      return;
    }
    if (planName.trim().length === 0) {
      setTrainingStatus("validation_error");
      return;
    }
    if (hasPlanBuilderValidationError) {
      setTrainingStatus("validation_error");
      return;
    }

    const weeks = normalizedPlanBuilderWeeks;
    const days = planBuilderPreviewDays;
    if (weeks === null || days.length === 0) {
      setTrainingStatus("validation_error");
      return;
    }

    setTrainingStatus("loading");
    const queuedPlanInput = {
      id: `plan-${Date.now()}`,
      userId: authenticatedUserId,
      name: planName.trim(),
      weeks,
      days
    } satisfies Omit<TrainingPlan, "createdAt">;

    try {
      const createdPlan = await manageTrainingUseCase.createTrainingPlan(queuedPlanInput);
      setSelectedPlanId(createdPlan.id);
      setTrainingStatus("saved");
      const loadedPlans = await manageTrainingUseCase.listTrainingPlans(authenticatedUserId);
      setPlans(loadedPlans);
      markDomainSuccess("training");
    } catch (error) {
      if (shouldStopForUpgrade(error)) {
        return;
      }
      try {
        await offlineSyncQueueUseCase.queueTrainingPlan(authenticatedUserId, queuedPlanInput);
        await refreshPendingQueue();
        setTrainingStatus("queued");
        markDomainSuccess("training");
      } catch (queueError) {
        if (shouldStopForUpgrade(queueError)) {
          return;
        }
        setTrainingStatus("error");
        markDomainFailure("training", queueError);
      }
    }
  }

  async function handleLoadPlans() {
    const authenticatedUserId = resolveAuthenticatedUserId("training");
    if (authenticatedUserId === null) {
      setTrainingStatus("error");
      return;
    }
    setTrainingStatus("loading");
    try {
      const loadedPlans = await manageTrainingUseCase.listTrainingPlans(authenticatedUserId);
      setPlans(loadedPlans);
      const firstPlan = loadedPlans[0];
      if (firstPlan !== undefined && selectedPlanId.length === 0) {
        setSelectedPlanId(firstPlan.id);
      }
      setTrainingStatus(loadedPlans.length === 0 ? "validation_error" : "loaded");
      markDomainSuccess("training");
    } catch (error) {
      if (shouldStopForUpgrade(error)) {
        return;
      }
      setTrainingStatus("error");
      markDomainFailure("training", error);
    }
  }

  async function handleLogWorkoutSession() {
    const authenticatedUserId = resolveAuthenticatedUserId("training");
    if (authenticatedUserId === null) {
      setSessionStatus("error");
      return;
    }
    setSessionStatus("loading");
    const planId = selectedPlanId || plans[0]?.id;
    if (planId === undefined || planId.length === 0) {
      setSessionStatus("validation_error");
      return;
    }
    const endedAt = new Date();
    const queuedSession = {
      userId: authenticatedUserId,
      planId,
      startedAt: new Date(endedAt.getTime() - 35 * 60 * 1000).toISOString(),
      endedAt: endedAt.toISOString(),
      exercises: [
        {
          exerciseId: "goblet-squat",
          sets: [{ reps: 12, loadKg: 20, rpe: 7 }]
        }
      ]
    } satisfies WorkoutSessionInput;

    try {
      await manageTrainingUseCase.createWorkoutSession(queuedSession);
      setSessionStatus("saved");
      markDomainSuccess("training");
    } catch (error) {
      if (shouldStopForUpgrade(error)) {
        return;
      }
      try {
        await offlineSyncQueueUseCase.queueWorkoutSession(authenticatedUserId, queuedSession);
        await refreshPendingQueue();
        setSessionStatus("saved");
        setTrainingStatus("queued");
        markDomainSuccess("training");
      } catch (queueError) {
        if (shouldStopForUpgrade(queueError)) {
          return;
        }
        setSessionStatus("error");
        markDomainFailure("training", queueError);
      }
    }
  }

  async function handleLoadSessions() {
    const authenticatedUserId = resolveAuthenticatedUserId("training");
    if (authenticatedUserId === null) {
      setSessionStatus("error");
      return;
    }
    setSessionStatus("loading");
    try {
      const loadedSessions = await manageTrainingUseCase.listWorkoutSessions(
        authenticatedUserId,
        selectedPlanId || undefined
      );
      const nextSessionRows = loadedSessions.map((session, index) => ({
        key: createSessionSelectionKey(session, index),
        session
      }));
      const hasCurrentSelection = nextSessionRows.some((row) => row.key === selectedSessionKey);
      setSessions(loadedSessions);
      if (hasCurrentSelection) {
        setSelectedSessionKey(selectedSessionKey);
      } else {
        setSelectedSessionKey(nextSessionRows[0]?.key ?? "");
      }
      setSessionStatus("saved");
      markDomainSuccess("training");
    } catch (error) {
      if (shouldStopForUpgrade(error)) {
        return;
      }
      setSessionStatus("error");
      markDomainFailure("training", error);
    }
  }

  function handleClearSessionSelection() {
    setSelectedSessionKey("");
  }

  function handleOpenSessionExerciseVideo() {
    if (selectedSessionPrimaryExerciseId === null) {
      return;
    }
    const preferredVideo =
      exerciseVideos.find(
        (video) =>
          video.exerciseId === selectedSessionPrimaryExerciseId && video.locale === videoLocale
      ) ??
      exerciseVideos.find((video) => video.exerciseId === selectedSessionPrimaryExerciseId) ??
      null;
    if (preferredVideo === null) {
      return;
    }
    setSelectedExerciseVideoId(preferredVideo.id);
    window.open(preferredVideo.videoUrl, "_blank", "noopener,noreferrer");
  }

  async function handleCreateNutritionLog() {
    const authenticatedUserId = resolveAuthenticatedUserId("nutrition");
    if (authenticatedUserId === null) {
      setNutritionStatus("error");
      return;
    }
    setNutritionStatus("loading");
    const queuedLog = {
      userId: authenticatedUserId,
      date: nutritionDate,
      calories: Number(calories),
      proteinGrams: Number(proteinGrams),
      carbsGrams: Number(carbsGrams),
      fatsGrams: Number(fatsGrams)
    } satisfies NutritionLog;

    try {
      await manageNutritionUseCase.createNutritionLog(queuedLog);
      setNutritionStatus("saved");
      markDomainSuccess("nutrition");
    } catch (error) {
      if (shouldStopForUpgrade(error)) {
        return;
      }
      try {
        await offlineSyncQueueUseCase.queueNutritionLog(authenticatedUserId, queuedLog);
        await refreshPendingQueue();
        setNutritionStatus("queued");
        markDomainSuccess("nutrition");
      } catch (queueError) {
        if (shouldStopForUpgrade(queueError)) {
          return;
        }
        setNutritionStatus("error");
        markDomainFailure("nutrition", queueError);
      }
    }
  }

  async function handleLoadNutritionLogs() {
    const authenticatedUserId = resolveAuthenticatedUserId("nutrition");
    if (authenticatedUserId === null) {
      setNutritionStatus("error");
      return;
    }
    setNutritionStatus("loading");
    try {
      const logs = await manageNutritionUseCase.listNutritionLogs(authenticatedUserId);
      setNutritionLogs(logs);
      setNutritionStatus(logs.length === 0 ? "empty" : "loaded");
      markDomainSuccess("nutrition");
    } catch (error) {
      if (shouldStopForUpgrade(error)) {
        return;
      }
      setNutritionStatus("error");
      markDomainFailure("nutrition", error);
    }
  }

  async function handleLoadProgressSummary() {
    const authenticatedUserId = resolveAuthenticatedUserId("progress");
    if (authenticatedUserId === null) {
      setProgressStatus("error");
      return;
    }
    setProgressStatus("loading");
    try {
      const summary = await manageProgressUseCase.getSummary(authenticatedUserId);
      setProgressSummary(summary);
      setProgressStatus(
        summary.workoutSessionsCount === 0 && summary.nutritionLogsCount === 0
          ? "empty"
          : "loaded"
      );
      markDomainSuccess("progress");
    } catch (error) {
      if (shouldStopForUpgrade(error)) {
        return;
      }
      setProgressStatus("error");
      markDomainFailure("progress", error);
    }
  }

  async function handleSyncOfflineQueue() {
    const authenticatedUserId = resolveAuthenticatedUserId("operations");
    if (authenticatedUserId === null) {
      setSyncStatus("error");
      return;
    }
    setSyncStatus("loading");
    try {
      const result = await offlineSyncQueueUseCase.syncPending(authenticatedUserId);
      await refreshPendingQueue();
      setLastSyncRejectedCount(result.rejected.length);
      setLastSyncIdempotency(result.idempotency);
      setSyncStatus("synced");
      markDomainSuccess("operations");
    } catch (error) {
      if (shouldStopForUpgrade(error)) {
        return;
      }
      setLastSyncIdempotency(null);
      setSyncStatus("error");
      markDomainFailure("operations", error);
    }
  }

  function applyObservabilityCollections(payload: ObservabilityCollectionsPayload): void {
    setAnalyticsEvents(payload.events);
    setCrashReports(payload.crashReports);
    setObservabilitySummary(payload.summary);
    setOperationalAlerts(payload.alerts);
    setOperationalRunbooks(payload.runbooks);
    setStructuredLogs(payload.structuredLogs);
    setActivityLogEntries(payload.activityLog);
  }

  async function loadObservabilityCollections(options?: { force?: boolean }): Promise<void> {
    const authenticatedUserId = resolveAuthenticatedUserId("operations");
    if (authenticatedUserId === null) {
      throw new Error("missing_authorization_bearer");
    }
    const forceReload = options?.force ?? false;
    const cacheTtlMs = 30_000;
    const now = Date.now();
    const cachedPayload = observabilityCollectionsCacheRef.current;

    if (
      forceReload === false &&
      cachedPayload !== null &&
      now - cachedPayload.loadedAt < cacheTtlMs
    ) {
      applyObservabilityCollections(cachedPayload.payload);
      return;
    }

    const [
      loadedEvents,
      loadedCrashReports,
      loadedSummary,
      loadedAlerts,
      loadedRunbooks,
      loadedStructuredLogs,
      loadedActivityLog
    ] = await Promise.all([
      manageObservabilityUseCase.listAnalyticsEvents(authenticatedUserId),
      manageObservabilityUseCase.listCrashReports(authenticatedUserId),
      manageObservabilityUseCase.listObservabilitySummary(authenticatedUserId),
      manageObservabilityUseCase.listOperationalAlerts(authenticatedUserId),
      manageObservabilityUseCase.listOperationalRunbooks(),
      manageObservabilityUseCase.listStructuredLogs(authenticatedUserId),
      manageObservabilityUseCase.listActivityLog(authenticatedUserId)
    ]);
    const payload: ObservabilityCollectionsPayload = {
      events: loadedEvents,
      crashReports: loadedCrashReports,
      summary: loadedSummary,
      alerts: loadedAlerts,
      runbooks: loadedRunbooks,
      structuredLogs: loadedStructuredLogs,
      activityLog: loadedActivityLog
    };
    observabilityCollectionsCacheRef.current = { loadedAt: now, payload };
    applyObservabilityCollections(payload);
  }

  async function handleTrackAnalyticsEvent() {
    const authenticatedUserId = resolveAuthenticatedUserId("operations");
    if (authenticatedUserId === null) {
      setObservabilityStatus("error");
      return;
    }
    setObservabilityStatus("loading");
    try {
      await manageObservabilityUseCase.createAnalyticsEvent({
        userId: authenticatedUserId,
        name: "dashboard_interaction",
        source: "web",
        occurredAt: new Date().toISOString(),
        attributes: {
          pendingQueueCount,
          selectedPlan: selectedPlanId.length > 0
        }
      });
      observabilityCollectionsCacheRef.current = null;
      setObservabilityStatus("event_saved");
      markDomainSuccess("operations");
    } catch (error) {
      if (shouldStopForUpgrade(error)) {
        return;
      }
      setObservabilityStatus("error");
      markDomainFailure("operations", error);
    }
  }

  async function handleReportDemoCrash() {
    const authenticatedUserId = resolveAuthenticatedUserId("operations");
    if (authenticatedUserId === null) {
      setObservabilityStatus("error");
      return;
    }
    setObservabilityStatus("loading");
    try {
      try {
        throw new Error("Simulated crash for observability validation");
      } catch (error) {
        const message = error instanceof Error ? error.message : "unknown_error";
        const stackTrace = error instanceof Error ? error.stack : undefined;
        await manageObservabilityUseCase.createCrashReport({
          userId: authenticatedUserId,
          source: "web",
          message,
          stackTrace,
          severity: "warning",
          occurredAt: new Date().toISOString()
        });
      }
      observabilityCollectionsCacheRef.current = null;
      setObservabilityStatus("crash_saved");
      markDomainSuccess("operations");
    } catch (error) {
      if (shouldStopForUpgrade(error)) {
        return;
      }
      setObservabilityStatus("error");
      markDomainFailure("operations", error);
    }
  }

  async function handleLoadObservabilityData() {
    setObservabilityStatus("loading");
    try {
      await loadObservabilityCollections({ force: true });
      setObservabilityStatus("loaded");
      markDomainSuccess("operations");
    } catch (error) {
      if (shouldStopForUpgrade(error)) {
        return;
      }
      setObservabilityStatus("error");
      markDomainFailure("operations", error);
    }
  }

  async function handleLoadAuditTimeline() {
    setAuditStatus("loading");
    try {
      await loadObservabilityCollections();
      setAuditStatus("loaded");
      markDomainSuccess("operations");
    } catch (error) {
      if (shouldStopForUpgrade(error)) {
        return;
      }
      setAuditStatus("error");
      markDomainFailure("operations", error);
    }
  }

  async function handleLoadBillingSupportData() {
    setBillingHasValidationError(false);
    setBillingSupportStatus("loading");
    try {
      await loadObservabilityCollections();
      setBillingSupportStatus("loaded");
      markDomainSuccess("operations");
    } catch (error) {
      if (shouldStopForUpgrade(error)) {
        return;
      }
      setBillingSupportStatus("error");
      markDomainFailure("operations", error);
    }
  }

  async function handleExportAuditCSV() {
    const authenticatedUserId = resolveAuthenticatedUserId("operations");
    if (authenticatedUserId === null) {
      setAuditStatus("error");
      return;
    }
    if (auditTimelineRows.length === 0) {
      setAuditStatus("empty");
      return;
    }
    const csv = exportAuditTimelineRowsToCSV(auditTimelineRows);
    if (typeof window !== "undefined") {
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = window.document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.download = `flux-audit-${new Date().toISOString()}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    }
    try {
      const runtimeAttributes = nextEventAttributes(runtimeObservabilitySessionRef.current, "operations");
      await manageObservabilityUseCase.createAnalyticsEvent({
        userId: authenticatedUserId,
        name: "audit_timeline_exported",
        source: "web",
        occurredAt: new Date().toISOString(),
        attributes: {
          rowsExported: String(auditTimelineRows.length),
          sourceFilter: auditSourceFilter,
          categoryFilter: auditCategoryFilter,
          severityFilter: auditSeverityFilter,
          ...runtimeAttributes
        }
      });
      setAuditStatus("saved");
    } catch (error) {
      setAuditStatus("error");
      markDomainFailure("operations", error);
    }
  }

  async function handleExportForensicAudit() {
    const authenticatedUserId = resolveAuthenticatedUserId("operations");
    if (authenticatedUserId === null) {
      setAuditStatus("error");
      return;
    }
    setAuditStatus("loading");
    try {
      const exportResult = await manageObservabilityUseCase.exportForensicAudit({
        userId: authenticatedUserId,
        format: "csv",
        fromDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        toDate: new Date().toISOString(),
        includeStructuredLogs: true,
        includeActivityLog: true
      });
      setForensicExportResult(exportResult);
      setAuditStatus("saved");
      markDomainSuccess("operations");
    } catch (error) {
      if (shouldStopForUpgrade(error)) {
        return;
      }
      setAuditStatus("error");
      markDomainFailure("operations", error);
    }
  }

  async function handleLoadExerciseVideos() {
    setVideoStatus("loading");
    try {
      const videos = await manageTrainingUseCase.listExerciseVideos(
        selectedExerciseForVideos,
        videoLocale
      );
      setExerciseVideos(videos);
      setSelectedExerciseVideoId(videos[0]?.id ?? "");
      setVideoStatus("loaded");
      markDomainSuccess("training");
    } catch (error) {
      if (shouldStopForUpgrade(error)) {
        return;
      }
      setVideoStatus("error");
      markDomainFailure("training", error);
    }
  }

  function handleClearExerciseDetailSelection() {
    setSelectedExerciseVideoId("");
  }

  function handleOpenSelectedExerciseVideo() {
    if (selectedExerciseVideo === null) {
      return;
    }
    window.open(selectedExerciseVideo.videoUrl, "_blank", "noopener,noreferrer");
  }

  function handleLoadPlanTemplates() {
    setPlanTemplatesStatus("loading");
    if (planTemplateOptions.length === 0) {
      setPlanTemplatesStatus("empty");
      return;
    }
    if (selectedPlanTemplate === "") {
      setSelectedPlanTemplate(planTemplateOptions[0]?.template ?? "");
    }
    setPlanTemplatesStatus("loaded");
    markDomainSuccess("training");
  }

  function handleApplyPlanTemplate() {
    if (selectedPlanTemplateOption === null) {
      setPlanTemplatesStatus("validation_error");
      return;
    }
    setPlanBuilderTemplate(selectedPlanTemplateOption.template);
    setPlanBuilderWeeksInput(String(selectedPlanTemplateOption.weeks));
    setPlanBuilderDaysInput(String(selectedPlanTemplateOption.daysPerWeek));
    setPlanTemplatesStatus("saved");
    markDomainSuccess("training");
  }

  function handleClearPlanTemplateSelection() {
    setSelectedPlanTemplate("");
    setPlanTemplatesStatus("empty");
  }

  function handlePreviewPublishPlan() {
    if (selectedPlan === null) {
      setPublishReviewStatus("empty");
      return;
    }
    setPublishReviewStatus("loaded");
  }

  function handleRunPublishChecklist() {
    setPublishReviewStatus("loading");
    if (isPublishChecklistReady === false) {
      setPublishChecklistAcknowledged(false);
      setPublishReviewStatus("validation_error");
      return;
    }
    setPublishChecklistAcknowledged(true);
    setPublishReviewStatus("loaded");
    markDomainSuccess("training");
  }

  async function handlePublishPlanReview() {
    const authenticatedUserId = resolveAuthenticatedUserId("training");
    if (authenticatedUserId === null) {
      setPublishReviewStatus("error");
      return;
    }
    if (selectedPlan === null || publishChecklistAcknowledged === false || !isPublishChecklistReady) {
      setPublishReviewStatus("validation_error");
      return;
    }
    setPublishReviewStatus("loading");
    try {
      const runtimeAttributes = nextEventAttributes(
        runtimeObservabilitySessionRef.current,
        "training"
      );
      await manageObservabilityUseCase.createAnalyticsEvent({
        userId: authenticatedUserId,
        name: "plan_publish_review_completed",
        source: "web",
        occurredAt: new Date().toISOString(),
        attributes: {
          planId: selectedPlan.id,
          template: selectedPlanTemplateOption?.template ?? "none",
          selectedAthletes: String(selectedAthleteRows.length),
          checklistReady: String(isPublishChecklistReady),
          ...runtimeAttributes
        }
      });
      setPublishedPlanId(selectedPlan.id);
      setPublishReviewStatus("saved");
      markDomainSuccess("training");
    } catch (error) {
      if (shouldStopForUpgrade(error)) {
        return;
      }
      setPublishReviewStatus("error");
      markDomainFailure("training", error);
    }
  }

  function handleClearPublishReview() {
    setPublishChecklistAcknowledged(false);
    setPublishedPlanId(null);
    setPublishReviewStatus("empty");
  }

  async function handleLoadRecommendations() {
    const authenticatedUserId = resolveAuthenticatedUserId("nutrition");
    if (authenticatedUserId === null) {
      setRecommendationsStatus("error");
      return;
    }
    setRecommendationsStatus("loading");
    const estimatedDaysSinceWorkout = sessions.length === 0 ? 3 : 0;
    const estimatedCompletionRate =
      plans.length === 0 ? 0.4 : Math.min(1, sessions.length / Math.max(plans.length * 2, 1));

    try {
      const loadedRecommendations = await manageRecommendationsUseCase.listRecommendations(
        authenticatedUserId,
        language === "es" ? "es-ES" : "en-US",
        {
          goal,
          pendingQueueCount,
          daysSinceLastWorkout: estimatedDaysSinceWorkout,
          recentCompletionRate: estimatedCompletionRate
        }
      );
      setRecommendations(loadedRecommendations);
      setRecommendationsStatus(loadedRecommendations.length === 0 ? "empty" : "loaded");
      markDomainSuccess("nutrition");
    } catch (error) {
      if (shouldStopForUpgrade(error)) {
        return;
      }
      setRecommendationsStatus("error");
      markDomainFailure("nutrition", error);
    }
  }

  function handleToggleAthleteSelection(athleteId: string) {
    setSelectedAthleteIds((current) =>
      current.includes(athleteId)
        ? current.filter((item) => item !== athleteId)
        : [...current, athleteId]
    );
  }

  function handleClearAthleteSelection() {
    setSelectedAthleteIds([]);
    setOperationsStatus(athleteOperationRows.length === 0 ? "empty" : "idle");
  }

  function handleSelectFirstAthleteDetail() {
    const firstAthlete = athleteOperationRows[0];
    if (firstAthlete === undefined) {
      setOperationsStatus("empty");
      return;
    }
    setSelectedAthleteIds([firstAthlete.athleteId]);
    setOperationsStatus("loaded");
  }

  function handleOpenAthleteSessionHistory() {
    if (selectedAthleteDetailRow === null) {
      setOperationsStatus("validation_error");
      return;
    }
    setAthleteSearch(selectedAthleteDetailRow.athleteId);
    setAthleteSortMode("lastSession");
    setOperationsStatus("loaded");
  }

  async function handleLoadCoachNotes() {
    const authenticatedUserId = resolveAuthenticatedUserId("operations");
    if (authenticatedUserId === null) {
      setOperationsStatus("error");
      return;
    }
    setOperationsStatus("loading");
    try {
      const [loadedSessions, loadedProgressSummary] = await Promise.all([
        manageTrainingUseCase.listWorkoutSessions(authenticatedUserId),
        manageProgressUseCase.getSummary(authenticatedUserId),
        loadObservabilityCollections({ force: true })
      ]);
      setSessions(loadedSessions);
      setProgressSummary(loadedProgressSummary);
      setOperationsStatus("loaded");
      markDomainSuccess("operations");
    } catch (error) {
      if (shouldStopForUpgrade(error)) {
        return;
      }
      setOperationsStatus("error");
      markDomainFailure("operations", error);
    }
  }

  async function handleSaveCoachFollowUp() {
    const authenticatedUserId = resolveAuthenticatedUserId("operations");
    if (authenticatedUserId === null) {
      setOperationsStatus("error");
      return;
    }
    if (selectedAthleteDetailRow === null) {
      setOperationsStatus("validation_error");
      return;
    }
    setOperationsStatus("loading");
    try {
      const runtimeAttributes = nextEventAttributes(runtimeObservabilitySessionRef.current, "operations");
      await manageObservabilityUseCase.createAnalyticsEvent({
        userId: authenticatedUserId,
        name: "coach_note_saved",
        source: "web",
        occurredAt: new Date().toISOString(),
        attributes: {
          athleteId: selectedAthleteDetailRow.athleteId,
          sessionsCount: String(selectedAthleteDetailRow.sessionsCount),
          nutritionLogsCount: String(selectedAthleteDetailRow.nutritionLogsCount),
          riskLevel: selectedAthleteDetailRow.riskLevel,
          ...runtimeAttributes
        }
      });
      observabilityCollectionsCacheRef.current = null;
      setOperationsStatus("saved");
      markDomainSuccess("operations");
    } catch (error) {
      if (shouldStopForUpgrade(error)) {
        return;
      }
      setOperationsStatus("error");
      markDomainFailure("operations", error);
    }
  }

  function handleBulkAssignStarterPlan() {
    void handleAssignPlansToAthletes(selectedAthleteIds, "selected");
  }

  async function handleAssignPlansToAthletes(
    athleteIds: string[],
    source: "selected" | "at_risk"
  ) {
    const authenticatedUserId = resolveAuthenticatedUserId("training");
    if (authenticatedUserId === null) {
      setTrainingStatus("error");
      setOperationsStatus("error");
      return;
    }
    if (selectedPlan === null) {
      setTrainingStatus("validation_error");
      setOperationsStatus("validation_error");
      return;
    }
    if (athleteIds.length === 0) {
      setOperationsStatus("validation_error");
      return;
    }

    const uniqueAthleteIds = Array.from(new Set(athleteIds));
    const assignedAtTimestamp = Date.now();
    setTrainingStatus("loading");
    setOperationsStatus("loading");

    try {
      await Promise.all(
        uniqueAthleteIds.map((athleteId, index) =>
          manageTrainingUseCase.createTrainingPlan({
            id: createAssignedPlanId(selectedPlan.id, athleteId, index, assignedAtTimestamp),
            userId: athleteId,
            name: `${selectedPlan.name} · ${translate("planAssignmentAssignedSuffix")}`,
            weeks: selectedPlan.weeks,
            days: selectedPlan.days
          })
        )
      );
      const runtimeAttributes = nextEventAttributes(runtimeObservabilitySessionRef.current, "training");
      await manageObservabilityUseCase.createAnalyticsEvent({
        userId: authenticatedUserId,
        name: "training_plan_assignment_saved",
        source: "web",
        occurredAt: new Date().toISOString(),
        attributes: {
          source,
          selectedPlanId: selectedPlan.id,
          selectedAthletes: String(uniqueAthleteIds.length),
          ...runtimeAttributes
        }
      });
      await handleLoadPlans();
      setTrainingStatus("saved");
      setOperationsStatus("saved");
      markDomainSuccess("training");
      markDomainSuccess("operations");
    } catch (error) {
      if (shouldStopForUpgrade(error)) {
        return;
      }
      setTrainingStatus("error");
      setOperationsStatus("error");
      markDomainFailure("training", error);
      markDomainFailure("operations", error);
    }
  }

  function handleAssignPlanToAtRiskAthletes() {
    const atRiskAthleteIds = atRiskAthleteRows.map((row) => row.athleteId);
    setSelectedAthleteIds(atRiskAthleteIds);
    void handleAssignPlansToAthletes(atRiskAthleteIds, "at_risk");
  }

  function handleClearNutritionFilters() {
    setNutritionDateFilter("");
    setNutritionMinProteinFilter("");
    setNutritionMaxCaloriesFilter("");
    setNutritionSortMode("date_desc");
  }

  function handleSelectNutritionLogDetail(logKey: string) {
    setSelectedNutritionLogKey(logKey);
  }

  function handleClearNutritionLogSelection() {
    setSelectedNutritionLogKey(null);
  }

  function handleOpenNutritionLogCoachView() {
    if (selectedNutritionLog === null) {
      setNutritionStatus("validation_error");
      return;
    }
    setSelectedAthleteIds([selectedNutritionLog.userId]);
    setAthleteSearch(selectedNutritionLog.userId);
    setAthleteSortMode("sessions");
    setActiveDomain(isQAMode ? "operations" : "progress");
  }

  function handleFocusNutritionCoachAtRisk() {
    const firstAtRiskAthlete = athleteOperationRows.find((row) => row.riskLevel === "attention");
    if (firstAtRiskAthlete === undefined) {
      setNutritionStatus("loaded");
      return;
    }
    setSelectedAthleteIds([firstAtRiskAthlete.athleteId]);
    setAthleteSearch(firstAtRiskAthlete.athleteId);
    setAthleteSortMode("sessions");
    setActiveDomain(isQAMode ? "operations" : "progress");
  }

  function handleOpenNutritionCoachOperations() {
    setAthleteSortMode("sessions");
    setActiveDomain(isQAMode ? "operations" : "progress");
  }

  function handleFocusHighestNutritionRisk() {
    const highestRiskRow =
      cohortNutritionRows.find((row) => row.riskLevel === "attention") ??
      cohortNutritionRows[0];
    if (highestRiskRow === undefined) {
      setNutritionStatus("loaded");
      return;
    }
    setSelectedAthleteIds([highestRiskRow.athleteId]);
    setAthleteSearch(highestRiskRow.athleteId);
    setAthleteSortMode("sessions");
    setActiveDomain(isQAMode ? "operations" : "progress");
  }

  function handleClearProgressFilters() {
    setProgressMinSessionsFilter("");
    setProgressSortMode("date_desc");
  }

  function handleClearAuditFilters() {
    setAuditQuery("");
    setAuditSourceFilter("all");
    setAuditCategoryFilter("all");
    setAuditSeverityFilter("all");
    setAuditDomainFilter("");
  }

  function handleClearBillingSupportFilters() {
    setBillingHasValidationError(false);
    setBillingSupportSearch("");
    setBillingDomainFilter("");
    setBillingInvoiceStatusFilter("all");
    setBillingIncidentStateFilter("all");
    setBillingIncidentSeverityFilter("all");
  }

  function handleShowMoreAthleteRows() {
    setAthleteRowsVisibleCount((current) =>
      increaseVisibleRows(current, athleteOperationRows.length)
    );
  }

  function handleShowAllAthleteRows() {
    setAthleteRowsVisibleCount(athleteOperationRows.length);
  }

  function handleShowMoreGovernanceRows() {
    setGovernanceRowsVisibleCount((current) =>
      increaseVisibleRows(current, governancePrincipals.length)
    );
  }

  function handleShowAllGovernanceRows() {
    setGovernanceRowsVisibleCount(governancePrincipals.length);
  }

  function handleShowMoreAuditRows() {
    setAuditRowsVisibleCount((current) =>
      increaseVisibleRows(current, auditTimelineRows.length)
    );
  }

  function handleShowAllAuditRows() {
    setAuditRowsVisibleCount(auditTimelineRows.length);
  }

  function handleShowMoreBillingInvoiceRows() {
    setBillingInvoiceRowsVisibleCount((current) =>
      increaseVisibleRows(current, billingInvoiceRows.length)
    );
  }

  function handleShowAllBillingInvoiceRows() {
    setBillingInvoiceRowsVisibleCount(billingInvoiceRows.length);
  }

  function handleShowMoreBillingIncidentRows() {
    setBillingIncidentRowsVisibleCount((current) =>
      increaseVisibleRows(current, supportIncidentRows.length)
    );
  }

  function handleShowAllBillingIncidentRows() {
    setBillingIncidentRowsVisibleCount(supportIncidentRows.length);
  }

  function handleToggleBillingIncidentSelection(incidentId: string) {
    setBillingHasValidationError(false);
    setBillingSelectedIncidentIds((current) =>
      current.includes(incidentId)
        ? current.filter((item) => item !== incidentId)
        : [...current, incidentId]
    );
  }

  function handleClearBillingIncidentSelection() {
    setBillingHasValidationError(false);
    setBillingSelectedIncidentIds([]);
    setBillingSupportStatus(
      billingInvoiceRows.length === 0 && supportIncidentRows.length === 0 ? "empty" : "idle"
    );
  }

  async function handleResolveBillingIncidents() {
    const authenticatedUserId = resolveAuthenticatedUserId("operations");
    if (authenticatedUserId === null) {
      setBillingSupportStatus("error");
      return;
    }
    if (billingSelectedIncidentIds.length === 0) {
      setBillingHasValidationError(true);
      setBillingSupportStatus("validation_error");
      return;
    }
    setBillingHasValidationError(false);
    setBillingSupportStatus("loading");
    setBillingIncidentStateOverrides((current) => {
      const next = { ...current };
      for (const incidentId of billingSelectedIncidentIds) {
        next[incidentId] = "resolved";
      }
      return next;
    });
    try {
      const runtimeAttributes = nextEventAttributes(
        runtimeObservabilitySessionRef.current,
        "operations"
      );
      await manageObservabilityUseCase.createAnalyticsEvent({
        userId: authenticatedUserId,
        name: "billing_support_incidents_resolved",
        source: "web",
        occurredAt: new Date().toISOString(),
        attributes: {
          selectedIncidents: String(billingSelectedIncidentIds.length),
          ...runtimeAttributes
        }
      });
      setBillingSupportStatus("saved");
    } catch {
      setBillingSupportStatus("error");
    }
  }

  function handleToggleGovernancePrincipalSelection(principalId: string) {
    setGovernanceHasValidationError(false);
    setGovernanceSelectedPrincipalIds((current) =>
      current.includes(principalId)
        ? current.filter((item) => item !== principalId)
        : [...current, principalId]
    );
  }

  function handleClearGovernanceSelection() {
    setGovernanceHasValidationError(false);
    setGovernanceSelectedPrincipalIds([]);
    setGovernanceStatus(
      governancePrincipals.length === 0 || governancePrincipalsBase.length === 0
        ? "empty"
        : "idle"
    );
  }

  async function handleLoadGovernanceRoleCoverage() {
    setGovernanceHasValidationError(false);
    setGovernanceStatus("loading");
    try {
      const roleCapabilityPairs = await Promise.all(
        dashboardRoles.map(async (role) => {
          const capabilities = await manageRoleCapabilitiesUseCase.listRoleCapabilities(
            role as AccessRole
          );
          return [role, capabilities] as const;
        })
      );
      setCapabilitiesByRole(Object.fromEntries(roleCapabilityPairs));
      setGovernanceStatus("loaded");
    } catch {
      setGovernanceStatus("error");
    }
  }

  async function handleAssignGovernanceRole(targetRole: DashboardRole) {
    const authenticatedUserId = resolveAuthenticatedUserId("operations");
    if (authenticatedUserId === null) {
      setGovernanceStatus("error");
      return;
    }
    if (!isAdminRole(activeRole)) {
      const correlationId = nextCorrelationId(
        runtimeObservabilitySessionRef.current,
        "operations",
        "runtime_state_change"
      );
      setGovernanceStatus("denied");
      await trackBlockedAction("operations", "runtime_state_change", "domain_denied", correlationId);
      return;
    }
    if (governanceSelectedPrincipalIds.length === 0) {
      setGovernanceHasValidationError(true);
      setGovernanceStatus("validation_error");
      return;
    }
    setGovernanceHasValidationError(false);
    setGovernanceStatus("loading");
    setAssignedRolesByPrincipal((current) => {
      const next = { ...current };
      for (const principalId of governanceSelectedPrincipalIds) {
        next[principalId] = targetRole;
      }
      return next;
    });
    try {
      const runtimeAttributes = nextEventAttributes(
        runtimeObservabilitySessionRef.current,
        "operations"
      );
      await manageObservabilityUseCase.createAnalyticsEvent({
        userId: authenticatedUserId,
        name: "governance_bulk_role_assignment_saved",
        source: "web",
        occurredAt: new Date().toISOString(),
        attributes: {
          operatorRole: activeRole,
          targetRole,
          selectedPrincipals: String(governanceSelectedPrincipalIds.length),
          ...runtimeAttributes
        }
      });
      setGovernanceStatus("saved");
    } catch {
      setGovernanceStatus("error");
    }
  }

  async function trackDomainChange(domain: DashboardDomain) {
    const authenticatedUserId = resolveAuthenticatedUserId(domain);
    if (authenticatedUserId === null) {
      return;
    }
    try {
      const allowedDomainCount =
        roleCapabilitiesStatus === "loaded" && roleCapabilities !== null
          ? roleCapabilities.allowedDomains.length
          : 0;
      const payloadValidation = resolveDomainPayloadValidation(buildDomainPayloadValidationInput(domain));
      const runtimeAttributes = nextEventAttributes(runtimeObservabilitySessionRef.current, domain);
      await manageObservabilityUseCase.createAnalyticsEvent({
        userId: authenticatedUserId,
        name: "dashboard_domain_changed",
        source: "web",
        occurredAt: new Date().toISOString(),
        attributes: {
          domain,
          role: activeRole,
          roleCapabilitiesStatus,
          allowedDomainCount: String(allowedDomainCount),
          backendRoute: resolveBlockedActionRoute(domain),
          contract: payloadValidation.contract,
          payloadValidation: payloadValidation.status,
          payloadMissingFields: payloadValidation.missingFields,
          ...runtimeAttributes
        }
      });
    } catch {
      return;
    }
  }

  async function trackRoleChange(role: DashboardRole) {
    const authenticatedUserId = resolveAuthenticatedUserId(activeDomain);
    if (authenticatedUserId === null) {
      return;
    }
    try {
      const runtimeAttributes = nextEventAttributes(runtimeObservabilitySessionRef.current, activeDomain);
      await manageObservabilityUseCase.createAnalyticsEvent({
        userId: authenticatedUserId,
        name: "dashboard_role_changed",
        source: "web",
        occurredAt: new Date().toISOString(),
        attributes: {
          role,
          domain: activeDomain,
          ...runtimeAttributes
        }
      });
    } catch {
      return;
    }
  }

  async function trackDeniedDomainAccess(
    domain: DashboardDomain,
    trigger: "domain_select" | "runtime_state_change" | "recover" | "role_capabilities_sync",
    correlationId?: string
  ) {
    const authenticatedUserId = resolveAuthenticatedUserId(domain);
    if (authenticatedUserId === null) {
      return;
    }
    try {
      const payloadValidation = resolveDomainPayloadValidation(buildDomainPayloadValidationInput(domain));
      const runtimeAttributes = nextDeniedEventAttributes(
        runtimeObservabilitySessionRef.current,
        domain,
        correlationId
      );
      await manageObservabilityUseCase.createAnalyticsEvent({
        userId: authenticatedUserId,
        name: "dashboard_domain_access_denied",
        source: "web",
        occurredAt: new Date().toISOString(),
        attributes: {
          role: activeRole,
          domain,
          trigger,
          roleCapabilitiesStatus,
          backendRoute: resolveBlockedActionRoute(domain),
          contract: payloadValidation.contract,
          payloadValidation: payloadValidation.status,
          payloadMissingFields: payloadValidation.missingFields,
          ...runtimeAttributes
        }
      });
    } catch {
      return;
    }
  }

  async function trackBlockedAction(
    domain: DashboardDomain,
    action:
      | "domain_select"
      | "runtime_state_change"
      | "recover"
      | "role_capabilities_sync",
    reason:
      | "domain_denied"
      | "action_denied"
      | "ownership_required"
      | "medical_consent_required",
    correlationId?: string
  ) {
    const authenticatedUserId = resolveAuthenticatedUserId(domain);
    if (authenticatedUserId === null) {
      return;
    }
    let resolvedReason = reason;
    try {
      const decision = await manageAccessControlUseCase.evaluateAccessDecision({
        role: activeRole,
        domain,
        action: "view",
        context: {
          isOwner: activeRole === "athlete",
          medicalDisclaimerAccepted
        }
      });
      if (decision.allowed === false && decision.reason !== "allowed") {
        resolvedReason = decision.reason;
      }
    } catch {
      resolvedReason = reason;
    }

    try {
      await manageAccessControlUseCase.recordDeniedAccessAudit({
        userId: authenticatedUserId,
        role: activeRole,
        domain,
        action: "view",
        reason: resolvedReason,
        trigger: action,
        correlationId: correlationId ?? nextCorrelationId(runtimeObservabilitySessionRef.current, domain, action)
      });
    } catch {
      resolvedReason = reason;
    }

    const backendRoute = resolveBlockedActionRoute(domain);
    const payloadValidation = resolveDomainPayloadValidation(buildDomainPayloadValidationInput(domain));
    const runtimeAttributes = nextEventAttributes(
      runtimeObservabilitySessionRef.current,
      domain,
      correlationId
    );
    try {
      await manageObservabilityUseCase.createAnalyticsEvent({
        userId: authenticatedUserId,
        name: "dashboard_action_blocked",
        source: "web",
        occurredAt: new Date().toISOString(),
        attributes: {
          role: activeRole,
          domain,
          action,
          reason: resolvedReason,
          roleCapabilitiesStatus,
          backendRoute,
          contract: payloadValidation.contract,
          payloadValidation: payloadValidation.status,
          payloadMissingFields: payloadValidation.missingFields,
          ...runtimeAttributes
        }
      });
    } catch {
      return;
    }
  }

  function buildDomainPayloadValidationInput(domain: DashboardDomain) {
    return {
      domain,
      userId: activeUserId,
      goal,
      displayName,
      age: Number(age),
      heightCm: Number(heightCm),
      weightKg: Number(weightKg),
      availableDaysPerWeek: Number(availableDaysPerWeek),
      parQ1,
      parQ2,
      selectedPlanId,
      selectedExerciseId: selectedExerciseForVideos,
      nutritionDate,
      calories: Number(calories),
      proteinGrams: Number(proteinGrams),
      carbsGrams: Number(carbsGrams),
      fatsGrams: Number(fatsGrams)
    };
  }

  function canAccessActiveRoleDomain(domain: DashboardDomain): boolean {
    return resolveDomainAccessDecision(domain, roleCapabilitiesStatus, roleCapabilities) === "allowed";
  }

  function setActiveDomainRuntimeState(targetState: EnterpriseRuntimeState) {
    const accessDecision = resolveDomainAccessDecision(
      activeDomain,
      roleCapabilitiesStatus,
      roleCapabilities
    );
    if (activeDomain !== "all" && accessDecision !== "allowed") {
      const blockedState: EnterpriseRuntimeState =
        accessDecision === "pending"
          ? "loading"
          : accessDecision === "error"
            ? "error"
            : "denied";
      setDomainRuntimeStates((currentStates) =>
        setRuntimeStateForActiveDomain(activeDomain, blockedState, currentStates)
      );
      if (blockedState === "denied") {
        const correlationId = nextCorrelationId(
          runtimeObservabilitySessionRef.current,
          activeDomain,
          "runtime_state_change"
        );
        void trackDeniedDomainAccess(activeDomain, "runtime_state_change", correlationId);
        void trackBlockedAction(activeDomain, "runtime_state_change", "domain_denied", correlationId);
      }
      return;
    }
    setDomainRuntimeStates((currentStates) =>
      setRuntimeStateForActiveDomain(activeDomain, targetState, currentStates)
    );
  }

  function handleDomainSelection(domain: DashboardDomain) {
    const nextDomain = normalizeDomainForMode(domain);
    setActiveDomain(nextDomain);
    if (nextDomain === "all") {
      return;
    }
    const accessDecision = resolveDomainAccessDecision(
      nextDomain,
      roleCapabilitiesStatus,
      roleCapabilities
    );
    if (accessDecision === "allowed") {
      return;
    }
    if (accessDecision === "pending") {
      setDomainRuntimeStates((currentStates) =>
        setRuntimeStateForActiveDomain(nextDomain, "loading", currentStates)
      );
      return;
    }
    if (accessDecision === "error") {
      setDomainRuntimeStates((currentStates) =>
        setRuntimeStateForActiveDomain(nextDomain, "error", currentStates)
      );
      return;
    }
    if (accessDecision === "denied") {
      setDomainRuntimeStates((currentStates) =>
        setRuntimeStateForActiveDomain(nextDomain, "denied", currentStates)
      );
      const correlationId = nextCorrelationId(
        runtimeObservabilitySessionRef.current,
        nextDomain,
        "domain_select"
      );
      void trackDeniedDomainAccess(nextDomain, "domain_select", correlationId);
      void trackBlockedAction(nextDomain, "domain_select", "domain_denied", correlationId);
    }
  }

  async function recoverActiveDomainState() {
    const accessDecision = resolveDomainAccessDecision(
      activeDomain,
      roleCapabilitiesStatus,
      roleCapabilities
    );
    if (activeDomain !== "all" && accessDecision !== "allowed") {
      const blockedState: EnterpriseRuntimeState =
        accessDecision === "pending"
          ? "loading"
          : accessDecision === "error"
            ? "error"
            : "denied";
      setDomainRuntimeStates((currentStates) =>
        setRuntimeStateForActiveDomain(activeDomain, blockedState, currentStates)
      );
      if (blockedState === "denied") {
        const correlationId = nextCorrelationId(
          runtimeObservabilitySessionRef.current,
          activeDomain,
          "recover"
        );
        await trackDeniedDomainAccess(activeDomain, "recover", correlationId);
        await trackBlockedAction(activeDomain, "recover", "domain_denied", correlationId);
      }
      return;
    }
    setDomainRuntimeStates((currentStates) =>
      resetRuntimeStateForActiveDomain(activeDomain, currentStates)
    );

    switch (activeDomain) {
      case "onboarding":
        setActiveSession(null);
        setAuthStatus("signed_out");
        setOnboardingStatus("idle");
        return;
      case "training":
        setTrainingStatus("idle");
        setSessionStatus("idle");
        setVideoStatus("idle");
        return;
      case "nutrition":
        setNutritionStatus("idle");
        return;
      case "progress":
        setProgressStatus("idle");
        return;
      case "operations":
        setSyncStatus("idle");
        setObservabilityStatus("idle");
        setRecommendationsStatus("idle");
        await refreshPendingQueue();
        return;
      case "all":
        return;
      default:
        return;
    }
  }

  async function handleRefreshDashboardHome() {
    if (hasAuthenticatedSession === false) {
      setAuthStatus("session_required");
      setDashboardHomeRuntimeStateOverride("denied");
      return;
    }

    setDashboardHomeRuntimeStateOverride("loading");
    setRoleCapabilitiesStatus("loading");

    try {
      const [capabilities] = await Promise.all([
        manageRoleCapabilitiesUseCase.listRoleCapabilities(activeRole as AccessRole),
        refreshPendingQueue(),
        loadObservabilityCollections({ force: true })
      ]);
      setRoleCapabilities(capabilities);
      setRoleCapabilitiesStatus("loaded");
      setDashboardHomeRuntimeStateOverride(
        visibleModulesForDomain.length === 0 ? "empty" : "success"
      );
    } catch (error) {
      if (shouldStopForUpgrade(error)) {
        return;
      }
      setRoleCapabilitiesStatus("error");
      setDashboardHomeRuntimeStateOverride(resolveFailureRuntimeState(error));
    }
  }

  async function handleRunQuickActions() {
    if (hasAuthenticatedSession === false) {
      setAuthStatus("session_required");
      setDashboardHomeRuntimeStateOverride("denied");
      return;
    }

    await Promise.all([
      handleLoadPlans(),
      handleLoadSessions(),
      handleLoadNutritionLogs(),
      handleLoadProgressSummary(),
      handleLoadRecommendations(),
      handleSyncOfflineQueue()
    ]);
  }

  async function handleRefreshAlertCenter() {
    await Promise.all([handleLoadObservabilityData(), handleLoadAuditTimeline()]);
  }

  function handleReloadRoleCapabilitiesMatrix() {
    setRoleCapabilitiesReloadNonce((current) => current + 1);
  }

  async function handleRefreshDashboardKpis() {
    await Promise.all([handleRunQuickActions(), handleRefreshAlertCenter()]);
  }

  async function handleRefreshReadinessMonitor() {
    await handleRefreshDashboardHome();
  }

  async function handleRefreshAlertsFull() {
    await Promise.all([handleRefreshAlertCenter(), handleLoadAuditTimeline()]);
  }

  async function handleRefreshRecentActivity() {
    await loadObservabilityCollections({ force: true });
    await handleLoadAuditTimeline();
  }

  async function handleRunShortcuts() {
    await Promise.all([handleRunQuickActions(), handleRefreshDashboardHome()]);
  }

  async function handleRefreshProgressTrends() {
    await handleLoadProgressSummary();
  }

  async function handleRefreshCohortAnalysis() {
    await Promise.all([
      handleLoadPlans(),
      handleLoadSessions(),
      handleLoadNutritionLogs(),
      handleLoadProgressSummary()
    ]);
  }

  async function handleRefreshAIInsights() {
    await Promise.all([
      handleLoadRecommendations(),
      handleLoadObservabilityData(),
      handleLoadProgressSummary()
    ]);
  }

  return (
    <div className={`app-shell tone-${readiness.tone}`}>
      <div className="app-background app-background-left" />
      <div className="app-background app-background-right" />
      <main className="app-main">
        <section
          className="hero-card"
          data-screen-id={signInScreenModel.screenId}
          data-route-id={signInScreenModel.routeId}
          data-status-id={signInScreenModel.statusId}
          aria-busy={isAuthLoading}
        >
          <div className="hero-content">
            <p className="eyebrow">{translate("appName")}</p>
            <h1>{translate("heroTitle")}</h1>
            <p className="hero-copy">{translate("heroCopy")}</p>
            <div className="hero-actions">
              <button
                className="button primary"
                onClick={handleAppleSignIn}
                type="button"
                disabled={isAuthLoading}
                data-action-id={signInScreenModel.actions.apple}
              >
                {translate("signInWithApple")}
              </button>
              <div className="inline-inputs">
                <input
                  aria-label={translate("emailPlaceholder")}
                  placeholder={translate("emailPlaceholder")}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
                <input
                  aria-label={translate("passwordPlaceholder")}
                  placeholder={translate("passwordPlaceholder")}
                  value={password}
                  type="password"
                  onChange={(event) => setPassword(event.target.value)}
                />
                <button
                  className="button ghost"
                  onClick={handleEmailSignIn}
                  type="button"
                  disabled={isAuthLoading}
                  data-action-id={signInScreenModel.actions.email}
                >
                  {translate("signInWithEmail")}
                </button>
              </div>
              <div className="inline-inputs">
                <button
                  className="button ghost"
                  onClick={() => handleEmailRecovery("email")}
                  type="button"
                  disabled={isAuthLoading}
                  data-action-id={signInScreenModel.actions.recoverEmail}
                >
                  {translate("recoverByEmail")}
                </button>
                <button
                  className="button ghost"
                  onClick={() => handleEmailRecovery("sms")}
                  type="button"
                  disabled={isAuthLoading}
                  data-action-id={signInScreenModel.actions.recoverSMS}
                >
                  {translate("recoverBySMS")}
                </button>
              </div>
              <p className="hero-copy" data-status-id={signInScreenModel.statusId}>
                {hasAuthenticatedSession
                  ? language === "es"
                    ? "sesion activa"
                    : "active session"
                  : language === "es"
                    ? "listo para iniciar"
                    : "ready to sign in"}
              </p>
            </div>
          </div>
          <div className="language-toggle">
            <span>{translate("languageLabel")}</span>
            <div className="language-toggle-buttons">
              <button
                className={`button ghost language-button ${language === "es" ? "active" : ""}`}
                onClick={() => setLanguage("es")}
                type="button"
              >
                ES
              </button>
              <button
                className={`button ghost language-button ${language === "en" ? "active" : ""}`}
                onClick={() => setLanguage("en")}
                type="button"
              >
                EN
              </button>
            </div>
            {isQAMode ? (
              <>
                <span>{translate("laneLabel")}</span>
                <div className="language-toggle-buttons">
                  <button
                    className={`button ghost language-button ${webLane === "main" ? "active" : ""}`}
                    onClick={() => setWebLane("main")}
                    type="button"
                  >
                    {translate("laneMain")}
                  </button>
                  <button
                    className={`button ghost language-button ${webLane === "secondary" ? "active" : ""}`}
                    onClick={() => setWebLane("secondary")}
                    type="button"
                  >
                    {translate("laneSecondary")}
                  </button>
                </div>
              </>
            ) : null}
          </div>
          <div className="readiness-panel">
            <p className="readiness-label">{translate("readinessLabel")}</p>
            <p className="readiness-score">{readiness.score}%</p>
            <p className="readiness-state">{readinessLabel(readiness.label, language)}</p>
            <div className="readiness-progress" role="presentation">
              <span style={{ width: `${readiness.score}%` }} />
            </div>
            <div className="hero-metrics">
              {isQAMode ? (
                <>
                  <Metric
                    title={translate("authMetric")}
                    value={
                      hasAuthenticatedSession
                        ? language === "es"
                          ? "activa"
                          : "active"
                        : language === "es"
                          ? "pendiente"
                          : "pending"
                    }
                  />
                  {hasAuthenticatedSession ? (
                    <Metric title={translate("queueMetric")} value={String(pendingQueueCount)} />
                  ) : null}
                  <Metric title={translate("goalMetric")} value={goalLabel(goal, language)} />
                  {hasAuthenticatedSession ? (
                    <Metric
                      title={translate("syncMetric")}
                      value={humanizeStatus(syncStatus, language)}
                    />
                  ) : null}
                  <Metric
                    title={translate("runtimeStateModeLabel")}
                    value={toHumanStatus(runtimeStateForUI, language)}
                  />
                </>
              ) : (
                <Metric title={translate("goalMetric")} value={goalLabel(goal, language)} />
              )}
            </div>
          </div>
        </section>

        {releaseCompatibilityStatus === "upgrade_required" ? (
          <section className="status-banner critical">
            <strong>{translate("updateRequiredTitle")}</strong>
            <p>{translate("updateRequiredCopy")}</p>
          </section>
        ) : null}

        {isQAMode ? (
          <section className="domain-filter-card">
            <p className="domain-filter-label">
              {translate("domainFilterLabel")}
            </p>
            <div
              className="domain-filter-tabs"
              role="tablist"
              aria-label={translate("domainFilterLabel")}
            >
              {domainTabsForUI.map((tab) => (
                <button
                  key={tab.id}
                  className={`button ghost domain-tab ${activeDomainForUI === tab.id ? "active" : ""}`}
                  onClick={() => handleDomainSelection(tab.id)}
                  type="button"
                  role="tab"
                  aria-selected={activeDomainForUI === tab.id}
                  aria-controls="dashboard-grid"
                >
                  {tab.label}
                </button>
              ))}
            </div>
            {isQAMode ? (
              <div className="inline-inputs">
                <label className="runtime-state-control">
                  <span>{translate("roleLabel")}</span>
                  <select
                    aria-label={translate("roleLabel")}
                    value={activeRole}
                    onChange={(event) => setActiveRole(event.target.value as DashboardRole)}
                  >
                    {roleOptions.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                </label>
                <Metric
                  title={translate("roleLabel")}
                  value={
                    roleCapabilitiesStatus === "loaded" && roleCapabilities !== null
                      ? roleCapabilities.allowedDomains
                          .filter((domain) => domain !== "all")
                          .map(
                            (domain) =>
                              domainTabs.find((tab) => tab.id === domain)?.label ?? domain
                          )
                          .join(" · ")
                      : toHumanStatus(roleCapabilitiesStatus, language)
                  }
                />
                {roleCapabilitiesStatus === "error" ? (
                  <button
                    className="button ghost"
                    onClick={() => setRoleCapabilitiesReloadNonce((current) => current + 1)}
                    type="button"
                  >
                    {translate("retryRoleCapabilities")}
                  </button>
                ) : null}
              </div>
            ) : null}
          </section>
        ) : null}

        {isQAMode ? (
          <section className="runtime-state-card">
          <header className="runtime-state-header">
            <p className="domain-filter-label">{translate("runtimeStateSectionTitle")}</p>
            <span className={`status-pill status-${toStatusClass(activeDomainRuntimeState)}`}>
              {toHumanStatus(activeDomainRuntimeState, language)}
            </span>
          </header>
          <div className="inline-inputs">
            <label className="runtime-state-control">
              <span>{translate("runtimeStateModeLabel")}</span>
              <select
                aria-label={translate("runtimeStateModeLabel")}
                disabled={activeDomain === "all"}
                value={activeDomainRuntimeState}
                onChange={(event) =>
                  setActiveDomainRuntimeState(event.target.value as EnterpriseRuntimeState)
                }
              >
                <option value="success">{toHumanStatus("success", language)}</option>
                <option value="loading">{toHumanStatus("loading", language)}</option>
                <option value="empty">{toHumanStatus("empty", language)}</option>
                <option value="error">{toHumanStatus("error", language)}</option>
                <option value="offline">{toHumanStatus("offline", language)}</option>
                <option value="denied">{toHumanStatus("denied", language)}</option>
              </select>
            </label>
            <button
              className="button ghost"
              disabled={activeDomain === "all" || activeDomainRuntimeState === "success"}
              onClick={() => void recoverActiveDomainState()}
              type="button"
            >
              {translate("runtimeStateRecoveryAction")}
            </button>
          </div>
          <p className="runtime-state-copy">
            {activeDomain === "all"
              ? translate("runtimeStateHintAllDomains")
              : runtimeStateDescription(activeDomainRuntimeState, translate)}
          </p>
          </section>
        ) : null}

        <section
          id="dashboard-grid"
          className="dashboard-grid"
          data-screen-id={hasAuthenticatedSession ? dashboardHomeScreenModel.screenId : undefined}
          data-route-id={hasAuthenticatedSession ? dashboardHomeScreenModel.routeId : undefined}
          data-screen-state={hasAuthenticatedSession ? dashboardHomeScreenModel.status : undefined}
          aria-busy={dashboardHomeScreenModel.status === "loading"}
        >
          {hasAuthenticatedSession === false ? (
            isQAMode ? (
            <article
              className="module-card access-gate-card"
              data-screen-id={accessGateScreenModel.screenId}
              data-route-id={accessGateScreenModel.routeId}
              data-status-id="web.accessGate.status"
              aria-live="polite"
            >
              <SectionHeader
                title={translate("heroTitle")}
                status={accessGateScreenModel.status}
                statusLabel={translate("authMetric")}
                language={language}
              />
              <div className="form-grid">
                <p className="runtime-state-copy">{translate("heroCopy")}</p>
                <div className="inline-inputs">
                  <button
                    className="button primary"
                    onClick={handleAppleSignIn}
                    type="button"
                    data-action-id={accessGateAppleActionId}
                  >
                    {translate("signInWithApple")}
                  </button>
                  <button
                    className="button ghost"
                    onClick={handleEmailSignIn}
                    type="button"
                    data-action-id={accessGateEmailActionId}
                  >
                    {translate("signInWithEmail")}
                  </button>
                </div>
                <p className="empty-state">
                  {language === "es"
                    ? "Acceso requerido para cargar el dashboard operativo."
                    : "Access required to load the operational dashboard."}
                </p>
              </div>
            </article>
            ) : null
          ) : runtimeStateForUI !== "success" ? (
            <article className={`module-card runtime-state-banner state-${runtimeStateForUI}`}>
              <SectionHeader
                title={translate("runtimeStateSectionTitle")}
                status={runtimeStateForUI}
                statusLabel={translate("runtimeStateModeLabel")}
                language={language}
              />
              <div className="form-grid">
                <p className="runtime-state-copy">
                  {runtimeStateDescription(runtimeStateForUI, translate)}
                </p>
                <button
                  className="button primary"
                  onClick={() => void recoverActiveDomainState()}
                  type="button"
                >
                  {translate("runtimeStateRecoveryAction")}
                </button>
              </div>
            </article>
          ) : (
            <>
              {isQAMode ? (
                <>
                  <article
                className="module-card"
                data-screen-id={dashboardHomeScreenModel.screenId}
                data-route-id={dashboardHomeScreenModel.routeId}
                data-status-id="web.dashboardHome.status"
              >
                <SectionHeader
                  title={translate("dashboardHomeTitle")}
                  status={dashboardHomeScreenModel.status}
                  statusLabel={translate("dashboardHomeStatusLabel")}
                  language={language}
                />
                <div className="form-grid">
                  <p className="runtime-state-copy">{translate("dashboardHomeSummary")}</p>
                  <div className="inline-inputs">
                    <Metric
                      title={translate("dashboardHomeVisibleModulesLabel")}
                      value={String(dashboardHomeScreenModel.visibleModulesCount)}
                    />
                    <Metric
                      title={translate("dashboardHomeActiveDomainLabel")}
                      value={
                        domainTabs.find((tab) => tab.id === dashboardHomeScreenModel.activeDomain)
                          ?.label ?? dashboardHomeScreenModel.activeDomain
                      }
                    />
                  </div>
                  <button
                    className="button ghost"
                    onClick={() => void handleRefreshDashboardHome()}
                    type="button"
                    data-action-id="web.dashboardHome.refresh"
                    disabled={dashboardHomeScreenModel.status === "loading"}
                  >
                    {translate("dashboardHomeRefreshAction")}
                  </button>
                </div>
              </article>
              <article
                className="module-card"
                data-screen-id={quickActionsScreenModel.screenId}
                data-route-id={quickActionsScreenModel.routeId}
                data-status-id={`${quickActionsScreenModel.screenId}.status`}
              >
                <SectionHeader
                  title={translate("quickActionsTitle")}
                  status={quickActionsScreenModel.status}
                  statusLabel={translate("quickActionsStatusLabel")}
                  language={language}
                />
                <div className="form-grid">
                  <p className="runtime-state-copy">{translate("quickActionsSummary")}</p>
                  <div className="inline-inputs">
                    <button
                      className="button primary"
                      type="button"
                      data-action-id={quickActionsScreenModel.actions.runAll}
                      onClick={() => void handleRunQuickActions()}
                      disabled={quickActionsScreenModel.status === "loading"}
                    >
                      {translate("quickActionsRunAll")}
                    </button>
                    <button
                      className="button ghost"
                      type="button"
                      data-action-id={quickActionsScreenModel.actions.refreshDashboard}
                      onClick={() => void handleRefreshDashboardHome()}
                      disabled={quickActionsScreenModel.status === "loading"}
                    >
                      {translate("dashboardHomeRefreshAction")}
                    </button>
                  </div>
                  <div className="inline-inputs">
                    <button
                      className="button ghost"
                      type="button"
                      data-action-id={quickActionsScreenModel.actions.loadPlans}
                      onClick={() => void handleLoadPlans()}
                    >
                      {translate("loadPlans")}
                    </button>
                    <button
                      className="button ghost"
                      type="button"
                      data-action-id={quickActionsScreenModel.actions.loadSessions}
                      onClick={() => void handleLoadSessions()}
                    >
                      {translate("loadSessions")}
                    </button>
                    <button
                      className="button ghost"
                      type="button"
                      data-action-id={quickActionsScreenModel.actions.loadRecommendations}
                      onClick={() => void handleLoadRecommendations()}
                    >
                      {translate("loadRecommendations")}
                    </button>
                  </div>
                </div>
              </article>
              <article
                className="module-card"
                data-screen-id={alertCenterScreenModel.screenId}
                data-route-id={alertCenterScreenModel.routeId}
                data-status-id={`${alertCenterScreenModel.screenId}.status`}
              >
                <SectionHeader
                  title={translate("alertCenterTitle")}
                  status={alertCenterScreenModel.status}
                  statusLabel={translate("alertCenterStatusLabel")}
                  language={language}
                />
                <div className="form-grid">
                  <p className="runtime-state-copy">{translate("alertCenterSummary")}</p>
                  <div className="inline-inputs">
                    <Metric
                      title={translate("alertCenterOpenCountLabel")}
                      value={String(openOperationalAlerts.length)}
                    />
                    <Metric
                      title={translate("alertCenterHighSeverityLabel")}
                      value={String(
                        openOperationalAlerts.filter((alert) => alert.severity === "critical")
                          .length
                      )}
                    />
                    <Metric
                      title={translate("alertCenterRunbooksLabel")}
                      value={String(operationalRunbooks.length)}
                    />
                  </div>
                  <div className="inline-inputs">
                    <button
                      className="button primary"
                      type="button"
                      data-action-id={alertCenterScreenModel.actions.load}
                      onClick={() => void handleRefreshAlertCenter()}
                    >
                      {translate("alertCenterLoadAction")}
                    </button>
                    <button
                      className="button ghost"
                      type="button"
                      data-action-id={alertCenterScreenModel.actions.audit}
                      onClick={() => void handleLoadAuditTimeline()}
                    >
                      {translate("alertCenterAuditAction")}
                    </button>
                  </div>
                  {openOperationalAlerts.length === 0 ? (
                    <p className="empty-state">{translate("alertCenterNoAlerts")}</p>
                  ) : (
                    <div className="dense-table">
                      <table>
                        <thead>
                          <tr>
                            <th>{translate("auditOccurredAtColumn")}</th>
                            <th>{translate("auditSeverityColumn")}</th>
                            <th>{translate("auditSummaryColumn")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {openOperationalAlerts.slice(0, 3).map((alert) => (
                            <tr key={alert.id}>
                              <td>{new Date(alert.triggeredAt).toLocaleString()}</td>
                              <td>{toHumanStatus(alert.severity, language)}</td>
                              <td>{alert.summary}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </article>
              <article
                className="module-card"
                data-screen-id={systemStatusScreenModel.screenId}
                data-route-id={systemStatusScreenModel.routeId}
                data-status-id={`${systemStatusScreenModel.screenId}.status`}
              >
                <SectionHeader
                  title={translate("systemStatusTitle")}
                  status={systemStatusScreenModel.status}
                  statusLabel={translate("systemStatusStatusLabel")}
                  language={language}
                />
                <div className="form-grid">
                  <p className="runtime-state-copy">{translate("systemStatusSummary")}</p>
                  <div className="inline-inputs">
                    <Metric
                      title={translate("systemStatusRuntimeLabel")}
                      value={toHumanStatus(activeDomainRuntimeState, language)}
                    />
                    <Metric
                      title={translate("systemStatusReleaseLabel")}
                      value={toHumanStatus(releaseCompatibilityStatus, language)}
                    />
                    <Metric
                      title={translate("systemStatusRoleMatrixLabel")}
                      value={toHumanStatus(roleCapabilitiesStatus, language)}
                    />
                    <Metric
                      title={translate("systemStatusQueueLabel")}
                      value={String(pendingQueueCount)}
                    />
                  </div>
                  <div className="inline-inputs">
                    <button
                      className="button primary"
                      type="button"
                      data-action-id={systemStatusScreenModel.actions.syncQueue}
                      onClick={() => void handleSyncOfflineQueue()}
                    >
                      {translate("syncQueue")}
                    </button>
                    <button
                      className="button ghost"
                      type="button"
                      data-action-id={systemStatusScreenModel.actions.recoverDomain}
                      onClick={() => void recoverActiveDomainState()}
                    >
                      {translate("runtimeStateRecoveryAction")}
                    </button>
                    <button
                      className="button ghost"
                      type="button"
                      data-action-id={systemStatusScreenModel.actions.reloadCapabilities}
                      onClick={handleReloadRoleCapabilitiesMatrix}
                    >
                      {translate("retryRoleCapabilities")}
                    </button>
                  </div>
                </div>
              </article>
              <article
                className="module-card"
                data-screen-id={dashboardKpisScreenModel.screenId}
                data-route-id={dashboardKpisScreenModel.routeId}
                data-status-id={`${dashboardKpisScreenModel.screenId}.status`}
              >
                <SectionHeader
                  title={translate("dashboardKpisTitle")}
                  status={dashboardKpisScreenModel.status}
                  statusLabel={translate("dashboardKpisStatusLabel")}
                  language={language}
                />
                <div className="form-grid">
                  <p className="runtime-state-copy">{translate("dashboardKpisSummary")}</p>
                  <div className="inline-inputs">
                    <Metric title={translate("planStatusLabel")} value={String(plans.length)} />
                    <Metric title={translate("sessionStatusLabel")} value={String(sessions.length)} />
                    <Metric title={translate("nutritionStatusLabel")} value={String(nutritionLogs.length)} />
                    <Metric
                      title={translate("recommendationsStatusLabel")}
                      value={String(recommendations.length)}
                    />
                    <Metric
                      title={translate("alertCenterOpenCountLabel")}
                      value={String(openOperationalAlerts.length)}
                    />
                    <Metric title={translate("queueMetric")} value={String(pendingQueueCount)} />
                  </div>
                  <button
                    className="button ghost"
                    type="button"
                    data-action-id={dashboardKpisScreenModel.actions.refresh}
                    onClick={() => void handleRefreshDashboardKpis()}
                    disabled={dashboardKpisScreenModel.status === "loading"}
                  >
                    {translate("dashboardKpisRefreshAction")}
                  </button>
                </div>
              </article>
              <article
                className="module-card"
                data-screen-id={readinessMonitorScreenModel.screenId}
                data-route-id={readinessMonitorScreenModel.routeId}
                data-status-id={`${readinessMonitorScreenModel.screenId}.status`}
              >
                <SectionHeader
                  title={translate("readinessMonitorTitle")}
                  status={readinessMonitorScreenModel.status}
                  statusLabel={translate("readinessMonitorStatusLabel")}
                  language={language}
                />
                <div className="form-grid">
                  <p className="runtime-state-copy">{translate("readinessMonitorSummary")}</p>
                  <div className="inline-inputs">
                    <Metric
                      title={translate("readinessMonitorScoreLabel")}
                      value={`${readiness.score}%`}
                    />
                    <Metric
                      title={translate("readinessLabel")}
                      value={readinessLabel(readiness.label, language)}
                    />
                    <Metric title={translate("authMetric")} value={toHumanStatus(authStatus, language)} />
                    <Metric title={translate("queueMetric")} value={String(pendingQueueCount)} />
                  </div>
                  <button
                    className="button ghost"
                    type="button"
                    data-action-id={readinessMonitorScreenModel.actions.refresh}
                    onClick={() => void handleRefreshReadinessMonitor()}
                    disabled={readinessMonitorScreenModel.status === "loading"}
                  >
                    {translate("readinessMonitorRefreshAction")}
                  </button>
                </div>
              </article>
              <article
                className="module-card"
                data-screen-id={alertsFullScreenModel.screenId}
                data-route-id={alertsFullScreenModel.routeId}
                data-status-id={`${alertsFullScreenModel.screenId}.status`}
              >
                <SectionHeader
                  title={translate("alertsFullTitle")}
                  status={alertsFullScreenModel.status}
                  statusLabel={translate("alertsFullStatusLabel")}
                  language={language}
                />
                <div className="form-grid">
                  <p className="runtime-state-copy">{translate("alertsFullSummary")}</p>
                  <div className="inline-inputs">
                    <Metric
                      title={translate("alertCenterOpenCountLabel")}
                      value={String(openOperationalAlerts.length)}
                    />
                    <Metric
                      title={translate("alertCenterRunbooksLabel")}
                      value={String(operationalRunbooks.length)}
                    />
                    <Metric
                      title={translate("auditActivityLogLabel")}
                      value={String(activityLogEntries.length)}
                    />
                    <Metric
                      title={translate("alertCenterHighSeverityLabel")}
                      value={String(
                        openOperationalAlerts.filter((alert) => alert.severity === "critical")
                          .length
                      )}
                    />
                  </div>
                  <div className="inline-inputs">
                    <button
                      className="button primary"
                      type="button"
                      data-action-id={alertsFullScreenModel.actions.refresh}
                      onClick={() => void handleRefreshAlertsFull()}
                    >
                      {translate("alertsFullRefreshAction")}
                    </button>
                    <button
                      className="button ghost"
                      type="button"
                      data-action-id={alertsFullScreenModel.actions.audit}
                      onClick={() => void handleLoadAuditTimeline()}
                    >
                      {translate("alertsFullAuditAction")}
                    </button>
                  </div>
                  {openOperationalAlerts.length === 0 ? (
                    <p className="empty-state">{translate("alertsFullNoAlerts")}</p>
                  ) : (
                    <div className="dense-table">
                      <table>
                        <thead>
                          <tr>
                            <th>{translate("auditOccurredAtColumn")}</th>
                            <th>{translate("auditSeverityColumn")}</th>
                            <th>{translate("alertsFullCodeLabel")}</th>
                            <th>{translate("alertsFullRunbookLabel")}</th>
                            <th>{translate("auditSummaryColumn")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {openOperationalAlerts.slice(0, 6).map((alert) => (
                            <tr key={alert.id}>
                              <td>{new Date(alert.triggeredAt).toLocaleString()}</td>
                              <td>{toHumanStatus(alert.severity, language)}</td>
                              <td>{alert.code}</td>
                              <td>{runbookTitleById[alert.runbookId] ?? alert.runbookId}</td>
                              <td>{alert.summary}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </article>
              <article
                className="module-card"
                data-screen-id={recentActivityScreenModel.screenId}
                data-route-id={recentActivityScreenModel.routeId}
                data-status-id="web.recentActivity.status"
              >
                <SectionHeader
                  title={translate("recentActivityTitle")}
                  status={recentActivityScreenModel.status}
                  statusLabel={translate("recentActivityStatusLabel")}
                  language={language}
                />
                <div className="form-grid">
                  <p className="runtime-state-copy">{translate("recentActivitySummary")}</p>
                  <div className="inline-inputs">
                    <Metric title={translate("auditActivityLogLabel")} value={String(recentActivityRows.length)} />
                    <Metric
                      title={translate("recentActivityDeniedLabel")}
                      value={String(recentActivityRows.filter((entry) => entry.outcome === "denied").length)}
                    />
                    <Metric
                      title={translate("recentActivityErrorLabel")}
                      value={String(recentActivityRows.filter((entry) => entry.outcome === "error").length)}
                    />
                      <Metric
                        title={translate("auditOccurredAtColumn")}
                        value={
                          latestRecentActivityRow
                            ? new Date(latestRecentActivityRow.occurredAt).toLocaleString()
                            : "-"
                        }
                      />
                  </div>
                  <button
                    className="button ghost"
                    type="button"
                    data-action-id="web.recentActivity.refresh"
                    onClick={() => void handleRefreshRecentActivity()}
                  >
                    {translate("recentActivityRefreshAction")}
                  </button>
                  {recentActivityRows.length === 0 ? (
                    <p className="empty-state">{translate("recentActivityNoEntries")}</p>
                  ) : (
                    <div className="dense-table">
                      <table>
                        <thead>
                          <tr>
                            <th>{translate("auditOccurredAtColumn")}</th>
                            <th>{translate("auditNameColumn")}</th>
                            <th>{translate("auditDomainColumn")}</th>
                            <th>{translate("recentActivityOutcomeLabel")}</th>
                            <th>{translate("auditSummaryColumn")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentActivityRows.slice(0, 8).map((entry) => (
                            <tr key={entry.id}>
                              <td>{new Date(entry.occurredAt).toLocaleString()}</td>
                              <td>{entry.action}</td>
                              <td>{entry.domain}</td>
                              <td>{toHumanStatus(entry.outcome, language)}</td>
                              <td>{entry.summary}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </article>
              <article
                className="module-card"
                data-screen-id={shortcutsScreenModel.screenId}
                data-route-id={shortcutsScreenModel.routeId}
                data-status-id="web.shortcuts.status"
              >
                <SectionHeader
                  title={translate("shortcutsTitle")}
                  status={shortcutsScreenModel.status}
                  statusLabel={translate("shortcutsStatusLabel")}
                  language={language}
                />
                <div className="form-grid">
                  <p className="runtime-state-copy">{translate("shortcutsSummary")}</p>
                  {isQAMode ? (
                    <div className="inline-inputs">
                      <Metric
                        title={translate("shortcutsVisibleModulesLabel")}
                        value={String(visibleModulesForDomain.length)}
                      />
                      <Metric title={translate("roleLabel")} value={activeRole} />
                      <Metric title={translate("domainFilterLabel")} value={activeDomainForUI} />
                      <Metric title={translate("queueMetric")} value={String(pendingQueueCount)} />
                    </div>
                  ) : null}
                  <div className="inline-inputs">
                    <button
                      className="button primary"
                      type="button"
                      data-action-id="web.shortcuts.run"
                      onClick={() => void handleRunShortcuts()}
                    >
                      {translate("shortcutsRunAction")}
                    </button>
                    <button
                      className="button ghost"
                      type="button"
                      data-action-id="web.shortcuts.refresh"
                      onClick={() => void handleRefreshDashboardHome()}
                    >
                      {translate("shortcutsRefreshAction")}
                    </button>
                    {isQAMode ? (
                      <button
                        className="button ghost"
                        type="button"
                        data-action-id="web.shortcuts.recoverDomain"
                        onClick={() => void recoverActiveDomainState()}
                      >
                        {translate("shortcutsRecoverAction")}
                      </button>
                    ) : null}
                  </div>
                  {isQAMode && visibleModulesForDomain.length === 0 ? (
                    <p className="empty-state">{translate("shortcutsNoItems")}</p>
                  ) : isQAMode ? (
                    <div className="inline-inputs">
                      {visibleModulesForDomain.slice(0, 8).map((moduleId) => (
                        <span key={`shortcut-${moduleId}`} className="chip role-badge">
                          {moduleId}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </article>
              <article
                className="module-card"
                data-screen-id={cohortAnalysisScreenModel.screenId}
                data-route-id={cohortAnalysisScreenModel.routeId}
                data-status-id="web.cohortAnalysis.status"
              >
                <SectionHeader
                  title={translate("cohortAnalysisTitle")}
                  status={cohortAnalysisScreenModel.status}
                  statusLabel={translate("cohortAnalysisStatusLabel")}
                  language={language}
                />
                <div className="form-grid">
                  <p className="runtime-state-copy">{translate("cohortAnalysisSummary")}</p>
                  <div className="inline-inputs">
                    <Metric
                      title={translate("cohortAnalysisSizeLabel")}
                      value={String(athleteOperationRowsBase.length)}
                    />
                    <Metric
                      title={translate("cohortAnalysisAttentionLabel")}
                      value={String(cohortAttentionCount)}
                    />
                    <Metric
                      title={translate("cohortAnalysisNormalLabel")}
                      value={String(cohortNormalCount)}
                    />
                    <Metric
                      title={translate("cohortAnalysisAvgSessionsLabel")}
                      value={String(cohortAverageSessions)}
                    />
                  </div>
                  <button
                    className="button ghost"
                    type="button"
                    data-action-id={cohortAnalysisScreenModel.actions.refresh}
                    onClick={() => void handleRefreshCohortAnalysis()}
                    disabled={cohortAnalysisScreenModel.status === "loading"}
                  >
                    {translate("cohortAnalysisRefreshAction")}
                  </button>
                  {athleteOperationRowsBase.length === 0 ? (
                    <p className="empty-state">{translate("cohortAnalysisNoRows")}</p>
                  ) : (
                    <div className="dense-table">
                      <table>
                        <thead>
                          <tr>
                            <th>{translate("athleteColumn")}</th>
                            <th>{translate("plansColumn")}</th>
                            <th>{translate("sessionsColumn")}</th>
                            <th>{translate("nutritionColumn")}</th>
                            <th>{translate("riskColumn")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {athleteOperationRowsBase.slice(0, 6).map((row) => (
                            <tr key={`cohort-${row.athleteId}`}>
                              <td>{row.athleteId}</td>
                              <td>{row.plansCount}</td>
                              <td>{row.sessionsCount}</td>
                              <td>{row.nutritionLogsCount}</td>
                              <td>{toHumanStatus(row.riskLevel, language)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </article>
              {visibleModulesForDomain.length === 0 ? (
                <article className="module-card">
                  <p className="empty-state">{translate("noModulesForSelectedDomain")}</p>
                </article>
              ) : null}
                </>
              ) : null}
          {canRenderOperationalModules && isModuleVisibleForUI("onboarding") ? (
            <article className="module-card">
            <SectionHeader
              title={translate("onboardingSectionTitle")}
              status={onboardingStatus}
              statusLabel={translate("onboardingStatusLabel")}
              language={language}
            />
            <div className="form-grid">
              <input
                aria-label={translate("displayNamePlaceholder")}
                placeholder={translate("displayNamePlaceholder")}
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
              />
              <div className="inline-inputs">
                <input
                  aria-label={translate("agePlaceholder")}
                  placeholder={translate("agePlaceholder")}
                  value={age}
                  onChange={(event) => setAge(event.target.value)}
                />
                <input
                  aria-label={translate("heightPlaceholder")}
                  placeholder={translate("heightPlaceholder")}
                  value={heightCm}
                  onChange={(event) => setHeightCm(event.target.value)}
                />
              </div>
              <div className="inline-inputs">
                <input
                  aria-label={translate("weightPlaceholder")}
                  placeholder={translate("weightPlaceholder")}
                  value={weightKg}
                  onChange={(event) => setWeightKg(event.target.value)}
                />
                <input
                  aria-label={translate("daysPerWeekPlaceholder")}
                  placeholder={translate("daysPerWeekPlaceholder")}
                  value={availableDaysPerWeek}
                  onChange={(event) => setAvailableDaysPerWeek(event.target.value)}
                />
              </div>
              <select
                aria-label={translate("goalPickerLabel")}
                value={goal}
                onChange={(event) => setGoal(event.target.value as Goal)}
              >
                <option value="fat_loss">fat_loss</option>
                <option value="recomposition">recomposition</option>
                <option value="muscle_gain">muscle_gain</option>
                <option value="habit">habit</option>
              </select>
              <label>
                <input
                  type="checkbox"
                  checked={parQ1}
                  onChange={(event) => setParQ1(event.target.checked)}
                />
                {translate("parQQuestionOne")}
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={parQ2}
                  onChange={(event) => setParQ2(event.target.checked)}
                />
                {translate("parQQuestionTwo")}
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={privacyPolicyAccepted}
                  onChange={(event) => setPrivacyPolicyAccepted(event.target.checked)}
                />
                {translate("acceptPrivacyPolicy")}
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(event) => setTermsAccepted(event.target.checked)}
                />
                {translate("acceptTerms")}
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={medicalDisclaimerAccepted}
                  onChange={(event) => setMedicalDisclaimerAccepted(event.target.checked)}
                />
                {translate("acceptMedicalDisclaimer")}
              </label>
              <button className="button primary" onClick={handleCompleteOnboarding} type="button">
                {translate("completeOnboarding")}
              </button>
              <div className="inline-inputs">
                <button className="button primary" onClick={handleSubmitLegalConsent} type="button">
                  {translate("saveConsent")}
                </button>
                <button className="button ghost" onClick={handleExportData} type="button">
                  {translate("exportData")}
                </button>
              </div>
            </div>
            </article>
          ) : null}

          {canRenderOperationalModules && isModuleVisibleForUI("training") ? (
            <article
              className="module-card"
              data-screen-id={plansListScreenModel.screenId}
              data-route-id={plansListScreenModel.routeId}
              data-status-id="web.plansList.status"
            >
            <SectionHeader
              title={translate("trainingSectionTitle")}
              status={plansListScreenModel.status}
              statusLabel={translate("planStatusLabel")}
              language={language}
            />
            <div className="form-grid">
              <div
                className="history-list"
                data-screen-id={planBuilderScreenModel.screenId}
                data-route-id={planBuilderScreenModel.routeId}
                data-status-id="web.planBuilder.status"
              >
                <p className="section-subtitle">{translate("planBuilderTitle")}</p>
                <div className="inline-inputs">
                  <input
                    aria-label={translate("planNamePlaceholder")}
                    placeholder={translate("planNamePlaceholder")}
                    value={planName}
                    data-action-id={planBuilderScreenModel.actions.updateName}
                    onChange={(event) => setPlanName(event.target.value)}
                  />
                  <input
                    aria-label={translate("planBuilderWeeksLabel")}
                    placeholder={translate("planBuilderWeeksLabel")}
                    value={planBuilderWeeksInput}
                    data-action-id={planBuilderScreenModel.actions.updateWeeks}
                    onChange={(event) => setPlanBuilderWeeksInput(event.target.value)}
                  />
                  <input
                    aria-label={translate("planBuilderDaysLabel")}
                    placeholder={translate("planBuilderDaysLabel")}
                    value={planBuilderDaysInput}
                    data-action-id={planBuilderScreenModel.actions.updateDays}
                    onChange={(event) => setPlanBuilderDaysInput(event.target.value)}
                  />
                  <select
                    aria-label={translate("planBuilderTemplateLabel")}
                    value={planBuilderTemplate}
                    data-action-id={planBuilderScreenModel.actions.updateTemplate}
                    onChange={(event) =>
                      setPlanBuilderTemplate(event.target.value as PlanBuilderTemplate)
                    }
                  >
                    <option value="strength">{translate("planBuilderTemplateStrength")}</option>
                    <option value="hypertrophy">
                      {translate("planBuilderTemplateHypertrophy")}
                    </option>
                    <option value="recomposition">
                      {translate("planBuilderTemplateRecomposition")}
                    </option>
                  </select>
                </div>
                <div className="inline-inputs">
                  <button
                    className="button primary"
                    onClick={handleCreatePlan}
                    type="button"
                    data-action-id={planBuilderScreenModel.actions.createPlan}
                  >
                    {translate("createPlan")}
                  </button>
                  <button
                    className="button ghost"
                    onClick={handleLoadPlans}
                    type="button"
                    data-action-id={planBuilderScreenModel.actions.loadPlans}
                  >
                    {translate("loadPlans")}
                  </button>
                </div>
                <p className="section-subtitle">{translate("planBuilderPreviewTitle")}</p>
                <div className="inline-inputs">
                  <Metric
                    title={translate("planBuilderPreviewDaysLabel")}
                    value={
                      normalizedPlanBuilderDays === null
                        ? "-"
                        : String(normalizedPlanBuilderDays)
                    }
                  />
                  <Metric
                    title={translate("planBuilderPreviewExercisesLabel")}
                    value={String(planBuilderDayExercises.length)}
                  />
                </div>
                {hasPlanBuilderValidationError ? (
                  <p className="validation-copy">{translate("planBuilderInvalidConfiguration")}</p>
                ) : null}
              </div>
              <div
                className="history-list"
                data-screen-id={planTemplatesScreenModel.screenId}
                data-route-id={planTemplatesScreenModel.routeId}
                data-status-id="web.light.planTemplates.status"
              >
                <SectionHeader
                  title={translate("planTemplatesTitle")}
                  status={planTemplatesScreenModel.status}
                  statusLabel={translate("planTemplatesStatusLabel")}
                  language={language}
                />
                <p>{translate("planTemplatesSummary")}</p>
                <div className="inline-inputs">
                  <button
                    className="button ghost"
                    onClick={handleLoadPlanTemplates}
                    type="button"
                    data-action-id={planTemplatesScreenModel.actions.loadTemplates}
                  >
                    {translate("planTemplatesLoadAction")}
                  </button>
                  <button
                    className="button primary"
                    onClick={handleApplyPlanTemplate}
                    type="button"
                    data-action-id={planTemplatesScreenModel.actions.applyTemplate}
                    disabled={selectedPlanTemplateOption === null}
                  >
                    {translate("planTemplatesApplyAction")}
                  </button>
                  <button
                    className="button ghost"
                    onClick={handleClearPlanTemplateSelection}
                    type="button"
                    data-action-id={planTemplatesScreenModel.actions.clearSelection}
                    disabled={selectedPlanTemplateOption === null}
                  >
                    {translate("planTemplatesClearAction")}
                  </button>
                </div>
                {planTemplateOptions.length === 0 ? (
                  <p className="empty-state">{translate("planTemplatesNoSelection")}</p>
                ) : (
                  <div className="choice-list">
                    {planTemplateOptions.map((option) => (
                      <label key={option.template}>
                        <input
                          type="radio"
                          name="selected-plan-template"
                          value={option.template}
                          data-action-id={planTemplatesScreenModel.actions.selectTemplate}
                          checked={selectedPlanTemplate === option.template}
                          onChange={() => {
                            setSelectedPlanTemplate(option.template);
                            setPlanTemplatesStatus("loaded");
                          }}
                        />
                        <span>
                          {option.template === "strength"
                            ? translate("planBuilderTemplateStrength")
                            : option.template === "hypertrophy"
                              ? translate("planBuilderTemplateHypertrophy")
                              : translate("planBuilderTemplateRecomposition")}
                        </span>
                        <span>
                          {translate("planTemplatesWeeksLabel")} {option.weeks} ·{" "}
                          {translate("planTemplatesDaysLabel")} {option.daysPerWeek} ·{" "}
                          {translate("planTemplatesFocusLabel")} {option.focus}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
                {selectedPlanTemplateOption === null ? (
                  <p className="empty-state">{translate("planTemplatesNoSelection")}</p>
                ) : (
                  <div className="inline-inputs">
                    <Metric
                      title={translate("planTemplatesWeeksLabel")}
                      value={String(selectedPlanTemplateOption.weeks)}
                    />
                    <Metric
                      title={translate("planTemplatesDaysLabel")}
                      value={String(selectedPlanTemplateOption.daysPerWeek)}
                    />
                    <Metric
                      title={translate("planTemplatesFocusLabel")}
                      value={selectedPlanTemplateOption.focus}
                    />
                  </div>
                )}
              </div>
              <div
                className="history-list"
                data-screen-id={publishReviewScreenModel.screenId}
                data-route-id={publishReviewScreenModel.routeId}
                data-status-id="web.light.publishReview.status"
              >
                <SectionHeader
                  title={translate("publishReviewTitle")}
                  status={publishReviewScreenModel.status}
                  statusLabel={translate("publishReviewStatusLabel")}
                  language={language}
                />
                <p>{translate("publishReviewSummary")}</p>
                <div className="inline-inputs">
                  <button
                    className="button ghost"
                    onClick={handlePreviewPublishPlan}
                    type="button"
                    data-action-id={publishReviewScreenModel.actions.previewPlan}
                  >
                    {translate("publishReviewPreviewAction")}
                  </button>
                  <button
                    className="button ghost"
                    onClick={handleRunPublishChecklist}
                    type="button"
                    data-action-id={publishReviewScreenModel.actions.runChecklist}
                  >
                    {translate("publishReviewChecklistAction")}
                  </button>
                  <button
                    className="button primary"
                    onClick={handlePublishPlanReview}
                    type="button"
                    data-action-id={publishReviewScreenModel.actions.publishPlan}
                    disabled={publishChecklistAcknowledged === false || selectedPlan === null}
                  >
                    {translate("publishReviewPublishAction")}
                  </button>
                  <button
                    className="button ghost"
                    onClick={handleClearPublishReview}
                    type="button"
                    data-action-id={publishReviewScreenModel.actions.clearReview}
                  >
                    {translate("publishReviewClearAction")}
                  </button>
                </div>
                <div className="choice-list">
                  {publishChecklistItems.map((item) => (
                    <label key={item.id}>
                      <span>{item.label}</span>
                      <span>{item.valid ? translate("publishReviewCheckOk") : translate("publishReviewCheckPending")}</span>
                    </label>
                  ))}
                </div>
                <div className="inline-inputs">
                  <Metric
                    title={translate("publishReviewPlanLabel")}
                    value={selectedPlan?.name ?? "-"}
                  />
                  <Metric
                    title={translate("publishReviewChecklistLabel")}
                    value={isPublishChecklistReady ? translate("publishReviewCheckOk") : translate("publishReviewCheckPending")}
                  />
                  <Metric
                    title={translate("publishReviewResultLabel")}
                    value={publishedPlanId ?? "-"}
                  />
                </div>
                {publishedPlanId === null ? (
                  <p className="empty-state">{translate("publishReviewNoResult")}</p>
                ) : (
                  <p className="section-subtitle">
                    {translate("publishReviewPublishedPrefix")} {publishedPlanId}
                  </p>
                )}
              </div>
              <StatLine
                label={translate("plansLoadedLabel")}
                value={String(plans.length)}
                language={language}
              />
              {plans.length === 0 ? (
                <p className="empty-state">{translate("noPlansLoaded")}</p>
              ) : (
                <div className="choice-list">
                  {plans.map((plan) => (
                    <label key={plan.id}>
                      <input
                        type="radio"
                        name="selected-plan"
                        data-action-id={plansListScreenModel.actions.selectPlan}
                        checked={selectedPlanId === plan.id}
                        onChange={() => setSelectedPlanId(plan.id)}
                      />
                      {plan.name} ({plan.weeks} weeks)
                    </label>
                  ))}
                </div>
              )}
              <div
                className="history-list"
                data-screen-id={planAssignmentScreenModel.screenId}
                data-route-id={planAssignmentScreenModel.routeId}
                data-status-id="web.planAssignment.status"
              >
                <SectionHeader
                  title={translate("planAssignmentTitle")}
                  status={planAssignmentScreenModel.status}
                  statusLabel={translate("planAssignmentStatusLabel")}
                  language={language}
                />
                <p>{translate("planAssignmentSummary")}</p>
                <div className="inline-inputs">
                  <Metric
                    title={translate("planAssignmentPlanLabel")}
                    value={selectedPlan?.name ?? "-"}
                  />
                  <Metric
                    title={translate("planAssignmentSelectedAthletesLabel")}
                    value={String(selectedAthleteRows.length)}
                  />
                  <Metric
                    title={translate("planAssignmentAtRiskAthletesLabel")}
                    value={String(atRiskAthleteRows.length)}
                  />
                </div>
                <div className="inline-inputs">
                  <button
                    className="button primary"
                    onClick={handleBulkAssignStarterPlan}
                    type="button"
                    data-action-id={planAssignmentScreenModel.actions.assignSelected}
                    disabled={selectedPlan === null || selectedAthleteRows.length === 0}
                  >
                    {translate("planAssignmentAssignSelectedAction")}
                  </button>
                  <button
                    className="button ghost"
                    onClick={handleAssignPlanToAtRiskAthletes}
                    type="button"
                    data-action-id={planAssignmentScreenModel.actions.assignAtRisk}
                    disabled={selectedPlan === null || atRiskAthleteRows.length === 0}
                  >
                    {translate("planAssignmentAssignAtRiskAction")}
                  </button>
                  <button
                    className="button ghost"
                    onClick={handleClearAthleteSelection}
                    type="button"
                    data-action-id={planAssignmentScreenModel.actions.clearSelection}
                    disabled={selectedAthleteRows.length === 0}
                  >
                    {translate("planAssignmentClearAction")}
                  </button>
                </div>
                {selectedAthleteRows.length === 0 ? (
                  <p className="empty-state">{translate("planAssignmentNoSelection")}</p>
                ) : (
                  <>
                    <p className="section-subtitle">{translate("planAssignmentSelectedListTitle")}</p>
                    <div className="choice-list">
                      {selectedAthleteRows.map((row) => (
                        <label key={row.athleteId}>
                          <span>{row.athleteId}</span>
                          <span>
                            {translate("sessionsColumn")} {row.sessionsCount} · {translate("plansColumn")}{" "}
                            {row.plansCount}
                          </span>
                        </label>
                      ))}
                    </div>
                  </>
                )}
              </div>
              <div className="inline-inputs">
                <button className="button primary" onClick={handleLogWorkoutSession} type="button">
                  {translate("logWorkout")}
                </button>
                <button
                  className="button ghost"
                  onClick={handleLoadSessions}
                  type="button"
                  data-action-id={sessionDetailScreenModel.actions.loadSessions}
                >
                  {translate("loadSessions")}
                </button>
              </div>
              <StatLine
                label={translate("sessionStatusLabel")}
                value={sessionStatus}
                language={language}
              />
              <StatLine
                label={translate("sessionsLoadedLabel")}
                value={String(sessions.length)}
                language={language}
              />
              <div
                className="history-list"
                data-screen-id={sessionDetailScreenModel.screenId}
                data-route-id={sessionDetailScreenModel.routeId}
                data-status-id="web.sessionDetail.status"
              >
                <p className="section-subtitle">{translate("sessionDetailTitle")}</p>
                <p>{translate("sessionDetailSummary")}</p>
                <div className="inline-inputs">
                  <select
                    aria-label={translate("sessionDetailSelectLabel")}
                    value={selectedSessionKey}
                    data-action-id={sessionDetailScreenModel.actions.selectSession}
                    onChange={(event) => setSelectedSessionKey(event.target.value)}
                  >
                    <option value="">{translate("sessionDetailSelectLabel")}</option>
                    {sessionSelectionRows.map((row) => (
                      <option key={row.key} value={row.key}>
                        {row.session.planId} · {row.session.startedAt.slice(0, 10)}
                      </option>
                    ))}
                  </select>
                  <button
                    className="button ghost"
                    onClick={handleClearSessionSelection}
                    type="button"
                    data-action-id={sessionDetailScreenModel.actions.clearSelection}
                  >
                    {translate("sessionDetailClearAction")}
                  </button>
                  <button
                    className="button ghost"
                    onClick={handleOpenSessionExerciseVideo}
                    type="button"
                    data-action-id={sessionDetailScreenModel.actions.openExerciseVideo}
                    disabled={selectedSessionPrimaryExerciseId === null}
                  >
                    {translate("sessionDetailOpenVideoAction")}
                  </button>
                </div>
                {selectedSession === null ? (
                  <p className="empty-state">{translate("sessionDetailNoSelection")}</p>
                ) : (
                  <div className="metric-grid">
                    <Metric
                      title={translate("sessionDetailPlanLabel")}
                      value={selectedSession.planId}
                    />
                    <Metric
                      title={translate("sessionDetailStartedLabel")}
                      value={selectedSession.startedAt}
                    />
                    <Metric
                      title={translate("sessionDetailEndedLabel")}
                      value={selectedSession.endedAt}
                    />
                    <Metric
                      title={translate("sessionDetailDurationLabel")}
                      value={`${Math.max(
                        0,
                        Math.round(
                          (Date.parse(selectedSession.endedAt) -
                            Date.parse(selectedSession.startedAt)) /
                            60000
                        )
                      )}m`}
                    />
                    <Metric
                      title={translate("sessionDetailExerciseCountLabel")}
                      value={String(selectedSession.exercises.length)}
                    />
                  </div>
                )}
              </div>
              <div
                className="history-list"
                data-screen-id={exerciseLibraryScreenModel.screenId}
                data-route-id={exerciseLibraryScreenModel.routeId}
                data-status-id="web.exerciseLibrary.status"
              >
                <SectionHeader
                  title={translate("exerciseVideosTitle")}
                  status={exerciseLibraryScreenModel.status}
                  statusLabel={translate("videosStatusLabel")}
                  language={language}
                />
                <div className="inline-inputs">
                  <select
                    aria-label={translate("exercisePickerLabel")}
                    value={selectedExerciseForVideos}
                    data-action-id={exerciseLibraryScreenModel.actions.selectExercise}
                    onChange={(event) => setSelectedExerciseForVideos(event.target.value)}
                  >
                    <option value="goblet-squat">goblet-squat</option>
                    <option value="bench-press">bench-press</option>
                  </select>
                  <select
                    aria-label={translate("videoLocalePickerLabel")}
                    value={videoLocale}
                    data-action-id={exerciseLibraryScreenModel.actions.selectLocale}
                    onChange={(event) => setVideoLocale(event.target.value)}
                  >
                    <option value="es-ES">es-ES</option>
                    <option value="en-US">en-US</option>
                  </select>
                  <button
                    className="button ghost"
                    onClick={handleLoadExerciseVideos}
                    type="button"
                    data-action-id={exerciseLibraryScreenModel.actions.loadVideos}
                  >
                    {translate("loadVideos")}
                  </button>
                </div>
                <StatLine
                  label={translate("videosStatusLabel")}
                  value={videoStatus}
                  language={language}
                />
                {exerciseVideos.length === 0 ? (
                  <p className="empty-state">{translate("noVideosLoaded")}</p>
                ) : (
                  <div className="video-grid">
                    {exerciseVideos.map((video) => (
                      <article key={video.id} className="video-item">
                        <img src={video.thumbnailUrl} alt={video.title} loading="lazy" />
                        <div className="video-body">
                          <strong>{video.title}</strong>
                          <p>{video.coach}</p>
                          <p>
                            {video.difficulty} · {Math.round(video.durationSeconds / 60)} min
                          </p>
                          <a
                            href={video.videoUrl}
                            target="_blank"
                            rel="noreferrer"
                            data-action-id={exerciseLibraryScreenModel.actions.openVideo}
                          >
                            {translate("openVideo")}
                          </a>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
              <div
                className="history-list"
                data-screen-id={exerciseDetailScreenModel.screenId}
                data-route-id={exerciseDetailScreenModel.routeId}
                data-status-id="web.exerciseDetail.status"
              >
                <SectionHeader
                  title={translate("exerciseDetailTitle")}
                  status={exerciseDetailScreenModel.status}
                  statusLabel={translate("exerciseDetailStatusLabel")}
                  language={language}
                />
                <p>{translate("exerciseDetailSummary")}</p>
                <div className="inline-inputs">
                  <button
                    className="button ghost"
                    onClick={handleLoadExerciseVideos}
                    type="button"
                    data-action-id={exerciseDetailScreenModel.actions.loadDetail}
                  >
                    {translate("exerciseDetailLoadAction")}
                  </button>
                  <select
                    aria-label={translate("exerciseDetailSelectLabel")}
                    value={selectedExerciseVideoId}
                    data-action-id={exerciseDetailScreenModel.actions.selectVideo}
                    onChange={(event) => setSelectedExerciseVideoId(event.target.value)}
                  >
                    <option value="">{translate("exerciseDetailSelectLabel")}</option>
                    {exerciseVideos.map((video) => (
                      <option key={video.id} value={video.id}>
                        {video.title}
                      </option>
                    ))}
                  </select>
                  <button
                    className="button ghost"
                    onClick={handleClearExerciseDetailSelection}
                    type="button"
                    data-action-id={exerciseDetailScreenModel.actions.clearSelection}
                    disabled={selectedExerciseVideo === null}
                  >
                    {translate("exerciseDetailClearAction")}
                  </button>
                  <button
                    className="button ghost"
                    onClick={handleOpenSelectedExerciseVideo}
                    type="button"
                    data-action-id={exerciseDetailScreenModel.actions.openVideo}
                    disabled={selectedExerciseVideo === null}
                  >
                    {translate("exerciseDetailOpenAction")}
                  </button>
                </div>
                {selectedExerciseVideo === null ? (
                  <p className="empty-state">{translate("exerciseDetailNoSelection")}</p>
                ) : (
                  <div className="video-grid">
                    <article className="video-item">
                      <img
                        src={selectedExerciseVideo.thumbnailUrl}
                        alt={selectedExerciseVideo.title}
                        loading="lazy"
                      />
                      <div className="video-body">
                        <strong>{selectedExerciseVideo.title}</strong>
                        <div className="metric-grid">
                          <Metric
                            title={translate("exerciseDetailCoachLabel")}
                            value={selectedExerciseVideo.coach}
                          />
                          <Metric
                            title={translate("exerciseDetailDifficultyLabel")}
                            value={selectedExerciseVideo.difficulty}
                          />
                          <Metric
                            title={translate("exerciseDetailLocaleLabel")}
                            value={selectedExerciseVideo.locale}
                          />
                          <Metric
                            title={translate("exerciseDetailDurationLabel")}
                            value={`${Math.round(selectedExerciseVideo.durationSeconds / 60)} min`}
                          />
                        </div>
                      </div>
                    </article>
                  </div>
                )}
              </div>
            </div>
            </article>
          ) : null}

          {canRenderOperationalModules && isModuleVisibleForUI("operationsHub") ? (
            <article
              className="module-card"
              data-screen-id={athletesListScreenModel.screenId}
              data-route-id={athletesListScreenModel.routeId}
              data-status-id={athletesListScreenModel.screenId.replace(".screen", ".status")}
            >
            <SectionHeader
              title={translate("operationsHubTitle")}
              status={athletesListScreenModel.status}
              statusLabel={translate("operationsHubStatusLabel")}
              language={language}
            />
            <div className="form-grid">
              <div
                className="inline-inputs"
                data-screen-id={athleteFiltersScreenModel.screenId}
                data-route-id={athleteFiltersScreenModel.routeId}
                data-status-id={athleteFiltersScreenModel.screenId.replace(".screen", ".status")}
              >
                <input
                  aria-label={translate("athleteSearchPlaceholder")}
                  data-action-id={athleteFiltersScreenModel.actions.updateSearch}
                  placeholder={translate("athleteSearchPlaceholder")}
                  value={athleteSearch}
                  onChange={(event) => setAthleteSearch(event.target.value)}
                />
                <label className="compact-label">
                  {translate("athleteSortLabel")}
                  <select
                    aria-label={translate("athleteSortLabel")}
                    data-action-id={athleteFiltersScreenModel.actions.updateSort}
                    value={athleteSortMode}
                    onChange={(event) => setAthleteSortMode(event.target.value as AthleteSortMode)}
                  >
                    <option value="sessions">{translate("athleteSortBySessions")}</option>
                    <option value="athlete">{translate("athleteSortByName")}</option>
                    <option value="lastSession">{translate("athleteSortByLastSession")}</option>
                  </select>
                </label>
              </div>
              <div className="inline-inputs">
                <button
                  className="button primary"
                  data-action-id={athletesListScreenModel.actions.assignStarterPlan}
                  onClick={handleBulkAssignStarterPlan}
                  type="button"
                >
                  {translate("bulkAssignStarterPlan")}
                </button>
                <button
                  className="button ghost"
                  data-action-id={athletesListScreenModel.actions.clearSelection}
                  onClick={handleClearAthleteSelection}
                  type="button"
                >
                  {translate("clearAthleteSelection")}
                </button>
              </div>
              <StatLine
                label={translate("athletesLoadedLabel")}
                value={String(athleteOperationRows.length)}
                language={language}
              />
              <StatLine
                label={translate("athletesSelectedLabel")}
                value={String(selectedAthleteIds.length)}
                language={language}
              />
              <div
                className="history-list"
                data-screen-id={athleteDetailScreenModel.screenId}
                data-route-id={athleteDetailScreenModel.routeId}
                data-status-id={athleteDetailScreenModel.screenId.replace(".screen", ".status")}
              >
                <p className="section-subtitle">{translate("athleteDetailTitle")}</p>
                {selectedAthleteDetailRow === null ? (
                  <p className="empty-state">{translate("athleteDetailEmpty")}</p>
                ) : (
                  <article className="history-item">
                    <strong>{selectedAthleteDetailRow.athleteId}</strong>
                    <div className="history-values">
                      <span>
                        {translate("plansColumn")} {selectedAthleteDetailRow.plansCount}
                      </span>
                      <span>
                        {translate("sessionsColumn")} {selectedAthleteDetailRow.sessionsCount}
                      </span>
                      <span>
                        {translate("nutritionColumn")}{" "}
                        {selectedAthleteDetailRow.nutritionLogsCount}
                      </span>
                      <span>
                        {translate("lastSessionColumn")} {selectedAthleteDetailRow.lastSessionDate}
                      </span>
                    </div>
                    <span
                      className={`status-pill status-${riskToStatusClass(
                        selectedAthleteDetailRow.riskLevel
                      )}`}
                    >
                      {selectedAthleteDetailRow.riskLevel === "normal"
                        ? translate("riskNormal")
                        : translate("riskAttention")}
                    </span>
                  </article>
                )}
                <div className="inline-inputs">
                  <button
                    className="button primary"
                    data-action-id={athleteDetailScreenModel.actions.selectFirstAthlete}
                    onClick={handleSelectFirstAthleteDetail}
                    type="button"
                  >
                    {translate("athleteDetailSelectFirst")}
                  </button>
                  <button
                    className="button ghost"
                    data-action-id={athleteDetailScreenModel.actions.openSessionHistory}
                    onClick={handleOpenAthleteSessionHistory}
                    type="button"
                  >
                    {translate("athleteDetailOpenSessionHistory")}
                  </button>
                  <button
                    className="button ghost"
                    data-action-id={athleteDetailScreenModel.actions.clearSelection}
                    onClick={handleClearAthleteSelection}
                    type="button"
                  >
                    {translate("clearAthleteSelection")}
                  </button>
                </div>
              </div>
              <div
                className="history-list"
                data-screen-id={sessionHistoryScreenModel.screenId}
                data-route-id={sessionHistoryScreenModel.routeId}
                data-status-id={sessionHistoryScreenModel.screenId.replace(".screen", ".status")}
              >
                <p className="section-subtitle">{translate("sessionHistoryTitle")}</p>
                <StatLine
                  label={translate("sessionsLoadedLabel")}
                  value={String(selectedAthleteSessionHistoryRows.length)}
                  language={language}
                />
                <div className="inline-inputs">
                  <button
                    className="button primary"
                    data-action-id={sessionHistoryScreenModel.actions.loadSessions}
                    onClick={() => void handleLoadSessions()}
                    type="button"
                  >
                    {translate("loadSessions")}
                  </button>
                  <button
                    className="button ghost"
                    data-action-id={sessionHistoryScreenModel.actions.selectFirstAthlete}
                    onClick={handleSelectFirstAthleteDetail}
                    type="button"
                  >
                    {translate("athleteDetailSelectFirst")}
                  </button>
                  <button
                    className="button ghost"
                    data-action-id={sessionHistoryScreenModel.actions.clearSelection}
                    onClick={handleClearAthleteSelection}
                    type="button"
                  >
                    {translate("clearAthleteSelection")}
                  </button>
                </div>
                {selectedAthleteIds.length === 0 ? (
                  <p className="empty-state">{translate("sessionHistoryEmpty")}</p>
                ) : selectedAthleteSessionHistoryRows.length === 0 ? (
                  <p className="empty-state">{translate("sessionHistoryNoRows")}</p>
                ) : (
                  selectedAthleteSessionHistoryRows.map((session) => {
                    const durationMinutes = Math.max(
                      0,
                      Math.round(
                        (new Date(session.endedAt).getTime() - new Date(session.startedAt).getTime()) /
                          (60 * 1000)
                      )
                    );
                    return (
                      <article
                        key={`${session.userId}-${session.planId}-${session.startedAt}`}
                        className="history-item"
                      >
                        <strong>
                          {translate("athleteColumn")} {session.userId}
                        </strong>
                        <div className="history-values">
                          <span>
                            {translate("sessionHistoryPlanLabel")} {session.planId}
                          </span>
                          <span>
                            {translate("sessionHistoryStartedLabel")}{" "}
                            {new Date(session.startedAt).toLocaleString()}
                          </span>
                          <span>
                            {translate("sessionHistoryEndedLabel")}{" "}
                            {new Date(session.endedAt).toLocaleString()}
                          </span>
                          <span>
                            {translate("sessionHistoryDurationLabel")} {durationMinutes}{" "}
                            {translate("historyMinutesLabel")}
                          </span>
                          <span>
                            {translate("sessionHistoryExercisesLabel")} {session.exercises.length}
                          </span>
                        </div>
                      </article>
                    );
                  })
                )}
              </div>
              <div
                className="history-list"
                data-screen-id={compareProgressScreenModel.screenId}
                data-route-id={compareProgressScreenModel.routeId}
                data-status-id={compareProgressScreenModel.screenId.replace(".screen", ".status")}
              >
                <p className="section-subtitle">{translate("compareProgressTitle")}</p>
                <div className="inline-inputs">
                  <button
                    className="button primary"
                    data-action-id={compareProgressScreenModel.actions.loadProgress}
                    onClick={() => void handleLoadProgressSummary()}
                    type="button"
                  >
                    {translate("compareProgressLoad")}
                  </button>
                  <button
                    className="button ghost"
                    data-action-id={compareProgressScreenModel.actions.selectFirstAthlete}
                    onClick={handleSelectFirstAthleteDetail}
                    type="button"
                  >
                    {translate("athleteDetailSelectFirst")}
                  </button>
                  <button
                    className="button ghost"
                    data-action-id={compareProgressScreenModel.actions.openSessionHistory}
                    onClick={handleOpenAthleteSessionHistory}
                    type="button"
                  >
                    {translate("athleteDetailOpenSessionHistory")}
                  </button>
                </div>
                {selectedAthleteDetailRow === null ? (
                  <p className="empty-state">{translate("compareProgressEmpty")}</p>
                ) : (
                  <>
                    <StatLine
                      label={translate("compareProgressSelectedSessions")}
                      value={String(selectedAthleteDetailRow.sessionsCount)}
                      language={language}
                    />
                    <StatLine
                      label={translate("compareProgressCohortSessions")}
                      value={String(cohortAverageSessions)}
                      language={language}
                    />
                    <StatLine
                      label={translate("compareProgressDeltaSessions")}
                      value={`${selectedAthleteDetailRow.sessionsCount - cohortAverageSessions >= 0 ? "+" : ""}${(
                        selectedAthleteDetailRow.sessionsCount - cohortAverageSessions
                      ).toFixed(1)}`}
                      language={language}
                    />
                    <StatLine
                      label={translate("compareProgressSelectedNutrition")}
                      value={String(selectedAthleteDetailRow.nutritionLogsCount)}
                      language={language}
                    />
                    <StatLine
                      label={translate("compareProgressCohortNutrition")}
                      value={String(cohortAverageNutritionLogs)}
                      language={language}
                    />
                    <StatLine
                      label={translate("compareProgressDeltaNutrition")}
                      value={`${selectedAthleteDetailRow.nutritionLogsCount - cohortAverageNutritionLogs >= 0 ? "+" : ""}${(
                        selectedAthleteDetailRow.nutritionLogsCount - cohortAverageNutritionLogs
                      ).toFixed(1)}`}
                      language={language}
                    />
                  </>
                )}
              </div>
              <div
                className="history-list"
                data-screen-id={coachNotesScreenModel.screenId}
                data-route-id={coachNotesScreenModel.routeId}
                data-status-id={coachNotesScreenModel.screenId.replace(".screen", ".status")}
              >
                <p className="section-subtitle">{translate("coachNotesTitle")}</p>
                <div className="inline-inputs">
                  <button
                    className="button primary"
                    data-action-id={coachNotesScreenModel.actions.loadNotes}
                    onClick={() => void handleLoadCoachNotes()}
                    type="button"
                  >
                    {translate("coachNotesLoad")}
                  </button>
                  <button
                    className="button ghost"
                    data-action-id={coachNotesScreenModel.actions.saveFollowUp}
                    onClick={() => void handleSaveCoachFollowUp()}
                    type="button"
                  >
                    {translate("coachNotesSaveFollowUp")}
                  </button>
                  <button
                    className="button ghost"
                    data-action-id={coachNotesScreenModel.actions.clearSelection}
                    onClick={handleClearAthleteSelection}
                    type="button"
                  >
                    {translate("clearAthleteSelection")}
                  </button>
                </div>
                {selectedAthleteIds.length === 0 ? (
                  <p className="empty-state">{translate("coachNotesEmpty")}</p>
                ) : selectedAthleteCoachNotesRows.length === 0 ? (
                  <p className="empty-state">{translate("coachNotesNoRows")}</p>
                ) : (
                  selectedAthleteCoachNotesRows.map((note) => (
                    <article key={note.id} className="history-item">
                      <strong>{new Date(note.occurredAt).toLocaleString()}</strong>
                      <div className="history-values">
                        <span>
                          {translate("coachNotesOccurredAtLabel")}{" "}
                          {new Date(note.occurredAt).toLocaleString()}
                        </span>
                        <span>
                          {translate("coachNotesSourceLabel")} {note.source}
                        </span>
                        <span>
                          {translate("coachNotesOutcomeLabel")} {note.outcome}
                        </span>
                        <span>
                          {translate("coachNotesSummaryLabel")} {note.summary}
                        </span>
                      </div>
                    </article>
                  ))
                )}
              </div>
              {athleteOperationRows.length === 0 ? (
                <p className="empty-state">{translate("noAthletesFound")}</p>
              ) : (
                <>
                  <DenseRowsInfo
                    visibleRows={visibleAthleteRows.length}
                    totalRows={athleteOperationRows.length}
                    language={language}
                  />
                  <div className="operations-table">
                    <header className="operations-table-row operations-table-header">
                      <span>{translate("athleteColumn")}</span>
                      <span>{translate("plansColumn")}</span>
                      <span>{translate("sessionsColumn")}</span>
                      <span>{translate("nutritionColumn")}</span>
                      <span>{translate("lastSessionColumn")}</span>
                      <span>{translate("riskColumn")}</span>
                    </header>
                    {visibleAthleteRows.map((row) => (
                      <label key={row.athleteId} className="operations-table-row">
                        <div className="operations-athlete-cell">
                          <input
                            type="checkbox"
                            checked={selectedAthleteIdSet.has(row.athleteId)}
                            onChange={() => handleToggleAthleteSelection(row.athleteId)}
                          />
                          <strong>{row.athleteId}</strong>
                        </div>
                        <span>{row.plansCount}</span>
                        <span>{row.sessionsCount}</span>
                        <span>{row.nutritionLogsCount}</span>
                        <span>{row.lastSessionDate}</span>
                        <span
                          className={`status-pill status-${riskToStatusClass(row.riskLevel)}`}
                        >
                          {row.riskLevel === "normal"
                            ? translate("riskNormal")
                            : translate("riskAttention")}
                        </span>
                      </label>
                    ))}
                  </div>
                  {hasMoreAthleteRows ? (
                    <div className="dense-table-actions">
                      <button
                        className="button ghost"
                        data-action-id={athletesListScreenModel.actions.showMoreRows}
                        onClick={handleShowMoreAthleteRows}
                        type="button"
                      >
                        {translate("loadMoreRows")}
                      </button>
                      <button
                        className="button ghost"
                        data-action-id={athletesListScreenModel.actions.showAllRows}
                        onClick={handleShowAllAthleteRows}
                        type="button"
                      >
                        {translate("showAllRows")}
                      </button>
                    </div>
                  ) : null}
                </>
              )}
            </div>
            </article>
          ) : null}

          {canRenderOperationalModules && isModuleVisibleForUI("adminGovernance") ? (
            <article
              className="module-card"
              data-screen-id={adminUsersScreenModel.screenId}
              data-route-id={adminUsersScreenModel.routeId}
              data-status-id="web.adminUsers.status"
            >
            <SectionHeader
              title={translate("governanceTitle")}
              status={adminUsersScreenModel.status}
              statusLabel={translate("governanceStatusLabel")}
              language={language}
            />
            <div className="form-grid">
              {adminUsersScreenModel.status === "denied" ? (
                <p className="empty-state">{translate("runtimeStateDeniedDescription")}</p>
              ) : null}
              <div className="inline-inputs">
                <input
                  aria-label={translate("governanceSearchPlaceholder")}
                  placeholder={translate("governanceSearchPlaceholder")}
                  value={governanceSearch}
                  onChange={(event) => setGovernanceSearch(event.target.value)}
                />
                <label className="compact-label">
                  {translate("governanceRoleFilterLabel")}
                  <select
                    aria-label={translate("governanceRoleFilterLabel")}
                    value={governanceRoleFilter}
                    onChange={(event) =>
                      setGovernanceRoleFilter(event.target.value as GovernanceRoleFilter)
                    }
                  >
                    <option value="all">{translate("governanceAllRoles")}</option>
                    {roleOptions.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="inline-inputs">
                <button
                  className="button ghost"
                  data-action-id={adminUsersScreenModel.actions.loadCapabilities}
                  onClick={handleLoadGovernanceRoleCoverage}
                  type="button"
                >
                  {translate("governanceLoadCapabilities")}
                </button>
                <button
                  className="button primary"
                  data-action-id={adminUsersScreenModel.actions.assignAthlete}
                  onClick={() => void handleAssignGovernanceRole("athlete")}
                  type="button"
                >
                  {translate("governanceAssignAthlete")}
                </button>
                <button
                  className="button primary"
                  data-action-id={adminUsersScreenModel.actions.assignCoach}
                  onClick={() => void handleAssignGovernanceRole("coach")}
                  type="button"
                >
                  {translate("governanceAssignCoach")}
                </button>
                <button
                  className="button primary"
                  data-action-id={adminUsersScreenModel.actions.assignAdmin}
                  onClick={() => void handleAssignGovernanceRole("admin")}
                  type="button"
                >
                  {translate("governanceAssignAdmin")}
                </button>
                <button
                  className="button ghost"
                  data-action-id={adminUsersScreenModel.actions.clearSelection}
                  onClick={handleClearGovernanceSelection}
                  type="button"
                >
                  {translate("governanceClearSelection")}
                </button>
              </div>
              <StatLine
                label={translate("governanceUsersLoadedLabel")}
                value={String(governancePrincipals.length)}
                language={language}
              />
              <StatLine
                label={translate("governanceUsersSelectedLabel")}
                value={String(governanceSelectedPrincipalIds.length)}
                language={language}
              />
              {governancePrincipals.length === 0 ? (
                <p className="empty-state">{translate("governanceNoUsers")}</p>
              ) : (
                <>
                  <DenseRowsInfo
                    visibleRows={visibleGovernanceRows.length}
                    totalRows={governancePrincipals.length}
                    language={language}
                  />
                  <div className="operations-table">
                    <header className="operations-table-row operations-table-header">
                      <span>{translate("governancePrincipalColumn")}</span>
                      <span>{translate("governanceRoleColumn")}</span>
                      <span>{translate("governanceSourceColumn")}</span>
                      <span>{translate("governanceCountsColumn")}</span>
                      <span>{translate("governanceAllowedDomainsLabel")}</span>
                      <span>{translate("riskColumn")}</span>
                    </header>
                    {visibleGovernanceRows.map((principal) => (
                      <label key={principal.userId} className="operations-table-row">
                        <div className="operations-athlete-cell">
                          <input
                            type="checkbox"
                            checked={selectedGovernancePrincipalIdSet.has(principal.userId)}
                            onChange={() =>
                              handleToggleGovernancePrincipalSelection(principal.userId)
                            }
                          />
                          <strong>{principal.userId}</strong>
                        </div>
                        <span>{toHumanStatus(principal.assignedRole, language)}</span>
                        <span>
                          {principal.source === "operator"
                            ? translate("governanceSourceOperator")
                            : translate("governanceSourceActivity")}
                        </span>
                        <span>
                          {principal.plansCount}/{principal.sessionsCount}/
                          {principal.nutritionLogsCount}
                        </span>
                        <span>
                          {(capabilitiesByRole[principal.assignedRole]?.allowedDomains.length ??
                            0)}
                        </span>
                        <span
                          className={`status-pill status-${toStatusClass(
                            principal.sessionsCount === 0 || principal.nutritionLogsCount === 0
                              ? "medium"
                              : "low"
                          )}`}
                        >
                          {principal.sessionsCount === 0 || principal.nutritionLogsCount === 0
                            ? translate("riskAttention")
                            : translate("riskNormal")}
                        </span>
                      </label>
                    ))}
                  </div>
                  {hasMoreGovernanceRows ? (
                    <div className="dense-table-actions">
                      <button className="button ghost" onClick={handleShowMoreGovernanceRows} type="button">
                        {translate("loadMoreRows")}
                      </button>
                      <button className="button ghost" onClick={handleShowAllGovernanceRows} type="button">
                        {translate("showAllRows")}
                      </button>
                    </div>
                  ) : null}
                </>
              )}
              <p className="section-subtitle">{translate("governanceCoverageTitle")}</p>
              <div className="history-list">
                {governanceRoleCoverage.map((coverage) => (
                  <article key={coverage.role} className="history-item">
                    <strong>{toHumanStatus(coverage.role, language)}</strong>
                    <div className="history-values">
                      <span>
                        {translate("governanceAllowedDomainsLabel")} {coverage.allowedDomainsCount}
                      </span>
                      <span>{coverage.allowedDomains.length === 0 ? "-" : coverage.allowedDomains}</span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
            </article>
          ) : null}

          {canRenderOperationalModules && isModuleVisibleForUI("auditCompliance") ? (
            <article
              className="module-card"
              data-screen-id={auditTrailScreenModel.screenId}
              data-route-id={auditTrailScreenModel.routeId}
              data-status-id="web.auditTrail.status"
            >
            <SectionHeader
              title={translate("auditTitle")}
              status={auditTrailScreenModel.status}
              statusLabel={translate("auditStatusLabel")}
              language={language}
            />
            <div className="form-grid">
              <div className="inline-inputs">
                <button
                  className="button ghost"
                  data-action-id={auditTrailScreenModel.actions.loadTimeline}
                  onClick={handleLoadAuditTimeline}
                  type="button"
                >
                  {translate("auditLoadTimeline")}
                </button>
                <button
                  className="button primary"
                  data-action-id={auditTrailScreenModel.actions.exportCsv}
                  onClick={handleExportAuditCSV}
                  type="button"
                >
                  {translate("auditExportCSV")}
                </button>
                <button
                  className="button ghost"
                  data-action-id={auditTrailScreenModel.actions.exportForensic}
                  onClick={handleExportForensicAudit}
                  type="button"
                >
                  {translate("auditExportForensic")}
                </button>
                <button
                  className="button ghost"
                  data-action-id={auditTrailScreenModel.actions.clearFilters}
                  onClick={handleClearAuditFilters}
                  type="button"
                >
                  {translate("auditClearFilters")}
                </button>
              </div>
              <div className="inline-inputs">
                <input
                  aria-label={translate("auditSearchPlaceholder")}
                  placeholder={translate("auditSearchPlaceholder")}
                  value={auditQuery}
                  onChange={(event) => setAuditQuery(event.target.value)}
                />
                <input
                  aria-label={translate("auditDomainFilterPlaceholder")}
                  placeholder={translate("auditDomainFilterPlaceholder")}
                  value={auditDomainFilter}
                  onChange={(event) => setAuditDomainFilter(event.target.value)}
                />
              </div>
              <div className="inline-inputs">
                <label className="compact-label">
                  {translate("auditSourceFilterLabel")}
                  <select
                    aria-label={translate("auditSourceFilterLabel")}
                    value={auditSourceFilter}
                    onChange={(event) => setAuditSourceFilter(event.target.value as AuditSourceFilter)}
                  >
                    <option value="all">{translate("auditFilterAllSources")}</option>
                    <option value="web">web</option>
                    <option value="ios">ios</option>
                    <option value="backend">backend</option>
                  </select>
                </label>
                <label className="compact-label">
                  {translate("auditCategoryFilterLabel")}
                  <select
                    aria-label={translate("auditCategoryFilterLabel")}
                    value={auditCategoryFilter}
                    onChange={(event) =>
                      setAuditCategoryFilter(event.target.value as AuditCategoryFilter)
                    }
                  >
                    <option value="all">{translate("auditFilterAllCategories")}</option>
                    <option value="analytics">{translate("auditCategoryAnalytics")}</option>
                    <option value="crash">{translate("auditCategoryCrash")}</option>
                  </select>
                </label>
                <label className="compact-label">
                  {translate("auditSeverityFilterLabel")}
                  <select
                    aria-label={translate("auditSeverityFilterLabel")}
                    value={auditSeverityFilter}
                    onChange={(event) =>
                      setAuditSeverityFilter(event.target.value as AuditSeverityFilter)
                    }
                  >
                    <option value="all">{translate("auditFilterAllSeverities")}</option>
                    <option value="info">{translate("auditSeverityInfo")}</option>
                    <option value="warning">warning</option>
                    <option value="fatal">fatal</option>
                  </select>
                </label>
              </div>
              <StatLine
                label={translate("auditRowsLoadedLabel")}
                value={String(auditTimelineRowsBase.length)}
                language={language}
              />
              <StatLine
                label={translate("auditRowsFilteredLabel")}
                value={String(auditTimelineRows.length)}
                language={language}
              />
              <StatLine
                label={translate("auditStructuredLogsLabel")}
                value={String(structuredLogs.length)}
                language={language}
              />
              <StatLine
                label={translate("auditActivityLogLabel")}
                value={String(activityLogEntries.length)}
                language={language}
              />
              <StatLine
                label={translate("auditForensicStatusLabel")}
                value={forensicExportResult === null ? "-" : humanizeStatus(forensicExportResult.status, language)}
                language={language}
              />
              {auditTimelineRows.length === 0 ? (
                <p className="empty-state">{translate("auditNoRows")}</p>
              ) : (
                <>
                  <DenseRowsInfo
                    visibleRows={visibleAuditRows.length}
                    totalRows={auditTimelineRows.length}
                    language={language}
                  />
                  <div className="operations-table">
                    <header className="operations-table-row operations-table-header">
                      <span>{translate("auditOccurredAtColumn")}</span>
                      <span>{translate("auditSourceColumn")}</span>
                      <span>{translate("auditCategoryColumn")}</span>
                      <span>{translate("auditSeverityColumn")}</span>
                      <span>{translate("auditNameColumn")}</span>
                      <span>{translate("auditDomainColumn")}</span>
                      <span>{translate("auditCorrelationColumn")}</span>
                      <span>{translate("auditSummaryColumn")}</span>
                    </header>
                    {visibleAuditRows.map((row) => (
                      <div key={row.id} className="operations-table-row audit-table-row">
                        <span>{row.occurredAt}</span>
                        <span>{row.source}</span>
                        <span>{row.category}</span>
                        <span
                          className={`status-pill status-${toStatusClass(
                            row.severity === "fatal"
                              ? "high"
                              : row.severity === "warning"
                                ? "medium"
                                : "low"
                          )}`}
                        >
                          {toHumanStatus(row.severity, language)}
                        </span>
                        <span>{row.name}</span>
                        <span>{row.domain}</span>
                        <span>{row.correlationId}</span>
                        <span>{row.summary}</span>
                      </div>
                    ))}
                  </div>
                  {hasMoreAuditRows ? (
                    <div className="dense-table-actions">
                      <button className="button ghost" onClick={handleShowMoreAuditRows} type="button">
                        {translate("loadMoreRows")}
                      </button>
                      <button className="button ghost" onClick={handleShowAllAuditRows} type="button">
                        {translate("showAllRows")}
                      </button>
                    </div>
                  ) : null}
                </>
              )}
            </div>
            </article>
          ) : null}

          {canRenderOperationalModules && isModuleVisibleForUI("billingSupport") ? (
            <article
              className="module-card"
              data-screen-id={billingOverviewScreenModel.screenId}
              data-route-id={billingOverviewScreenModel.routeId}
              data-status-id="web.billingOverview.status"
            >
            <SectionHeader
              title={translate("billingSupportTitle")}
              status={billingOverviewScreenModel.status}
              statusLabel={translate("billingSupportStatusLabel")}
              language={language}
            />
            <div className="form-grid">
              <div className="inline-inputs">
                <button
                  className="button ghost"
                  data-action-id={billingOverviewScreenModel.actions.loadData}
                  onClick={handleLoadBillingSupportData}
                  type="button"
                >
                  {translate("billingSupportLoadData")}
                </button>
                <button
                  className="button primary"
                  data-action-id={billingOverviewScreenModel.actions.resolveSelected}
                  onClick={handleResolveBillingIncidents}
                  type="button"
                >
                  {translate("billingSupportResolveSelected")}
                </button>
                <button
                  className="button ghost"
                  data-action-id={billingOverviewScreenModel.actions.clearSelection}
                  onClick={handleClearBillingIncidentSelection}
                  type="button"
                >
                  {translate("billingSupportClearSelection")}
                </button>
                <button
                  className="button ghost"
                  data-action-id={billingOverviewScreenModel.actions.clearFilters}
                  onClick={handleClearBillingSupportFilters}
                  type="button"
                >
                  {translate("billingSupportClearFilters")}
                </button>
              </div>
              <div className="inline-inputs">
                <input
                  aria-label={translate("billingSupportSearchPlaceholder")}
                  placeholder={translate("billingSupportSearchPlaceholder")}
                  value={billingSupportSearch}
                  onChange={(event) => setBillingSupportSearch(event.target.value)}
                />
                <input
                  aria-label={translate("billingDomainFilterPlaceholder")}
                  placeholder={translate("billingDomainFilterPlaceholder")}
                  value={billingDomainFilter}
                  onChange={(event) => setBillingDomainFilter(event.target.value)}
                />
              </div>
              <div className="inline-inputs">
                <label className="compact-label">
                  {translate("billingInvoiceStatusFilterLabel")}
                  <select
                    aria-label={translate("billingInvoiceStatusFilterLabel")}
                    value={billingInvoiceStatusFilter}
                    onChange={(event) =>
                      setBillingInvoiceStatusFilter(event.target.value as BillingInvoiceStatusFilter)
                    }
                  >
                    <option value="all">{translate("billingFilterAllInvoiceStatuses")}</option>
                    <option value="draft">{translate("billingInvoiceStatusDraft")}</option>
                    <option value="open">{translate("billingInvoiceStatusOpen")}</option>
                    <option value="paid">{translate("billingInvoiceStatusPaid")}</option>
                    <option value="overdue">{translate("billingInvoiceStatusOverdue")}</option>
                  </select>
                </label>
                <label className="compact-label">
                  {translate("billingIncidentStateFilterLabel")}
                  <select
                    aria-label={translate("billingIncidentStateFilterLabel")}
                    value={billingIncidentStateFilter}
                    onChange={(event) =>
                      setBillingIncidentStateFilter(event.target.value as SupportIncidentStateFilter)
                    }
                  >
                    <option value="all">{translate("billingFilterAllIncidentStates")}</option>
                    <option value="open">{translate("billingIncidentStateOpen")}</option>
                    <option value="in_progress">
                      {translate("billingIncidentStateInProgress")}
                    </option>
                    <option value="resolved">{translate("billingIncidentStateResolved")}</option>
                  </select>
                </label>
                <label className="compact-label">
                  {translate("billingIncidentSeverityFilterLabel")}
                  <select
                    aria-label={translate("billingIncidentSeverityFilterLabel")}
                    value={billingIncidentSeverityFilter}
                    onChange={(event) =>
                      setBillingIncidentSeverityFilter(
                        event.target.value as SupportIncidentSeverityFilter
                      )
                    }
                  >
                    <option value="all">{translate("billingFilterAllIncidentSeverities")}</option>
                    <option value="high">{translate("billingIncidentSeverityHigh")}</option>
                    <option value="medium">{translate("billingIncidentSeverityMedium")}</option>
                    <option value="low">{translate("billingIncidentSeverityLow")}</option>
                  </select>
                </label>
              </div>
              <StatLine
                label={translate("billingInvoicesLoadedLabel")}
                value={String(billingInvoiceRows.length)}
                language={language}
              />
              <StatLine
                label={translate("billingIncidentsLoadedLabel")}
                value={String(supportIncidentRows.length)}
                language={language}
              />
              <StatLine
                label={translate("billingIncidentsSelectedLabel")}
                value={String(billingSelectedIncidentIds.length)}
                language={language}
              />
              <p className="section-subtitle">{translate("billingInvoicesSectionTitle")}</p>
              {billingInvoiceRows.length === 0 ? (
                <p className="empty-state">{translate("billingNoInvoices")}</p>
              ) : (
                <>
                  <DenseRowsInfo
                    visibleRows={visibleBillingInvoiceRows.length}
                    totalRows={billingInvoiceRows.length}
                    language={language}
                  />
                  <div className="operations-table">
                    <header className="operations-table-row operations-table-header billing-table-row">
                      <span>{translate("billingInvoiceIdColumn")}</span>
                      <span>{translate("billingAccountColumn")}</span>
                      <span>{translate("billingPeriodColumn")}</span>
                      <span>{translate("billingAmountColumn")}</span>
                      <span>{translate("billingInvoiceStatusColumn")}</span>
                      <span>{translate("billingSourceColumn")}</span>
                    </header>
                    {visibleBillingInvoiceRows.map((invoice) => (
                      <div key={invoice.id} className="operations-table-row billing-table-row">
                        <span>{invoice.id}</span>
                        <span>{invoice.accountId}</span>
                        <span>{invoice.period}</span>
                        <span>{invoice.amountEUR.toFixed(2)}</span>
                        <span className={`status-pill status-${toStatusClass(invoice.status)}`}>
                          {invoiceStatusLabel(invoice.status)}
                        </span>
                        <span>{toHumanStatus(invoice.source, language)}</span>
                      </div>
                    ))}
                  </div>
                  {hasMoreBillingInvoiceRows ? (
                    <div className="dense-table-actions">
                      <button className="button ghost" onClick={handleShowMoreBillingInvoiceRows} type="button">
                        {translate("loadMoreRows")}
                      </button>
                      <button className="button ghost" onClick={handleShowAllBillingInvoiceRows} type="button">
                        {translate("showAllRows")}
                      </button>
                    </div>
                  ) : null}
                </>
              )}
              <section
                data-screen-id={supportIncidentsScreenModel.screenId}
                data-route-id={supportIncidentsScreenModel.routeId}
                data-status-id="web.supportIncidents.status"
              >
                <p className="section-subtitle">{translate("billingIncidentsSectionTitle")}</p>
                <div className="inline-inputs">
                  <button
                    className="button ghost"
                    data-action-id={supportIncidentsScreenModel.actions.loadData}
                    onClick={handleLoadBillingSupportData}
                    type="button"
                  >
                    {translate("billingSupportLoadData")}
                  </button>
                  <button
                    className="button primary"
                    data-action-id={supportIncidentsScreenModel.actions.resolveSelected}
                    onClick={handleResolveBillingIncidents}
                    type="button"
                  >
                    {translate("billingSupportResolveSelected")}
                  </button>
                  <button
                    className="button ghost"
                    data-action-id={supportIncidentsScreenModel.actions.clearSelection}
                    onClick={handleClearBillingIncidentSelection}
                    type="button"
                  >
                    {translate("billingSupportClearSelection")}
                  </button>
                  <button
                    className="button ghost"
                    data-action-id={supportIncidentsScreenModel.actions.clearFilters}
                    onClick={handleClearBillingSupportFilters}
                    type="button"
                  >
                    {translate("billingSupportClearFilters")}
                  </button>
                </div>
                {supportIncidentRows.length === 0 ? (
                  <p className="empty-state">{translate("billingNoIncidents")}</p>
                ) : (
                  <>
                    <DenseRowsInfo
                      visibleRows={visibleBillingIncidentRows.length}
                      totalRows={supportIncidentRows.length}
                      language={language}
                    />
                    <div className="operations-table">
                      <header className="operations-table-row operations-table-header support-table-row">
                        <span>{translate("billingIncidentIdColumn")}</span>
                        <span>{translate("billingOpenedAtColumn")}</span>
                        <span>{translate("billingIncidentDomainColumn")}</span>
                        <span>{translate("billingIncidentSeverityColumn")}</span>
                        <span>{translate("billingIncidentStateColumn")}</span>
                        <span>{translate("billingIncidentCorrelationColumn")}</span>
                        <span>{translate("billingIncidentSummaryColumn")}</span>
                      </header>
                      {visibleBillingIncidentRows.map((incident) => (
                        <label key={incident.id} className="operations-table-row support-table-row">
                          <div className="operations-athlete-cell">
                            <input
                              type="checkbox"
                              checked={selectedBillingIncidentIdSet.has(incident.id)}
                              onChange={() => handleToggleBillingIncidentSelection(incident.id)}
                            />
                            <strong>{incident.id}</strong>
                          </div>
                          <span>{incident.openedAt}</span>
                          <span>{incident.domain}</span>
                          <span
                            className={`status-pill status-${toStatusClass(
                              incident.severity
                            )}`}
                          >
                            {incidentSeverityLabel(incident.severity)}
                          </span>
                          <span
                            className={`status-pill status-${toStatusClass(
                              incident.state === "resolved"
                                ? "low"
                                : incident.state === "in_progress"
                                  ? "medium"
                                  : "high"
                            )}`}
                          >
                            {incidentStateLabel(incident.state)}
                          </span>
                          <span>{incident.correlationId}</span>
                          <span>{incident.summary}</span>
                        </label>
                      ))}
                    </div>
                    {hasMoreBillingIncidentRows ? (
                      <div className="dense-table-actions">
                        <button className="button ghost" onClick={handleShowMoreBillingIncidentRows} type="button">
                          {translate("loadMoreRows")}
                        </button>
                        <button className="button ghost" onClick={handleShowAllBillingIncidentRows} type="button">
                          {translate("showAllRows")}
                        </button>
                      </div>
                    ) : null}
                  </>
                )}
              </section>
            </div>
            </article>
          ) : null}

          {canRenderOperationalModules && isModuleVisibleForUI("recommendations") ? (
            <article
              className="module-card"
              data-screen-id={aiInsightsScreenModel.screenId}
              data-route-id={aiInsightsScreenModel.routeId}
              data-status-id="web.aiInsights.status"
            >
            <SectionHeader
              title={translate("aiInsightsTitle")}
              status={aiInsightsScreenModel.status}
              statusLabel={translate("aiInsightsStatusLabel")}
              language={language}
            />
            <div className="form-grid">
              <p className="runtime-state-copy">{translate("aiInsightsSummary")}</p>
              <div className="inline-inputs">
                <button
                  className="button primary"
                  onClick={() => void handleLoadRecommendations()}
                  type="button"
                  data-action-id={aiInsightsScreenModel.actions.loadRecommendations}
                >
                  {translate("aiInsightsLoadAction")}
                </button>
                <button
                  className="button ghost"
                  onClick={() => void handleRefreshAIInsights()}
                  type="button"
                  data-action-id={aiInsightsScreenModel.actions.refreshSignals}
                  disabled={aiInsightsScreenModel.status === "loading"}
                >
                  {translate("aiInsightsRefreshAction")}
                </button>
              </div>
              <div className="inline-inputs">
                <Metric
                  title={translate("aiInsightsRecommendationsLabel")}
                  value={String(recommendations.length)}
                />
                <Metric
                  title={translate("aiInsightsHighPriorityLabel")}
                  value={String(
                    recommendations.filter((recommendation) => recommendation.priority === "high")
                      .length
                  )}
                />
                <Metric
                  title={translate("aiInsightsSignalsLabel")}
                  value={String(analyticsEvents.length + crashReports.length)}
                />
              </div>
              {recommendations.length === 0 ? (
                <p className="empty-state">{translate("aiInsightsNoData")}</p>
              ) : (
                <div className="recommendation-list">
                  {recommendations.map((recommendation) => (
                    <article key={recommendation.id} className="recommendation-item">
                      <div className="recommendation-head">
                        <strong>{recommendation.title}</strong>
                        <span
                          className={`status-pill status-${toStatusClass(
                            recommendation.priority
                          )}`}
                        >
                          {recommendation.priority}
                        </span>
                      </div>
                      <p>{recommendation.rationale}</p>
                      <div className="recommendation-meta">
                        <span>{recommendation.category}</span>
                        <span>{recommendation.expectedImpact}</span>
                        <strong>{recommendation.actionLabel}</strong>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
            </article>
          ) : null}

          {canRenderOperationalModules && isModuleVisibleForUI("nutrition") ? (
            <article
              className="module-card"
              data-screen-id={nutritionOverviewScreenModel.screenId}
              data-route-id={nutritionOverviewScreenModel.routeId}
              data-status-id="web.nutritionOverview.status"
            >
            <SectionHeader
              title={translate("nutritionTitle")}
              status={nutritionOverviewScreenModel.status}
              statusLabel={translate("nutritionStatusLabel")}
              language={language}
            />
            <div className="form-grid">
              <input
                aria-label={translate("datePlaceholder")}
                placeholder={translate("datePlaceholder")}
                value={nutritionDate}
                onChange={(event) => setNutritionDate(event.target.value)}
              />
              <div className="inline-inputs">
                <input
                  aria-label={translate("caloriesPlaceholder")}
                  placeholder={translate("caloriesPlaceholder")}
                  value={calories}
                  onChange={(event) => setCalories(event.target.value)}
                />
                <input
                  aria-label={translate("proteinPlaceholder")}
                  placeholder={translate("proteinPlaceholder")}
                  value={proteinGrams}
                  onChange={(event) => setProteinGrams(event.target.value)}
                />
              </div>
              <div className="inline-inputs">
                <input
                  aria-label={translate("carbsPlaceholder")}
                  placeholder={translate("carbsPlaceholder")}
                  value={carbsGrams}
                  onChange={(event) => setCarbsGrams(event.target.value)}
                />
                <input
                  aria-label={translate("fatsPlaceholder")}
                  placeholder={translate("fatsPlaceholder")}
                  value={fatsGrams}
                  onChange={(event) => setFatsGrams(event.target.value)}
                />
              </div>
              <div className="inline-inputs">
                <button
                  className="button primary"
                  onClick={handleCreateNutritionLog}
                  type="button"
                  data-action-id={nutritionOverviewScreenModel.actions.saveLog}
                >
                  {translate("saveNutritionLog")}
                </button>
                <button
                  className="button ghost"
                  onClick={handleLoadNutritionLogs}
                  type="button"
                  data-action-id={nutritionOverviewScreenModel.actions.loadLogs}
                >
                  {translate("loadLogs")}
                </button>
              </div>
              <div
                className="history-list"
                data-screen-id={dailyLogReviewScreenModel.screenId}
                data-route-id={dailyLogReviewScreenModel.routeId}
                data-status-id="web.dailyLogReview.status"
              >
                <p className="section-subtitle">{translate("nutritionFiltersLabel")}</p>
                <div className="inline-inputs">
                  <input
                    aria-label={translate("nutritionDateFilterPlaceholder")}
                    placeholder={translate("nutritionDateFilterPlaceholder")}
                    value={nutritionDateFilter}
                    data-action-id={dailyLogReviewScreenModel.actions.updateFilters}
                    onChange={(event) => setNutritionDateFilter(event.target.value)}
                  />
                  <input
                    aria-label={translate("nutritionMinProteinPlaceholder")}
                    placeholder={translate("nutritionMinProteinPlaceholder")}
                    value={nutritionMinProteinFilter}
                    data-action-id={dailyLogReviewScreenModel.actions.updateFilters}
                    onChange={(event) => setNutritionMinProteinFilter(event.target.value)}
                  />
                  <input
                    aria-label={translate("nutritionMaxCaloriesPlaceholder")}
                    placeholder={translate("nutritionMaxCaloriesPlaceholder")}
                    value={nutritionMaxCaloriesFilter}
                    data-action-id={dailyLogReviewScreenModel.actions.updateFilters}
                    onChange={(event) => setNutritionMaxCaloriesFilter(event.target.value)}
                  />
                </div>
                <div className="inline-inputs">
                  <label className="compact-label">
                    {translate("nutritionSortLabel")}
                    <select
                      aria-label={translate("nutritionSortLabel")}
                      value={nutritionSortMode}
                      data-action-id={dailyLogReviewScreenModel.actions.updateSort}
                      onChange={(event) =>
                        setNutritionSortMode(event.target.value as NutritionSortMode)
                      }
                    >
                      <option value="date_desc">{translate("nutritionSortByDate")}</option>
                      <option value="calories_desc">{translate("nutritionSortByCalories")}</option>
                      <option value="protein_desc">{translate("nutritionSortByProtein")}</option>
                    </select>
                  </label>
                  <button
                    className="button ghost"
                    onClick={handleClearNutritionFilters}
                    type="button"
                    data-action-id={dailyLogReviewScreenModel.actions.clearFilters}
                  >
                    {translate("clearNutritionFilters")}
                  </button>
                </div>
              </div>
              <StatLine
                label={translate("logsLoadedLabel")}
                value={String(nutritionLogs.length)}
                language={language}
              />
              <StatLine
                label={translate("filteredLogsLabel")}
                value={String(filteredNutritionLogs.length)}
                language={language}
              />
              <div
                className="history-list"
                data-screen-id={deviationAlertsScreenModel.screenId}
                data-route-id={deviationAlertsScreenModel.routeId}
                data-status-id="web.deviationAlerts.status"
              >
                <p className="section-subtitle">{translate("deviationAlertsTitle")}</p>
                <p className="runtime-state-copy">{translate("deviationAlertsSummary")}</p>
                <div className="inline-inputs">
                  <button
                    className="button primary"
                    onClick={handleLoadNutritionLogs}
                    type="button"
                    data-action-id={deviationAlertsScreenModel.actions.loadAlerts}
                    disabled={deviationAlertsScreenModel.status === "loading"}
                  >
                    {translate("deviationAlertsLoadAction")}
                  </button>
                  <button
                    className="button ghost"
                    onClick={handleClearNutritionFilters}
                    type="button"
                    data-action-id={deviationAlertsScreenModel.actions.clearFilters}
                  >
                    {translate("deviationAlertsClearAction")}
                  </button>
                </div>
                <StatLine
                  label={translate("deviationAlertsHighRiskLabel")}
                  value={String(
                    nutritionDeviationAlerts.filter((alert) => alert.severity === "high").length
                  )}
                  language={language}
                />
                <StatLine
                  label={translate("deviationAlertsModerateRiskLabel")}
                  value={String(
                    nutritionDeviationAlerts.filter((alert) => alert.severity === "medium").length
                  )}
                  language={language}
                />
                {nutritionDeviationAlerts.length === 0 ? (
                  <p className="empty-state">{translate("deviationAlertsNoData")}</p>
                ) : (
                  <div className="history-list">
                    {nutritionDeviationAlerts.map((alert) => (
                      <article key={alert.id} className="history-item">
                        <div className="history-item-head">
                          <strong>{alert.date}</strong>
                          <span
                            className={`status-pill status-${toStatusClass(alert.severity)}`}
                          >
                            {alert.severity === "high"
                              ? translate("deviationAlertsHighRiskLabel")
                              : translate("deviationAlertsModerateRiskLabel")}
                          </span>
                        </div>
                        <p className="runtime-state-copy">
                          {alert.reason === "calories"
                            ? translate("deviationAlertsReasonCalories")
                            : translate("deviationAlertsReasonProtein")}
                        </p>
                        <div className="history-values">
                          <span>{translate("caloriesPlaceholder")} {alert.calories}</span>
                          <span>{translate("proteinPlaceholder")} {alert.proteinGrams}</span>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
              <div
                className="history-list"
                data-screen-id={nutritionCoachViewScreenModel.screenId}
                data-route-id={nutritionCoachViewScreenModel.routeId}
                data-status-id="web.nutritionCoachView.status"
              >
                <p className="section-subtitle">{translate("nutritionCoachViewTitle")}</p>
                <p className="runtime-state-copy">{translate("nutritionCoachViewSummary")}</p>
                <div className="inline-inputs">
                  <button
                    className="button primary"
                    onClick={handleLoadNutritionLogs}
                    type="button"
                    data-action-id={nutritionCoachViewScreenModel.actions.loadCohort}
                    disabled={nutritionCoachViewScreenModel.status === "loading"}
                  >
                    {translate("nutritionCoachViewLoadAction")}
                  </button>
                  <button
                    className="button ghost"
                    onClick={handleFocusNutritionCoachAtRisk}
                    type="button"
                    data-action-id={nutritionCoachViewScreenModel.actions.focusAtRisk}
                  >
                    {translate("nutritionCoachViewFocusAction")}
                  </button>
                  <button
                    className="button ghost"
                    onClick={handleOpenNutritionCoachOperations}
                    type="button"
                    data-action-id={nutritionCoachViewScreenModel.actions.openOperations}
                  >
                    {translate("nutritionCoachViewOpenOperationsAction")}
                  </button>
                </div>
                <StatLine
                  label={translate("athletesLoadedLabel")}
                  value={String(nutritionCoachRows.length)}
                  language={language}
                />
                <StatLine
                  label={translate("nutritionCoachViewAtRiskLabel")}
                  value={String(nutritionCoachAtRiskCount)}
                  language={language}
                />
                {nutritionCoachRows.length === 0 ? (
                  <p className="empty-state">{translate("nutritionCoachViewNoRows")}</p>
                ) : (
                  <div className="history-list">
                    {nutritionCoachRows.map((row) => (
                      <article key={row.athleteId} className="history-item">
                        <div className="history-item-head">
                          <strong>{row.athleteId}</strong>
                          <span
                            className={
                              row.riskLevel === "attention"
                                ? "status-pill status-critical"
                                : "status-pill status-positive"
                            }
                          >
                            {row.riskLevel === "attention"
                              ? translate("riskAttention")
                              : translate("riskNormal")}
                          </span>
                        </div>
                        <div className="history-values">
                          <span>{translate("plansColumn")} {row.plansCount}</span>
                          <span>{translate("sessionsColumn")} {row.sessionsCount}</span>
                          <span>{translate("nutritionColumn")} {row.nutritionLogsCount}</span>
                          <span>{translate("lastSessionColumn")} {row.lastSessionDate}</span>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
              {webLane === "secondary" ? (
                <div
                  className="history-list"
                  data-screen-id={cohortNutritionScreenModel.screenId}
                  data-route-id={cohortNutritionScreenModel.routeId}
                  data-status-id="web.light.cohortNutrition.status"
                >
                  <p className="section-subtitle">{translate("cohortNutritionTitle")}</p>
                  <p className="runtime-state-copy">{translate("cohortNutritionSummary")}</p>
                  <div className="inline-inputs">
                    <button
                      className="button primary"
                      onClick={handleLoadNutritionLogs}
                      type="button"
                      data-action-id={cohortNutritionScreenModel.actions.loadCohort}
                      disabled={cohortNutritionScreenModel.status === "loading"}
                    >
                      {translate("cohortNutritionLoadAction")}
                    </button>
                    <button
                      className="button ghost"
                      onClick={handleFocusHighestNutritionRisk}
                      type="button"
                      data-action-id={cohortNutritionScreenModel.actions.focusHighestRisk}
                    >
                      {translate("cohortNutritionFocusAction")}
                    </button>
                  </div>
                  <StatLine
                    label={translate("athletesLoadedLabel")}
                    value={String(cohortNutritionRows.length)}
                    language={language}
                  />
                  <StatLine
                    label={translate("nutritionCoachViewAtRiskLabel")}
                    value={String(
                      cohortNutritionRows.filter((row) => row.riskLevel === "attention").length
                    )}
                    language={language}
                  />
                  {cohortNutritionRows.length === 0 ? (
                    <p className="empty-state">{translate("cohortNutritionNoRows")}</p>
                  ) : (
                    <div className="history-list">
                      {cohortNutritionRows.map((row) => (
                        <article key={row.athleteId} className="history-item">
                          <div className="history-item-head">
                            <strong>{row.athleteId}</strong>
                            <span
                              className={
                                row.riskLevel === "attention"
                                  ? "status-pill status-critical"
                                  : "status-pill status-positive"
                              }
                            >
                              {row.riskLevel === "attention"
                                ? translate("riskAttention")
                                : translate("riskNormal")}
                            </span>
                          </div>
                          <div className="history-values">
                            <span>{translate("cohortNutritionLogsLabel")} {row.logsCount}</span>
                            <span>
                              {translate("cohortNutritionAvgCaloriesLabel")} {row.averageCalories}
                            </span>
                            <span>
                              {translate("cohortNutritionAvgProteinLabel")} {row.averageProteinGrams}
                            </span>
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </div>
              ) : null}
              {webLane === "secondary" ? (
                <div
                  className="history-list"
                  data-screen-id={nutritionLogDetailScreenModel.screenId}
                  data-route-id={nutritionLogDetailScreenModel.routeId}
                  data-status-id="web.light.logDetail.status"
                >
                  <p className="section-subtitle">{translate("logDetailTitle")}</p>
                  <p className="runtime-state-copy">{translate("logDetailSummary")}</p>
                  <div className="inline-inputs">
                    <button
                      className="button primary"
                      onClick={handleLoadNutritionLogs}
                      type="button"
                      data-action-id={nutritionLogDetailScreenModel.actions.loadDetail}
                      disabled={nutritionLogDetailScreenModel.status === "loading"}
                    >
                      {translate("logDetailLoadAction")}
                    </button>
                    <button
                      className="button ghost"
                      onClick={handleClearNutritionLogSelection}
                      type="button"
                      data-action-id={nutritionLogDetailScreenModel.actions.clearSelection}
                    >
                      {translate("logDetailClearAction")}
                    </button>
                    <button
                      className="button ghost"
                      onClick={handleOpenNutritionLogCoachView}
                      type="button"
                      data-action-id={nutritionLogDetailScreenModel.actions.openCoachView}
                    >
                      {translate("logDetailOpenCoachAction")}
                    </button>
                  </div>
                  <label className="compact-label">
                    {translate("logDetailSelectPlaceholder")}
                    <select
                      aria-label={translate("logDetailSelectPlaceholder")}
                      value={selectedNutritionLogOption?.key ?? ""}
                      onChange={(event) => handleSelectNutritionLogDetail(event.target.value)}
                      data-action-id={nutritionLogDetailScreenModel.actions.selectLog}
                    >
                      {nutritionLogOptionRows.map((row) => (
                        <option key={row.key} value={row.key}>
                          {row.log.date} · {row.log.userId}
                        </option>
                      ))}
                    </select>
                  </label>
                  <StatLine
                    label={translate("logDetailSelectedDateLabel")}
                    value={selectedNutritionLog?.date ?? "-"}
                    language={language}
                  />
                  <StatLine
                    label={translate("logDetailSelectedAthleteLabel")}
                    value={selectedNutritionLog?.userId ?? "-"}
                    language={language}
                  />
                  {selectedNutritionLog === null ? (
                    <p className="empty-state">{translate("logDetailNoSelection")}</p>
                  ) : (
                    <div className="history-values">
                      <span>{translate("caloriesPlaceholder")} {selectedNutritionLog.calories}</span>
                      <span>{translate("proteinPlaceholder")} {selectedNutritionLog.proteinGrams}</span>
                      <span>{translate("carbsPlaceholder")} {selectedNutritionLog.carbsGrams}</span>
                      <span>{translate("fatsPlaceholder")} {selectedNutritionLog.fatsGrams}</span>
                    </div>
                  )}
                </div>
              ) : null}
              {filteredNutritionLogs.length === 0 ? (
                <p className="empty-state">{translate("noNutritionFilteredLogs")}</p>
              ) : (
                <div className="history-list">
                  {nutritionLogOptionRows.map((row) => (
                    <article key={row.key} className="history-item">
                      <strong>{row.log.date}</strong>
                      <div className="history-values">
                        <span>{translate("caloriesPlaceholder")} {row.log.calories}</span>
                        <span>{translate("proteinPlaceholder")} {row.log.proteinGrams}</span>
                        <span>{translate("carbsPlaceholder")} {row.log.carbsGrams}</span>
                        <span>{translate("fatsPlaceholder")} {row.log.fatsGrams}</span>
                      </div>
                      {webLane === "secondary" ? (
                        <button
                          className="button ghost"
                          type="button"
                          onClick={() => handleSelectNutritionLogDetail(row.key)}
                          data-action-id={nutritionLogDetailScreenModel.actions.selectLog}
                        >
                          {translate("logDetailSelectPlaceholder")}
                        </button>
                      ) : null}
                    </article>
                  ))}
                </div>
              )}
            </div>
            </article>
          ) : null}

          {canRenderOperationalModules && isModuleVisibleForUI("progress") ? (
            <article
              className="module-card"
              data-screen-id={progressTrendsScreenModel.screenId}
              data-route-id={progressTrendsScreenModel.routeId}
              data-status-id="web.progressTrends.status"
            >
            <SectionHeader
              title={translate("progressTrendsTitle")}
              status={progressTrendsScreenModel.status}
              statusLabel={translate("progressTrendsStatusLabel")}
              language={language}
            />
            <div className="form-grid">
              <p className="runtime-state-copy">{translate("progressTrendsSummary")}</p>
              <button
                className="button primary"
                onClick={() => void handleRefreshProgressTrends()}
                type="button"
                data-action-id={progressTrendsScreenModel.actions.refresh}
                disabled={progressTrendsScreenModel.status === "loading"}
              >
                {translate("progressTrendsRefreshAction")}
              </button>
              {progressSummary === null ? (
                <p className="empty-state">{translate("progressTrendsNoData")}</p>
              ) : (
                <>
                  <div className="metric-grid">
                    <Metric
                      title={translate("workoutsMetric")}
                      value={String(progressSummary.workoutSessionsCount)}
                    />
                    <Metric
                      title={translate("minutesMetric")}
                      value={String(progressSummary.totalTrainingMinutes)}
                    />
                    <Metric
                      title={translate("setsMetric")}
                      value={String(progressSummary.totalCompletedSets)}
                    />
                    <Metric
                      title={translate("nutritionMetric")}
                      value={String(progressSummary.nutritionLogsCount)}
                    />
                    <Metric
                      title={translate("avgCaloriesMetric")}
                      value={String(progressSummary.averageCalories)}
                    />
                    <Metric
                      title={translate("avgProteinMetric")}
                      value={String(progressSummary.averageProteinGrams)}
                    />
                  </div>
                  <p className="section-subtitle">{translate("progressFiltersLabel")}</p>
                  <div className="inline-inputs">
                    <input
                      aria-label={translate("progressMinSessionsPlaceholder")}
                      placeholder={translate("progressMinSessionsPlaceholder")}
                      value={progressMinSessionsFilter}
                      onChange={(event) => setProgressMinSessionsFilter(event.target.value)}
                    />
                    <label className="compact-label">
                      {translate("progressSortLabel")}
                      <select
                        aria-label={translate("progressSortLabel")}
                        value={progressSortMode}
                        onChange={(event) =>
                          setProgressSortMode(event.target.value as ProgressSortMode)
                        }
                      >
                        <option value="date_desc">{translate("progressSortByDate")}</option>
                        <option value="sessions_desc">{translate("progressSortBySessions")}</option>
                        <option value="minutes_desc">{translate("progressSortByMinutes")}</option>
                      </select>
                    </label>
                    <button className="button ghost" onClick={handleClearProgressFilters} type="button">
                      {translate("clearProgressFilters")}
                    </button>
                  </div>
                  <StatLine
                    label={translate("filteredHistoryLabel")}
                    value={String(filteredProgressHistory.length)}
                    language={language}
                  />
                  <div className="history-list">
                    {filteredProgressHistory.length === 0 ? (
                      <p className="empty-state">{translate("noProgressFilteredHistory")}</p>
                    ) : (
                      filteredProgressHistory.map((entry) => (
                        <article key={entry.date} className="history-item">
                          <strong>{entry.date}</strong>
                          <div className="history-values">
                            <span>
                              {translate("historySessionsLabel")} {entry.workoutSessions}
                            </span>
                            <span>
                              {translate("historyMinutesLabel")} {entry.trainingMinutes}
                            </span>
                            <span>
                              {translate("historySetsLabel")} {entry.completedSets}
                            </span>
                            <span>
                              {translate("historyCaloriesLabel")} {entry.calories ?? "-"}
                            </span>
                            <span>{translate("effortMetric")} {entry.effortScore}</span>
                          </div>
                        </article>
                      ))
                    )}
                  </div>
                </>
              )}
            </div>
            </article>
          ) : null}

          {canRenderOperationalModules && isModuleVisibleForUI("offlineSync") ? (
            <article className="module-card">
            <SectionHeader
              title={translate("offlineSyncTitle")}
              status={syncStatus}
              statusLabel={translate("syncStatusLabel")}
              language={language}
            />
            <div className="form-grid">
              <div className="inline-inputs">
                <button className="button primary" onClick={handleSyncOfflineQueue} type="button">
                  {translate("syncQueue")}
                </button>
                <button className="button ghost" onClick={() => void refreshPendingQueue()} type="button">
                  {translate("refreshQueue")}
                </button>
              </div>
              <StatLine
                label={translate("pendingActionsLabel")}
                value={String(pendingQueueCount)}
                language={language}
              />
              <StatLine
                label={translate("rejectedLastSyncLabel")}
                value={String(lastSyncRejectedCount)}
                language={language}
              />
              <StatLine
                label={translate("idempotencyKeyLabel")}
                value={lastSyncIdempotency?.key ?? "-"}
                language={language}
              />
              <StatLine
                label={translate("idempotencyReplayLabel")}
                value={
                  lastSyncIdempotency === null
                    ? "-"
                    : lastSyncIdempotency.replayed
                      ? translate("idempotencyReplayYes")
                      : translate("idempotencyReplayNo")
                }
                language={language}
              />
              <StatLine
                label={translate("idempotencyTTLLabel")}
                value={
                  lastSyncIdempotency === null
                    ? "-"
                    : `${lastSyncIdempotency.ttlSeconds}s`
                }
                language={language}
              />
            </div>
            </article>
          ) : null}

          {canRenderOperationalModules && isModuleVisibleForUI("settings") ? (
            <article className="module-card">
            <SectionHeader
              title={translate("settingsTitle")}
              status={settingsStatus}
              statusLabel={translate("settingsStatusLabel")}
              language={language}
            />
            <div className="form-grid">
              <label>
                <input
                  type="checkbox"
                  checked={notificationsEnabled}
                  onChange={(event) => setNotificationsEnabled(event.target.checked)}
                />
                {translate("notificationsPreference")}
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={watchSyncEnabled}
                  onChange={(event) => setWatchSyncEnabled(event.target.checked)}
                />
                {translate("watchPreference")}
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={calendarSyncEnabled}
                  onChange={(event) => setCalendarSyncEnabled(event.target.checked)}
                />
                {translate("calendarPreference")}
              </label>
              <button className="button primary" onClick={handleSaveSettings} type="button">
                {translate("saveSettings")}
              </button>
            </div>
            </article>
          ) : null}

          {canRenderOperationalModules && isModuleVisibleForUI("legal") ? (
            <article
              className="module-card"
              data-screen-id={legalComplianceScreenModel.screenId}
              data-route-id={legalComplianceScreenModel.routeId}
              data-status-id="web.legalCompliance.status"
            >
            <SectionHeader
              title={translate("legalSectionTitle")}
              status={legalComplianceScreenModel.status}
              statusLabel={translate("legalStatusLabel")}
              language={language}
            />
            <div className="form-grid">
              <StatLine
                label={translate("legalSummaryLabel")}
                value={`${privacyPolicyAccepted && termsAccepted && medicalDisclaimerAccepted ? "saved" : "idle"}`}
                language={language}
              />
              <div className="inline-inputs">
                <button
                  className="button primary"
                  data-action-id={legalComplianceScreenModel.actions.saveConsent}
                  onClick={handleSubmitLegalConsent}
                  type="button"
                >
                  {translate("saveConsent")}
                </button>
                <button
                  className="button ghost"
                  data-action-id={legalComplianceScreenModel.actions.exportData}
                  onClick={handleExportData}
                  type="button"
                >
                  {translate("exportData")}
                </button>
                <button
                  className="button ghost"
                  data-action-id={legalComplianceScreenModel.actions.requestDeletion}
                  onClick={handleRequestDataDeletion}
                  type="button"
                >
                  {translate("requestDeletion")}
                </button>
              </div>
            </div>
            </article>
          ) : null}

          {canRenderOperationalModules && isModuleVisibleForUI("observability") ? (
            <article
              className="module-card"
              data-screen-id={analyticsOverviewScreenModel.screenId}
              data-route-id={analyticsOverviewScreenModel.routeId}
              data-status-id="web.analyticsOverview.status"
            >
            <SectionHeader
              title={translate("observabilityTitle")}
              status={analyticsOverviewScreenModel.status}
              statusLabel={translate("observabilityStatusLabel")}
              language={language}
            />
            <div className="form-grid">
              <div className="inline-inputs">
                <button
                  className="button primary"
                  data-action-id={analyticsOverviewScreenModel.actions.trackEvent}
                  onClick={handleTrackAnalyticsEvent}
                  type="button"
                >
                  {translate("trackEvent")}
                </button>
                <button
                  className="button ghost"
                  data-action-id={analyticsOverviewScreenModel.actions.reportCrash}
                  onClick={handleReportDemoCrash}
                  type="button"
                >
                  {translate("reportCrash")}
                </button>
                <button
                  className="button ghost"
                  data-action-id={analyticsOverviewScreenModel.actions.loadData}
                  onClick={handleLoadObservabilityData}
                  type="button"
                >
                  {translate("loadData")}
                </button>
              </div>
              <StatLine
                label={translate("analyticsEventsLabel")}
                value={String(analyticsEvents.length)}
                language={language}
              />
              <StatLine
                label={translate("crashReportsLabel")}
                value={String(crashReports.length)}
                language={language}
              />
              <StatLine
                label={translate("observabilityBlockedActionsLabel")}
                value={String(observabilitySummary?.blockedActions ?? 0)}
                language={language}
              />
              <StatLine
                label={translate("observabilityDeniedEventsLabel")}
                value={String(observabilitySummary?.deniedAccessEvents ?? 0)}
                language={language}
              />
              <StatLine
                label={translate("observabilityFatalCrashesLabel")}
                value={String(observabilitySummary?.fatalCrashReports ?? 0)}
                language={language}
              />
              <StatLine
                label={translate("observabilityCanonicalCoverageLabel")}
                value={`${observabilitySummary?.canonicalCoverage.trackedCanonicalEvents ?? 0}/${(observabilitySummary?.canonicalCoverage.trackedCanonicalEvents ?? 0) + (observabilitySummary?.canonicalCoverage.customEvents ?? 0)}`}
                language={language}
              />
              <StatLine
                label={translate("observabilityOperationalAlertsLabel")}
                value={String(
                  operationalAlerts.filter((alert) => alert.state !== "resolved").length
                )}
                language={language}
              />
              <StatLine
                label={translate("observabilityRunbooksLabel")}
                value={String(operationalRunbooks.length)}
                language={language}
              />
              <StatLine
                label={translate("observabilityOnCallOwnerLabel")}
                value={operationalAlerts[0]?.ownerOnCall ?? "-"}
                language={language}
              />
            </div>
            </article>
          ) : null}
            </>
          )}
        </section>
      </main>
    </div>
  );
}

type SectionHeaderProps = {
  title: string;
  statusLabel: string;
  status: string;
  language: AppLanguage;
};

const SectionHeader = memo(function SectionHeader({
  title,
  statusLabel,
  status,
  language
}: SectionHeaderProps) {
  const shouldShowStatus = readWebRuntimeMode() === "qa";

  return (
    <header className="module-header">
      <h2>{title}</h2>
      {shouldShowStatus ? (
        <p>
          {statusLabel}:{" "}
          <span className={`status-pill status-${toStatusClass(status)}`}>
            {toHumanStatus(status, language)}
          </span>
        </p>
      ) : null}
    </header>
  );
});

type MetricProps = {
  title: string;
  value: string;
};

const Metric = memo(function Metric({ title, value }: MetricProps) {
  return (
    <article className="metric-item">
      <p>{title}</p>
      <strong>{value}</strong>
    </article>
  );
});

type StatLineProps = {
  label: string;
  value: string;
  language: AppLanguage;
};

const StatLine = memo(function StatLine({ label, value, language }: StatLineProps) {
  return (
    <p className="stat-line">
      <span>{label}</span>
      <strong>{toHumanStatus(value, language)}</strong>
    </p>
  );
});

type DenseRowsInfoProps = {
  visibleRows: number;
  totalRows: number;
  language: AppLanguage;
};

const DenseRowsInfo = memo(function DenseRowsInfo({
  visibleRows,
  totalRows,
  language
}: DenseRowsInfoProps) {
  const translate = createTranslator(language);
  return (
    <p className="dense-table-info">
      {translate("rowsShownLabel")} {visibleRows}/{totalRows}
    </p>
  );
});

function toHumanStatus(status: string, language: AppLanguage): string {
  return humanizeStatus(status, language);
}

function toStatusClass(status: string): string {
  if (status === "overdue" || status === "open") {
    return "critical";
  }
  if (status === "paid" || status === "resolved") {
    return "positive";
  }
  if (status === "draft" || status === "in_progress") {
    return "warning";
  }
  if (status === "high") {
    return "critical";
  }
  if (status === "medium") {
    return "warning";
  }
  if (status === "low") {
    return "positive";
  }
  if (status.includes("error") || status.includes("required")) {
    return "critical";
  }
  if (status.includes("saved") || status.includes("loaded") || status.includes("signed_in")) {
    return "positive";
  }
  if (status.includes("queued")) {
    return "warning";
  }
  return "neutral";
}

function normalizeVisibleRows(current: number, totalRows: number): number {
  if (totalRows <= 0) {
    return denseTableInitialRows;
  }
  const boundedCurrent = Math.max(denseTableInitialRows, current);
  return Math.min(boundedCurrent, totalRows);
}

function increaseVisibleRows(current: number, totalRows: number): number {
  if (totalRows <= 0) {
    return denseTableInitialRows;
  }
  return Math.min(totalRows, current + denseTableRowsStep);
}

function riskToStatusClass(riskLevel: "normal" | "attention"): string {
  return riskLevel === "normal" ? "positive" : "critical";
}

function runtimeStateDescription(
  runtimeState: EnterpriseRuntimeState,
  translate: (
    key:
      | "runtimeStateSuccessDescription"
      | "runtimeStateLoadingDescription"
      | "runtimeStateEmptyDescription"
      | "runtimeStateErrorDescription"
      | "runtimeStateOfflineDescription"
      | "runtimeStateDeniedDescription"
  ) => string
): string {
  switch (runtimeState) {
    case "success":
      return translate("runtimeStateSuccessDescription");
    case "loading":
      return translate("runtimeStateLoadingDescription");
    case "empty":
      return translate("runtimeStateEmptyDescription");
    case "error":
      return translate("runtimeStateErrorDescription");
    case "offline":
      return translate("runtimeStateOfflineDescription");
    case "denied":
      return translate("runtimeStateDeniedDescription");
    default:
      return translate("runtimeStateSuccessDescription");
  }
}

function readLanguagePreference(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  const storedLanguage = window.localStorage.getItem(languageStorageKey);
  if (storedLanguage !== null) {
    return storedLanguage;
  }
  return window.navigator.language;
}

function persistLanguagePreference(language: AppLanguage): void {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(languageStorageKey, language);
}

function readRolePreference(): DashboardRole {
  if (typeof window === "undefined") {
    return "athlete";
  }
  return resolveDashboardRole(window.localStorage.getItem(dashboardRoleStorageKey));
}

function persistRolePreference(role: DashboardRole): void {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(dashboardRoleStorageKey, role);
}

function readDomainPreference(): DashboardDomain {
  if (typeof window === "undefined") {
    return "onboarding";
  }
  const domainFromURL = readDashboardDomainFromURL(window.location.href);
  if (domainFromURL !== null) {
    return domainFromURL;
  }
  const persistedDomain = window.localStorage.getItem(dashboardDomainStorageKey);
  if (persistedDomain === null) {
    return readWebRuntimeMode() === "qa" ? "all" : "onboarding";
  }
  return resolveDashboardDomain(persistedDomain);
}

function persistDomainPreference(domain: DashboardDomain): void {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(dashboardDomainStorageKey, domain);
}

function persistDomainQueryParam(domain: DashboardDomain): void {
  if (typeof window === "undefined") {
    return;
  }
  const nextURL = applyDashboardDomainToURL(window.location.href, domain);
  if (nextURL !== window.location.href) {
    window.history.replaceState(null, "", nextURL);
  }
}

function clearDomainQueryParam(): void {
  if (typeof window === "undefined") {
    return;
  }
  const url = new URL(window.location.href);
  if (url.searchParams.has("domain") === false) {
    return;
  }
  url.searchParams.delete("domain");
  const nextSearch = url.searchParams.toString();
  const nextURL = `${url.pathname}${nextSearch.length > 0 ? `?${nextSearch}` : ""}${url.hash}`;
  const currentURL = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  if (nextURL !== currentURL) {
    window.history.replaceState(null, "", nextURL);
  }
}

function readWebRuntimeMode(): "qa" | "product" {
  const importMeta = import.meta as ImportMeta & {
    env?: Record<string, string | undefined>;
  };
  const rawValue = String(importMeta.env?.VITE_WEB_RUNTIME_MODE ?? "product")
    .trim()
    .toLowerCase();
  if (rawValue !== "qa") {
    return "product";
  }

  const qaUIEnabled = String(importMeta.env?.VITE_WEB_QA_UI_ENABLED ?? "0").trim() === "1";
  if (qaUIEnabled === false) {
    return "product";
  }

  if (typeof window === "undefined") {
    return "product";
  }

  // QA UI is isolated to a dedicated route to avoid accidental exposure in product runtime.
  const isQaRoute = window.location.pathname.startsWith("/__qa");
  if (isQaRoute === false) {
    return "product";
  }

  const params = new URLSearchParams(window.location.search);
  const qaUnlockStorageKey = "flux.web.qa.unlock";
  const unlockParam = params.get("unlockQa");
  if (unlockParam === "1") {
    window.localStorage.setItem(qaUnlockStorageKey, "1");
  } else if (unlockParam === "0") {
    window.localStorage.removeItem(qaUnlockStorageKey);
  }

  const isQaUnlocked = window.localStorage.getItem(qaUnlockStorageKey) === "1";
  if (isQaUnlocked === false) {
    return "product";
  }
  return params.get("qa") === "1" ? "qa" : "product";
}
