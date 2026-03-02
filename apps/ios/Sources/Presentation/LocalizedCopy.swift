import Foundation

public enum SupportedLanguage: String, CaseIterable, Sendable {
  case es
  case en
}

public enum CopyKey: Sendable {
  case appName
  case heroTitle
  case todayTab
  case progressTab
  case progressTitle
  case operationsTab
  case progressNavigationTitle
  case operationsNavigationTitle
  case overallStatusLabel
  case languageLabel
  case languageOptionSpanish
  case languageOptionEnglish
  case domainFilterLabel
  case domainAll
  case domainOnboarding
  case domainTraining
  case domainNutrition
  case domainProgress
  case domainOperations
  case roleLabel
  case roleAthlete
  case roleCoach
  case roleAdmin
  case noModulesForSelectedDomain
  case runtimeStateSectionTitle
  case runtimeStateModeLabel
  case runtimeStateHintAllDomains
  case runtimeStateRecoveryAction
  case runtimeStateSuccessDescription
  case runtimeStateLoadingDescription
  case runtimeStateEmptyDescription
  case runtimeStateErrorDescription
  case runtimeStateOfflineDescription
  case runtimeStateDeniedDescription
  case offlineSyncTitle
  case syncQueue
  case refreshQueue
  case pendingActionsLabel
  case rejectedLastSyncLabel
  case idempotencyKeyLabel
  case idempotencyReplayLabel
  case idempotencyReplayYes
  case idempotencyReplayNo
  case idempotencyTTLLabel
  case observabilityTitle
  case trackEvent
  case reportCrash
  case loadData
  case loadProgress
  case analyticsEventsLabel
  case crashReportsLabel
  case supportIncidentsLabel
  case noSupportIncidents
  case incidentDomainLabel
  case incidentSeverityLabel
  case incidentStateLabel
  case incidentCorrelationLabel
  case incidentSummaryLabel
  case readinessLabel
  case dailyObjective
  case authenticationTitle
  case emailField
  case passwordField
  case signInWithApple
  case signInWithEmail
  case recoverByEmail
  case recoverBySMS
  case authStatusLabel
  case onboardingTitle
  case displayName
  case age
  case days
  case chestPainQuestion
  case dizzinessQuestion
  case acceptPrivacyPolicy
  case acceptTerms
  case acceptMedicalDisclaimer
  case completeOnboarding
  case onboardingStatusLabel
  case nutritionTitle
  case nutritionDate
  case calories
  case protein
  case carbs
  case fats
  case saveLog
  case loadLogs
  case nutritionStatusLabel
  case nutritionLogsLoaded
  case noProgressLoaded
  case progressWorkoutsLabel
  case progressMinutesLabel
  case progressSetsLabel
  case progressNutritionLogsLabel
  case progressAverageCaloriesLabel
  case progressAverageProteinLabel
  case progressAverageCarbsLabel
  case progressAverageFatsLabel
  case progressEntrySessionsLabel
  case progressEntryMinutesLabel
  case progressEntrySetsLabel
  case progressEntryCaloriesLabel
  case recommendationsTitle
  case loadRecommendations
  case recommendationsStatusLabel
  case noRecommendations
  case trainingTitle
  case trainingCockpitTitle
  case refreshTrainingCockpit
  case planName
  case createPlan
  case plansLoadedLabel
  case noPlansYet
  case logDemoSession
  case sessionsLabel
  case todaySessionsLabel
  case statusLabel
  case sessionStatusLabel
  case lastSessionLabel
  case exerciseVideosTitle
  case exercisePicker
  case localePicker
  case loadVideos
  case videoStatusLabel
  case videoFallbackNotice
  case videoOfflineNotice
  case videoEmptyNotice
  case noVideosLoaded
  case openVideo
  case settingsTitle
  case settingsStatusLabel
  case notificationsPreference
  case watchPreference
  case calendarPreference
  case saveSettings
  case legalSectionTitle
  case legalStatusLabel
  case legalSummaryLabel
  case saveConsent
  case exportData
  case requestDeletion
}

public struct LocalizedCopy: Sendable {
  public let language: SupportedLanguage

  public init(language: SupportedLanguage) {
    self.language = language
  }

