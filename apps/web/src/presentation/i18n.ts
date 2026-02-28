import type { Goal } from "@flux/contracts";
import type { UXReadinessSnapshot } from "./ux-readiness";

export type AppLanguage = "es" | "en";

type AppTranslations = {
  appName: string;
  heroTitle: string;
  heroCopy: string;
  signInWithApple: string;
  signInWithEmail: string;
  languageLabel: string;
  emailPlaceholder: string;
  passwordPlaceholder: string;
  displayNamePlaceholder: string;
  agePlaceholder: string;
  heightPlaceholder: string;
  weightPlaceholder: string;
  daysPerWeekPlaceholder: string;
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
  saveConsent: string;
  requestDeletion: string;
  trainingSectionTitle: string;
  planStatusLabel: string;
  createPlan: string;
  loadPlans: string;
  logWorkout: string;
  loadSessions: string;
  sessionStatusLabel: string;
  sessionsLoadedLabel: string;
  exerciseVideosTitle: string;
  videosStatusLabel: string;
  loadVideos: string;
  noVideosLoaded: string;
  openVideo: string;
  recommendationsTitle: string;
  recommendationsStatusLabel: string;
  loadRecommendations: string;
  noRecommendationsLoaded: string;
  nutritionTitle: string;
  nutritionStatusLabel: string;
  saveNutritionLog: string;
  loadLogs: string;
  logsLoadedLabel: string;
  progressTitle: string;
  progressStatusLabel: string;
  loadProgressSummary: string;
  noSummaryLoaded: string;
  workoutsMetric: string;
  minutesMetric: string;
  setsMetric: string;
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
};

const translations: Record<AppLanguage, AppTranslations> = {
  es: {
    appName: "Flux Training",
    heroTitle: "Entrena con foco y seguimiento real",
    heroCopy: "Panel personal para autenticacion, onboarding, rutina, nutricion y operacion.",
    signInWithApple: "Iniciar con Apple",
    signInWithEmail: "Iniciar con email",
    languageLabel: "Idioma",
    emailPlaceholder: "correo",
    passwordPlaceholder: "contrasena",
    displayNamePlaceholder: "nombre",
    agePlaceholder: "edad",
    heightPlaceholder: "altura cm",
    weightPlaceholder: "peso kg",
    daysPerWeekPlaceholder: "dias por semana",
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
    saveConsent: "Guardar consentimiento",
    requestDeletion: "Solicitar borrado",
    trainingSectionTitle: "Entrenamiento",
    planStatusLabel: "Plan",
    createPlan: "Crear plan",
    loadPlans: "Cargar planes",
    logWorkout: "Registrar sesion demo",
    loadSessions: "Cargar sesiones",
    sessionStatusLabel: "Estado de sesion",
    sessionsLoadedLabel: "Sesiones cargadas",
    exerciseVideosTitle: "Videos de ejercicios",
    videosStatusLabel: "Videos",
    loadVideos: "Cargar videos",
    noVideosLoaded: "Todavia no hay videos cargados.",
    openVideo: "Abrir video",
    recommendationsTitle: "Recomendaciones IA",
    recommendationsStatusLabel: "Recomendaciones",
    loadRecommendations: "Cargar recomendaciones IA",
    noRecommendationsLoaded: "Todavia no hay recomendaciones cargadas.",
    nutritionTitle: "Nutricion",
    nutritionStatusLabel: "Nutricion",
    saveNutritionLog: "Guardar registro nutricional",
    loadLogs: "Cargar registros",
    logsLoadedLabel: "Registros cargados",
    progressTitle: "Progreso",
    progressStatusLabel: "Progreso",
    loadProgressSummary: "Cargar resumen de progreso",
    noSummaryLoaded: "Todavia no hay resumen cargado.",
    workoutsMetric: "Entrenos",
    minutesMetric: "Minutos",
    setsMetric: "Series",
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
    syncMetric: "Sync"
  },
  en: {
    appName: "Flux Training",
    heroTitle: "Train with focus and real tracking",
    heroCopy: "Personal dashboard for auth, onboarding, training, nutrition and operations.",
    signInWithApple: "Sign in with Apple",
    signInWithEmail: "Email sign in",
    languageLabel: "Language",
    emailPlaceholder: "email",
    passwordPlaceholder: "password",
    displayNamePlaceholder: "display name",
    agePlaceholder: "age",
    heightPlaceholder: "height cm",
    weightPlaceholder: "weight kg",
    daysPerWeekPlaceholder: "days per week",
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
    saveConsent: "Save consent",
    requestDeletion: "Request deletion",
    trainingSectionTitle: "Training",
    planStatusLabel: "Plan",
    createPlan: "Create plan",
    loadPlans: "Load plans",
    logWorkout: "Log demo workout",
    loadSessions: "Load sessions",
    sessionStatusLabel: "Session status",
    sessionsLoadedLabel: "Sessions loaded",
    exerciseVideosTitle: "Exercise videos",
    videosStatusLabel: "Videos",
    loadVideos: "Load videos",
    noVideosLoaded: "No videos loaded yet.",
    openVideo: "Open video",
    recommendationsTitle: "AI recommendations",
    recommendationsStatusLabel: "Recommendations",
    loadRecommendations: "Load AI recommendations",
    noRecommendationsLoaded: "No recommendations loaded yet.",
    nutritionTitle: "Nutrition",
    nutritionStatusLabel: "Nutrition",
    saveNutritionLog: "Save nutrition log",
    loadLogs: "Load logs",
    logsLoadedLabel: "Logs loaded",
    progressTitle: "Progress",
    progressStatusLabel: "Progress",
    loadProgressSummary: "Load progress summary",
    noSummaryLoaded: "No summary loaded yet.",
    workoutsMetric: "Workouts",
    minutesMetric: "Minutes",
    setsMetric: "Sets",
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
    syncMetric: "Sync"
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
    auth_error: "error de auth",
    idle: "inactivo",
    saved: "guardado",
    loaded: "cargado",
    queued: "en cola",
    synced: "sincronizado",
    event_saved: "evento guardado",
    crash_saved: "crash guardado",
    error: "error",
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
    auth_error: "auth error",
    idle: "idle",
    saved: "saved",
    loaded: "loaded",
    queued: "queued",
    synced: "synced",
    event_saved: "event saved",
    crash_saved: "crash saved",
    error: "error",
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
