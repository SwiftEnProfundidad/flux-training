import type { Goal } from "@flux/contracts";
import type { UXReadinessSnapshot } from "./ux-readiness";

export type AppLanguage = "es" | "en";

type AppTranslations = {
  appName: string;
  heroTitle: string;
  heroCopy: string;
  signInWithApple: string;
  signInWithEmail: string;
  recoverByEmail: string;
  recoverBySMS: string;
  languageLabel: string;
  emailPlaceholder: string;
  passwordPlaceholder: string;
  displayNamePlaceholder: string;
  agePlaceholder: string;
  heightPlaceholder: string;
  weightPlaceholder: string;
  daysPerWeekPlaceholder: string;
  goalPickerLabel: string;
  planNamePlaceholder: string;
  datePlaceholder: string;
  caloriesPlaceholder: string;
  proteinPlaceholder: string;
  carbsPlaceholder: string;
  fatsPlaceholder: string;
  parQQuestionOne: string;
  parQQuestionTwo: string;
  updateRequiredTitle: string;
  updateRequiredCopy: string;
  onboardingSectionTitle: string;
  onboardingStatusLabel: string;
  completeOnboarding: string;
  legalSectionTitle: string;
  legalStatusLabel: string;
  acceptPrivacyPolicy: string;
  acceptTerms: string;
  acceptMedicalDisclaimer: string;
  legalSummaryLabel: string;
  saveConsent: string;
  exportData: string;
  requestDeletion: string;
  trainingSectionTitle: string;
  planStatusLabel: string;
  operationsHubTitle: string;
  operationsHubStatusLabel: string;
  athleteSearchPlaceholder: string;
  athleteSortLabel: string;
  athleteSortByName: string;
  athleteSortBySessions: string;
  athleteSortByLastSession: string;
  athletesLoadedLabel: string;
  athletesSelectedLabel: string;
  bulkAssignStarterPlan: string;
  clearAthleteSelection: string;
  noAthletesFound: string;
  athleteColumn: string;
  plansColumn: string;
  sessionsColumn: string;
  nutritionColumn: string;
  lastSessionColumn: string;
  riskColumn: string;
  riskNormal: string;
  riskAttention: string;
  governanceTitle: string;
  governanceStatusLabel: string;
  governanceSearchPlaceholder: string;
  governanceRoleFilterLabel: string;
  governanceAllRoles: string;
  governanceLoadCapabilities: string;
  governanceAssignAthlete: string;
  governanceAssignCoach: string;
  governanceAssignAdmin: string;
  governanceClearSelection: string;
  governanceUsersLoadedLabel: string;
  governanceUsersSelectedLabel: string;
  governanceNoUsers: string;
  governancePrincipalColumn: string;
  governanceRoleColumn: string;
  governanceSourceColumn: string;
  governanceCountsColumn: string;
  governanceCoverageTitle: string;
  governanceAllowedDomainsLabel: string;
  governanceSourceOperator: string;
  governanceSourceActivity: string;
  createPlan: string;
  loadPlans: string;
  logWorkout: string;
  loadSessions: string;
  sessionStatusLabel: string;
  sessionsLoadedLabel: string;
  exerciseVideosTitle: string;
  videosStatusLabel: string;
  exercisePickerLabel: string;
  videoLocalePickerLabel: string;
  loadVideos: string;
  noVideosLoaded: string;
  openVideo: string;
  recommendationsTitle: string;
  recommendationsStatusLabel: string;
  loadRecommendations: string;
  noRecommendationsLoaded: string;
  nutritionTitle: string;
  nutritionStatusLabel: string;
  nutritionFiltersLabel: string;
  nutritionDateFilterPlaceholder: string;
  nutritionMinProteinPlaceholder: string;
  nutritionMaxCaloriesPlaceholder: string;
  nutritionSortLabel: string;
  nutritionSortByDate: string;
  nutritionSortByCalories: string;
  nutritionSortByProtein: string;
  clearNutritionFilters: string;
  saveNutritionLog: string;
  loadLogs: string;
  logsLoadedLabel: string;
  filteredLogsLabel: string;
  noNutritionFilteredLogs: string;
  progressTitle: string;
  progressStatusLabel: string;
  progressFiltersLabel: string;
  progressMinSessionsPlaceholder: string;
  progressSortLabel: string;
  progressSortByDate: string;
  progressSortBySessions: string;
  progressSortByMinutes: string;
  clearProgressFilters: string;
  loadProgressSummary: string;
  noSummaryLoaded: string;
  filteredHistoryLabel: string;
  noProgressFilteredHistory: string;
  workoutsMetric: string;
  minutesMetric: string;
  setsMetric: string;
  effortMetric: string;
  nutritionMetric: string;
  avgCaloriesMetric: string;
  avgProteinMetric: string;
  historySessionsLabel: string;
  historyMinutesLabel: string;
  historySetsLabel: string;
  historyCaloriesLabel: string;
  offlineSyncTitle: string;
  syncStatusLabel: string;
  syncQueue: string;
  refreshQueue: string;
  pendingActionsLabel: string;
  rejectedLastSyncLabel: string;
  observabilityTitle: string;
  observabilityStatusLabel: string;
  trackEvent: string;
  reportCrash: string;
  loadData: string;
  analyticsEventsLabel: string;
  crashReportsLabel: string;
  readinessLabel: string;
  authMetric: string;
  queueMetric: string;
  goalMetric: string;
  syncMetric: string;
  domainFilterLabel: string;
  domainAll: string;
  domainOnboarding: string;
  domainTraining: string;
  domainNutrition: string;
  domainProgress: string;
  domainOperations: string;
  roleLabel: string;
  roleAthlete: string;
  roleCoach: string;
  roleAdmin: string;
  retryRoleCapabilities: string;
  noModulesForSelectedDomain: string;
  runtimeStateSectionTitle: string;
  runtimeStateModeLabel: string;
  runtimeStateHintAllDomains: string;
  runtimeStateRecoveryAction: string;
  runtimeStateSuccessDescription: string;
  runtimeStateLoadingDescription: string;
  runtimeStateEmptyDescription: string;
  runtimeStateErrorDescription: string;
  runtimeStateOfflineDescription: string;
  runtimeStateDeniedDescription: string;
  settingsTitle: string;
  settingsStatusLabel: string;
  saveSettings: string;
  notificationsPreference: string;
  watchPreference: string;
  calendarPreference: string;
};

