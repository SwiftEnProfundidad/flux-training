import { useEffect, useMemo, useRef, useState } from "react";
import {
  AccessRole,
  AIRecommendation,
  AnalyticsEvent,
  CrashReport,
  ExerciseVideo,
  Goal,
  NutritionLog,
  ProgressSummary,
  TrainingPlan,
  WorkoutSessionInput,
  RoleCapabilities
} from "@flux/contracts";
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
import { isClientUpdateRequiredError } from "../infrastructure/api-client";
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
  isModuleVisible,
  readDashboardDomainFromURL,
  resolveDashboardRole,
  resolveDashboardDomain,
  type DashboardDomain,
  type DashboardRole
} from "./dashboard-domains";
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
  deriveModuleRuntimeStatus,
  type ModuleRuntimeStatus
} from "./module-runtime-status";
import "./app.css";

type SessionStatus = "idle" | "loading" | "saved" | "queued" | "validation_error" | "error";
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

const demoUserId = "demo-user";
const languageStorageKey = "flux_training_language";
const dashboardDomainStorageKey = "flux_training_dashboard_domain";
const dashboardRoleStorageKey = "flux_training_dashboard_role";

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

  const [authStatus, setAuthStatus] = useState("signed_out");
  const [onboardingStatus, setOnboardingStatus] = useState<OnboardingStatus>("idle");
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>("idle");
  const [trainingStatus, setTrainingStatus] = useState<TrainingStatus>("idle");
  const [nutritionStatus, setNutritionStatus] = useState<NutritionStatus>("idle");
  const [progressStatus, setProgressStatus] = useState<ProgressStatus>("idle");
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("idle");
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
  const [plans, setPlans] = useState<TrainingPlan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState(dailyTrainingVideoDefaults.selectedPlanId);
  const [sessions, setSessions] = useState<WorkoutSessionInput[]>(dailyTrainingVideoDefaults.sessions);
  const [nutritionDate, setNutritionDate] = useState("2026-02-26");
  const [calories, setCalories] = useState("2200");
  const [proteinGrams, setProteinGrams] = useState("150");
  const [carbsGrams, setCarbsGrams] = useState("230");
  const [fatsGrams, setFatsGrams] = useState("70");
  const [nutritionDateFilter, setNutritionDateFilter] = useState("");
  const [nutritionMinProteinFilter, setNutritionMinProteinFilter] = useState("");
  const [nutritionMaxCaloriesFilter, setNutritionMaxCaloriesFilter] = useState("");
  const [nutritionSortMode, setNutritionSortMode] = useState<NutritionSortMode>("date_desc");
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
  const [exerciseVideos, setExerciseVideos] = useState<ExerciseVideo[]>([]);
  const [videoStatus, setVideoStatus] = useState<VideoStatus>("idle");
  const [selectedExerciseForVideos, setSelectedExerciseForVideos] = useState(
    dailyTrainingVideoDefaults.selectedExercise
  );
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
  const [roleCapabilitiesReloadNonce, setRoleCapabilitiesReloadNonce] = useState(0);
  const isInitialDomainRender = useRef(true);
  const isInitialRoleRender = useRef(true);
  const runtimeObservabilitySessionRef = useRef(createRuntimeObservabilitySession());

  const translate = useMemo(() => createTranslator(language), [language]);

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
  const visibleModulesForDomain = useMemo(() => getVisibleModules(activeDomain), [activeDomain]);
  const activeDomainRuntimeState = resolveActiveDomainRuntimeState(
    activeDomain,
    domainRuntimeStates
  );
  const athleteOperationRowsBase = useMemo(
    () => buildAthleteOperationsRows(plans, sessions, nutritionLogs, progressSummary),
    [plans, sessions, nutritionLogs, progressSummary]
  );
  const athleteOperationRows = useMemo(
    () =>
      sortAthleteOperationsRows(
        filterAthleteOperationsRows(athleteOperationRowsBase, athleteSearch),
        athleteSortMode
      ),
    [athleteOperationRowsBase, athleteSearch, athleteSortMode]
  );
  const governancePrincipalsBase = useMemo(
    () =>
      buildGovernancePrincipals({
        operatorId: demoUserId,
        activeRole,
        plans,
        sessions,
        nutritionLogs,
        assignedRolesByPrincipal
      }),
    [activeRole, assignedRolesByPrincipal, nutritionLogs, plans, sessions]
  );
  const governancePrincipals = useMemo(
    () =>
      filterGovernancePrincipals(
        governancePrincipalsBase,
        governanceSearch,
        governanceRoleFilter
      ),
    [governancePrincipalsBase, governanceSearch, governanceRoleFilter]
  );
  const governanceRoleCoverage = useMemo(
    () => buildRoleCapabilityCoverage(capabilitiesByRole),
    [capabilitiesByRole]
  );
  const auditTimelineRowsBase = useMemo(
    () => buildAuditTimelineRows(analyticsEvents, crashReports),
    [analyticsEvents, crashReports]
  );
  const auditTimelineRows = useMemo(
    () =>
      filterAuditTimelineRows(auditTimelineRowsBase, {
        query: auditQuery,
        source: auditSourceFilter,
        category: auditCategoryFilter,
        severity: auditSeverityFilter,
        domain: auditDomainFilter
      }),
    [
      auditCategoryFilter,
      auditDomainFilter,
      auditQuery,
      auditSeverityFilter,
      auditSourceFilter,
      auditTimelineRowsBase
    ]
  );
  const nutritionMinProteinFilterParsed = useMemo(
    () => parseOptionalNumber(nutritionMinProteinFilter),
    [nutritionMinProteinFilter]
  );
  const nutritionMaxCaloriesFilterParsed = useMemo(
    () => parseOptionalNumber(nutritionMaxCaloriesFilter),
    [nutritionMaxCaloriesFilter]
  );
  const progressMinSessionsFilterParsed = useMemo(
    () => parseOptionalNumber(progressMinSessionsFilter),
    [progressMinSessionsFilter]
  );
  const hasNutritionFilterValidationError =
    !nutritionMinProteinFilterParsed.isValid || !nutritionMaxCaloriesFilterParsed.isValid;
  const hasProgressFilterValidationError = !progressMinSessionsFilterParsed.isValid;
  const filteredNutritionLogs = useMemo(() => {
    const filtered = filterNutritionLogs(nutritionLogs, {
      queryDate: nutritionDateFilter,
      minProteinGrams: nutritionMinProteinFilterParsed.value,
      maxCalories: nutritionMaxCaloriesFilterParsed.value
    });
    return sortNutritionLogs(filtered, nutritionSortMode);
  }, [
    nutritionLogs,
    nutritionDateFilter,
    nutritionMinProteinFilterParsed.value,
    nutritionMaxCaloriesFilterParsed.value,
    nutritionSortMode
  ]);
  const filteredProgressHistory = useMemo(() => {
    const rows = buildProgressHistoryRows(progressSummary);
    const filtered = filterProgressHistoryRows(rows, progressMinSessionsFilterParsed.value);
    return sortProgressHistoryRows(filtered, progressSortMode);
  }, [progressSummary, progressMinSessionsFilterParsed.value, progressSortMode]);

  async function refreshPendingQueue(): Promise<void> {
    const pending = await offlineSyncQueueUseCase.listPending(demoUserId);
    setPendingQueueCount(pending.length);
  }

  function shouldStopForUpgrade(error: unknown): boolean {
    if (isClientUpdateRequiredError(error)) {
      setReleaseCompatibilityStatus("upgrade_required");
      return true;
    }
    return false;
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

  useEffect(() => {
    void refreshPendingQueue();
  }, []);

  useEffect(() => {
    persistLanguagePreference(language);
  }, [language]);

  useEffect(() => {
    persistDomainPreference(activeDomain);
    persistDomainQueryParam(activeDomain);
    if (isInitialDomainRender.current) {
      isInitialDomainRender.current = false;
      return;
    }
    void trackDomainChange(activeDomain);
  }, [activeDomain]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    function handlePopState(): void {
      const domainFromURL = readDashboardDomainFromURL(window.location.href);
      if (domainFromURL !== null) {
        setActiveDomain(domainFromURL);
      }
    }
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

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
    let isCancelled = false;

    async function loadRoleCapabilities() {
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
  }, [activeRole, manageRoleCapabilitiesUseCase, roleCapabilitiesReloadNonce]);

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
    persistRolePreference(activeRole);
    if (isInitialRoleRender.current) {
      isInitialRoleRender.current = false;
      return;
    }
    void trackRoleChange(activeRole);
  }, [activeRole]);

  async function handleAppleSignIn() {
    setAuthStatus("loading");
    try {
      const session = await createAuthSessionUseCase.executeWithApple();
      setAuthStatus(`signed_in:${session.identity.provider}`);
    } catch (error) {
      if (shouldStopForUpgrade(error)) {
        return;
      }
      setAuthStatus("auth_error");
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
      setAuthStatus(`signed_in:${session.identity.provider}`);
    } catch (error) {
      if (shouldStopForUpgrade(error)) {
        return;
      }
      setAuthStatus("auth_error");
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
        userId: demoUserId,
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
    } catch (error) {
      if (shouldStopForUpgrade(error)) {
        return;
      }
      setOnboardingStatus("validation_error");
    }
  }

  async function handleSubmitLegalConsent() {
    setLegalStatus("loading");
    if (!privacyPolicyAccepted || !termsAccepted || !medicalDisclaimerAccepted) {
      setLegalStatus("consent_required");
      return;
    }
    try {
      await manageLegalUseCase.submitConsent({
        userId: demoUserId,
        acceptedAt: new Date().toISOString(),
        privacyPolicyAccepted,
        termsAccepted,
        medicalDisclaimerAccepted
      });
      setLegalStatus("saved");
    } catch (error) {
      if (shouldStopForUpgrade(error)) {
        return;
      }
      setLegalStatus("error");
    }
  }

  async function handleRequestDataDeletion() {
    setLegalStatus("loading");
    if (!privacyPolicyAccepted || !termsAccepted || !medicalDisclaimerAccepted) {
      setLegalStatus("consent_required");
      return;
    }
    try {
      await manageLegalUseCase.requestDataDeletion({
        userId: demoUserId,
        requestedAt: new Date().toISOString(),
        reason: "user_request",
        status: "pending"
      });
      setLegalStatus("deletion_requested");
    } catch (error) {
      if (shouldStopForUpgrade(error)) {
        return;
      }
      setLegalStatus("error");
    }
  }

  function handleSaveSettings() {
    setSettingsStatus("loading");
    setSettingsStatus("saved");
  }

  function handleExportData() {
    setLegalStatus("loading");
    if (!privacyPolicyAccepted || !termsAccepted) {
      setLegalStatus("consent_required");
      return;
    }
    setLegalStatus("exported");
  }

  async function handleCreatePlan() {
    if (planName.trim().length === 0) {
      setTrainingStatus("validation_error");
      return;
    }
    setTrainingStatus("loading");
    const queuedPlanInput = {
      id: `plan-${Date.now()}`,
      userId: demoUserId,
      name: planName,
      weeks: 4,
      days: [
        {
          dayIndex: 1,
          exercises: [
            { exerciseId: "goblet-squat", targetSets: 4, targetReps: 10 },
            { exerciseId: "bench-press", targetSets: 4, targetReps: 8 }
          ]
        }
      ]
    } satisfies Omit<TrainingPlan, "createdAt">;

    try {
      const createdPlan = await manageTrainingUseCase.createTrainingPlan(queuedPlanInput);
      setSelectedPlanId(createdPlan.id);
      setTrainingStatus("saved");
      const loadedPlans = await manageTrainingUseCase.listTrainingPlans(demoUserId);
      setPlans(loadedPlans);
    } catch (error) {
      if (shouldStopForUpgrade(error)) {
        return;
      }
      try {
        await offlineSyncQueueUseCase.queueTrainingPlan(demoUserId, queuedPlanInput);
        await refreshPendingQueue();
        setTrainingStatus("queued");
      } catch (queueError) {
        if (shouldStopForUpgrade(queueError)) {
          return;
        }
        setTrainingStatus("error");
      }
    }
  }

  async function handleLoadPlans() {
    setTrainingStatus("loading");
    try {
      const loadedPlans = await manageTrainingUseCase.listTrainingPlans(demoUserId);
      setPlans(loadedPlans);
      const firstPlan = loadedPlans[0];
      if (firstPlan !== undefined && selectedPlanId.length === 0) {
        setSelectedPlanId(firstPlan.id);
      }
      setTrainingStatus(loadedPlans.length === 0 ? "validation_error" : "loaded");
    } catch (error) {
      if (shouldStopForUpgrade(error)) {
        return;
      }
      setTrainingStatus("error");
    }
  }

  async function handleLogWorkoutSession() {
    setSessionStatus("loading");
    const planId = selectedPlanId || plans[0]?.id;
    if (planId === undefined || planId.length === 0) {
      setSessionStatus("validation_error");
      return;
    }
    const endedAt = new Date();
    const queuedSession = {
      userId: demoUserId,
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
    } catch (error) {
      if (shouldStopForUpgrade(error)) {
        return;
      }
      try {
        await offlineSyncQueueUseCase.queueWorkoutSession(demoUserId, queuedSession);
        await refreshPendingQueue();
        setSessionStatus("saved");
        setTrainingStatus("queued");
      } catch (queueError) {
        if (shouldStopForUpgrade(queueError)) {
          return;
        }
        setSessionStatus("error");
      }
    }
  }

  async function handleLoadSessions() {
    setSessionStatus("loading");
    try {
      const loadedSessions = await manageTrainingUseCase.listWorkoutSessions(
        demoUserId,
        selectedPlanId || undefined
      );
      setSessions(loadedSessions);
      setSessionStatus("saved");
    } catch (error) {
      if (shouldStopForUpgrade(error)) {
        return;
      }
      setSessionStatus("error");
    }
  }

  async function handleCreateNutritionLog() {
    setNutritionStatus("loading");
    const queuedLog = {
      userId: demoUserId,
      date: nutritionDate,
      calories: Number(calories),
      proteinGrams: Number(proteinGrams),
      carbsGrams: Number(carbsGrams),
      fatsGrams: Number(fatsGrams)
    } satisfies NutritionLog;

    try {
      await manageNutritionUseCase.createNutritionLog(queuedLog);
      setNutritionStatus("saved");
    } catch (error) {
      if (shouldStopForUpgrade(error)) {
        return;
      }
      try {
        await offlineSyncQueueUseCase.queueNutritionLog(demoUserId, queuedLog);
        await refreshPendingQueue();
        setNutritionStatus("queued");
      } catch (queueError) {
        if (shouldStopForUpgrade(queueError)) {
          return;
        }
        setNutritionStatus("error");
      }
    }
  }

  async function handleLoadNutritionLogs() {
    setNutritionStatus("loading");
    try {
      const logs = await manageNutritionUseCase.listNutritionLogs(demoUserId);
      setNutritionLogs(logs);
      setNutritionStatus(logs.length === 0 ? "empty" : "loaded");
    } catch (error) {
      if (shouldStopForUpgrade(error)) {
        return;
      }
      setNutritionStatus("error");
    }
  }

  async function handleLoadProgressSummary() {
    setProgressStatus("loading");
    try {
      const summary = await manageProgressUseCase.getSummary(demoUserId);
      setProgressSummary(summary);
      setProgressStatus(
        summary.workoutSessionsCount === 0 && summary.nutritionLogsCount === 0
          ? "empty"
          : "loaded"
      );
    } catch (error) {
      if (shouldStopForUpgrade(error)) {
        return;
      }
      setProgressStatus("error");
    }
  }

  async function handleSyncOfflineQueue() {
    setSyncStatus("loading");
    try {
      const result = await offlineSyncQueueUseCase.syncPending(demoUserId);
      await refreshPendingQueue();
      setLastSyncRejectedCount(result.rejected.length);
      setSyncStatus("synced");
    } catch (error) {
      if (shouldStopForUpgrade(error)) {
        return;
      }
      setSyncStatus("error");
    }
  }

  async function loadObservabilityCollections(): Promise<void> {
    const [loadedEvents, loadedCrashReports] = await Promise.all([
      manageObservabilityUseCase.listAnalyticsEvents(demoUserId),
      manageObservabilityUseCase.listCrashReports(demoUserId)
    ]);
    setAnalyticsEvents(loadedEvents);
    setCrashReports(loadedCrashReports);
  }

  async function handleTrackAnalyticsEvent() {
    setObservabilityStatus("loading");
    try {
      await manageObservabilityUseCase.createAnalyticsEvent({
        userId: demoUserId,
        name: "dashboard_interaction",
        source: "web",
        occurredAt: new Date().toISOString(),
        attributes: {
          pendingQueueCount,
          selectedPlan: selectedPlanId.length > 0
        }
      });
      setObservabilityStatus("event_saved");
    } catch (error) {
      if (shouldStopForUpgrade(error)) {
        return;
      }
      setObservabilityStatus("error");
    }
  }

  async function handleReportDemoCrash() {
    setObservabilityStatus("loading");
    try {
      try {
        throw new Error("Simulated crash for observability validation");
      } catch (error) {
        const message = error instanceof Error ? error.message : "unknown_error";
        const stackTrace = error instanceof Error ? error.stack : undefined;
        await manageObservabilityUseCase.createCrashReport({
          userId: demoUserId,
          source: "web",
          message,
          stackTrace,
          severity: "warning",
          occurredAt: new Date().toISOString()
        });
      }
      setObservabilityStatus("crash_saved");
    } catch (error) {
      if (shouldStopForUpgrade(error)) {
        return;
      }
      setObservabilityStatus("error");
    }
  }

  async function handleLoadObservabilityData() {
    setObservabilityStatus("loading");
    try {
      await loadObservabilityCollections();
      setObservabilityStatus("loaded");
    } catch (error) {
      if (shouldStopForUpgrade(error)) {
        return;
      }
      setObservabilityStatus("error");
    }
  }

  async function handleLoadAuditTimeline() {
    setAuditStatus("loading");
    try {
      await loadObservabilityCollections();
      setAuditStatus("loaded");
    } catch (error) {
      if (shouldStopForUpgrade(error)) {
        return;
      }
      setAuditStatus("error");
    }
  }

  async function handleExportAuditCSV() {
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
        userId: demoUserId,
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
    } catch {
      setAuditStatus("error");
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
      setVideoStatus("loaded");
    } catch (error) {
      if (shouldStopForUpgrade(error)) {
        return;
      }
      setVideoStatus("error");
    }
  }

  async function handleLoadRecommendations() {
    setRecommendationsStatus("loading");
    const estimatedDaysSinceWorkout = sessions.length === 0 ? 3 : 0;
    const estimatedCompletionRate =
      plans.length === 0 ? 0.4 : Math.min(1, sessions.length / Math.max(plans.length * 2, 1));

    try {
      const loadedRecommendations = await manageRecommendationsUseCase.listRecommendations(
        demoUserId,
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
    } catch (error) {
      if (shouldStopForUpgrade(error)) {
        return;
      }
      setRecommendationsStatus("error");
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

  function handleBulkAssignStarterPlan() {
    if (selectedAthleteIds.length === 0) {
      setOperationsStatus("validation_error");
      return;
    }
    setOperationsStatus("loading");
    setPlanName("Starter Plan");
    setOperationsStatus("saved");
  }

  function handleClearNutritionFilters() {
    setNutritionDateFilter("");
    setNutritionMinProteinFilter("");
    setNutritionMaxCaloriesFilter("");
    setNutritionSortMode("date_desc");
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
        userId: demoUserId,
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
    try {
      const allowedDomainCount =
        roleCapabilitiesStatus === "loaded" && roleCapabilities !== null
          ? roleCapabilities.allowedDomains.length
          : 0;
      const payloadValidation = resolveDomainPayloadValidation(buildDomainPayloadValidationInput(domain));
      const runtimeAttributes = nextEventAttributes(runtimeObservabilitySessionRef.current, domain);
      await manageObservabilityUseCase.createAnalyticsEvent({
        userId: demoUserId,
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
    try {
      const runtimeAttributes = nextEventAttributes(runtimeObservabilitySessionRef.current, activeDomain);
      await manageObservabilityUseCase.createAnalyticsEvent({
        userId: demoUserId,
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
    try {
      const payloadValidation = resolveDomainPayloadValidation(buildDomainPayloadValidationInput(domain));
      const runtimeAttributes = nextDeniedEventAttributes(
        runtimeObservabilitySessionRef.current,
        domain,
        correlationId
      );
      await manageObservabilityUseCase.createAnalyticsEvent({
        userId: demoUserId,
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
    reason: "domain_denied",
    correlationId?: string
  ) {
    const backendRoute = resolveBlockedActionRoute(domain);
    const payloadValidation = resolveDomainPayloadValidation(buildDomainPayloadValidationInput(domain));
    const runtimeAttributes = nextEventAttributes(
      runtimeObservabilitySessionRef.current,
      domain,
      correlationId
    );
    try {
      await manageObservabilityUseCase.createAnalyticsEvent({
        userId: demoUserId,
        name: "dashboard_action_blocked",
        source: "web",
        occurredAt: new Date().toISOString(),
        attributes: {
          role: activeRole,
          domain,
          action,
          reason,
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
      userId: demoUserId,
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
    setActiveDomain(domain);
    if (domain === "all") {
      return;
    }
    const accessDecision = resolveDomainAccessDecision(
      domain,
      roleCapabilitiesStatus,
      roleCapabilities
    );
    if (accessDecision === "allowed") {
      return;
    }
    if (accessDecision === "pending") {
      setDomainRuntimeStates((currentStates) =>
        setRuntimeStateForActiveDomain(domain, "loading", currentStates)
      );
      return;
    }
    if (accessDecision === "error") {
      setDomainRuntimeStates((currentStates) =>
        setRuntimeStateForActiveDomain(domain, "error", currentStates)
      );
      return;
    }
    if (accessDecision === "denied") {
      setDomainRuntimeStates((currentStates) =>
        setRuntimeStateForActiveDomain(domain, "denied", currentStates)
      );
      const correlationId = nextCorrelationId(
        runtimeObservabilitySessionRef.current,
        domain,
        "domain_select"
      );
      void trackDeniedDomainAccess(domain, "domain_select", correlationId);
      void trackBlockedAction(domain, "domain_select", "domain_denied", correlationId);
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

  return (
    <div className={`app-shell tone-${readiness.tone}`}>
      <div className="app-background app-background-left" />
      <div className="app-background app-background-right" />
      <main className="app-main">
        <section className="hero-card">
          <div className="hero-content">
            <p className="eyebrow">{translate("appName")}</p>
            <h1>{translate("heroTitle")}</h1>
            <p className="hero-copy">{translate("heroCopy")}</p>
            <div className="hero-actions">
              <button className="button primary" onClick={handleAppleSignIn} type="button">
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
                <button className="button ghost" onClick={handleEmailSignIn} type="button">
                  {translate("signInWithEmail")}
                </button>
              </div>
              <div className="inline-inputs">
                <button
                  className="button ghost"
                  onClick={() => handleEmailRecovery("email")}
                  type="button"
                >
                  {translate("recoverByEmail")}
                </button>
                <button
                  className="button ghost"
                  onClick={() => handleEmailRecovery("sms")}
                  type="button"
                >
                  {translate("recoverBySMS")}
                </button>
              </div>
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
          </div>
          <div className="readiness-panel">
            <p className="readiness-label">{translate("readinessLabel")}</p>
            <p className="readiness-score">{readiness.score}%</p>
            <p className="readiness-state">{readinessLabel(readiness.label, language)}</p>
            <div className="readiness-progress" role="presentation">
              <span style={{ width: `${readiness.score}%` }} />
            </div>
            <div className="hero-metrics">
              <Metric
                title={translate("authMetric")}
                value={humanizeStatus(authStatus, language)}
              />
              <Metric title={translate("queueMetric")} value={String(pendingQueueCount)} />
              <Metric title={translate("goalMetric")} value={goalLabel(goal, language)} />
              <Metric
                title={translate("syncMetric")}
                value={humanizeStatus(syncStatus, language)}
              />
              <Metric
                title={translate("runtimeStateModeLabel")}
                value={toHumanStatus(activeDomainRuntimeState, language)}
              />
            </div>
          </div>
        </section>

        {releaseCompatibilityStatus === "upgrade_required" ? (
          <section className="status-banner critical">
            <strong>{translate("updateRequiredTitle")}</strong>
            <p>{translate("updateRequiredCopy")}</p>
          </section>
        ) : null}

        <section className="domain-filter-card">
          <p className="domain-filter-label">{translate("domainFilterLabel")}</p>
          <div
            className="domain-filter-tabs"
            role="tablist"
            aria-label={translate("domainFilterLabel")}
          >
            {domainTabs.map((tab) => (
              <button
                key={tab.id}
                className={`button ghost domain-tab ${activeDomain === tab.id ? "active" : ""}`}
                onClick={() => handleDomainSelection(tab.id)}
                type="button"
                role="tab"
                aria-selected={activeDomain === tab.id}
                aria-controls="dashboard-grid"
              >
                {tab.label}
              </button>
            ))}
          </div>
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
        </section>

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

        <section id="dashboard-grid" className="dashboard-grid">
          {activeDomainRuntimeState !== "success" ? (
            <article className={`module-card runtime-state-banner state-${activeDomainRuntimeState}`}>
              <SectionHeader
                title={translate("runtimeStateSectionTitle")}
                status={activeDomainRuntimeState}
                statusLabel={translate("runtimeStateModeLabel")}
                language={language}
              />
              <div className="form-grid">
                <p className="runtime-state-copy">
                  {runtimeStateDescription(activeDomainRuntimeState, translate)}
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
              {visibleModulesForDomain.length === 0 ? (
                <article className="module-card">
                  <p className="empty-state">{translate("noModulesForSelectedDomain")}</p>
                </article>
              ) : null}
          {isModuleVisible("onboarding", activeDomain) ? (
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

          {isModuleVisible("training", activeDomain) ? (
            <article className="module-card">
            <SectionHeader
              title={translate("trainingSectionTitle")}
              status={trainingStatus}
              statusLabel={translate("planStatusLabel")}
              language={language}
            />
            <div className="form-grid">
              <div className="inline-inputs">
                <input
                  aria-label={translate("planNamePlaceholder")}
                  placeholder={translate("planNamePlaceholder")}
                  value={planName}
                  onChange={(event) => setPlanName(event.target.value)}
                />
                <button className="button primary" onClick={handleCreatePlan} type="button">
                  {translate("createPlan")}
                </button>
                <button className="button ghost" onClick={handleLoadPlans} type="button">
                  {translate("loadPlans")}
                </button>
              </div>
              <div className="choice-list">
                {plans.map((plan) => (
                  <label key={plan.id}>
                    <input
                      type="radio"
                      name="selected-plan"
                      checked={selectedPlanId === plan.id}
                      onChange={() => setSelectedPlanId(plan.id)}
                    />
                    {plan.name} ({plan.weeks} weeks)
                  </label>
                ))}
              </div>
              <div className="inline-inputs">
                <button className="button primary" onClick={handleLogWorkoutSession} type="button">
                  {translate("logWorkout")}
                </button>
                <button className="button ghost" onClick={handleLoadSessions} type="button">
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
              <div className="inline-inputs">
                <select
                  aria-label={translate("exercisePickerLabel")}
                  value={selectedExerciseForVideos}
                  onChange={(event) => setSelectedExerciseForVideos(event.target.value)}
                >
                  <option value="goblet-squat">goblet-squat</option>
                  <option value="bench-press">bench-press</option>
                </select>
                <select
                  aria-label={translate("videoLocalePickerLabel")}
                  value={videoLocale}
                  onChange={(event) => setVideoLocale(event.target.value)}
                >
                  <option value="es-ES">es-ES</option>
                  <option value="en-US">en-US</option>
                </select>
                <button className="button ghost" onClick={handleLoadExerciseVideos} type="button">
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
                        <a href={video.videoUrl} target="_blank" rel="noreferrer">
                          {translate("openVideo")}
                        </a>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
            </article>
          ) : null}

          {isModuleVisible("operationsHub", activeDomain) ? (
            <article className="module-card">
            <SectionHeader
              title={translate("operationsHubTitle")}
              status={operationsStatus}
              statusLabel={translate("operationsHubStatusLabel")}
              language={language}
            />
            <div className="form-grid">
              <div className="inline-inputs">
                <input
                  aria-label={translate("athleteSearchPlaceholder")}
                  placeholder={translate("athleteSearchPlaceholder")}
                  value={athleteSearch}
                  onChange={(event) => setAthleteSearch(event.target.value)}
                />
                <label className="compact-label">
                  {translate("athleteSortLabel")}
                  <select
                    aria-label={translate("athleteSortLabel")}
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
                <button className="button primary" onClick={handleBulkAssignStarterPlan} type="button">
                  {translate("bulkAssignStarterPlan")}
                </button>
                <button className="button ghost" onClick={handleClearAthleteSelection} type="button">
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
              {athleteOperationRows.length === 0 ? (
                <p className="empty-state">{translate("noAthletesFound")}</p>
              ) : (
                <div className="operations-table">
                  <header className="operations-table-row operations-table-header">
                    <span>{translate("athleteColumn")}</span>
                    <span>{translate("plansColumn")}</span>
                    <span>{translate("sessionsColumn")}</span>
                    <span>{translate("nutritionColumn")}</span>
                    <span>{translate("lastSessionColumn")}</span>
                    <span>{translate("riskColumn")}</span>
                  </header>
                  {athleteOperationRows.map((row) => (
                    <label key={row.athleteId} className="operations-table-row">
                      <div className="operations-athlete-cell">
                        <input
                          type="checkbox"
                          checked={selectedAthleteIds.includes(row.athleteId)}
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
              )}
            </div>
            </article>
          ) : null}

          {isModuleVisible("adminGovernance", activeDomain) ? (
            <article className="module-card">
            <SectionHeader
              title={translate("governanceTitle")}
              status={governanceStatus}
              statusLabel={translate("governanceStatusLabel")}
              language={language}
            />
            <div className="form-grid">
              {!isAdminRole(activeRole) ? (
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
                <button className="button ghost" onClick={handleLoadGovernanceRoleCoverage} type="button">
                  {translate("governanceLoadCapabilities")}
                </button>
                <button className="button primary" onClick={() => void handleAssignGovernanceRole("athlete")} type="button">
                  {translate("governanceAssignAthlete")}
                </button>
                <button className="button primary" onClick={() => void handleAssignGovernanceRole("coach")} type="button">
                  {translate("governanceAssignCoach")}
                </button>
                <button className="button primary" onClick={() => void handleAssignGovernanceRole("admin")} type="button">
                  {translate("governanceAssignAdmin")}
                </button>
                <button className="button ghost" onClick={handleClearGovernanceSelection} type="button">
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
                <div className="operations-table">
                  <header className="operations-table-row operations-table-header">
                    <span>{translate("governancePrincipalColumn")}</span>
                    <span>{translate("governanceRoleColumn")}</span>
                    <span>{translate("governanceSourceColumn")}</span>
                    <span>{translate("governanceCountsColumn")}</span>
                    <span>{translate("governanceAllowedDomainsLabel")}</span>
                    <span>{translate("riskColumn")}</span>
                  </header>
                  {governancePrincipals.map((principal) => (
                    <label key={principal.userId} className="operations-table-row">
                      <div className="operations-athlete-cell">
                        <input
                          type="checkbox"
                          checked={governanceSelectedPrincipalIds.includes(principal.userId)}
                          onChange={() => handleToggleGovernancePrincipalSelection(principal.userId)}
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
                        {principal.plansCount}/{principal.sessionsCount}/{principal.nutritionLogsCount}
                      </span>
                      <span>
                        {
                          (capabilitiesByRole[principal.assignedRole]?.allowedDomains.length ??
                            0)
                        }
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

          {isModuleVisible("auditCompliance", activeDomain) ? (
            <article className="module-card">
            <SectionHeader
              title={translate("auditTitle")}
              status={auditStatus}
              statusLabel={translate("auditStatusLabel")}
              language={language}
            />
            <div className="form-grid">
              <div className="inline-inputs">
                <button className="button ghost" onClick={handleLoadAuditTimeline} type="button">
                  {translate("auditLoadTimeline")}
                </button>
                <button className="button primary" onClick={handleExportAuditCSV} type="button">
                  {translate("auditExportCSV")}
                </button>
                <button className="button ghost" onClick={handleClearAuditFilters} type="button">
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
              {auditTimelineRows.length === 0 ? (
                <p className="empty-state">{translate("auditNoRows")}</p>
              ) : (
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
                  {auditTimelineRows.map((row) => (
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
              )}
            </div>
            </article>
          ) : null}

          {isModuleVisible("recommendations", activeDomain) ? (
            <article className="module-card">
            <SectionHeader
              title={translate("recommendationsTitle")}
              status={recommendationsStatus}
              statusLabel={translate("recommendationsStatusLabel")}
              language={language}
            />
            <div className="form-grid">
              <button className="button primary" onClick={handleLoadRecommendations} type="button">
                {translate("loadRecommendations")}
              </button>
              {recommendations.length === 0 ? (
                <p className="empty-state">{translate("noRecommendationsLoaded")}</p>
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

          {isModuleVisible("nutrition", activeDomain) ? (
            <article className="module-card">
            <SectionHeader
              title={translate("nutritionTitle")}
              status={nutritionStatus}
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
                <button className="button primary" onClick={handleCreateNutritionLog} type="button">
                  {translate("saveNutritionLog")}
                </button>
                <button className="button ghost" onClick={handleLoadNutritionLogs} type="button">
                  {translate("loadLogs")}
                </button>
              </div>
              <p className="section-subtitle">{translate("nutritionFiltersLabel")}</p>
              <div className="inline-inputs">
                <input
                  aria-label={translate("nutritionDateFilterPlaceholder")}
                  placeholder={translate("nutritionDateFilterPlaceholder")}
                  value={nutritionDateFilter}
                  onChange={(event) => setNutritionDateFilter(event.target.value)}
                />
                <input
                  aria-label={translate("nutritionMinProteinPlaceholder")}
                  placeholder={translate("nutritionMinProteinPlaceholder")}
                  value={nutritionMinProteinFilter}
                  onChange={(event) => setNutritionMinProteinFilter(event.target.value)}
                />
                <input
                  aria-label={translate("nutritionMaxCaloriesPlaceholder")}
                  placeholder={translate("nutritionMaxCaloriesPlaceholder")}
                  value={nutritionMaxCaloriesFilter}
                  onChange={(event) => setNutritionMaxCaloriesFilter(event.target.value)}
                />
              </div>
              <div className="inline-inputs">
                <label className="compact-label">
                  {translate("nutritionSortLabel")}
                  <select
                    aria-label={translate("nutritionSortLabel")}
                    value={nutritionSortMode}
                    onChange={(event) =>
                      setNutritionSortMode(event.target.value as NutritionSortMode)
                    }
                  >
                    <option value="date_desc">{translate("nutritionSortByDate")}</option>
                    <option value="calories_desc">{translate("nutritionSortByCalories")}</option>
                    <option value="protein_desc">{translate("nutritionSortByProtein")}</option>
                  </select>
                </label>
                <button className="button ghost" onClick={handleClearNutritionFilters} type="button">
                  {translate("clearNutritionFilters")}
                </button>
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
              {filteredNutritionLogs.length === 0 ? (
                <p className="empty-state">{translate("noNutritionFilteredLogs")}</p>
              ) : (
                <div className="history-list">
                  {filteredNutritionLogs.map((log) => (
                    <article key={`${log.userId}-${log.date}`} className="history-item">
                      <strong>{log.date}</strong>
                      <div className="history-values">
                        <span>{translate("caloriesPlaceholder")} {log.calories}</span>
                        <span>{translate("proteinPlaceholder")} {log.proteinGrams}</span>
                        <span>{translate("carbsPlaceholder")} {log.carbsGrams}</span>
                        <span>{translate("fatsPlaceholder")} {log.fatsGrams}</span>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
            </article>
          ) : null}

          {isModuleVisible("progress", activeDomain) ? (
            <article className="module-card">
            <SectionHeader
              title={translate("progressTitle")}
              status={progressStatus}
              statusLabel={translate("progressStatusLabel")}
              language={language}
            />
            <div className="form-grid">
              <button className="button primary" onClick={handleLoadProgressSummary} type="button">
                {translate("loadProgressSummary")}
              </button>
              {progressSummary === null ? (
                <p className="empty-state">{translate("noSummaryLoaded")}</p>
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

          {isModuleVisible("offlineSync", activeDomain) ? (
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
            </div>
            </article>
          ) : null}

          {isModuleVisible("settings", activeDomain) ? (
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

          {isModuleVisible("legal", activeDomain) ? (
            <article className="module-card">
            <SectionHeader
              title={translate("legalSectionTitle")}
              status={legalStatus}
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
                <button className="button primary" onClick={handleSubmitLegalConsent} type="button">
                  {translate("saveConsent")}
                </button>
                <button className="button ghost" onClick={handleExportData} type="button">
                  {translate("exportData")}
                </button>
                <button className="button ghost" onClick={handleRequestDataDeletion} type="button">
                  {translate("requestDeletion")}
                </button>
              </div>
            </div>
            </article>
          ) : null}

          {isModuleVisible("observability", activeDomain) ? (
            <article className="module-card">
            <SectionHeader
              title={translate("observabilityTitle")}
              status={observabilityStatus}
              statusLabel={translate("observabilityStatusLabel")}
              language={language}
            />
            <div className="form-grid">
              <div className="inline-inputs">
                <button className="button primary" onClick={handleTrackAnalyticsEvent} type="button">
                  {translate("trackEvent")}
                </button>
                <button className="button ghost" onClick={handleReportDemoCrash} type="button">
                  {translate("reportCrash")}
                </button>
                <button className="button ghost" onClick={handleLoadObservabilityData} type="button">
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

function SectionHeader({ title, statusLabel, status, language }: SectionHeaderProps) {
  return (
    <header className="module-header">
      <h2>{title}</h2>
      <p>
        {statusLabel}:{" "}
        <span className={`status-pill status-${toStatusClass(status)}`}>
          {toHumanStatus(status, language)}
        </span>
      </p>
    </header>
  );
}

type MetricProps = {
  title: string;
  value: string;
};

function Metric({ title, value }: MetricProps) {
  return (
    <article className="metric-item">
      <p>{title}</p>
      <strong>{value}</strong>
    </article>
  );
}

type StatLineProps = {
  label: string;
  value: string;
  language: AppLanguage;
};

function StatLine({ label, value, language }: StatLineProps) {
  return (
    <p className="stat-line">
      <span>{label}</span>
      <strong>{toHumanStatus(value, language)}</strong>
    </p>
  );
}

function toHumanStatus(status: string, language: AppLanguage): string {
  return humanizeStatus(status, language);
}

function toStatusClass(status: string): string {
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
    return "all";
  }
  const domainFromURL = readDashboardDomainFromURL(window.location.href);
  if (domainFromURL !== null) {
    return domainFromURL;
  }
  return resolveDashboardDomain(window.localStorage.getItem(dashboardDomainStorageKey));
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