  public var recommendationLocale: String {
    switch language {
    case .es:
      return "es-ES"
    case .en:
      return "en-US"
    }
  }

  public func text(_ key: CopyKey) -> String {
    switch language {
    case .es:
      return spanishCopy(for: key)
    case .en:
      return englishCopy(for: key)
    }
  }

  public func readinessLabel(_ label: UXReadinessLabel) -> String {
    switch language {
    case .es:
      switch label {
      case .readyToTrain:
        return "Listo para entrenar"
      case .warmingUp:
        return "Calentando"
      case .needsSetup:
        return "Necesita configuracion"
      }
    case .en:
      switch label {
      case .readyToTrain:
        return "Ready to train"
      case .warmingUp:
        return "Warming up"
      case .needsSetup:
        return "Needs setup"
      }
    }
  }

  public func humanStatus(_ rawStatus: String) -> String {
    let normalizedStatus = rawStatus.trimmingCharacters(in: .whitespacesAndNewlines)
      .lowercased()
    if normalizedStatus.isEmpty {
      return language == .es ? "inactivo" : "idle"
    }

    if normalizedStatus.hasPrefix("signed_in:") {
      let provider = String(normalizedStatus.split(separator: ":").last ?? "")
      switch language {
      case .es:
        return "sesion iniciada \(provider)"
      case .en:
        return "signed in \(provider)"
      }
    }

    let labels: [SupportedLanguage: [String: String]] = [
      .es: [
        "signed_out": "sin sesion",
        "auth_error": "error de auth",
        "validation_error": "error de validacion",
        "consent_required": "consentimiento requerido",
        "recovery_sent_email": "recuperacion enviada por email",
        "recovery_sent_sms": "recuperacion enviada por sms",
        "session_active": "sesion activa",
        "fallback_loaded": "fallback cargado",
        "idle": "inactivo",
        "saved": "guardado",
        "loaded": "cargado",
        "queued": "en cola",
        "synced": "sincronizado",
        "event_saved": "evento guardado",
        "crash_saved": "crash guardado",
        "error": "error",
        "deletion_requested": "borrado solicitado",
        "exported": "exportado",
        "success": "operativo",
        "loading": "cargando",
        "empty": "sin datos",
        "offline": "sin conexion",
        "denied": "sin permiso",
        "open": "abierta",
        "in_progress": "en progreso",
        "resolved": "resuelta",
        "high": "alta",
        "medium": "media",
        "low": "baja"
      ],
      .en: [
        "signed_out": "signed out",
        "auth_error": "auth error",
        "validation_error": "validation error",
        "consent_required": "consent required",
        "recovery_sent_email": "recovery sent by email",
        "recovery_sent_sms": "recovery sent by sms",
        "session_active": "session active",
        "fallback_loaded": "fallback loaded",
        "idle": "idle",
        "saved": "saved",
        "loaded": "loaded",
        "queued": "queued",
        "synced": "synced",
        "event_saved": "event saved",
        "crash_saved": "crash saved",
        "error": "error",
        "deletion_requested": "deletion requested",
        "exported": "exported",
        "success": "operational",
        "loading": "loading",
        "empty": "empty",
        "offline": "offline",
        "denied": "denied",
        "open": "open",
        "in_progress": "in progress",
        "resolved": "resolved",
        "high": "high",
        "medium": "medium",
        "low": "low"
      ]
    ]

    if let localized = labels[language]?[normalizedStatus] {
      return localized
    }

    return normalizedStatus.replacingOccurrences(of: "_", with: " ")
  }
}