const translations: Record<AppLanguage, AppTranslations> = {
  es: {
    appName: "Flux Training",
    heroTitle: "Entrena con foco y seguimiento real",
    heroCopy: "Panel personal para autenticacion, onboarding, rutina, nutricion y operacion.",
    signInWithApple: "Iniciar con Apple",
    signInWithEmail: "Iniciar con email",
    recoverByEmail: "Recuperar por email",
    recoverBySMS: "Recuperar por SMS",
    languageLabel: "Idioma",
    emailPlaceholder: "correo",
    passwordPlaceholder: "contrasena",
    displayNamePlaceholder: "nombre",
    agePlaceholder: "edad",
    heightPlaceholder: "altura cm",
    weightPlaceholder: "peso kg",
    daysPerWeekPlaceholder: "dias por semana",
    goalPickerLabel: "objetivo",
    planNamePlaceholder: "nombre del plan",
    datePlaceholder: "fecha (AAAA-MM-DD)",
    caloriesPlaceholder: "calorias",
    proteinPlaceholder: "proteina g",
    carbsPlaceholder: "carbohidratos g",
    fatsPlaceholder: "grasas g",
    parQQuestionOne: "PAR-Q pregunta 1",
    parQQuestionTwo: "PAR-Q pregunta 2",
    updateRequiredTitle: "Actualizacion requerida",
    updateRequiredCopy:
      "Tu cliente esta desactualizado para esta beta. Actualiza a la ultima version para continuar.",
    onboardingSectionTitle: "Onboarding + PAR-Q+",
    onboardingStatusLabel: "Onboarding",
    completeOnboarding: "Completar onboarding",
    legalSectionTitle: "Privacidad y consentimiento",
    legalStatusLabel: "Legal",
    acceptPrivacyPolicy: "Acepto politica de privacidad",
    acceptTerms: "Acepto terminos y condiciones",
    acceptMedicalDisclaimer: "He leido el disclaimer medico",
    legalSummaryLabel: "Resumen legal",
    saveConsent: "Guardar consentimiento",
    exportData: "Exportar datos",
    requestDeletion: "Solicitar borrado",
    trainingSectionTitle: "Entrenamiento",
    planStatusLabel: "Plan",
    operationsHubTitle: "Operaciones core",
    operationsHubStatusLabel: "Operaciones",
    athleteSearchPlaceholder: "buscar atleta",
    athleteSortLabel: "ordenar por",
    athleteSortByName: "nombre",
    athleteSortBySessions: "sesiones",
    athleteSortByLastSession: "ultima sesion",
    athletesLoadedLabel: "Atletas cargados",
    athletesSelectedLabel: "Atletas seleccionados",
    bulkAssignStarterPlan: "Asignar starter plan",
    clearAthleteSelection: "Limpiar seleccion",
    noAthletesFound: "No hay atletas para este filtro.",
    athleteColumn: "Atleta",
    plansColumn: "Planes",
    sessionsColumn: "Sesiones",
    nutritionColumn: "Nutricion",
    lastSessionColumn: "Ultima sesion",
    riskColumn: "Riesgo",
    riskNormal: "Normal",
    riskAttention: "Atencion",
    governanceTitle: "Usuarios + roles + RBAC",
    governanceStatusLabel: "Governance",
    governanceSearchPlaceholder: "buscar usuario",
    governanceRoleFilterLabel: "filtro de rol",
    governanceAllRoles: "todos los roles",
    governanceLoadCapabilities: "Cargar matriz RBAC",
    governanceAssignAthlete: "Asignar atleta",
    governanceAssignCoach: "Asignar coach",
    governanceAssignAdmin: "Asignar admin",
    governanceClearSelection: "Limpiar seleccion governance",
    governanceUsersLoadedLabel: "Usuarios cargados",
    governanceUsersSelectedLabel: "Usuarios seleccionados",
    governanceNoUsers: "No hay usuarios para este filtro.",
    governancePrincipalColumn: "Usuario",
    governanceRoleColumn: "Rol asignado",
    governanceSourceColumn: "Origen",
    governanceCountsColumn: "Carga",
    governanceCoverageTitle: "Cobertura RBAC por rol",
    governanceAllowedDomainsLabel: "Dominios permitidos",
    governanceSourceOperator: "operador",
    governanceSourceActivity: "actividad",
    createPlan: "Crear plan",
    loadPlans: "Cargar planes",
    logWorkout: "Registrar sesion demo",
    loadSessions: "Cargar sesiones",
    sessionStatusLabel: "Estado de sesion",
    sessionsLoadedLabel: "Sesiones cargadas",
    exerciseVideosTitle: "Videos de ejercicios",
    videosStatusLabel: "Videos",
    exercisePickerLabel: "ejercicio",
    videoLocalePickerLabel: "idioma del video",
    loadVideos: "Cargar videos",
    noVideosLoaded: "Todavia no hay videos cargados.",
    openVideo: "Abrir video",
    recommendationsTitle: "Recomendaciones IA",
    recommendationsStatusLabel: "Recomendaciones",
    loadRecommendations: "Cargar recomendaciones IA",
    noRecommendationsLoaded: "Todavia no hay recomendaciones cargadas.",
    nutritionTitle: "Nutricion",
    nutritionStatusLabel: "Nutricion",
    nutritionFiltersLabel: "Filtros de nutricion",
    nutritionDateFilterPlaceholder: "filtrar por fecha",
    nutritionMinProteinPlaceholder: "proteina minima",
    nutritionMaxCaloriesPlaceholder: "calorias maximas",
    nutritionSortLabel: "orden nutricion",
    nutritionSortByDate: "fecha",
    nutritionSortByCalories: "calorias",
    nutritionSortByProtein: "proteina",
    clearNutritionFilters: "Limpiar filtros nutricion",
    saveNutritionLog: "Guardar registro nutricional",
    loadLogs: "Cargar registros",
    logsLoadedLabel: "Registros cargados",
    filteredLogsLabel: "Registros filtrados",
    noNutritionFilteredLogs: "No hay registros nutricionales para este filtro.",
    progressTitle: "Progreso",
    progressStatusLabel: "Progreso",
    progressFiltersLabel: "Filtros de progreso",
    progressMinSessionsPlaceholder: "sesiones minimas",
    progressSortLabel: "orden progreso",
    progressSortByDate: "fecha",
    progressSortBySessions: "sesiones",
    progressSortByMinutes: "minutos",
    clearProgressFilters: "Limpiar filtros progreso",
    loadProgressSummary: "Cargar resumen de progreso",
    noSummaryLoaded: "Todavia no hay resumen cargado.",
    filteredHistoryLabel: "Dias filtrados",
    noProgressFilteredHistory: "No hay historial para este filtro.",
    workoutsMetric: "Entrenos",
    minutesMetric: "Minutos",
    setsMetric: "Series",
    effortMetric: "Esfuerzo",
    nutritionMetric: "Nutricion",
    avgCaloriesMetric: "Media kcal",
    avgProteinMetric: "Media proteina",
    historySessionsLabel: "sesiones",
    historyMinutesLabel: "minutos",
    historySetsLabel: "series",
    historyCaloriesLabel: "calorias",
    offlineSyncTitle: "Offline + Sync",
    syncStatusLabel: "Sync",
    syncQueue: "Sincronizar cola",
    refreshQueue: "Refrescar cola",
    pendingActionsLabel: "Acciones pendientes",
    rejectedLastSyncLabel: "Rechazadas en ultimo sync",
    observabilityTitle: "Observabilidad",
    observabilityStatusLabel: "Observabilidad",
    trackEvent: "Registrar evento",
    reportCrash: "Reportar crash",
    loadData: "Cargar datos",
    analyticsEventsLabel: "Eventos de analitica",
    crashReportsLabel: "Crash reports",
    readinessLabel: "Readiness",
    authMetric: "Auth",
    queueMetric: "Cola",
    goalMetric: "Objetivo",
    syncMetric: "Sync",
    domainFilterLabel: "Dominio",
    domainAll: "Todo",
    domainOnboarding: "Onboarding",
    domainTraining: "Entrenamiento",
    domainNutrition: "Nutricion",
    domainProgress: "Progreso",
    domainOperations: "Operaciones",
    roleLabel: "Rol",
    roleAthlete: "Atleta",
    roleCoach: "Coach",
    roleAdmin: "Admin",
    retryRoleCapabilities: "Reintentar capacidades",
    noModulesForSelectedDomain: "No hay modulos para el dominio seleccionado.",
    runtimeStateSectionTitle: "Estado enterprise por dominio",
    runtimeStateModeLabel: "Modo runtime",
    runtimeStateHintAllDomains: "Selecciona un dominio concreto para simular estados de riesgo.",
    runtimeStateRecoveryAction: "Recuperar dominio",
    runtimeStateSuccessDescription: "Dominio operativo. El flujo principal esta disponible.",
    runtimeStateLoadingDescription: "Carga en curso. Mostrando estado intermedio.",
    runtimeStateEmptyDescription: "Sin datos para este dominio. Requiere inicializacion.",
    runtimeStateErrorDescription: "Error operativo detectado. Necesita reintento controlado.",
    runtimeStateOfflineDescription: "Sin conexion. Opera en cola hasta recuperar red.",
    runtimeStateDeniedDescription: "Permiso denegado para este dominio segun rol activo.",
    settingsTitle: "Ajustes",
    settingsStatusLabel: "Ajustes",
    saveSettings: "Guardar ajustes",
    notificationsPreference: "Notificaciones activas",
    watchPreference: "Sincronizar Apple Watch",
    calendarPreference: "Sincronizar calendario"
  },
  en: {
    appName: "Flux Training",
    heroTitle: "Train with focus and real tracking",
    heroCopy: "Personal dashboard for auth, onboarding, training, nutrition and operations.",
    signInWithApple: "Sign in with Apple",
    signInWithEmail: "Email sign in",
    recoverByEmail: "Recover by email",
    recoverBySMS: "Recover by SMS",
    languageLabel: "Language",
    emailPlaceholder: "email",
    passwordPlaceholder: "password",
    displayNamePlaceholder: "display name",
    agePlaceholder: "age",
    heightPlaceholder: "height cm",
    weightPlaceholder: "weight kg",
    daysPerWeekPlaceholder: "days per week",
    goalPickerLabel: "goal",
    planNamePlaceholder: "plan name",
    datePlaceholder: "date (YYYY-MM-DD)",
    caloriesPlaceholder: "calories",
    proteinPlaceholder: "protein g",
    carbsPlaceholder: "carbs g",
    fatsPlaceholder: "fats g",
    parQQuestionOne: "PAR-Q question 1",
    parQQuestionTwo: "PAR-Q question 2",
    updateRequiredTitle: "Update required",
    updateRequiredCopy:
      "Your client is outdated for this beta. Update to the latest version to continue.",
    onboardingSectionTitle: "Onboarding + PAR-Q+",
    onboardingStatusLabel: "Onboarding",
    completeOnboarding: "Complete onboarding",
    legalSectionTitle: "Privacy and consent",
    legalStatusLabel: "Legal",
    acceptPrivacyPolicy: "I accept the privacy policy",
    acceptTerms: "I accept terms and conditions",
    acceptMedicalDisclaimer: "I have read the medical disclaimer",
    legalSummaryLabel: "Legal summary",
    saveConsent: "Save consent",
    exportData: "Export data",
    requestDeletion: "Request deletion",
    trainingSectionTitle: "Training",
    planStatusLabel: "Plan",
    operationsHubTitle: "Core operations",
    operationsHubStatusLabel: "Operations",
    athleteSearchPlaceholder: "search athlete",
    athleteSortLabel: "sort by",
    athleteSortByName: "name",
    athleteSortBySessions: "sessions",
    athleteSortByLastSession: "last session",
    athletesLoadedLabel: "Athletes loaded",
    athletesSelectedLabel: "Athletes selected",
    bulkAssignStarterPlan: "Assign starter plan",
    clearAthleteSelection: "Clear selection",
    noAthletesFound: "No athletes match this filter.",
    athleteColumn: "Athlete",
    plansColumn: "Plans",
    sessionsColumn: "Sessions",
    nutritionColumn: "Nutrition",
    lastSessionColumn: "Last session",
    riskColumn: "Risk",
    riskNormal: "Normal",
    riskAttention: "Attention",
    governanceTitle: "Users + roles + RBAC",
    governanceStatusLabel: "Governance",
    governanceSearchPlaceholder: "search user",
    governanceRoleFilterLabel: "role filter",
    governanceAllRoles: "all roles",
    governanceLoadCapabilities: "Load RBAC matrix",
    governanceAssignAthlete: "Assign athlete",
    governanceAssignCoach: "Assign coach",
    governanceAssignAdmin: "Assign admin",
    governanceClearSelection: "Clear governance selection",
    governanceUsersLoadedLabel: "Users loaded",
    governanceUsersSelectedLabel: "Users selected",
    governanceNoUsers: "No users match this filter.",
    governancePrincipalColumn: "User",
    governanceRoleColumn: "Assigned role",
    governanceSourceColumn: "Source",
    governanceCountsColumn: "Load",
    governanceCoverageTitle: "RBAC coverage by role",
    governanceAllowedDomainsLabel: "Allowed domains",
    governanceSourceOperator: "operator",
    governanceSourceActivity: "activity",
    createPlan: "Create plan",
    loadPlans: "Load plans",
    logWorkout: "Log demo workout",
    loadSessions: "Load sessions",
    sessionStatusLabel: "Session status",
    sessionsLoadedLabel: "Sessions loaded",
    exerciseVideosTitle: "Exercise videos",
    videosStatusLabel: "Videos",
    exercisePickerLabel: "exercise",
    videoLocalePickerLabel: "video language",
    loadVideos: "Load videos",
    noVideosLoaded: "No videos loaded yet.",
    openVideo: "Open video",
    recommendationsTitle: "AI recommendations",
    recommendationsStatusLabel: "Recommendations",
    loadRecommendations: "Load AI recommendations",
    noRecommendationsLoaded: "No recommendations loaded yet.",
    nutritionTitle: "Nutrition",
    nutritionStatusLabel: "Nutrition",
    nutritionFiltersLabel: "Nutrition filters",
    nutritionDateFilterPlaceholder: "filter by date",
    nutritionMinProteinPlaceholder: "minimum protein",
    nutritionMaxCaloriesPlaceholder: "maximum calories",
    nutritionSortLabel: "nutrition sort",
    nutritionSortByDate: "date",
    nutritionSortByCalories: "calories",
    nutritionSortByProtein: "protein",
    clearNutritionFilters: "Clear nutrition filters",
    saveNutritionLog: "Save nutrition log",
    loadLogs: "Load logs",
    logsLoadedLabel: "Logs loaded",
    filteredLogsLabel: "Filtered logs",
    noNutritionFilteredLogs: "No nutrition logs match this filter.",
    progressTitle: "Progress",
    progressStatusLabel: "Progress",
    progressFiltersLabel: "Progress filters",
    progressMinSessionsPlaceholder: "minimum sessions",
    progressSortLabel: "progress sort",
    progressSortByDate: "date",
    progressSortBySessions: "sessions",
    progressSortByMinutes: "minutes",
    clearProgressFilters: "Clear progress filters",
    loadProgressSummary: "Load progress summary",
    noSummaryLoaded: "No summary loaded yet.",
    filteredHistoryLabel: "Filtered days",
    noProgressFilteredHistory: "No history matches this filter.",
    workoutsMetric: "Workouts",
    minutesMetric: "Minutes",
    setsMetric: "Sets",
    effortMetric: "Effort",
    nutritionMetric: "Nutrition",
    avgCaloriesMetric: "Avg kcal",
    avgProteinMetric: "Avg protein",
    historySessionsLabel: "sessions",
    historyMinutesLabel: "minutes",
    historySetsLabel: "sets",
    historyCaloriesLabel: "calories",
    offlineSyncTitle: "Offline + Sync",
    syncStatusLabel: "Sync",
    syncQueue: "Sync queue",
    refreshQueue: "Refresh queue",
    pendingActionsLabel: "Pending actions",
    rejectedLastSyncLabel: "Rejected on last sync",
    observabilityTitle: "Observability",
    observabilityStatusLabel: "Observability",
    trackEvent: "Track event",
    reportCrash: "Report crash",
    loadData: "Load data",
    analyticsEventsLabel: "Analytics events",
    crashReportsLabel: "Crash reports",
    readinessLabel: "Readiness",
    authMetric: "Auth",
    queueMetric: "Queue",
    goalMetric: "Goal",
    syncMetric: "Sync",
    domainFilterLabel: "Domain",
    domainAll: "All",
    domainOnboarding: "Onboarding",
    domainTraining: "Training",
    domainNutrition: "Nutrition",
    domainProgress: "Progress",
    domainOperations: "Operations",
    roleLabel: "Role",
    roleAthlete: "Athlete",
    roleCoach: "Coach",
    roleAdmin: "Admin",
    retryRoleCapabilities: "Retry capabilities",
    noModulesForSelectedDomain: "No modules are available for the selected domain.",
    runtimeStateSectionTitle: "Enterprise runtime state by domain",
    runtimeStateModeLabel: "Runtime mode",
    runtimeStateHintAllDomains:
      "Select a concrete domain to simulate risky operational states.",
    runtimeStateRecoveryAction: "Recover domain",
    runtimeStateSuccessDescription: "Domain is operational. Main flow is available.",
    runtimeStateLoadingDescription: "Loading in progress. Showing intermediate state.",
    runtimeStateEmptyDescription: "No data for this domain. Initialization is required.",
    runtimeStateErrorDescription: "Operational error detected. Controlled retry is required.",
    runtimeStateOfflineDescription: "No connection. Queue mode remains active until network returns.",
    runtimeStateDeniedDescription: "Permission denied for this domain under active role.",
    settingsTitle: "Settings",
    settingsStatusLabel: "Settings",
    saveSettings: "Save settings",
    notificationsPreference: "Notifications enabled",
    watchPreference: "Sync Apple Watch",
    calendarPreference: "Sync calendar"
  }
};

