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
import { resolveAuthHeroStatus } from "./auth-feedback";
import { HeroAuthPanel } from "./HeroAuthPanel";
import { HeroStatusPanel } from "./HeroStatusPanel";
import { DomainFilterCard } from "./DomainFilterCard";
import { RuntimeStateCard } from "./RuntimeStateCard";
import { AccessGateCard } from "./AccessGateCard";
import { RuntimeStateBannerCard } from "./RuntimeStateBannerCard";
import { DashboardHomeCard } from "./DashboardHomeCard";
import { QuickActionsCard } from "./QuickActionsCard";
import { AlertCenterCard } from "./AlertCenterCard";
import { SystemStatusCard } from "./SystemStatusCard";
import { DashboardKpisCard } from "./DashboardKpisCard";
import { ReadinessMonitorCard } from "./ReadinessMonitorCard";
import { AlertsFullCard } from "./AlertsFullCard";
import { RecentActivityCard } from "./RecentActivityCard";
import { ShortcutsCard } from "./ShortcutsCard";
import { CohortAnalysisCard } from "./CohortAnalysisCard";
import { OnboardingCard } from "./OnboardingCard";
import { PlanBuilderPanel } from "./PlanBuilderPanel";
import { PlanTemplatesPanel } from "./PlanTemplatesPanel";
import { PlansSelectionPanel } from "./PlansSelectionPanel";
import { PublishReviewPanel } from "./PublishReviewPanel";
import { PlanAssignmentPanel } from "./PlanAssignmentPanel";
import { SessionActionsPanel } from "./SessionActionsPanel";
import { SessionDetailPanel } from "./SessionDetailPanel";
import { ExerciseLibraryPanel } from "./ExerciseLibraryPanel";
import { ExerciseDetailPanel } from "./ExerciseDetailPanel";
import { AthleteOperationsToolbar } from "./AthleteOperationsToolbar";
import { AthleteDetailPanel } from "./AthleteDetailPanel";
import { SessionHistoryPanel } from "./SessionHistoryPanel";
import { CompareProgressPanel } from "./CompareProgressPanel";
import { CoachNotesPanel } from "./CoachNotesPanel";
import { AthletesOperationsTablePanel } from "./AthletesOperationsTablePanel";
import { AdminUsersPanel } from "./AdminUsersPanel";
import { AuditTrailPanel } from "./AuditTrailPanel";
import { BillingSupportPanel } from "./BillingSupportPanel";
import { AIInsightsPanel } from "./AIInsightsPanel";
import { NutritionOverviewPanel } from "./NutritionOverviewPanel";
import { DailyLogReviewPanel } from "./DailyLogReviewPanel";
import { DeviationAlertsPanel } from "./DeviationAlertsPanel";
import { NutritionCoachPanel } from "./NutritionCoachPanel";
import { NutritionLogDetailPanel } from "./NutritionLogDetailPanel";
import { ProgressTrendsPanel } from "./ProgressTrendsPanel";
import { OfflineSyncPanel } from "./OfflineSyncPanel";
import { SettingsPanel } from "./SettingsPanel";
import { createAnalyticsOverviewScreenModel } from "./analytics-overview-contract";
import { createProgressTrendsScreenModel } from "./progress-trends-contract";
import { createCohortAnalysisScreenModel } from "./cohort-analysis-contract";
import { createAthleteFiltersScreenModel } from "./athlete-filters-contract";
import { createAthletesListScreenModel } from "./athletes-list-contract";
import { readWebRuntimeMode as evaluateWebRuntimeMode } from "./web-runtime-mode";
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
  const isQAMode = useMemo(() => resolveWebRuntimeMode() === "qa", []);
  const showQATools = isQAMode && hasAuthenticatedSession;
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
  const roleCapabilitiesSummary = useMemo(() => {
    if (roleCapabilitiesStatus !== "loaded" || roleCapabilities === null) {
      return toHumanStatus(roleCapabilitiesStatus, language);
    }
    return roleCapabilities.allowedDomains
      .filter((domain) => domain !== "all")
      .map((domain) => domainTabs.find((tab) => tab.id === domain)?.label ?? domain)
      .join(" · ");
  }, [domainTabs, language, roleCapabilities, roleCapabilitiesStatus]);
  const runtimeStateOptions = useMemo(
    () =>
      (["success", "loading", "empty", "error", "offline", "denied"] as const).map((state) => ({
        id: state,
        label: toHumanStatus(state, language)
      })),
    [language]
  );
  const productVisibleModules = useMemo<DashboardModule[]>(
    () => [
      "onboarding",
      "training",
      "recommendations",
      "nutrition",
      "progress",
      "settings"
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
  const selectedAthleteSessionHistoryCards = useMemo(
    () =>
      selectedAthleteSessionHistoryRows.map((session) => {
        const durationMinutes = Math.max(
          0,
          Math.round(
            (new Date(session.endedAt).getTime() - new Date(session.startedAt).getTime()) /
              (60 * 1000)
          )
        );
        return {
          key: `${session.userId}-${session.planId}-${session.startedAt}`,
          athleteId: session.userId,
          planId: session.planId,
          startedAt: new Date(session.startedAt).toLocaleString(),
          endedAt: new Date(session.endedAt).toLocaleString(),
          durationMinutes,
          exercisesCount: session.exercises.length
        };
      }),
    [selectedAthleteSessionHistoryRows]
  );
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
  const sessionDetailOptions = useMemo(
    () =>
      sessionSelectionRows.map((row) => ({
        key: row.key,
        label: `${row.session.planId} · ${row.session.startedAt.slice(0, 10)}`
      })),
    [sessionSelectionRows]
  );
  const selectedSessionSummary = useMemo(() => {
    if (selectedSession === null) {
      return null;
    }
    const durationInMinutes = Math.max(
      0,
      Math.round((Date.parse(selectedSession.endedAt) - Date.parse(selectedSession.startedAt)) / 60000)
    );
    return {
      planId: selectedSession.planId,
      startedAt: selectedSession.startedAt,
      endedAt: selectedSession.endedAt,
      durationLabel: `${durationInMinutes}m`,
      exerciseCount: String(selectedSession.exercises.length)
    };
  }, [selectedSession]);
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
    const labelByStatus: Partial<Record<BillingInvoiceStatusFilter, string>> = {
      draft: translate("billingInvoiceStatusDraft"),
      open: translate("billingInvoiceStatusOpen"),
      paid: translate("billingInvoiceStatusPaid"),
      overdue: translate("billingInvoiceStatusOverdue")
    };
    return labelByStatus[status] ?? translate("billingFilterAllInvoiceStatuses");
  }

  function incidentStateLabel(status: SupportIncidentStateFilter): string {
    const labelByState: Partial<Record<SupportIncidentStateFilter, string>> = {
      open: translate("billingIncidentStateOpen"),
      in_progress: translate("billingIncidentStateInProgress"),
      resolved: translate("billingIncidentStateResolved")
    };
    return labelByState[status] ?? translate("billingFilterAllIncidentStates");
  }

  function incidentSeverityLabel(status: SupportIncidentSeverityFilter): string {
    const labelBySeverity: Partial<Record<SupportIncidentSeverityFilter, string>> = {
      high: translate("billingIncidentSeverityHigh"),
      medium: translate("billingIncidentSeverityMedium"),
      low: translate("billingIncidentSeverityLow")
    };
    return labelBySeverity[status] ?? translate("billingFilterAllIncidentSeverities");
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

    const recoveryByDomain: Record<DashboardDomain, () => Promise<void> | void> = {
      onboarding: () => {
        setActiveSession(null);
        setAuthStatus("signed_out");
        setOnboardingStatus("idle");
      },
      training: () => {
        setTrainingStatus("idle");
        setSessionStatus("idle");
        setVideoStatus("idle");
      },
      nutrition: () => {
        setNutritionStatus("idle");
      },
      progress: () => {
        setProgressStatus("idle");
      },
      operations: async () => {
        setSyncStatus("idle");
        setObservabilityStatus("idle");
        setRecommendationsStatus("idle");
        await refreshPendingQueue();
      },
      all: () => {}
    };
    await recoveryByDomain[activeDomain]();
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

  const heroAuthMetricValue = hasAuthenticatedSession
    ? language === "es"
      ? "activa"
      : "active"
    : language === "es"
      ? "pendiente"
      : "pending";

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
            <HeroAuthPanel
              isAuthLoading={isAuthLoading}
              email={email}
              password={password}
              emailPlaceholder={translate("emailPlaceholder")}
              passwordPlaceholder={translate("passwordPlaceholder")}
              signInWithAppleLabel={translate("signInWithApple")}
              signInWithEmailLabel={translate("signInWithEmail")}
              recoverByEmailLabel={translate("recoverByEmail")}
              recoverBySMSLabel={translate("recoverBySMS")}
              authStatusLabel={resolveAuthHeroStatus({
                authStatus,
                hasAuthenticatedSession,
                language
              })}
              actionIds={{
                apple: signInScreenModel.actions.apple,
                email: signInScreenModel.actions.email,
                recoverEmail: signInScreenModel.actions.recoverEmail,
                recoverSMS: signInScreenModel.actions.recoverSMS,
                status: signInScreenModel.statusId
              }}
              onAppleSignIn={handleAppleSignIn}
              onEmailChange={setEmail}
              onPasswordChange={setPassword}
              onEmailSignIn={() => {
                void handleEmailSignIn();
              }}
              onEmailRecovery={handleEmailRecovery}
            />
          </div>
          <HeroStatusPanel
            language={language}
            showQATools={showQATools}
            webLane={webLane}
            readinessScore={readiness.score}
            readinessStateLabel={readinessLabel(readiness.label, language)}
            labels={{
              language: translate("languageLabel"),
              lane: translate("laneLabel"),
              laneMain: translate("laneMain"),
              laneSecondary: translate("laneSecondary"),
              readiness: translate("readinessLabel"),
              authMetric: translate("authMetric"),
              queueMetric: translate("queueMetric"),
              goalMetric: translate("goalMetric"),
              syncMetric: translate("syncMetric"),
              runtimeMetric: translate("runtimeStateModeLabel")
            }}
            values={{
              goal: goalLabel(goal, language),
              auth: heroAuthMetricValue,
              queue: String(pendingQueueCount),
              sync: humanizeStatus(syncStatus, language),
              runtime: toHumanStatus(runtimeStateForUI, language)
            }}
            hasAuthenticatedSession={hasAuthenticatedSession}
            onLanguageChange={setLanguage}
            onWebLaneChange={setWebLane}
          />
        </section>

        {releaseCompatibilityStatus === "upgrade_required" ? (
          <section className="status-banner critical">
            <strong>{translate("updateRequiredTitle")}</strong>
            <p>{translate("updateRequiredCopy")}</p>
          </section>
        ) : null}

        {showQATools ? (
          <DomainFilterCard
            label={translate("domainFilterLabel")}
            tabs={domainTabsForUI}
            activeDomain={activeDomainForUI}
            onDomainSelect={handleDomainSelection}
            roleLabel={translate("roleLabel")}
            activeRole={activeRole}
            roleOptions={roleOptions}
            onRoleChange={setActiveRole}
            roleCapabilitySummary={roleCapabilitiesSummary}
            roleCapabilitiesStatus={roleCapabilitiesStatus}
            retryRoleCapabilitiesLabel={translate("retryRoleCapabilities")}
            onRetryRoleCapabilities={() =>
              setRoleCapabilitiesReloadNonce((current) => current + 1)
            }
          />
        ) : null}

        {showQATools ? (
          <RuntimeStateCard
            title={translate("runtimeStateSectionTitle")}
            statusClass={toStatusClass(activeDomainRuntimeState)}
            statusLabel={toHumanStatus(activeDomainRuntimeState, language)}
            modeLabel={translate("runtimeStateModeLabel")}
            activeDomain={activeDomain}
            value={activeDomainRuntimeState}
            options={runtimeStateOptions}
            onChange={setActiveDomainRuntimeState}
            recoverLabel={translate("runtimeStateRecoveryAction")}
            recoverDisabled={activeDomain === "all" || activeDomainRuntimeState === "success"}
            onRecover={() => {
              void recoverActiveDomainState();
            }}
            copy={
              activeDomain === "all"
                ? translate("runtimeStateHintAllDomains")
                : runtimeStateDescription(activeDomainRuntimeState, translate)
            }
          />
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
              <AccessGateCard
                screenId={accessGateScreenModel.screenId}
                routeId={accessGateScreenModel.routeId}
                title={translate("heroTitle")}
                summary={translate("heroCopy")}
                hint={
                  language === "es"
                    ? "Acceso requerido para cargar el dashboard operativo."
                    : "Access required to load the operational dashboard."
                }
                signInWithAppleLabel={translate("signInWithApple")}
                signInWithEmailLabel={translate("signInWithEmail")}
                appleActionId={accessGateAppleActionId}
                emailActionId={accessGateEmailActionId}
                onAppleSignIn={handleAppleSignIn}
                onEmailSignIn={handleEmailSignIn}
              />
            ) : null
          ) : runtimeStateForUI !== "success" ? (
            <RuntimeStateBannerCard
              title={translate("runtimeStateSectionTitle")}
              statusLabel={translate("runtimeStateModeLabel")}
              statusValue={toHumanStatus(runtimeStateForUI, language)}
              statusClass={toStatusClass(runtimeStateForUI)}
              copy={runtimeStateDescription(runtimeStateForUI, translate)}
              actionLabel={translate("runtimeStateRecoveryAction")}
              onRecover={() => {
                void recoverActiveDomainState();
              }}
            />
          ) : (
            <>
              {isQAMode ? (
                <>
                  <DashboardHomeCard
                    screenId={dashboardHomeScreenModel.screenId}
                    routeId={dashboardHomeScreenModel.routeId}
                    title={translate("dashboardHomeTitle")}
                    statusLabel={translate("dashboardHomeStatusLabel")}
                    statusValue={toHumanStatus(dashboardHomeScreenModel.status, language)}
                    statusClass={toStatusClass(dashboardHomeScreenModel.status)}
                    summary={translate("dashboardHomeSummary")}
                    visibleModulesLabel={translate("dashboardHomeVisibleModulesLabel")}
                    visibleModulesValue={String(dashboardHomeScreenModel.visibleModulesCount)}
                    activeDomainLabel={translate("dashboardHomeActiveDomainLabel")}
                    activeDomainValue={
                      domainTabs.find((tab) => tab.id === dashboardHomeScreenModel.activeDomain)
                        ?.label ?? dashboardHomeScreenModel.activeDomain
                    }
                    refreshActionId="web.dashboardHome.refresh"
                    refreshLabel={translate("dashboardHomeRefreshAction")}
                    refreshDisabled={dashboardHomeScreenModel.status === "loading"}
                    onRefresh={() => {
                      void handleRefreshDashboardHome();
                    }}
                  />
              <QuickActionsCard
                screenId={quickActionsScreenModel.screenId}
                routeId={quickActionsScreenModel.routeId}
                title={translate("quickActionsTitle")}
                statusLabel={translate("quickActionsStatusLabel")}
                statusValue={toHumanStatus(quickActionsScreenModel.status, language)}
                statusClass={toStatusClass(quickActionsScreenModel.status)}
                summary={translate("quickActionsSummary")}
                runAllActionId={quickActionsScreenModel.actions.runAll}
                runAllLabel={translate("quickActionsRunAll")}
                runAllDisabled={quickActionsScreenModel.status === "loading"}
                onRunAll={() => {
                  void handleRunQuickActions();
                }}
                refreshActionId={quickActionsScreenModel.actions.refreshDashboard}
                refreshLabel={translate("dashboardHomeRefreshAction")}
                refreshDisabled={quickActionsScreenModel.status === "loading"}
                onRefresh={() => {
                  void handleRefreshDashboardHome();
                }}
                loadPlansActionId={quickActionsScreenModel.actions.loadPlans}
                loadPlansLabel={translate("loadPlans")}
                onLoadPlans={() => {
                  void handleLoadPlans();
                }}
                loadSessionsActionId={quickActionsScreenModel.actions.loadSessions}
                loadSessionsLabel={translate("loadSessions")}
                onLoadSessions={() => {
                  void handleLoadSessions();
                }}
                loadRecommendationsActionId={quickActionsScreenModel.actions.loadRecommendations}
                loadRecommendationsLabel={translate("loadRecommendations")}
                onLoadRecommendations={() => {
                  void handleLoadRecommendations();
                }}
              />
              <AlertCenterCard
                screenId={alertCenterScreenModel.screenId}
                routeId={alertCenterScreenModel.routeId}
                title={translate("alertCenterTitle")}
                statusLabel={translate("alertCenterStatusLabel")}
                statusValue={toHumanStatus(alertCenterScreenModel.status, language)}
                statusClass={toStatusClass(alertCenterScreenModel.status)}
                summary={translate("alertCenterSummary")}
                openCountLabel={translate("alertCenterOpenCountLabel")}
                openCountValue={String(openOperationalAlerts.length)}
                highSeverityLabel={translate("alertCenterHighSeverityLabel")}
                highSeverityValue={String(
                  openOperationalAlerts.filter((alert) => alert.severity === "critical").length
                )}
                runbooksLabel={translate("alertCenterRunbooksLabel")}
                runbooksValue={String(operationalRunbooks.length)}
                loadActionId={alertCenterScreenModel.actions.load}
                loadLabel={translate("alertCenterLoadAction")}
                onLoad={() => {
                  void handleRefreshAlertCenter();
                }}
                auditActionId={alertCenterScreenModel.actions.audit}
                auditLabel={translate("alertCenterAuditAction")}
                onAudit={() => {
                  void handleLoadAuditTimeline();
                }}
                noAlertsLabel={translate("alertCenterNoAlerts")}
                occurredAtLabel={translate("auditOccurredAtColumn")}
                severityLabel={translate("auditSeverityColumn")}
                summaryLabel={translate("auditSummaryColumn")}
                rows={openOperationalAlerts.slice(0, 3).map((alert) => ({
                  id: alert.id,
                  occurredAt: new Date(alert.triggeredAt).toLocaleString(),
                  severity: toHumanStatus(alert.severity, language),
                  summary: alert.summary
                }))}
              />
              <SystemStatusCard
                screenId={systemStatusScreenModel.screenId}
                routeId={systemStatusScreenModel.routeId}
                title={translate("systemStatusTitle")}
                statusLabel={translate("systemStatusStatusLabel")}
                statusValue={toHumanStatus(systemStatusScreenModel.status, language)}
                statusClass={toStatusClass(systemStatusScreenModel.status)}
                summary={translate("systemStatusSummary")}
                runtimeLabel={translate("systemStatusRuntimeLabel")}
                runtimeValue={toHumanStatus(activeDomainRuntimeState, language)}
                releaseLabel={translate("systemStatusReleaseLabel")}
                releaseValue={toHumanStatus(releaseCompatibilityStatus, language)}
                roleMatrixLabel={translate("systemStatusRoleMatrixLabel")}
                roleMatrixValue={toHumanStatus(roleCapabilitiesStatus, language)}
                queueLabel={translate("systemStatusQueueLabel")}
                queueValue={String(pendingQueueCount)}
                syncQueueActionId={systemStatusScreenModel.actions.syncQueue}
                syncQueueLabel={translate("syncQueue")}
                onSyncQueue={() => {
                  void handleSyncOfflineQueue();
                }}
                recoverDomainActionId={systemStatusScreenModel.actions.recoverDomain}
                recoverDomainLabel={translate("runtimeStateRecoveryAction")}
                onRecoverDomain={() => {
                  void recoverActiveDomainState();
                }}
                reloadCapabilitiesActionId={systemStatusScreenModel.actions.reloadCapabilities}
                reloadCapabilitiesLabel={translate("retryRoleCapabilities")}
                onReloadCapabilities={handleReloadRoleCapabilitiesMatrix}
              />
              <DashboardKpisCard
                screenId={dashboardKpisScreenModel.screenId}
                routeId={dashboardKpisScreenModel.routeId}
                title={translate("dashboardKpisTitle")}
                statusLabel={translate("dashboardKpisStatusLabel")}
                statusValue={toHumanStatus(dashboardKpisScreenModel.status, language)}
                statusClass={toStatusClass(dashboardKpisScreenModel.status)}
                summary={translate("dashboardKpisSummary")}
                planLabel={translate("planStatusLabel")}
                planValue={String(plans.length)}
                sessionLabel={translate("sessionStatusLabel")}
                sessionValue={String(sessions.length)}
                nutritionLabel={translate("nutritionStatusLabel")}
                nutritionValue={String(nutritionLogs.length)}
                recommendationsLabel={translate("recommendationsStatusLabel")}
                recommendationsValue={String(recommendations.length)}
                openAlertsLabel={translate("alertCenterOpenCountLabel")}
                openAlertsValue={String(openOperationalAlerts.length)}
                queueLabel={translate("queueMetric")}
                queueValue={String(pendingQueueCount)}
                refreshActionId={dashboardKpisScreenModel.actions.refresh}
                refreshLabel={translate("dashboardKpisRefreshAction")}
                refreshDisabled={dashboardKpisScreenModel.status === "loading"}
                onRefresh={() => {
                  void handleRefreshDashboardKpis();
                }}
              />
              <ReadinessMonitorCard
                screenId={readinessMonitorScreenModel.screenId}
                routeId={readinessMonitorScreenModel.routeId}
                title={translate("readinessMonitorTitle")}
                statusLabel={translate("readinessMonitorStatusLabel")}
                statusValue={toHumanStatus(readinessMonitorScreenModel.status, language)}
                statusClass={toStatusClass(readinessMonitorScreenModel.status)}
                summary={translate("readinessMonitorSummary")}
                scoreLabel={translate("readinessMonitorScoreLabel")}
                scoreValue={`${readiness.score}%`}
                readinessLabel={translate("readinessLabel")}
                readinessValue={readinessLabel(readiness.label, language)}
                authLabel={translate("authMetric")}
                authValue={toHumanStatus(authStatus, language)}
                queueLabel={translate("queueMetric")}
                queueValue={String(pendingQueueCount)}
                refreshActionId={readinessMonitorScreenModel.actions.refresh}
                refreshLabel={translate("readinessMonitorRefreshAction")}
                refreshDisabled={readinessMonitorScreenModel.status === "loading"}
                onRefresh={() => {
                  void handleRefreshReadinessMonitor();
                }}
              />
              <AlertsFullCard
                screenId={alertsFullScreenModel.screenId}
                routeId={alertsFullScreenModel.routeId}
                title={translate("alertsFullTitle")}
                statusLabel={translate("alertsFullStatusLabel")}
                statusValue={toHumanStatus(alertsFullScreenModel.status, language)}
                statusClass={toStatusClass(alertsFullScreenModel.status)}
                summary={translate("alertsFullSummary")}
                openCountLabel={translate("alertCenterOpenCountLabel")}
                openCountValue={String(openOperationalAlerts.length)}
                runbooksLabel={translate("alertCenterRunbooksLabel")}
                runbooksValue={String(operationalRunbooks.length)}
                activityLabel={translate("auditActivityLogLabel")}
                activityValue={String(activityLogEntries.length)}
                highSeverityLabel={translate("alertCenterHighSeverityLabel")}
                highSeverityValue={String(
                  openOperationalAlerts.filter((alert) => alert.severity === "critical").length
                )}
                refreshActionId={alertsFullScreenModel.actions.refresh}
                refreshLabel={translate("alertsFullRefreshAction")}
                onRefresh={() => {
                  void handleRefreshAlertsFull();
                }}
                auditActionId={alertsFullScreenModel.actions.audit}
                auditLabel={translate("alertsFullAuditAction")}
                onAudit={() => {
                  void handleLoadAuditTimeline();
                }}
                emptyLabel={translate("alertsFullNoAlerts")}
                occurredAtLabel={translate("auditOccurredAtColumn")}
                severityLabel={translate("auditSeverityColumn")}
                codeLabel={translate("alertsFullCodeLabel")}
                runbookLabel={translate("alertsFullRunbookLabel")}
                summaryLabel={translate("auditSummaryColumn")}
                rows={openOperationalAlerts.slice(0, 6).map((alert) => ({
                  id: alert.id,
                  occurredAt: new Date(alert.triggeredAt).toLocaleString(),
                  severity: toHumanStatus(alert.severity, language),
                  code: alert.code,
                  runbook: runbookTitleById[alert.runbookId] ?? alert.runbookId,
                  summary: alert.summary
                }))}
              />
              <RecentActivityCard
                screenId={recentActivityScreenModel.screenId}
                routeId={recentActivityScreenModel.routeId}
                title={translate("recentActivityTitle")}
                statusLabel={translate("recentActivityStatusLabel")}
                statusValue={toHumanStatus(recentActivityScreenModel.status, language)}
                statusClass={toStatusClass(recentActivityScreenModel.status)}
                summary={translate("recentActivitySummary")}
                activityLabel={translate("auditActivityLogLabel")}
                activityValue={String(recentActivityRows.length)}
                deniedLabel={translate("recentActivityDeniedLabel")}
                deniedValue={String(
                  recentActivityRows.filter((entry) => entry.outcome === "denied").length
                )}
                errorLabel={translate("recentActivityErrorLabel")}
                errorValue={String(
                  recentActivityRows.filter((entry) => entry.outcome === "error").length
                )}
                lastOccurredLabel={translate("auditOccurredAtColumn")}
                lastOccurredValue={
                  latestRecentActivityRow
                    ? new Date(latestRecentActivityRow.occurredAt).toLocaleString()
                    : "-"
                }
                refreshActionId="web.recentActivity.refresh"
                refreshLabel={translate("recentActivityRefreshAction")}
                onRefresh={() => {
                  void handleRefreshRecentActivity();
                }}
                emptyLabel={translate("recentActivityNoEntries")}
                occurredAtLabel={translate("auditOccurredAtColumn")}
                nameLabel={translate("auditNameColumn")}
                domainLabel={translate("auditDomainColumn")}
                outcomeLabel={translate("recentActivityOutcomeLabel")}
                summaryLabel={translate("auditSummaryColumn")}
                rows={recentActivityRows.slice(0, 8).map((entry) => ({
                  id: entry.id,
                  occurredAt: new Date(entry.occurredAt).toLocaleString(),
                  action: entry.action,
                  domain: entry.domain,
                  outcome: toHumanStatus(entry.outcome, language),
                  summary: entry.summary
                }))}
              />
              <ShortcutsCard
                screenId={shortcutsScreenModel.screenId}
                routeId={shortcutsScreenModel.routeId}
                title={translate("shortcutsTitle")}
                statusLabel={translate("shortcutsStatusLabel")}
                statusValue={toHumanStatus(shortcutsScreenModel.status, language)}
                statusClass={toStatusClass(shortcutsScreenModel.status)}
                summary={translate("shortcutsSummary")}
                showQATools={isQAMode}
                visibleModulesLabel={translate("shortcutsVisibleModulesLabel")}
                visibleModulesValue={String(visibleModulesForDomain.length)}
                roleLabel={translate("roleLabel")}
                roleValue={activeRole}
                domainLabel={translate("domainFilterLabel")}
                domainValue={activeDomainForUI}
                queueLabel={translate("queueMetric")}
                queueValue={String(pendingQueueCount)}
                runActionId="web.shortcuts.run"
                runLabel={translate("shortcutsRunAction")}
                onRun={() => {
                  void handleRunShortcuts();
                }}
                refreshActionId="web.shortcuts.refresh"
                refreshLabel={translate("shortcutsRefreshAction")}
                onRefresh={() => {
                  void handleRefreshDashboardHome();
                }}
                recoverActionId="web.shortcuts.recoverDomain"
                recoverLabel={translate("shortcutsRecoverAction")}
                onRecover={() => {
                  void recoverActiveDomainState();
                }}
                emptyLabel={translate("shortcutsNoItems")}
                modules={visibleModulesForDomain}
              />
              <CohortAnalysisCard
                screenId={cohortAnalysisScreenModel.screenId}
                routeId={cohortAnalysisScreenModel.routeId}
                title={translate("cohortAnalysisTitle")}
                statusLabel={translate("cohortAnalysisStatusLabel")}
                statusValue={toHumanStatus(cohortAnalysisScreenModel.status, language)}
                statusClass={toStatusClass(cohortAnalysisScreenModel.status)}
                summary={translate("cohortAnalysisSummary")}
                sizeLabel={translate("cohortAnalysisSizeLabel")}
                sizeValue={String(athleteOperationRowsBase.length)}
                attentionLabel={translate("cohortAnalysisAttentionLabel")}
                attentionValue={String(cohortAttentionCount)}
                normalLabel={translate("cohortAnalysisNormalLabel")}
                normalValue={String(cohortNormalCount)}
                averageSessionsLabel={translate("cohortAnalysisAvgSessionsLabel")}
                averageSessionsValue={String(cohortAverageSessions)}
                refreshActionId={cohortAnalysisScreenModel.actions.refresh}
                refreshLabel={translate("cohortAnalysisRefreshAction")}
                onRefresh={() => {
                  void handleRefreshCohortAnalysis();
                }}
                refreshDisabled={cohortAnalysisScreenModel.status === "loading"}
                emptyLabel={translate("cohortAnalysisNoRows")}
                athleteLabel={translate("athleteColumn")}
                plansLabel={translate("plansColumn")}
                sessionsLabel={translate("sessionsColumn")}
                nutritionLabel={translate("nutritionColumn")}
                riskLabel={translate("riskColumn")}
                rows={athleteOperationRowsBase.slice(0, 6).map((row) => ({
                  id: `cohort-${row.athleteId}`,
                  athleteId: row.athleteId,
                  plansCount: row.plansCount,
                  sessionsCount: row.sessionsCount,
                  nutritionLogsCount: row.nutritionLogsCount,
                  riskLevel: toHumanStatus(row.riskLevel, language)
                }))}
              />
              {visibleModulesForDomain.length === 0 ? (
                <article className="module-card">
                  <p className="empty-state">{translate("noModulesForSelectedDomain")}</p>
                </article>
              ) : null}
                </>
              ) : null}
          {canRenderOperationalModules && isModuleVisibleForUI("onboarding") ? (
            <OnboardingCard
              title={translate("onboardingSectionTitle")}
              statusLabel={translate("onboardingStatusLabel")}
              statusValue={toHumanStatus(onboardingStatus, language)}
              statusClass={toStatusClass(onboardingStatus)}
              displayNameLabel={translate("displayNamePlaceholder")}
              displayName={displayName}
              onDisplayNameChange={setDisplayName}
              ageLabel={translate("agePlaceholder")}
              age={age}
              onAgeChange={setAge}
              heightLabel={translate("heightPlaceholder")}
              height={heightCm}
              onHeightChange={setHeightCm}
              weightLabel={translate("weightPlaceholder")}
              weight={weightKg}
              onWeightChange={setWeightKg}
              daysPerWeekLabel={translate("daysPerWeekPlaceholder")}
              daysPerWeek={availableDaysPerWeek}
              onDaysPerWeekChange={setAvailableDaysPerWeek}
              goalLabel={translate("goalPickerLabel")}
              goal={goal}
              goalOptions={{
                fatLoss: goalLabel("fat_loss", language),
                recomposition: goalLabel("recomposition", language),
                muscleGain: goalLabel("muscle_gain", language),
                habit: goalLabel("habit", language)
              }}
              onGoalChange={setGoal}
              parQ1Label={translate("parQQuestionOne")}
              parQ1={parQ1}
              onParQ1Change={setParQ1}
              parQ2Label={translate("parQQuestionTwo")}
              parQ2={parQ2}
              onParQ2Change={setParQ2}
              privacyPolicyLabel={translate("acceptPrivacyPolicy")}
              privacyPolicyAccepted={privacyPolicyAccepted}
              onPrivacyPolicyChange={setPrivacyPolicyAccepted}
              termsLabel={translate("acceptTerms")}
              termsAccepted={termsAccepted}
              onTermsChange={setTermsAccepted}
              medicalDisclaimerLabel={translate("acceptMedicalDisclaimer")}
              medicalDisclaimerAccepted={medicalDisclaimerAccepted}
              onMedicalDisclaimerChange={setMedicalDisclaimerAccepted}
              completeLabel={translate("completeOnboarding")}
              onComplete={handleCompleteOnboarding}
              saveConsentLabel={translate("saveConsent")}
              onSaveConsent={handleSubmitLegalConsent}
              exportDataLabel={translate("exportData")}
              onExportData={handleExportData}
            />
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
              <PlanBuilderPanel
                screenId={planBuilderScreenModel.screenId}
                routeId={planBuilderScreenModel.routeId}
                title={translate("planBuilderTitle")}
                planNameLabel={translate("planNamePlaceholder")}
                planNameValue={planName}
                planNameActionId={planBuilderScreenModel.actions.updateName}
                onPlanNameChange={setPlanName}
                weeksLabel={translate("planBuilderWeeksLabel")}
                weeksValue={planBuilderWeeksInput}
                weeksActionId={planBuilderScreenModel.actions.updateWeeks}
                onWeeksChange={setPlanBuilderWeeksInput}
                daysLabel={translate("planBuilderDaysLabel")}
                daysValue={planBuilderDaysInput}
                daysActionId={planBuilderScreenModel.actions.updateDays}
                onDaysChange={setPlanBuilderDaysInput}
                templateLabel={translate("planBuilderTemplateLabel")}
                templateValue={planBuilderTemplate}
                templateActionId={planBuilderScreenModel.actions.updateTemplate}
                onTemplateChange={(value) => setPlanBuilderTemplate(value as PlanBuilderTemplate)}
                templateOptions={{
                  strength: translate("planBuilderTemplateStrength"),
                  hypertrophy: translate("planBuilderTemplateHypertrophy"),
                  recomposition: translate("planBuilderTemplateRecomposition")
                }}
                createLabel={translate("createPlan")}
                createActionId={planBuilderScreenModel.actions.createPlan}
                onCreate={handleCreatePlan}
                loadLabel={translate("loadPlans")}
                loadActionId={planBuilderScreenModel.actions.loadPlans}
                onLoad={handleLoadPlans}
                previewTitle={translate("planBuilderPreviewTitle")}
                previewDaysLabel={translate("planBuilderPreviewDaysLabel")}
                previewDaysValue={
                  normalizedPlanBuilderDays === null ? "-" : String(normalizedPlanBuilderDays)
                }
                previewExercisesLabel={translate("planBuilderPreviewExercisesLabel")}
                previewExercisesValue={String(planBuilderDayExercises.length)}
                validationCopy={
                  hasPlanBuilderValidationError
                    ? translate("planBuilderInvalidConfiguration")
                    : null
                }
              />
              <PlanTemplatesPanel
                screenId={planTemplatesScreenModel.screenId}
                routeId={planTemplatesScreenModel.routeId}
                statusId="web.light.planTemplates.status"
                title={translate("planTemplatesTitle")}
                statusLabel={translate("planTemplatesStatusLabel")}
                statusClass={toStatusClass(planTemplatesScreenModel.status)}
                statusValue={toHumanStatus(planTemplatesScreenModel.status, language)}
                showStatus={resolveWebRuntimeMode() === "qa"}
                summary={translate("planTemplatesSummary")}
                loadLabel={translate("planTemplatesLoadAction")}
                loadActionId={planTemplatesScreenModel.actions.loadTemplates}
                onLoad={handleLoadPlanTemplates}
                applyLabel={translate("planTemplatesApplyAction")}
                applyActionId={planTemplatesScreenModel.actions.applyTemplate}
                onApply={handleApplyPlanTemplate}
                clearLabel={translate("planTemplatesClearAction")}
                clearActionId={planTemplatesScreenModel.actions.clearSelection}
                onClear={handleClearPlanTemplateSelection}
                isSelectionEmpty={selectedPlanTemplateOption === null}
                noSelectionLabel={translate("planTemplatesNoSelection")}
                options={planTemplateOptions}
                selectedTemplate={selectedPlanTemplate}
                selectActionId={planTemplatesScreenModel.actions.selectTemplate}
                onSelectTemplate={(template) => {
                  setSelectedPlanTemplate(template);
                  setPlanTemplatesStatus("loaded");
                }}
                strengthLabel={translate("planBuilderTemplateStrength")}
                hypertrophyLabel={translate("planBuilderTemplateHypertrophy")}
                recompositionLabel={translate("planBuilderTemplateRecomposition")}
                weeksLabel={translate("planTemplatesWeeksLabel")}
                daysLabel={translate("planTemplatesDaysLabel")}
                focusLabel={translate("planTemplatesFocusLabel")}
                selectedOption={selectedPlanTemplateOption}
              />
              <PublishReviewPanel
                screenId={publishReviewScreenModel.screenId}
                routeId={publishReviewScreenModel.routeId}
                statusId="web.light.publishReview.status"
                title={translate("publishReviewTitle")}
                statusLabel={translate("publishReviewStatusLabel")}
                statusClass={toStatusClass(publishReviewScreenModel.status)}
                statusValue={toHumanStatus(publishReviewScreenModel.status, language)}
                showStatus={resolveWebRuntimeMode() === "qa"}
                summary={translate("publishReviewSummary")}
                previewLabel={translate("publishReviewPreviewAction")}
                previewActionId={publishReviewScreenModel.actions.previewPlan}
                onPreview={handlePreviewPublishPlan}
                checklistLabel={translate("publishReviewChecklistAction")}
                checklistActionId={publishReviewScreenModel.actions.runChecklist}
                onRunChecklist={handleRunPublishChecklist}
                publishLabel={translate("publishReviewPublishAction")}
                publishActionId={publishReviewScreenModel.actions.publishPlan}
                onPublish={handlePublishPlanReview}
                publishDisabled={publishChecklistAcknowledged === false || selectedPlan === null}
                clearLabel={translate("publishReviewClearAction")}
                clearActionId={publishReviewScreenModel.actions.clearReview}
                onClear={handleClearPublishReview}
                checklistItems={publishChecklistItems}
                checklistOkLabel={translate("publishReviewCheckOk")}
                checklistPendingLabel={translate("publishReviewCheckPending")}
                planMetricLabel={translate("publishReviewPlanLabel")}
                planMetricValue={selectedPlan?.name ?? "-"}
                checklistMetricLabel={translate("publishReviewChecklistLabel")}
                checklistMetricValue={
                  isPublishChecklistReady
                    ? translate("publishReviewCheckOk")
                    : translate("publishReviewCheckPending")
                }
                resultMetricLabel={translate("publishReviewResultLabel")}
                resultMetricValue={publishedPlanId ?? "-"}
                noResultLabel={translate("publishReviewNoResult")}
                publishedPrefix={translate("publishReviewPublishedPrefix")}
                publishedId={publishedPlanId}
              />
              <PlansSelectionPanel
                plansCountLabel={translate("plansLoadedLabel")}
                plansCountValue={String(plans.length)}
                noPlansLabel={translate("noPlansLoaded")}
                plans={plans}
                selectedPlanId={selectedPlanId}
                selectActionId={plansListScreenModel.actions.selectPlan}
                onSelectPlan={setSelectedPlanId}
                weeksSuffix={translate("planTemplatesWeeksLabel")}
              />
              <PlanAssignmentPanel
                screenId={planAssignmentScreenModel.screenId}
                routeId={planAssignmentScreenModel.routeId}
                statusId="web.planAssignment.status"
                title={translate("planAssignmentTitle")}
                statusLabel={translate("planAssignmentStatusLabel")}
                statusClass={toStatusClass(planAssignmentScreenModel.status)}
                statusValue={toHumanStatus(planAssignmentScreenModel.status, language)}
                showStatus={resolveWebRuntimeMode() === "qa"}
                summary={translate("planAssignmentSummary")}
                planLabel={translate("planAssignmentPlanLabel")}
                planValue={selectedPlan?.name ?? "-"}
                selectedAthletesLabel={translate("planAssignmentSelectedAthletesLabel")}
                selectedAthletesValue={String(selectedAthleteRows.length)}
                atRiskAthletesLabel={translate("planAssignmentAtRiskAthletesLabel")}
                atRiskAthletesValue={String(atRiskAthleteRows.length)}
                assignSelectedLabel={translate("planAssignmentAssignSelectedAction")}
                assignSelectedActionId={planAssignmentScreenModel.actions.assignSelected}
                onAssignSelected={handleBulkAssignStarterPlan}
                assignSelectedDisabled={selectedPlan === null || selectedAthleteRows.length === 0}
                assignAtRiskLabel={translate("planAssignmentAssignAtRiskAction")}
                assignAtRiskActionId={planAssignmentScreenModel.actions.assignAtRisk}
                onAssignAtRisk={handleAssignPlanToAtRiskAthletes}
                assignAtRiskDisabled={selectedPlan === null || atRiskAthleteRows.length === 0}
                clearLabel={translate("planAssignmentClearAction")}
                clearActionId={planAssignmentScreenModel.actions.clearSelection}
                onClear={handleClearAthleteSelection}
                clearDisabled={selectedAthleteRows.length === 0}
                noSelectionLabel={translate("planAssignmentNoSelection")}
                selectedListTitle={translate("planAssignmentSelectedListTitle")}
                selectedRows={selectedAthleteRows}
                sessionsLabel={translate("sessionsColumn")}
                plansLabel={translate("plansColumn")}
              />
              <SessionActionsPanel
                logWorkoutLabel={translate("logWorkout")}
                onLogWorkout={handleLogWorkoutSession}
                loadSessionsLabel={translate("loadSessions")}
                loadSessionsActionId={sessionDetailScreenModel.actions.loadSessions}
                onLoadSessions={handleLoadSessions}
                sessionStatusLabel={translate("sessionStatusLabel")}
                sessionStatusValue={toHumanStatus(sessionStatus, language)}
                sessionsLoadedLabel={translate("sessionsLoadedLabel")}
                sessionsLoadedValue={String(sessions.length)}
              />
              <SessionDetailPanel
                screenId={sessionDetailScreenModel.screenId}
                routeId={sessionDetailScreenModel.routeId}
                statusId="web.sessionDetail.status"
                title={translate("sessionDetailTitle")}
                summary={translate("sessionDetailSummary")}
                selectLabel={translate("sessionDetailSelectLabel")}
                selectedKey={selectedSessionKey}
                selectActionId={sessionDetailScreenModel.actions.selectSession}
                onSelectKey={setSelectedSessionKey}
                options={sessionDetailOptions}
                clearLabel={translate("sessionDetailClearAction")}
                clearActionId={sessionDetailScreenModel.actions.clearSelection}
                onClear={handleClearSessionSelection}
                openVideoLabel={translate("sessionDetailOpenVideoAction")}
                openVideoActionId={sessionDetailScreenModel.actions.openExerciseVideo}
                onOpenVideo={handleOpenSessionExerciseVideo}
                openVideoDisabled={selectedSessionPrimaryExerciseId === null}
                noSelectionLabel={translate("sessionDetailNoSelection")}
                selectedSession={selectedSessionSummary}
                planLabel={translate("sessionDetailPlanLabel")}
                startedLabel={translate("sessionDetailStartedLabel")}
                endedLabel={translate("sessionDetailEndedLabel")}
                durationLabel={translate("sessionDetailDurationLabel")}
                exerciseCountLabel={translate("sessionDetailExerciseCountLabel")}
              />
              <ExerciseLibraryPanel
                screenId={exerciseLibraryScreenModel.screenId}
                routeId={exerciseLibraryScreenModel.routeId}
                statusId="web.exerciseLibrary.status"
                title={translate("exerciseVideosTitle")}
                statusLabel={translate("videosStatusLabel")}
                statusClass={toStatusClass(exerciseLibraryScreenModel.status)}
                statusValue={toHumanStatus(exerciseLibraryScreenModel.status, language)}
                showStatus={resolveWebRuntimeMode() === "qa"}
                exercisePickerLabel={translate("exercisePickerLabel")}
                selectedExercise={selectedExerciseForVideos}
                selectExerciseActionId={exerciseLibraryScreenModel.actions.selectExercise}
                onSelectExercise={setSelectedExerciseForVideos}
                videoLocalePickerLabel={translate("videoLocalePickerLabel")}
                videoLocale={videoLocale}
                selectLocaleActionId={exerciseLibraryScreenModel.actions.selectLocale}
                onSelectLocale={setVideoLocale}
                loadVideosLabel={translate("loadVideos")}
                loadVideosActionId={exerciseLibraryScreenModel.actions.loadVideos}
                onLoadVideos={handleLoadExerciseVideos}
                videosStatusLabel={translate("videosStatusLabel")}
                videosStatusValue={toHumanStatus(videoStatus, language)}
                noVideosLabel={translate("noVideosLoaded")}
                openVideoLabel={translate("openVideo")}
                openVideoActionId={exerciseLibraryScreenModel.actions.openVideo}
                videos={exerciseVideos}
              />
              <ExerciseDetailPanel
                screenId={exerciseDetailScreenModel.screenId}
                routeId={exerciseDetailScreenModel.routeId}
                statusId="web.exerciseDetail.status"
                title={translate("exerciseDetailTitle")}
                statusLabel={translate("exerciseDetailStatusLabel")}
                statusClass={toStatusClass(exerciseDetailScreenModel.status)}
                statusValue={toHumanStatus(exerciseDetailScreenModel.status, language)}
                showStatus={resolveWebRuntimeMode() === "qa"}
                summary={translate("exerciseDetailSummary")}
                loadActionLabel={translate("exerciseDetailLoadAction")}
                loadActionId={exerciseDetailScreenModel.actions.loadDetail}
                onLoadDetail={handleLoadExerciseVideos}
                selectLabel={translate("exerciseDetailSelectLabel")}
                selectedVideoId={selectedExerciseVideoId}
                selectActionId={exerciseDetailScreenModel.actions.selectVideo}
                onSelectVideoId={setSelectedExerciseVideoId}
                clearActionLabel={translate("exerciseDetailClearAction")}
                clearActionId={exerciseDetailScreenModel.actions.clearSelection}
                onClearSelection={handleClearExerciseDetailSelection}
                clearDisabled={selectedExerciseVideo === null}
                openActionLabel={translate("exerciseDetailOpenAction")}
                openActionId={exerciseDetailScreenModel.actions.openVideo}
                onOpenVideo={handleOpenSelectedExerciseVideo}
                openDisabled={selectedExerciseVideo === null}
                noSelectionLabel={translate("exerciseDetailNoSelection")}
                selectedVideo={selectedExerciseVideo}
                coachLabel={translate("exerciseDetailCoachLabel")}
                difficultyLabel={translate("exerciseDetailDifficultyLabel")}
                localeLabel={translate("exerciseDetailLocaleLabel")}
                durationLabel={translate("exerciseDetailDurationLabel")}
                videos={exerciseVideos}
              />
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
              <AthleteOperationsToolbar
                screenId={athleteFiltersScreenModel.screenId}
                routeId={athleteFiltersScreenModel.routeId}
                statusId={athleteFiltersScreenModel.screenId.replace(".screen", ".status")}
                searchLabel={translate("athleteSearchPlaceholder")}
                searchValue={athleteSearch}
                searchActionId={athleteFiltersScreenModel.actions.updateSearch}
                onSearchValueChange={setAthleteSearch}
                sortLabel={translate("athleteSortLabel")}
                sortValue={athleteSortMode}
                sortActionId={athleteFiltersScreenModel.actions.updateSort}
                onSortValueChange={setAthleteSortMode}
                sortBySessionsLabel={translate("athleteSortBySessions")}
                sortByAthleteLabel={translate("athleteSortByName")}
                sortByLastSessionLabel={translate("athleteSortByLastSession")}
                assignStarterPlanLabel={translate("bulkAssignStarterPlan")}
                assignStarterPlanActionId={athletesListScreenModel.actions.assignStarterPlan}
                onAssignStarterPlan={handleBulkAssignStarterPlan}
                clearSelectionLabel={translate("clearAthleteSelection")}
                clearSelectionActionId={athletesListScreenModel.actions.clearSelection}
                onClearSelection={handleClearAthleteSelection}
                athletesLoadedLabel={translate("athletesLoadedLabel")}
                athletesLoadedValue={String(athleteOperationRows.length)}
                athletesSelectedLabel={translate("athletesSelectedLabel")}
                athletesSelectedValue={String(selectedAthleteIds.length)}
              />
              <AthleteDetailPanel
                screenId={athleteDetailScreenModel.screenId}
                routeId={athleteDetailScreenModel.routeId}
                statusId={athleteDetailScreenModel.screenId.replace(".screen", ".status")}
                title={translate("athleteDetailTitle")}
                emptyLabel={translate("athleteDetailEmpty")}
                selectedRow={selectedAthleteDetailRow}
                plansLabel={translate("plansColumn")}
                sessionsLabel={translate("sessionsColumn")}
                nutritionLabel={translate("nutritionColumn")}
                lastSessionLabel={translate("lastSessionColumn")}
                riskNormalLabel={translate("riskNormal")}
                riskAttentionLabel={translate("riskAttention")}
                selectFirstAthleteLabel={translate("athleteDetailSelectFirst")}
                selectFirstAthleteActionId={athleteDetailScreenModel.actions.selectFirstAthlete}
                onSelectFirstAthlete={handleSelectFirstAthleteDetail}
                openSessionHistoryLabel={translate("athleteDetailOpenSessionHistory")}
                openSessionHistoryActionId={athleteDetailScreenModel.actions.openSessionHistory}
                onOpenSessionHistory={handleOpenAthleteSessionHistory}
                clearSelectionLabel={translate("clearAthleteSelection")}
                clearSelectionActionId={athleteDetailScreenModel.actions.clearSelection}
                onClearSelection={handleClearAthleteSelection}
              />
              <SessionHistoryPanel
                screenId={sessionHistoryScreenModel.screenId}
                routeId={sessionHistoryScreenModel.routeId}
                statusId={sessionHistoryScreenModel.screenId.replace(".screen", ".status")}
                title={translate("sessionHistoryTitle")}
                sessionsLoadedLabel={translate("sessionsLoadedLabel")}
                sessionsLoadedValue={String(selectedAthleteSessionHistoryRows.length)}
                loadSessionsLabel={translate("loadSessions")}
                loadSessionsActionId={sessionHistoryScreenModel.actions.loadSessions}
                onLoadSessions={() => void handleLoadSessions()}
                selectFirstAthleteLabel={translate("athleteDetailSelectFirst")}
                selectFirstAthleteActionId={sessionHistoryScreenModel.actions.selectFirstAthlete}
                onSelectFirstAthlete={handleSelectFirstAthleteDetail}
                clearSelectionLabel={translate("clearAthleteSelection")}
                clearSelectionActionId={sessionHistoryScreenModel.actions.clearSelection}
                onClearSelection={handleClearAthleteSelection}
                hasSelection={selectedAthleteIds.length > 0}
                hasRows={selectedAthleteSessionHistoryRows.length > 0}
                emptySelectionLabel={translate("sessionHistoryEmpty")}
                noRowsLabel={translate("sessionHistoryNoRows")}
                rows={selectedAthleteSessionHistoryCards}
                athleteLabel={translate("athleteColumn")}
                planLabel={translate("sessionHistoryPlanLabel")}
                startedLabel={translate("sessionHistoryStartedLabel")}
                endedLabel={translate("sessionHistoryEndedLabel")}
                durationLabel={translate("sessionHistoryDurationLabel")}
                minutesLabel={translate("historyMinutesLabel")}
                exercisesLabel={translate("sessionHistoryExercisesLabel")}
              />
              <CompareProgressPanel
                screenId={compareProgressScreenModel.screenId}
                routeId={compareProgressScreenModel.routeId}
                statusId={compareProgressScreenModel.screenId.replace(".screen", ".status")}
                title={translate("compareProgressTitle")}
                loadProgressLabel={translate("compareProgressLoad")}
                loadProgressActionId={compareProgressScreenModel.actions.loadProgress}
                onLoadProgress={() => void handleLoadProgressSummary()}
                selectFirstAthleteLabel={translate("athleteDetailSelectFirst")}
                selectFirstAthleteActionId={compareProgressScreenModel.actions.selectFirstAthlete}
                onSelectFirstAthlete={handleSelectFirstAthleteDetail}
                openSessionHistoryLabel={translate("athleteDetailOpenSessionHistory")}
                openSessionHistoryActionId={compareProgressScreenModel.actions.openSessionHistory}
                onOpenSessionHistory={handleOpenAthleteSessionHistory}
                emptyLabel={translate("compareProgressEmpty")}
                selectedRow={selectedAthleteDetailRow}
                selectedSessionsLabel={translate("compareProgressSelectedSessions")}
                cohortSessionsLabel={translate("compareProgressCohortSessions")}
                deltaSessionsLabel={translate("compareProgressDeltaSessions")}
                selectedNutritionLabel={translate("compareProgressSelectedNutrition")}
                cohortNutritionLabel={translate("compareProgressCohortNutrition")}
                deltaNutritionLabel={translate("compareProgressDeltaNutrition")}
                cohortAverageSessions={cohortAverageSessions}
                cohortAverageNutritionLogs={cohortAverageNutritionLogs}
              />
              <CoachNotesPanel
                screenId={coachNotesScreenModel.screenId}
                routeId={coachNotesScreenModel.routeId}
                statusId={coachNotesScreenModel.screenId.replace(".screen", ".status")}
                title={translate("coachNotesTitle")}
                loadNotesLabel={translate("coachNotesLoad")}
                loadNotesActionId={coachNotesScreenModel.actions.loadNotes}
                onLoadNotes={() => void handleLoadCoachNotes()}
                saveFollowUpLabel={translate("coachNotesSaveFollowUp")}
                saveFollowUpActionId={coachNotesScreenModel.actions.saveFollowUp}
                onSaveFollowUp={() => void handleSaveCoachFollowUp()}
                clearSelectionLabel={translate("clearAthleteSelection")}
                clearSelectionActionId={coachNotesScreenModel.actions.clearSelection}
                onClearSelection={handleClearAthleteSelection}
                hasSelection={selectedAthleteIds.length > 0}
                hasRows={selectedAthleteCoachNotesRows.length > 0}
                emptyLabel={translate("coachNotesEmpty")}
                noRowsLabel={translate("coachNotesNoRows")}
                occurredAtLabel={translate("coachNotesOccurredAtLabel")}
                sourceLabel={translate("coachNotesSourceLabel")}
                outcomeLabel={translate("coachNotesOutcomeLabel")}
                summaryLabel={translate("coachNotesSummaryLabel")}
                rows={selectedAthleteCoachNotesRows.map((note) => ({
                  id: note.id,
                  occurredAt: new Date(note.occurredAt).toLocaleString(),
                  source: note.source,
                  outcome: note.outcome,
                  summary: note.summary
                }))}
              />
              <AthletesOperationsTablePanel
                screenId={athletesListScreenModel.screenId}
                routeId={athletesListScreenModel.routeId}
                statusId={athletesListScreenModel.screenId.replace(".screen", ".status")}
                rows={visibleAthleteRows}
                selectedAthleteIds={selectedAthleteIdSet}
                onToggleAthleteSelection={handleToggleAthleteSelection}
                athleteColumnLabel={translate("athleteColumn")}
                plansColumnLabel={translate("plansColumn")}
                sessionsColumnLabel={translate("sessionsColumn")}
                nutritionColumnLabel={translate("nutritionColumn")}
                lastSessionColumnLabel={translate("lastSessionColumn")}
                riskColumnLabel={translate("riskColumn")}
                riskNormalLabel={translate("riskNormal")}
                riskAttentionLabel={translate("riskAttention")}
                emptyLabel={translate("noAthletesFound")}
                rowsInfoLabel={`${translate("rowsShownLabel")} ${visibleAthleteRows.length}/${athleteOperationRows.length}`}
                hasMoreRows={hasMoreAthleteRows}
                loadMoreRowsLabel={translate("loadMoreRows")}
                loadMoreRowsActionId={athletesListScreenModel.actions.showMoreRows}
                onLoadMoreRows={handleShowMoreAthleteRows}
                showAllRowsLabel={translate("showAllRows")}
                showAllRowsActionId={athletesListScreenModel.actions.showAllRows}
                onShowAllRows={handleShowAllAthleteRows}
              />
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
            <AdminUsersPanel
              screenId={adminUsersScreenModel.screenId}
              routeId={adminUsersScreenModel.routeId}
              statusId="web.adminUsers.status"
              title={translate("governanceTitle")}
              deniedDescription={translate("runtimeStateDeniedDescription")}
              isDenied={adminUsersScreenModel.status === "denied"}
              searchPlaceholder={translate("governanceSearchPlaceholder")}
              searchValue={governanceSearch}
              onSearchChange={setGovernanceSearch}
              roleFilterLabel={translate("governanceRoleFilterLabel")}
              roleFilterValue={governanceRoleFilter}
              roleOptions={[
                { id: "all", label: translate("governanceAllRoles") },
                ...roleOptions
              ]}
              onRoleFilterChange={(value) => setGovernanceRoleFilter(value as GovernanceRoleFilter)}
              loadCapabilitiesLabel={translate("governanceLoadCapabilities")}
              loadCapabilitiesActionId={adminUsersScreenModel.actions.loadCapabilities}
              onLoadCapabilities={handleLoadGovernanceRoleCoverage}
              assignAthleteLabel={translate("governanceAssignAthlete")}
              assignAthleteActionId={adminUsersScreenModel.actions.assignAthlete}
              onAssignAthlete={() => void handleAssignGovernanceRole("athlete")}
              assignCoachLabel={translate("governanceAssignCoach")}
              assignCoachActionId={adminUsersScreenModel.actions.assignCoach}
              onAssignCoach={() => void handleAssignGovernanceRole("coach")}
              assignAdminLabel={translate("governanceAssignAdmin")}
              assignAdminActionId={adminUsersScreenModel.actions.assignAdmin}
              onAssignAdmin={() => void handleAssignGovernanceRole("admin")}
              clearSelectionLabel={translate("governanceClearSelection")}
              clearSelectionActionId={adminUsersScreenModel.actions.clearSelection}
              onClearSelection={handleClearGovernanceSelection}
              usersLoadedLabel={translate("governanceUsersLoadedLabel")}
              usersLoadedValue={String(governancePrincipals.length)}
              usersSelectedLabel={translate("governanceUsersSelectedLabel")}
              usersSelectedValue={String(governanceSelectedPrincipalIds.length)}
              noUsersLabel={translate("governanceNoUsers")}
              rowsInfoLabel={`${translate("rowsShownLabel")} ${visibleGovernanceRows.length}/${governancePrincipals.length}`}
              principals={visibleGovernanceRows}
              selectedPrincipalIds={selectedGovernancePrincipalIdSet}
              onTogglePrincipalSelection={handleToggleGovernancePrincipalSelection}
              principalColumnLabel={translate("governancePrincipalColumn")}
              roleColumnLabel={translate("governanceRoleColumn")}
              sourceColumnLabel={translate("governanceSourceColumn")}
              countsColumnLabel={translate("governanceCountsColumn")}
              allowedDomainsLabel={translate("governanceAllowedDomainsLabel")}
              riskColumnLabel={translate("riskColumn")}
              sourceOperatorLabel={translate("governanceSourceOperator")}
              sourceActivityLabel={translate("governanceSourceActivity")}
              riskNormalLabel={translate("riskNormal")}
              riskAttentionLabel={translate("riskAttention")}
              roleHumanizer={(role) => toHumanStatus(role, language)}
              hasMoreRows={hasMoreGovernanceRows}
              loadMoreRowsLabel={translate("loadMoreRows")}
              onLoadMoreRows={handleShowMoreGovernanceRows}
              showAllRowsLabel={translate("showAllRows")}
              onShowAllRows={handleShowAllGovernanceRows}
              coverageTitle={translate("governanceCoverageTitle")}
              coverageRows={governanceRoleCoverage}
            />
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
            <AuditTrailPanel
              screenId={auditTrailScreenModel.screenId}
              routeId={auditTrailScreenModel.routeId}
              statusId="web.auditTrail.status"
              title={translate("auditTitle")}
              loadTimelineLabel={translate("auditLoadTimeline")}
              loadTimelineActionId={auditTrailScreenModel.actions.loadTimeline}
              onLoadTimeline={handleLoadAuditTimeline}
              exportCsvLabel={translate("auditExportCSV")}
              exportCsvActionId={auditTrailScreenModel.actions.exportCsv}
              onExportCsv={handleExportAuditCSV}
              exportForensicLabel={translate("auditExportForensic")}
              exportForensicActionId={auditTrailScreenModel.actions.exportForensic}
              onExportForensic={handleExportForensicAudit}
              clearFiltersLabel={translate("auditClearFilters")}
              clearFiltersActionId={auditTrailScreenModel.actions.clearFilters}
              onClearFilters={handleClearAuditFilters}
              searchPlaceholder={translate("auditSearchPlaceholder")}
              searchValue={auditQuery}
              onSearchChange={setAuditQuery}
              domainPlaceholder={translate("auditDomainFilterPlaceholder")}
              domainValue={auditDomainFilter}
              onDomainChange={setAuditDomainFilter}
              sourceFilterLabel={translate("auditSourceFilterLabel")}
              sourceFilterValue={auditSourceFilter}
              sourceOptions={[
                { value: "all", label: translate("auditFilterAllSources") },
                { value: "web", label: "web" },
                { value: "ios", label: "ios" },
                { value: "backend", label: "backend" }
              ]}
              onSourceFilterChange={setAuditSourceFilter}
              categoryFilterLabel={translate("auditCategoryFilterLabel")}
              categoryFilterValue={auditCategoryFilter}
              categoryOptions={[
                { value: "all", label: translate("auditFilterAllCategories") },
                { value: "analytics", label: translate("auditCategoryAnalytics") },
                { value: "crash", label: translate("auditCategoryCrash") }
              ]}
              onCategoryFilterChange={setAuditCategoryFilter}
              severityFilterLabel={translate("auditSeverityFilterLabel")}
              severityFilterValue={auditSeverityFilter}
              severityOptions={[
                { value: "all", label: translate("auditFilterAllSeverities") },
                { value: "info", label: translate("auditSeverityInfo") },
                { value: "warning", label: "warning" },
                { value: "fatal", label: "fatal" }
              ]}
              onSeverityFilterChange={setAuditSeverityFilter}
              rowsLoadedLabel={translate("auditRowsLoadedLabel")}
              rowsLoadedValue={String(auditTimelineRowsBase.length)}
              rowsFilteredLabel={translate("auditRowsFilteredLabel")}
              rowsFilteredValue={String(auditTimelineRows.length)}
              structuredLogsLabel={translate("auditStructuredLogsLabel")}
              structuredLogsValue={String(structuredLogs.length)}
              activityLogLabel={translate("auditActivityLogLabel")}
              activityLogValue={String(activityLogEntries.length)}
              forensicStatusLabel={translate("auditForensicStatusLabel")}
              forensicStatusValue={
                forensicExportResult === null
                  ? "-"
                  : humanizeStatus(forensicExportResult.status, language)
              }
              emptyLabel={translate("auditNoRows")}
              rowsInfoLabel={`${translate("rowsShownLabel")} ${visibleAuditRows.length}/${auditTimelineRows.length}`}
              rows={visibleAuditRows}
              occurredAtLabel={translate("auditOccurredAtColumn")}
              sourceLabel={translate("auditSourceColumn")}
              categoryLabel={translate("auditCategoryColumn")}
              severityLabel={translate("auditSeverityColumn")}
              nameLabel={translate("auditNameColumn")}
              domainLabel={translate("auditDomainColumn")}
              correlationLabel={translate("auditCorrelationColumn")}
              summaryLabel={translate("auditSummaryColumn")}
              severityHumanizer={(value) => toHumanStatus(value, language)}
              severityClassName={(severity) =>
                toStatusClass(
                  severity === "fatal" ? "high" : severity === "warning" ? "medium" : "low"
                )
              }
              hasMoreRows={hasMoreAuditRows}
              loadMoreRowsLabel={translate("loadMoreRows")}
              onLoadMoreRows={handleShowMoreAuditRows}
              showAllRowsLabel={translate("showAllRows")}
              onShowAllRows={handleShowAllAuditRows}
            />
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
            <BillingSupportPanel
              screenId={billingOverviewScreenModel.screenId}
              routeId={billingOverviewScreenModel.routeId}
              statusId="web.billingOverview.status"
              title={translate("billingSupportTitle")}
              supportScreenId={supportIncidentsScreenModel.screenId}
              supportRouteId={supportIncidentsScreenModel.routeId}
              supportStatusId="web.supportIncidents.status"
              loadDataLabel={translate("billingSupportLoadData")}
              billingLoadDataActionId={billingOverviewScreenModel.actions.loadData}
              supportLoadDataActionId={supportIncidentsScreenModel.actions.loadData}
              onLoadData={handleLoadBillingSupportData}
              resolveSelectedLabel={translate("billingSupportResolveSelected")}
              billingResolveSelectedActionId={billingOverviewScreenModel.actions.resolveSelected}
              supportResolveSelectedActionId={supportIncidentsScreenModel.actions.resolveSelected}
              onResolveSelected={handleResolveBillingIncidents}
              clearSelectionLabel={translate("billingSupportClearSelection")}
              billingClearSelectionActionId={billingOverviewScreenModel.actions.clearSelection}
              supportClearSelectionActionId={supportIncidentsScreenModel.actions.clearSelection}
              onClearSelection={handleClearBillingIncidentSelection}
              clearFiltersLabel={translate("billingSupportClearFilters")}
              billingClearFiltersActionId={billingOverviewScreenModel.actions.clearFilters}
              supportClearFiltersActionId={supportIncidentsScreenModel.actions.clearFilters}
              onClearFilters={handleClearBillingSupportFilters}
              searchPlaceholder={translate("billingSupportSearchPlaceholder")}
              searchValue={billingSupportSearch}
              onSearchChange={setBillingSupportSearch}
              domainPlaceholder={translate("billingDomainFilterPlaceholder")}
              domainValue={billingDomainFilter}
              onDomainChange={setBillingDomainFilter}
              invoiceStatusFilterLabel={translate("billingInvoiceStatusFilterLabel")}
              invoiceStatusFilterValue={billingInvoiceStatusFilter}
              invoiceStatusOptions={[
                { value: "all", label: translate("billingFilterAllInvoiceStatuses") },
                { value: "draft", label: translate("billingInvoiceStatusDraft") },
                { value: "open", label: translate("billingInvoiceStatusOpen") },
                { value: "paid", label: translate("billingInvoiceStatusPaid") },
                { value: "overdue", label: translate("billingInvoiceStatusOverdue") }
              ]}
              onInvoiceStatusFilterChange={setBillingInvoiceStatusFilter}
              incidentStateFilterLabel={translate("billingIncidentStateFilterLabel")}
              incidentStateFilterValue={billingIncidentStateFilter}
              incidentStateOptions={[
                { value: "all", label: translate("billingFilterAllIncidentStates") },
                { value: "open", label: translate("billingIncidentStateOpen") },
                { value: "in_progress", label: translate("billingIncidentStateInProgress") },
                { value: "resolved", label: translate("billingIncidentStateResolved") }
              ]}
              onIncidentStateFilterChange={setBillingIncidentStateFilter}
              incidentSeverityFilterLabel={translate("billingIncidentSeverityFilterLabel")}
              incidentSeverityFilterValue={billingIncidentSeverityFilter}
              incidentSeverityOptions={[
                { value: "all", label: translate("billingFilterAllIncidentSeverities") },
                { value: "high", label: translate("billingIncidentSeverityHigh") },
                { value: "medium", label: translate("billingIncidentSeverityMedium") },
                { value: "low", label: translate("billingIncidentSeverityLow") }
              ]}
              onIncidentSeverityFilterChange={setBillingIncidentSeverityFilter}
              invoicesLoadedLabel={translate("billingInvoicesLoadedLabel")}
              invoicesLoadedValue={String(billingInvoiceRows.length)}
              incidentsLoadedLabel={translate("billingIncidentsLoadedLabel")}
              incidentsLoadedValue={String(supportIncidentRows.length)}
              incidentsSelectedLabel={translate("billingIncidentsSelectedLabel")}
              incidentsSelectedValue={String(billingSelectedIncidentIds.length)}
              invoicesSectionTitle={translate("billingInvoicesSectionTitle")}
              noInvoicesLabel={translate("billingNoInvoices")}
              invoiceRowsInfoLabel={`${translate("rowsShownLabel")} ${visibleBillingInvoiceRows.length}/${billingInvoiceRows.length}`}
              invoiceRows={visibleBillingInvoiceRows}
              invoiceIdColumnLabel={translate("billingInvoiceIdColumn")}
              accountColumnLabel={translate("billingAccountColumn")}
              periodColumnLabel={translate("billingPeriodColumn")}
              amountColumnLabel={translate("billingAmountColumn")}
              invoiceStatusColumnLabel={translate("billingInvoiceStatusColumn")}
              sourceColumnLabel={translate("billingSourceColumn")}
              invoiceStatusHumanizer={invoiceStatusLabel}
              invoiceSourceHumanizer={(source) => toHumanStatus(source, language)}
              invoiceStatusClassName={toStatusClass}
              hasMoreInvoiceRows={hasMoreBillingInvoiceRows}
              loadMoreRowsLabel={translate("loadMoreRows")}
              onLoadMoreInvoiceRows={handleShowMoreBillingInvoiceRows}
              showAllRowsLabel={translate("showAllRows")}
              onShowAllInvoiceRows={handleShowAllBillingInvoiceRows}
              incidentsSectionTitle={translate("billingIncidentsSectionTitle")}
              noIncidentsLabel={translate("billingNoIncidents")}
              incidentRowsInfoLabel={`${translate("rowsShownLabel")} ${visibleBillingIncidentRows.length}/${supportIncidentRows.length}`}
              incidentRows={visibleBillingIncidentRows}
              selectedIncidentIds={selectedBillingIncidentIdSet}
              onToggleIncidentSelection={handleToggleBillingIncidentSelection}
              incidentIdColumnLabel={translate("billingIncidentIdColumn")}
              openedAtColumnLabel={translate("billingOpenedAtColumn")}
              incidentDomainColumnLabel={translate("billingIncidentDomainColumn")}
              incidentSeverityColumnLabel={translate("billingIncidentSeverityColumn")}
              incidentStateColumnLabel={translate("billingIncidentStateColumn")}
              incidentCorrelationColumnLabel={translate("billingIncidentCorrelationColumn")}
              incidentSummaryColumnLabel={translate("billingIncidentSummaryColumn")}
              incidentSeverityHumanizer={incidentSeverityLabel}
              incidentStateHumanizer={incidentStateLabel}
              incidentSeverityClassName={toStatusClass}
              incidentStateClassName={(state) =>
                toStatusClass(state === "resolved" ? "low" : state === "in_progress" ? "medium" : "high")
              }
              hasMoreIncidentRows={hasMoreBillingIncidentRows}
              onLoadMoreIncidentRows={handleShowMoreBillingIncidentRows}
              onShowAllIncidentRows={handleShowAllBillingIncidentRows}
            />
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
            <AIInsightsPanel
              screenId={aiInsightsScreenModel.screenId}
              routeId={aiInsightsScreenModel.routeId}
              statusId="web.aiInsights.status"
              title={translate("aiInsightsTitle")}
              summary={translate("aiInsightsSummary")}
              loadActionLabel={translate("aiInsightsLoadAction")}
              loadActionId={aiInsightsScreenModel.actions.loadRecommendations}
              onLoadRecommendations={() => void handleLoadRecommendations()}
              refreshActionLabel={translate("aiInsightsRefreshAction")}
              refreshActionId={aiInsightsScreenModel.actions.refreshSignals}
              onRefreshSignals={() => void handleRefreshAIInsights()}
              refreshDisabled={aiInsightsScreenModel.status === "loading"}
              recommendationsMetricLabel={translate("aiInsightsRecommendationsLabel")}
              recommendationsMetricValue={String(recommendations.length)}
              highPriorityMetricLabel={translate("aiInsightsHighPriorityLabel")}
              highPriorityMetricValue={String(
                recommendations.filter((recommendation) => recommendation.priority === "high").length
              )}
              signalsMetricLabel={translate("aiInsightsSignalsLabel")}
              signalsMetricValue={String(analyticsEvents.length + crashReports.length)}
              emptyLabel={translate("aiInsightsNoData")}
              recommendations={recommendations}
              priorityClassName={toStatusClass}
            />
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
            <NutritionOverviewPanel
              screenId={nutritionOverviewScreenModel.screenId}
              routeId={nutritionOverviewScreenModel.routeId}
              statusId="web.nutritionOverview.status"
              title={translate("nutritionTitle")}
              datePlaceholder={translate("datePlaceholder")}
              nutritionDate={nutritionDate}
              onNutritionDateChange={setNutritionDate}
              caloriesPlaceholder={translate("caloriesPlaceholder")}
              calories={calories}
              onCaloriesChange={setCalories}
              proteinPlaceholder={translate("proteinPlaceholder")}
              proteinGrams={proteinGrams}
              onProteinChange={setProteinGrams}
              carbsPlaceholder={translate("carbsPlaceholder")}
              carbsGrams={carbsGrams}
              onCarbsChange={setCarbsGrams}
              fatsPlaceholder={translate("fatsPlaceholder")}
              fatsGrams={fatsGrams}
              onFatsChange={setFatsGrams}
              saveLabel={translate("saveNutritionLog")}
              saveActionId={nutritionOverviewScreenModel.actions.saveLog}
              onSave={handleCreateNutritionLog}
              loadLabel={translate("loadLogs")}
              loadActionId={nutritionOverviewScreenModel.actions.loadLogs}
              onLoad={handleLoadNutritionLogs}
            />
            <DailyLogReviewPanel
              screenId={dailyLogReviewScreenModel.screenId}
              routeId={dailyLogReviewScreenModel.routeId}
              statusId="web.dailyLogReview.status"
              title={translate("nutritionFiltersLabel")}
              dateFilterPlaceholder={translate("nutritionDateFilterPlaceholder")}
              dateFilterValue={nutritionDateFilter}
              onDateFilterChange={setNutritionDateFilter}
              minProteinPlaceholder={translate("nutritionMinProteinPlaceholder")}
              minProteinValue={nutritionMinProteinFilter}
              onMinProteinChange={setNutritionMinProteinFilter}
              maxCaloriesPlaceholder={translate("nutritionMaxCaloriesPlaceholder")}
              maxCaloriesValue={nutritionMaxCaloriesFilter}
              onMaxCaloriesChange={setNutritionMaxCaloriesFilter}
              sortLabel={translate("nutritionSortLabel")}
              sortValue={nutritionSortMode}
              sortOptions={[
                { value: "date_desc", label: translate("nutritionSortByDate") },
                { value: "calories_desc", label: translate("nutritionSortByCalories") },
                { value: "protein_desc", label: translate("nutritionSortByProtein") }
              ]}
              onSortChange={(value) => setNutritionSortMode(value as NutritionSortMode)}
              clearFiltersLabel={translate("clearNutritionFilters")}
              clearFiltersActionId={dailyLogReviewScreenModel.actions.clearFilters}
              onClearFilters={handleClearNutritionFilters}
              updateFiltersActionId={dailyLogReviewScreenModel.actions.updateFilters}
              updateSortActionId={dailyLogReviewScreenModel.actions.updateSort}
              logsLoadedLabel={translate("logsLoadedLabel")}
              logsLoadedValue={String(nutritionLogs.length)}
              filteredLogsLabel={translate("filteredLogsLabel")}
              filteredLogsValue={String(filteredNutritionLogs.length)}
            />
              <DeviationAlertsPanel
                screenId={deviationAlertsScreenModel.screenId}
                routeId={deviationAlertsScreenModel.routeId}
                statusId="web.deviationAlerts.status"
                title={translate("deviationAlertsTitle")}
                summary={translate("deviationAlertsSummary")}
                loadActionLabel={translate("deviationAlertsLoadAction")}
                loadActionId={deviationAlertsScreenModel.actions.loadAlerts}
                onLoadAlerts={handleLoadNutritionLogs}
                loadDisabled={deviationAlertsScreenModel.status === "loading"}
                clearActionLabel={translate("deviationAlertsClearAction")}
                clearActionId={deviationAlertsScreenModel.actions.clearFilters}
                onClearFilters={handleClearNutritionFilters}
                highRiskLabel={translate("deviationAlertsHighRiskLabel")}
                highRiskValue={String(
                  nutritionDeviationAlerts.filter((alert) => alert.severity === "high").length
                )}
                moderateRiskLabel={translate("deviationAlertsModerateRiskLabel")}
                moderateRiskValue={String(
                  nutritionDeviationAlerts.filter((alert) => alert.severity === "medium").length
                )}
                noDataLabel={translate("deviationAlertsNoData")}
                alerts={nutritionDeviationAlerts}
                caloriesLabel={translate("caloriesPlaceholder")}
                proteinLabel={translate("proteinPlaceholder")}
                reasonCaloriesLabel={translate("deviationAlertsReasonCalories")}
                reasonProteinLabel={translate("deviationAlertsReasonProtein")}
                highSeverityLabel={translate("deviationAlertsHighRiskLabel")}
                moderateSeverityLabel={translate("deviationAlertsModerateRiskLabel")}
                severityClassName={toStatusClass}
              />
              <NutritionCoachPanel
                coachScreenId={nutritionCoachViewScreenModel.screenId}
                coachRouteId={nutritionCoachViewScreenModel.routeId}
                coachStatusId="web.nutritionCoachView.status"
                coachTitle={translate("nutritionCoachViewTitle")}
                coachSummary={translate("nutritionCoachViewSummary")}
                coachLoadLabel={translate("nutritionCoachViewLoadAction")}
                coachLoadActionId={nutritionCoachViewScreenModel.actions.loadCohort}
                onCoachLoad={handleLoadNutritionLogs}
                coachLoadDisabled={nutritionCoachViewScreenModel.status === "loading"}
                coachFocusLabel={translate("nutritionCoachViewFocusAction")}
                coachFocusActionId={nutritionCoachViewScreenModel.actions.focusAtRisk}
                onCoachFocusAtRisk={handleFocusNutritionCoachAtRisk}
                coachOpenOperationsLabel={translate("nutritionCoachViewOpenOperationsAction")}
                coachOpenOperationsActionId={nutritionCoachViewScreenModel.actions.openOperations}
                onCoachOpenOperations={handleOpenNutritionCoachOperations}
                athletesLoadedLabel={translate("athletesLoadedLabel")}
                athletesLoadedValue={String(nutritionCoachRows.length)}
                athletesAtRiskLabel={translate("nutritionCoachViewAtRiskLabel")}
                athletesAtRiskValue={String(nutritionCoachAtRiskCount)}
                coachEmptyLabel={translate("nutritionCoachViewNoRows")}
                coachRows={nutritionCoachRows}
                plansLabel={translate("plansColumn")}
                sessionsLabel={translate("sessionsColumn")}
                nutritionLabel={translate("nutritionColumn")}
                lastSessionLabel={translate("lastSessionColumn")}
                riskAttentionLabel={translate("riskAttention")}
                riskNormalLabel={translate("riskNormal")}
                riskClassName={riskToStatusClass}
                showCohortView={webLane === "secondary"}
                cohortScreenId={cohortNutritionScreenModel.screenId}
                cohortRouteId={cohortNutritionScreenModel.routeId}
                cohortStatusId="web.light.cohortNutrition.status"
                cohortTitle={translate("cohortNutritionTitle")}
                cohortSummary={translate("cohortNutritionSummary")}
                cohortLoadLabel={translate("cohortNutritionLoadAction")}
                cohortLoadActionId={cohortNutritionScreenModel.actions.loadCohort}
                onCohortLoad={handleLoadNutritionLogs}
                cohortLoadDisabled={cohortNutritionScreenModel.status === "loading"}
                cohortFocusLabel={translate("cohortNutritionFocusAction")}
                cohortFocusActionId={cohortNutritionScreenModel.actions.focusHighestRisk}
                onCohortFocusHighestRisk={handleFocusHighestNutritionRisk}
                cohortRows={cohortNutritionRows}
                cohortRowsLoadedValue={String(cohortNutritionRows.length)}
                cohortAtRiskValue={String(
                  cohortNutritionRows.filter((row) => row.riskLevel === "attention").length
                )}
                cohortEmptyLabel={translate("cohortNutritionNoRows")}
                cohortLogsLabel={translate("cohortNutritionLogsLabel")}
                cohortAvgCaloriesLabel={translate("cohortNutritionAvgCaloriesLabel")}
                cohortAvgProteinLabel={translate("cohortNutritionAvgProteinLabel")}
              />
              {webLane === "secondary" ? (
                <NutritionLogDetailPanel
                  screenId={nutritionLogDetailScreenModel.screenId}
                  routeId={nutritionLogDetailScreenModel.routeId}
                  statusId="web.light.logDetail.status"
                  title={translate("logDetailTitle")}
                  summary={translate("logDetailSummary")}
                  loadLabel={translate("logDetailLoadAction")}
                  loadActionId={nutritionLogDetailScreenModel.actions.loadDetail}
                  onLoad={handleLoadNutritionLogs}
                  loadDisabled={nutritionLogDetailScreenModel.status === "loading"}
                  clearLabel={translate("logDetailClearAction")}
                  clearActionId={nutritionLogDetailScreenModel.actions.clearSelection}
                  onClearSelection={handleClearNutritionLogSelection}
                  openCoachLabel={translate("logDetailOpenCoachAction")}
                  openCoachActionId={nutritionLogDetailScreenModel.actions.openCoachView}
                  onOpenCoachView={handleOpenNutritionLogCoachView}
                  selectLabel={translate("logDetailSelectPlaceholder")}
                  selectActionId={nutritionLogDetailScreenModel.actions.selectLog}
                  selectedOptionKey={selectedNutritionLogOption?.key ?? ""}
                  onSelectLog={handleSelectNutritionLogDetail}
                  optionRows={nutritionLogOptionRows}
                  selectedDateLabel={translate("logDetailSelectedDateLabel")}
                  selectedDateValue={selectedNutritionLog?.date ?? "-"}
                  selectedAthleteLabel={translate("logDetailSelectedAthleteLabel")}
                  selectedAthleteValue={selectedNutritionLog?.userId ?? "-"}
                  noSelectionLabel={translate("logDetailNoSelection")}
                  selectedLog={selectedNutritionLog}
                  caloriesLabel={translate("caloriesPlaceholder")}
                  proteinLabel={translate("proteinPlaceholder")}
                  carbsLabel={translate("carbsPlaceholder")}
                  fatsLabel={translate("fatsPlaceholder")}
                />
              ) : filteredNutritionLogs.length === 0 ? (
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
                    </article>
                  ))}
                </div>
              )}
            </article>
          ) : null}

          {canRenderOperationalModules && isModuleVisibleForUI("progress") ? (
            <ProgressTrendsPanel
              screenId={progressTrendsScreenModel.screenId}
              routeId={progressTrendsScreenModel.routeId}
              statusId="web.progressTrends.status"
              title={translate("progressTrendsTitle")}
              status={progressTrendsScreenModel.status}
              statusLabel={translate("progressTrendsStatusLabel")}
              summary={translate("progressTrendsSummary")}
              refreshLabel={translate("progressTrendsRefreshAction")}
              refreshActionId={progressTrendsScreenModel.actions.refresh}
              onRefresh={() => void handleRefreshProgressTrends()}
              refreshDisabled={progressTrendsScreenModel.status === "loading"}
              progressSummary={progressSummary}
              noDataLabel={translate("progressTrendsNoData")}
              workoutsLabel={translate("workoutsMetric")}
              minutesLabel={translate("minutesMetric")}
              setsLabel={translate("setsMetric")}
              nutritionLabel={translate("nutritionMetric")}
              avgCaloriesLabel={translate("avgCaloriesMetric")}
              avgProteinLabel={translate("avgProteinMetric")}
              filtersLabel={translate("progressFiltersLabel")}
              minSessionsPlaceholder={translate("progressMinSessionsPlaceholder")}
              minSessionsValue={progressMinSessionsFilter}
              onMinSessionsChange={setProgressMinSessionsFilter}
              sortLabel={translate("progressSortLabel")}
              sortMode={progressSortMode}
              onSortModeChange={setProgressSortMode}
              sortByDateLabel={translate("progressSortByDate")}
              sortBySessionsLabel={translate("progressSortBySessions")}
              sortByMinutesLabel={translate("progressSortByMinutes")}
              clearFiltersLabel={translate("clearProgressFilters")}
              onClearFilters={handleClearProgressFilters}
              filteredHistoryLabel={translate("filteredHistoryLabel")}
              filteredHistoryValue={String(filteredProgressHistory.length)}
              filteredHistory={filteredProgressHistory}
              noFilteredHistoryLabel={translate("noProgressFilteredHistory")}
              historySessionsLabel={translate("historySessionsLabel")}
              historyMinutesLabel={translate("historyMinutesLabel")}
              historySetsLabel={translate("historySetsLabel")}
              historyCaloriesLabel={translate("historyCaloriesLabel")}
              effortLabel={translate("effortMetric")}
            />
          ) : null}

          {canRenderOperationalModules && isModuleVisibleForUI("offlineSync") ? (
            <OfflineSyncPanel
              screenId="web.offlineSync.screen"
              routeId="web.route.offlineSync"
              statusId="web.offlineSync.status"
              title={translate("offlineSyncTitle")}
              status={toHumanStatus(syncStatus, language)}
              statusLabel={translate("syncStatusLabel")}
              summary=""
              syncLabel={translate("syncQueue")}
              syncActionId={systemStatusScreenModel.actions.syncQueue}
              onSync={handleSyncOfflineQueue}
              refreshLabel={translate("refreshQueue")}
              refreshActionId="web.offlineSync.refreshQueue"
              onRefresh={() => void refreshPendingQueue()}
              pendingActionsLabel={translate("pendingActionsLabel")}
              pendingActionsValue={String(pendingQueueCount)}
              rejectedLastSyncLabel={translate("rejectedLastSyncLabel")}
              rejectedLastSyncValue={String(lastSyncRejectedCount)}
              idempotencyKeyLabel={translate("idempotencyKeyLabel")}
              idempotencyKeyValue={lastSyncIdempotency?.key ?? "-"}
              idempotencyReplayLabel={translate("idempotencyReplayLabel")}
              idempotencyReplayValue={
                lastSyncIdempotency === null
                  ? "-"
                  : lastSyncIdempotency.replayed
                    ? translate("idempotencyReplayYes")
                    : translate("idempotencyReplayNo")
              }
              idempotencyTtlLabel={translate("idempotencyTTLLabel")}
              idempotencyTtlValue={
                lastSyncIdempotency === null ? "-" : `${lastSyncIdempotency.ttlSeconds}s`
              }
            />
          ) : null}

          {canRenderOperationalModules && isModuleVisibleForUI("settings") ? (
            <SettingsPanel
              screenId="web.settings.screen"
              routeId="web.route.settings"
              statusId="web.settings.status"
              title={translate("settingsTitle")}
              status={toHumanStatus(settingsStatus, language)}
              statusLabel={translate("settingsStatusLabel")}
              notificationsEnabled={notificationsEnabled}
              onNotificationsChange={setNotificationsEnabled}
              notificationsLabel={translate("notificationsPreference")}
              watchSyncEnabled={watchSyncEnabled}
              onWatchSyncChange={setWatchSyncEnabled}
              watchSyncLabel={translate("watchPreference")}
              calendarSyncEnabled={calendarSyncEnabled}
              onCalendarSyncChange={setCalendarSyncEnabled}
              calendarSyncLabel={translate("calendarPreference")}
              saveLabel={translate("saveSettings")}
              saveActionId="web.settings.save"
              onSave={handleSaveSettings}
            />
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
  showStatus?: boolean;
};

const SectionHeader = memo(function SectionHeader({
  title,
  statusLabel,
  status,
  language,
  showStatus
}: SectionHeaderProps) {
  const shouldShowStatus = showStatus ?? resolveWebRuntimeMode() === "qa";

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
  const descriptionByState: Record<EnterpriseRuntimeState, string> = {
    success: translate("runtimeStateSuccessDescription"),
    loading: translate("runtimeStateLoadingDescription"),
    empty: translate("runtimeStateEmptyDescription"),
    error: translate("runtimeStateErrorDescription"),
    offline: translate("runtimeStateOfflineDescription"),
    denied: translate("runtimeStateDeniedDescription")
  };
  return descriptionByState[runtimeState];
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
    return resolveWebRuntimeMode() === "qa" ? "all" : "onboarding";
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

function resolveWebRuntimeMode(): "qa" | "product" {
  const importMeta = import.meta as ImportMeta & {
    env?: Record<string, string | undefined>;
  };
  if (typeof window === "undefined") {
    return "product";
  }

  return evaluateWebRuntimeMode({
    envMode: importMeta.env?.VITE_WEB_RUNTIME_MODE,
    qaUIEnabled: importMeta.env?.VITE_WEB_QA_UI_ENABLED,
    pathname: window.location.pathname,
    search: window.location.search,
    hostname: window.location.hostname,
    storage: window.localStorage
  });
}