private func spanishCopy(for key: CopyKey) -> String {
  switch key {
  case .appName:
    return "Flux Training"
  case .heroTitle:
    return "Entrena con foco y seguimiento real"
  case .todayTab:
    return "Hoy"
  case .progressTab:
    return "Progreso"
  case .progressTitle:
    return "Resumen de progreso"
  case .operationsTab:
    return "Ops"
  case .progressNavigationTitle:
    return "Progreso"
  case .operationsNavigationTitle:
    return "Operaciones"
  case .overallStatusLabel:
    return "Estado general"
  case .languageLabel:
    return "Idioma"
  case .languageOptionSpanish:
    return "ES"
  case .languageOptionEnglish:
    return "EN"
  case .domainFilterLabel:
    return "Dominio"
  case .domainAll:
    return "Todo"
  case .domainOnboarding:
    return "Onboarding"
  case .domainTraining:
    return "Entrenamiento"
  case .domainNutrition:
    return "Nutricion"
  case .domainProgress:
    return "Progreso"
  case .domainOperations:
    return "Operaciones"
  case .roleLabel:
    return "Rol"
  case .roleAthlete:
    return "Atleta"
  case .roleCoach:
    return "Coach"
  case .roleAdmin:
    return "Admin"
  case .noModulesForSelectedDomain:
    return "No hay modulos en esta seccion para el dominio seleccionado"
  case .runtimeStateSectionTitle:
    return "Estado enterprise por dominio"
  case .runtimeStateModeLabel:
    return "Modo runtime"
  case .runtimeStateHintAllDomains:
    return "Selecciona un dominio concreto para simular estados de riesgo"
  case .runtimeStateRecoveryAction:
    return "Recuperar dominio"
  case .runtimeStateSuccessDescription:
    return "Dominio operativo. El flujo principal esta disponible."
  case .runtimeStateLoadingDescription:
    return "Carga en curso. Mostrando estado intermedio."
  case .runtimeStateEmptyDescription:
    return "Sin datos para este dominio. Requiere inicializacion."
  case .runtimeStateErrorDescription:
    return "Error operativo detectado. Necesita reintento controlado."
  case .runtimeStateOfflineDescription:
    return "Sin conexion. Opera en cola hasta recuperar red."
  case .runtimeStateDeniedDescription:
    return "Permiso denegado para este dominio segun rol activo."
  case .offlineSyncTitle:
    return "Offline + Sync"
  case .syncQueue:
    return "Sincronizar cola"
  case .refreshQueue:
    return "Refrescar cola"
  case .pendingActionsLabel:
    return "Acciones pendientes"
  case .rejectedLastSyncLabel:
    return "Rechazadas en ultimo sync"
  case .idempotencyKeyLabel:
    return "Clave idempotencia"
  case .idempotencyReplayLabel:
    return "Replay idempotente"
  case .idempotencyReplayYes:
    return "si"
  case .idempotencyReplayNo:
    return "no"
  case .idempotencyTTLLabel:
    return "TTL idempotencia"
  case .observabilityTitle:
    return "Observabilidad"
  case .trackEvent:
    return "Registrar evento"
  case .reportCrash:
    return "Reportar crash"
  case .loadData:
    return "Cargar datos"
  case .loadProgress:
    return "Cargar progreso"
  case .analyticsEventsLabel:
    return "Eventos de analitica"
  case .crashReportsLabel:
    return "Crash reports"
  case .supportIncidentsLabel:
    return "Incidencias de soporte"
  case .noSupportIncidents:
    return "No hay incidencias de soporte cargadas"
  case .incidentDomainLabel:
    return "Dominio"
  case .incidentSeverityLabel:
    return "Severidad"
  case .incidentStateLabel:
    return "Estado"
  case .incidentCorrelationLabel:
    return "Correlacion"
  case .incidentSummaryLabel:
    return "Resumen"
  case .readinessLabel:
    return "Readiness"
  case .dailyObjective:
    return "Objetivo diario: completar entrenamiento y nutricion sin acciones pendientes."
  case .authenticationTitle:
    return "Autenticacion"
  case .emailField:
    return "Correo"
  case .passwordField:
    return "Contrasena"
  case .signInWithApple:
    return "Iniciar con Apple"
  case .signInWithEmail:
    return "Iniciar con email"
  case .recoverByEmail:
    return "Recuperar por email"
  case .recoverBySMS:
    return "Recuperar por SMS"
  case .authStatusLabel:
    return "Auth"
  case .onboardingTitle:
    return "Onboarding + PAR-Q+"
  case .displayName:
    return "Nombre"
  case .age:
    return "Edad"
  case .days:
    return "Dias"
  case .chestPainQuestion:
    return "Dolor de pecho en actividad fisica"
  case .dizzinessQuestion:
    return "Mareos durante el ejercicio"
  case .acceptPrivacyPolicy:
    return "Acepto politica de privacidad"
  case .acceptTerms:
    return "Acepto terminos y condiciones"
  case .acceptMedicalDisclaimer:
    return "He leido el disclaimer medico"
  case .completeOnboarding:
    return "Completar onboarding"
  case .onboardingStatusLabel:
    return "Onboarding"
  case .nutritionTitle:
    return "Nutricion"
  case .nutritionDate:
    return "Fecha (AAAA-MM-DD)"
  case .calories:
    return "Calorias"
  case .protein:
    return "Proteina"
  case .carbs:
    return "Carbohidratos"
  case .fats:
    return "Grasas"
  case .saveLog:
    return "Guardar registro"
  case .loadLogs:
    return "Cargar registros"
  case .nutritionStatusLabel:
    return "Nutricion"
  case .nutritionLogsLoaded:
    return "Registros cargados"
  case .noProgressLoaded:
    return "Todavia no hay progreso cargado"
  case .progressWorkoutsLabel:
    return "Entrenamientos"
  case .progressMinutesLabel:
    return "Minutos"
  case .progressSetsLabel:
    return "Series"
  case .progressNutritionLogsLabel:
    return "Registros de nutricion"
  case .progressAverageCaloriesLabel:
    return "Calorias promedio"
  case .progressAverageProteinLabel:
    return "Proteina promedio"
  case .progressAverageCarbsLabel:
    return "Carbohidratos promedio"
  case .progressAverageFatsLabel:
    return "Grasas promedio"
  case .progressEntrySessionsLabel:
    return "sesiones"
  case .progressEntryMinutesLabel:
    return "minutos"
  case .progressEntrySetsLabel:
    return "series"
  case .progressEntryCaloriesLabel:
    return "calorias"
  case .recommendationsTitle:
    return "Recomendaciones IA"
  case .loadRecommendations:
    return "Cargar recomendaciones IA"
  case .recommendationsStatusLabel:
    return "Recomendaciones"
  case .noRecommendations:
    return "Todavia no hay recomendaciones cargadas"
  case .trainingTitle:
    return "Entrenamiento"
  case .trainingCockpitTitle:
    return "Cockpit diario"
  case .refreshTrainingCockpit:
    return "Actualizar cockpit"
  case .planName:
    return "Nombre del plan"
  case .createPlan:
    return "Crear plan"
  case .plansLoadedLabel:
    return "Planes cargados"
  case .noPlansYet:
    return "Todavia no hay planes"
  case .logDemoSession:
    return "Registrar sesion demo"
  case .sessionsLabel:
    return "Sesiones"
  case .todaySessionsLabel:
    return "Sesiones hoy"
  case .statusLabel:
    return "Estado"
  case .sessionStatusLabel:
    return "Estado de sesion"
  case .lastSessionLabel:
    return "Ultima sesion"
  case .exerciseVideosTitle:
    return "Videos de ejercicios"
  case .exercisePicker:
    return "Ejercicio"
  case .localePicker:
    return "Idioma video"
  case .loadVideos:
    return "Cargar videos"
  case .videoStatusLabel:
    return "Estado de videos"
  case .videoFallbackNotice:
    return "Mostrando fallback EN por falta de video en idioma solicitado."
  case .videoOfflineNotice:
    return "Sin conexion para cargar videos. Reintenta con red disponible."
  case .videoEmptyNotice:
    return "No hay videos para este ejercicio."
  case .noVideosLoaded:
    return "Todavia no hay videos cargados"
  case .openVideo:
    return "Abrir video"
  case .settingsTitle:
    return "Ajustes"
  case .settingsStatusLabel:
    return "Ajustes"
  case .notificationsPreference:
    return "Notificaciones activas"
  case .watchPreference:
    return "Sincronizar Apple Watch"
  case .calendarPreference:
    return "Sincronizar calendario"
  case .saveSettings:
    return "Guardar ajustes"
  case .legalSectionTitle:
    return "Privacidad y consentimiento"
  case .legalStatusLabel:
    return "Legal"
  case .legalSummaryLabel:
    return "Resumen legal"
  case .saveConsent:
    return "Guardar consentimiento"
  case .exportData:
    return "Exportar datos"
  case .requestDeletion:
    return "Solicitar borrado"
  }
}