type TranslationKey = keyof AppTranslations;

export function resolveLanguage(rawLanguage: string | null | undefined): AppLanguage {
  if (typeof rawLanguage !== "string") {
    return "es";
  }
  return rawLanguage.toLowerCase().startsWith("en") ? "en" : "es";
}

export function createTranslator(language: AppLanguage): (key: TranslationKey) => string {
  return (key: TranslationKey) => translations[language][key];
}

export function readinessLabel(
  label: UXReadinessSnapshot["label"],
  language: AppLanguage
): string {
  if (label === "ready_to_train") {
    return language === "es" ? "Listo para entrenar" : "Ready to train";
  }
  if (label === "warming_up") {
    return language === "es" ? "Calentando" : "Warming up";
  }
  if (label === "upgrade_required") {
    return language === "es" ? "Actualizacion requerida" : "Upgrade required";
  }
  return language === "es" ? "Necesita configuracion" : "Needs setup";
}

export function goalLabel(goal: Goal, language: AppLanguage): string {
  const labels: Record<AppLanguage, Record<Goal, string>> = {
    es: {
      fat_loss: "Perdida de grasa",
      recomposition: "Recomposicion",
      muscle_gain: "Ganancia muscular",
      habit: "Habito"
    },
    en: {
      fat_loss: "Fat loss",
      recomposition: "Recomposition",
      muscle_gain: "Muscle gain",
      habit: "Habit"
    }
  };
  return labels[language][goal];
}