private func englishCopy(for key: CopyKey) -> String {
  switch key {
  case .appName:
    return "Flux Training"
  case .heroTitle:
    return "Train with focus and real tracking"
  case .todayTab:
    return "Today"
  case .progressTab:
    return "Progress"
  case .progressTitle:
    return "Progress summary"
  case .operationsTab:
    return "Ops"
  case .progressNavigationTitle:
    return "Progress"
  case .operationsNavigationTitle:
    return "Operations"
  case .overallStatusLabel:
    return "Overall status"
  case .languageLabel:
    return "Language"
  case .languageOptionSpanish:
    return "ES"
  case .languageOptionEnglish:
    return "EN"
  case .domainFilterLabel:
    return "Domain"
  case .domainAll:
    return "All"
  case .domainOnboarding:
    return "Onboarding"
  case .domainTraining:
    return "Training"
  case .domainNutrition:
    return "Nutrition"
  case .domainProgress:
    return "Progress"
  case .domainOperations:
    return "Operations"
  case .roleLabel:
    return "Role"
  case .roleAthlete:
    return "Athlete"
  case .roleCoach:
    return "Coach"
  case .roleAdmin:
    return "Admin"
  case .noModulesForSelectedDomain:
    return "No modules are available in this section for the selected domain"
  case .runtimeStateSectionTitle:
    return "Enterprise runtime state by domain"
  case .runtimeStateModeLabel:
    return "Runtime mode"
  case .runtimeStateHintAllDomains:
    return "Select a concrete domain to simulate risky operational states"
  case .runtimeStateRecoveryAction:
    return "Recover domain"
  case .runtimeStateSuccessDescription:
    return "Domain is operational. Main flow is available."
  case .runtimeStateLoadingDescription:
    return "Loading in progress. Showing intermediate state."
  case .runtimeStateEmptyDescription:
    return "No data for this domain. Initialization is required."
  case .runtimeStateErrorDescription:
    return "Operational error detected. Controlled retry is required."
  case .runtimeStateOfflineDescription:
    return "No connection. Queue mode remains active until network returns."
  case .runtimeStateDeniedDescription:
    return "Permission denied for this domain under active role."
  case .offlineSyncTitle:
    return "Offline + Sync"
  case .syncQueue:
    return "Sync queue"
  case .refreshQueue:
    return "Refresh queue"
  case .pendingActionsLabel:
    return "Pending actions"
  case .rejectedLastSyncLabel:
    return "Rejected on last sync"
  case .idempotencyKeyLabel:
    return "Idempotency key"
  case .idempotencyReplayLabel:
    return "Idempotency replay"
  case .idempotencyReplayYes:
    return "yes"
  case .idempotencyReplayNo:
    return "no"
  case .idempotencyTTLLabel:
    return "Idempotency TTL"
  case .observabilityTitle:
    return "Observability"
  case .trackEvent:
    return "Track event"
  case .reportCrash:
    return "Report crash"
  case .loadData:
    return "Load data"
  case .loadProgress:
    return "Load progress"
  case .analyticsEventsLabel:
    return "Analytics events"
  case .crashReportsLabel:
    return "Crash reports"
  case .supportIncidentsLabel:
    return "Support incidents"
  case .noSupportIncidents:
    return "No support incidents loaded"
  case .incidentDomainLabel:
    return "Domain"
  case .incidentSeverityLabel:
    return "Severity"
  case .incidentStateLabel:
    return "State"
  case .incidentCorrelationLabel:
    return "Correlation"
  case .incidentSummaryLabel:
    return "Summary"
  case .readinessLabel:
    return "Readiness"
  case .dailyObjective:
    return "Daily objective: complete training and nutrition without pending actions."
  case .authenticationTitle:
    return "Authentication"
  case .emailField:
    return "Email"
  case .passwordField:
    return "Password"
  case .signInWithApple:
    return "Sign in with Apple"
  case .signInWithEmail:
    return "Sign in with email"
  case .recoverByEmail:
    return "Recover by email"
  case .recoverBySMS:
    return "Recover by SMS"
  case .authStatusLabel:
    return "Auth"
  case .onboardingTitle:
    return "Onboarding + PAR-Q+"
  case .displayName:
    return "Display name"
  case .age:
    return "Age"
  case .days:
    return "Days"
  case .chestPainQuestion:
    return "Chest pain in physical activity"
  case .dizzinessQuestion:
    return "Dizziness during exercise"
  case .acceptPrivacyPolicy:
    return "I accept the privacy policy"
  case .acceptTerms:
    return "I accept terms and conditions"
  case .acceptMedicalDisclaimer:
    return "I have read the medical disclaimer"
  case .completeOnboarding:
    return "Complete onboarding"
  case .onboardingStatusLabel:
    return "Onboarding"
  case .nutritionTitle:
    return "Nutrition"
  case .nutritionDate:
    return "Date (YYYY-MM-DD)"
  case .calories:
    return "Calories"
  case .protein:
    return "Protein"
  case .carbs:
    return "Carbs"
  case .fats:
    return "Fats"
  case .saveLog:
    return "Save log"
  case .loadLogs:
    return "Load logs"
  case .nutritionStatusLabel:
    return "Nutrition"
  case .nutritionLogsLoaded:
    return "Logs loaded"
  case .noProgressLoaded:
    return "No progress loaded yet"
  case .progressWorkoutsLabel:
    return "Workouts"
  case .progressMinutesLabel:
    return "Minutes"
  case .progressSetsLabel:
    return "Sets"
  case .progressNutritionLogsLabel:
    return "Nutrition logs"
  case .progressAverageCaloriesLabel:
    return "Avg calories"
  case .progressAverageProteinLabel:
    return "Avg protein"
  case .progressAverageCarbsLabel:
    return "Avg carbs"
  case .progressAverageFatsLabel:
    return "Avg fats"
  case .progressEntrySessionsLabel:
    return "sessions"
  case .progressEntryMinutesLabel:
    return "minutes"
  case .progressEntrySetsLabel:
    return "sets"
  case .progressEntryCaloriesLabel:
    return "calories"
  case .recommendationsTitle:
    return "AI recommendations"
  case .loadRecommendations:
    return "Load AI recommendations"
  case .recommendationsStatusLabel:
    return "Recommendations"
  case .noRecommendations:
    return "No recommendations loaded yet"
  case .trainingTitle:
    return "Training"
  case .trainingCockpitTitle:
    return "Daily cockpit"
  case .refreshTrainingCockpit:
    return "Refresh cockpit"
  case .planName:
    return "Plan name"
  case .createPlan:
    return "Create plan"
  case .plansLoadedLabel:
    return "Plans loaded"
  case .noPlansYet:
    return "No plans yet"
  case .logDemoSession:
    return "Log demo session"
  case .sessionsLabel:
    return "Sessions"
  case .todaySessionsLabel:
    return "Sessions today"
  case .statusLabel:
    return "Status"
  case .sessionStatusLabel:
    return "Session status"
  case .lastSessionLabel:
    return "Last session"
  case .exerciseVideosTitle:
    return "Exercise videos"
  case .exercisePicker:
    return "Exercise"
  case .localePicker:
    return "Video locale"
  case .loadVideos:
    return "Load videos"
  case .videoStatusLabel:
    return "Video status"
  case .videoFallbackNotice:
    return "Showing EN fallback because requested locale has no video."
  case .videoOfflineNotice:
    return "No connection to load videos. Retry when network is available."
  case .videoEmptyNotice:
    return "No videos available for this exercise."
  case .noVideosLoaded:
    return "No videos loaded yet"
  case .openVideo:
    return "Open video"
  case .settingsTitle:
    return "Settings"
  case .settingsStatusLabel:
    return "Settings"
  case .notificationsPreference:
    return "Notifications enabled"
  case .watchPreference:
    return "Sync Apple Watch"
  case .calendarPreference:
    return "Sync calendar"
  case .saveSettings:
    return "Save settings"
  case .legalSectionTitle:
    return "Privacy and consent"
  case .legalStatusLabel:
    return "Legal"
  case .legalSummaryLabel:
    return "Legal summary"
  case .saveConsent:
    return "Save consent"
  case .exportData:
    return "Export data"
  case .requestDeletion:
    return "Request deletion"
  }
}