const knownStatuses: Record<AppLanguage, Record<string, string>> = {
  es: {
    signed_out: "sin sesion",
    validation_error: "error de validacion",
    consent_required: "consentimiento requerido",
    recovery_sent_email: "recuperacion enviada por email",
    recovery_sent_sms: "recuperacion enviada por sms",
    auth_error: "error de auth",
    idle: "inactivo",
    saved: "guardado",
    loaded: "cargado",
    queued: "en cola",
    synced: "sincronizado",
    event_saved: "evento guardado",
    crash_saved: "crash guardado",
    error: "error",
    exported: "exportado",
    deletion_requested: "borrado solicitado",
    success: "operativo",
    loading: "cargando",
    empty: "sin datos",
    offline: "sin conexion",
    denied: "sin permiso",
    upgrade_required: "actualizacion requerida",
    high: "alta",
    medium: "media",
    low: "baja",
    signed_in: "sesion iniciada",
    apple: "apple",
    email: "email"
  },
  en: {
    signed_out: "signed out",
    validation_error: "validation error",
    consent_required: "consent required",
    recovery_sent_email: "recovery sent by email",
    recovery_sent_sms: "recovery sent by sms",
    auth_error: "auth error",
    idle: "idle",
    saved: "saved",
    loaded: "loaded",
    queued: "queued",
    synced: "synced",
    event_saved: "event saved",
    crash_saved: "crash saved",
    error: "error",
    exported: "exported",
    deletion_requested: "deletion requested",
    success: "operational",
    loading: "loading",
    empty: "empty",
    offline: "offline",
    denied: "denied",
    upgrade_required: "upgrade required",
    high: "high",
    medium: "medium",
    low: "low",
    signed_in: "signed in",
    apple: "apple",
    email: "email"
  }
};

export function humanizeStatus(rawStatus: string, language: AppLanguage): string {
  const localizedStatuses = knownStatuses[language];
  const normalizedStatus = rawStatus.trim().toLowerCase();
  if (normalizedStatus.length === 0) {
    return localizedStatuses.idle ?? "idle";
  }

  const direct = localizedStatuses[normalizedStatus];
  if (direct !== undefined) {
    return direct;
  }

  if (normalizedStatus.startsWith("signed_in:")) {
    const provider = normalizedStatus.split(":")[1] ?? "";
    const providerLabel = localizedStatuses[provider] ?? provider;
    const signedInLabel = localizedStatuses.signed_in ?? "signed in";
    return `${signedInLabel} ${providerLabel}`.trim();
  }

  return normalizedStatus.replace(/_/g, " ").replace(/:/g, " ").trim();
}
