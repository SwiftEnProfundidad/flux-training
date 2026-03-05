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
  case signInEmailSubtitle
  case authEmailHelpText
  case applePermissionsTitle
  case applePermissionsSubtitle
  case applePermissionNameEmail
  case applePermissionHealthKitRead
  case applePermissionCalendarEvents
  case applePermissionRequiredCount
  case appleUseEmailInstead
  case verifyOTPTitle
  case otpSubtitle
  case otpCodeField
  case otpExpirationHint
  case verifyCodeAction
  case resendOTPAction
  case recoverAccountTitle
  case recoverAccountSubtitle
  case recoveryMethodLabel
  case openSupportTicketAction
  case sessionExpiredTitle
  case sessionExpiredMessage
  case sessionExpiredCauses
  case backToSignInAction
  case openOfflineModeAction
  case emailField
  case passwordField
  case signInWithApple
  case signInWithEmail
  case recoverByEmail
  case recoverBySMS
  case authStatusLabel
  case rememberMe
  case forgotPassword
  case signOutAction
  case onboardingTitle
  case onboardingStepOneSubtitle
  case displayName
  case age
  case days
  case chestPainQuestion
  case dizzinessQuestion
  case parQBoneJointQuestion
  case parQWarning
  case parQMedicalClearanceAction
  case acceptPrivacyPolicy
  case acceptTerms
  case acceptMedicalDisclaimer
  case policySummaryLine
  case termsSummaryLine
  case medicalDisclaimerSummaryLine
  case yesOption
  case noOption
  case acceptAndContinue
  case continueAction
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
  case nutritionStageOverview
  case nutritionStageLog
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
  case progressStageOverview
  case progressStageWeeklyReview
  case progressStageGoal
  case progressStageCoach
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
  case trainingStageToday
  case trainingStagePlan
  case trainingStageSetup
  case trainingStageWorkout
  case trainingStageRPE
  case trainingStageSubstitution
  case trainingStageLibrary
  case trainingStageVideo
  case trainingStageSummary
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
  case inWorkoutSetupTitle
  case inWorkoutSetupDescription
  case startInWorkoutSetup
  case setupStatusLabel
  case inWorkoutSetupNoPlan
  case inWorkoutSetupReady
  case rpeRatingTitle
  case rpeRatingDescription
  case selectedRPELabel
  case submitRPEAction
  case rpeSavedMessage
  case substitutionTitle
  case substitutionDescription
  case currentExerciseLabel
  case substituteExerciseLabel
  case applySubstitutionAction
  case substitutionStatusLabel
  case substitutionSavedMessage
  case substitutionInvalidSelection
  case exerciseLibraryTitle
  case exerciseLibraryDescription
  case loadExerciseLibraryAction
  case exerciseLibraryStatusLabel
  case noExerciseLibraryResults
  case videoPlayerTitle
  case videoPlayerDescription
  case videoPlayerSelectionLabel
  case playSelectedVideoAction
  case videoPlayerStatusLabel
  case settingsTitle
  case accountProfileTitle
  case notificationsTitle
  case settingsStatusLabel
  case profileStatusLabel
  case notificationsStatusLabel
  case notificationsPreference
  case trainingRemindersPreference
  case recoveryAlertsPreference
  case weeklyDigestPreference
  case watchPreference
  case calendarPreference
  case saveSettings
  case saveProfile
  case saveNotifications
  case goalLabel
  case goalSetupSubtitle
  case weeklySessionsLabel
  case sessionDurationLabel
  case saveGoal
  case parQTitle
  case heightCmLabel
  case weightKgLabel
  case goalFatLoss
  case goalRecomposition
  case goalMuscleGain
  case goalHabit
  case legalSectionTitle
  case legalStatusLabel
  case legalSummaryLabel
  case saveConsent
  case exportData
  case exportDataTitle
  case exportStatusLabel
  case exportGeneratedAtLabel
  case exportPayloadBytesLabel
  case exportPayloadPreviewLabel
  case exportNoPayloadPreview
  case deleteAccountTitle
  case deleteAccountStatusLabel
  case deleteAccountReasonLabel
  case deleteAccountLatestRequestLabel
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
    let canonicalStatus = normalizedStatus
      .replacingOccurrences(of: ":", with: "_")
      .replacingOccurrences(of: "-", with: "_")
      .replacingOccurrences(of: " ", with: "_")
    if normalizedStatus.isEmpty {
      return language == .es ? "listo" : "ready"
    }

    if canonicalStatus.hasPrefix("signed_in_") {
      let provider = String(canonicalStatus.split(separator: "_").last ?? "")
      switch language {
      case .es:
        return "sesion iniciada \(provider)"
      case .en:
        return "signed in \(provider)"
      }
    }

    let labels: [SupportedLanguage: [String: String]] = [
      .es: [
        "signed_out": "inicia sesion",
        "session_required": "inicia sesion",
        "session_expired": "sesion expirada",
        "auth_error": "no pudimos iniciar sesion",
        "validation_error": "error de validacion",
        "consent_required": "consentimiento requerido",
        "recovery_sent_email": "recuperacion enviada por email",
        "recovery_sent_sms": "recuperacion enviada por sms",
        "session_active": "sesion activa",
        "fallback_loaded": "fallback cargado",
        "idle": "listo",
        "saved": "actualizado",
        "loaded": "actualizado",
        "queued": "en cola",
        "synced": "sincronizado",
        "event_saved": "evento guardado",
        "crash_saved": "crash guardado",
        "error": "error",
        "deletion_requested": "borrado solicitado",
        "exported": "exportado",
        "success": "completado",
        "loading": "cargando",
        "empty": "sin datos",
        "offline": "sin conexion",
        "denied": "sin permiso",
        "open": "en revision",
        "in_progress": "en progreso",
        "resolved": "resuelta",
        "high": "alta",
        "medium": "media",
        "low": "baja"
      ],
      .en: [
        "signed_out": "sign in to continue",
        "session_required": "sign in to continue",
        "session_expired": "session expired",
        "auth_error": "sign in failed",
        "validation_error": "validation error",
        "consent_required": "consent required",
        "recovery_sent_email": "recovery sent by email",
        "recovery_sent_sms": "recovery sent by sms",
        "session_active": "session active",
        "fallback_loaded": "fallback loaded",
        "idle": "ready",
        "saved": "updated",
        "loaded": "updated",
        "queued": "queued",
        "synced": "synced",
        "event_saved": "event saved",
        "crash_saved": "crash saved",
        "error": "error",
        "deletion_requested": "deletion requested",
        "exported": "exported",
        "success": "completed",
        "loading": "loading",
        "empty": "empty",
        "offline": "offline",
        "denied": "denied",
        "open": "under review",
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

    if let localized = labels[language]?[canonicalStatus] {
      return localized
    }

    return normalizedStatus.replacingOccurrences(of: "_", with: " ")
  }

  public func authFeedback(_ rawStatus: String) -> String? {
    let normalizedStatus = rawStatus.trimmingCharacters(in: .whitespacesAndNewlines).lowercased()
    if normalizedStatus.isEmpty {
      return nil
    }
    if normalizedStatus == "signed_out" || normalizedStatus == "idle" || normalizedStatus == "loading" {
      return nil
    }
    if normalizedStatus.hasPrefix("signed_in:") {
      switch language {
      case .es:
        return "Sesion iniciada correctamente."
      case .en:
        return "Signed in successfully."
      }
    }

    let messages: [SupportedLanguage: [String: String]] = [
      .es: [
        "validation_error": "Revisa los datos e intentalo de nuevo.",
        "auth_error": "No pudimos iniciar sesion. Intentalo otra vez.",
        "recovery_sent_email": "Te enviamos instrucciones al correo.",
        "recovery_sent_sms": "Te enviamos un codigo por SMS.",
        "session_expired": "Tu sesion expiro. Vuelve a iniciar sesion.",
        "offline": "Sin conexion. Intentalo cuando vuelvas a tener red.",
        "denied": "No tienes permiso para esta accion.",
        "success": "Accion completada correctamente.",
        "open": "Soporte informado. Revisaremos tu caso."
      ],
      .en: [
        "validation_error": "Please review your input and try again.",
        "auth_error": "We couldn't sign you in. Please try again.",
        "recovery_sent_email": "Recovery instructions were sent to your email.",
        "recovery_sent_sms": "A verification code was sent by SMS.",
        "session_expired": "Your session expired. Please sign in again.",
        "offline": "You're offline. Try again when connection is back.",
        "denied": "You don't have permission for this action.",
        "success": "Action completed successfully.",
        "open": "Support was notified. We'll review your case."
      ]
    ]

    if let message = messages[language]?[normalizedStatus] {
      return message
    }
    return humanStatus(normalizedStatus)
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
    return "Ajustes"
  case .progressNavigationTitle:
    return "Progreso"
  case .operationsNavigationTitle:
    return "Ajustes"
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
    return "Preparacion"
  case .dailyObjective:
    return "Objetivo diario: completar entrenamiento y nutricion sin acciones pendientes."
  case .authenticationTitle:
    return "Acceso"
  case .signInEmailSubtitle:
    return "Accede con email y contrasena o usa proveedores seguros."
  case .authEmailHelpText:
    return "Problemas de acceso:\n- Codigo OTP\n- Recuperar cuenta\n- Contactar soporte"
  case .applePermissionsTitle:
    return "Permisos Apple"
  case .applePermissionsSubtitle:
    return "Revisa permisos requeridos antes de continuar."
  case .applePermissionNameEmail:
    return "Nombre y email"
  case .applePermissionHealthKitRead:
    return "Lectura de HealthKit"
  case .applePermissionCalendarEvents:
    return "Eventos del calendario"
  case .applePermissionRequiredCount:
    return "3 de 3 permisos requeridos"
  case .appleUseEmailInstead:
    return "Usar email en su lugar"
  case .verifyOTPTitle:
    return "Verificar OTP"
  case .otpSubtitle:
    return "Introduce el codigo de 6 digitos enviado a tu email."
  case .otpCodeField:
    return "Codigo de 6 digitos"
  case .otpExpirationHint:
    return "El codigo expira en 00:58"
  case .verifyCodeAction:
    return "Verificar codigo"
  case .resendOTPAction:
    return "Reenviar OTP"
  case .recoverAccountTitle:
    return "Recuperar cuenta"
  case .recoverAccountSubtitle:
    return "Elige metodo para recuperar acceso."
  case .recoveryMethodLabel:
    return "Metodo de recuperacion"
  case .openSupportTicketAction:
    return "Abrir ticket de soporte"
  case .sessionExpiredTitle:
    return "Sesion expirada"
  case .sessionExpiredMessage:
    return "Por seguridad, vuelve a iniciar sesion o continua en modo offline."
  case .sessionExpiredCauses:
    return "Posibles causas:\n- Token expirado\n- Sesion cerrada en otro dispositivo\n- Version no compatible"
  case .backToSignInAction:
    return "Volver a iniciar sesion"
  case .openOfflineModeAction:
    return "Abrir modo offline"
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
  case .rememberMe:
    return "recordarme"
  case .forgotPassword:
    return "olvide mi contrasena"
  case .authStatusLabel:
    return "Acceso"
  case .signOutAction:
    return "Cerrar sesion"
  case .onboardingTitle:
    return "Onboarding + PAR-Q+"
  case .onboardingStepOneSubtitle:
    return "Completa tu perfil inicial y disponibilidad semanal."
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
  case .parQBoneJointQuestion:
    return "Problema oseo o articular"
  case .parQWarning:
    return "Si alguna respuesta es SI, consulta a tu medico primero."
  case .parQMedicalClearanceAction:
    return "Solicitar aptitud medica"
  case .acceptPrivacyPolicy:
    return "Acepto politica de privacidad"
  case .acceptTerms:
    return "Acepto terminos y condiciones"
  case .acceptMedicalDisclaimer:
    return "He leido el disclaimer medico"
  case .policySummaryLine:
    return "Resumen de politica"
  case .termsSummaryLine:
    return "Resumen de terminos"
  case .medicalDisclaimerSummaryLine:
    return "Disclaimer medico"
  case .yesOption:
    return "Si"
  case .noOption:
    return "No"
  case .acceptAndContinue:
    return "Aceptar y continuar"
  case .continueAction:
    return "Continuar"
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
  case .nutritionStageOverview:
    return "Resumen"
  case .nutritionStageLog:
    return "Registro"
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
  case .progressStageOverview:
    return "Metricas"
  case .progressStageWeeklyReview:
    return "Semanal"
  case .progressStageGoal:
    return "Objetivo"
  case .progressStageCoach:
    return "Coach IA"
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
    return "Registrar sesion"
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
  case .trainingStageToday:
    return "Hoy"
  case .trainingStagePlan:
    return "Plan"
  case .trainingStageSetup:
    return "Preparacion"
  case .trainingStageWorkout:
    return "En sesion"
  case .trainingStageRPE:
    return "RPE"
  case .trainingStageSubstitution:
    return "Sustitucion"
  case .trainingStageLibrary:
    return "Biblioteca"
  case .trainingStageVideo:
    return "Video"
  case .trainingStageSummary:
    return "Resumen"
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
  case .inWorkoutSetupTitle:
    return "Setup de sesion"
  case .inWorkoutSetupDescription:
    return "Prepara plan, ejercicio e idioma antes de iniciar la sesion."
  case .startInWorkoutSetup:
    return "Preparar sesion"
  case .setupStatusLabel:
    return "Estado setup"
  case .inWorkoutSetupNoPlan:
    return "No hay planes para iniciar la sesion."
  case .inWorkoutSetupReady:
    return "Sesion lista para empezar."
  case .rpeRatingTitle:
    return "RPE de la sesion"
  case .rpeRatingDescription:
    return "Registra percepcion de esfuerzo para cerrar la sesion en curso."
  case .selectedRPELabel:
    return "RPE objetivo"
  case .submitRPEAction:
    return "Guardar RPE"
  case .rpeSavedMessage:
    return "RPE guardado en la sesion."
  case .substitutionTitle:
    return "Sustitucion de ejercicio"
  case .substitutionDescription:
    return "Reemplaza el ejercicio actual por una alternativa disponible."
  case .currentExerciseLabel:
    return "Ejercicio actual"
  case .substituteExerciseLabel:
    return "Ejercicio sustituto"
  case .applySubstitutionAction:
    return "Aplicar sustitucion"
  case .substitutionStatusLabel:
    return "Estado sustitucion"
  case .substitutionSavedMessage:
    return "Sustitucion aplicada y sesion actualizada."
  case .substitutionInvalidSelection:
    return "Selecciona un ejercicio distinto al actual."
  case .exerciseLibraryTitle:
    return "Biblioteca de ejercicios"
  case .exerciseLibraryDescription:
    return "Consulta videos disponibles por ejercicio e idioma."
  case .loadExerciseLibraryAction:
    return "Cargar biblioteca"
  case .exerciseLibraryStatusLabel:
    return "Estado biblioteca"
  case .noExerciseLibraryResults:
    return "No hay videos disponibles para este filtro."
  case .videoPlayerTitle:
    return "Reproductor de video"
  case .videoPlayerDescription:
    return "Selecciona un video de la biblioteca y reproducelo en la app."
  case .videoPlayerSelectionLabel:
    return "Video seleccionado"
  case .playSelectedVideoAction:
    return "Reproducir video"
  case .videoPlayerStatusLabel:
    return "Estado reproductor"
  case .settingsTitle:
    return "Ajustes"
  case .accountProfileTitle:
    return "Perfil de cuenta"
  case .notificationsTitle:
    return "Notificaciones"
  case .settingsStatusLabel:
    return "Ajustes"
  case .profileStatusLabel:
    return "Perfil"
  case .notificationsStatusLabel:
    return "Notificaciones"
  case .notificationsPreference:
    return "Notificaciones activas"
  case .trainingRemindersPreference:
    return "Recordatorios de entrenamiento"
  case .recoveryAlertsPreference:
    return "Alertas de recuperacion"
  case .weeklyDigestPreference:
    return "Resumen semanal"
  case .watchPreference:
    return "Sincronizar Apple Watch"
  case .calendarPreference:
    return "Sincronizar calendario"
  case .saveSettings:
    return "Guardar ajustes"
  case .saveProfile:
    return "Guardar perfil"
  case .saveNotifications:
    return "Guardar notificaciones"
  case .goalLabel:
    return "Objetivo"
  case .goalSetupSubtitle:
    return "Define objetivo principal y compromiso semanal."
  case .weeklySessionsLabel:
    return "Sesiones por semana"
  case .sessionDurationLabel:
    return "Duracion por sesion"
  case .saveGoal:
    return "Guardar objetivo"
  case .parQTitle:
    return "PAR-Q+"
  case .heightCmLabel:
    return "Altura (cm)"
  case .weightKgLabel:
    return "Peso (kg)"
  case .goalFatLoss:
    return "Perdida de grasa"
  case .goalRecomposition:
    return "Recomposicion"
  case .goalMuscleGain:
    return "Ganancia muscular"
  case .goalHabit:
    return "Habito"
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
  case .exportDataTitle:
    return "Exportacion de datos"
  case .exportStatusLabel:
    return "Exportacion"
  case .exportGeneratedAtLabel:
    return "Generado"
  case .exportPayloadBytesLabel:
    return "Tamano (bytes)"
  case .exportPayloadPreviewLabel:
    return "Vista previa"
  case .exportNoPayloadPreview:
    return "No hay contenido exportado todavia."
  case .deleteAccountTitle:
    return "Borrado de cuenta"
  case .deleteAccountStatusLabel:
    return "Borrado"
  case .deleteAccountReasonLabel:
    return "Motivo de borrado"
  case .deleteAccountLatestRequestLabel:
    return "Ultima solicitud"
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
    return "Settings"
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
  case .signInEmailSubtitle:
    return "Use email and password or continue with secure providers."
  case .authEmailHelpText:
    return "Access issues:\n- OTP code\n- Recover account\n- Contact support"
  case .applePermissionsTitle:
    return "Apple permissions"
  case .applePermissionsSubtitle:
    return "Review required scopes before continue."
  case .applePermissionNameEmail:
    return "Name and email"
  case .applePermissionHealthKitRead:
    return "HealthKit read"
  case .applePermissionCalendarEvents:
    return "Calendar events"
  case .applePermissionRequiredCount:
    return "3 of 3 required permissions"
  case .appleUseEmailInstead:
    return "Use email instead"
  case .verifyOTPTitle:
    return "Verify OTP"
  case .otpSubtitle:
    return "Enter the 6-digit code sent to your email."
  case .otpCodeField:
    return "6-digit code"
  case .otpExpirationHint:
    return "Code expires in 00:58"
  case .verifyCodeAction:
    return "Verify code"
  case .resendOTPAction:
    return "Resend OTP"
  case .recoverAccountTitle:
    return "Recover account"
  case .recoverAccountSubtitle:
    return "Choose method to restore access."
  case .recoveryMethodLabel:
    return "Recovery method"
  case .openSupportTicketAction:
    return "Open support ticket"
  case .sessionExpiredTitle:
    return "Session expired"
  case .sessionExpiredMessage:
    return "For security, sign in again or continue in offline mode."
  case .sessionExpiredCauses:
    return "Possible causes:\n- Token expired\n- Remote logout\n- Version mismatch"
  case .backToSignInAction:
    return "Back to sign in"
  case .openOfflineModeAction:
    return "Open offline mode"
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
  case .rememberMe:
    return "remember me"
  case .forgotPassword:
    return "forgot password?"
  case .authStatusLabel:
    return "Access"
  case .signOutAction:
    return "Sign out"
  case .onboardingTitle:
    return "Onboarding + PAR-Q+"
  case .onboardingStepOneSubtitle:
    return "Set your profile and weekly availability."
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
  case .parQBoneJointQuestion:
    return "Bone or joint issue"
  case .parQWarning:
    return "If any answer is YES, consult doctor first."
  case .parQMedicalClearanceAction:
    return "Request medical clearance"
  case .acceptPrivacyPolicy:
    return "I accept the privacy policy"
  case .acceptTerms:
    return "I accept terms and conditions"
  case .acceptMedicalDisclaimer:
    return "I have read the medical disclaimer"
  case .policySummaryLine:
    return "Policy summary"
  case .termsSummaryLine:
    return "Terms summary"
  case .medicalDisclaimerSummaryLine:
    return "Medical disclaimer"
  case .yesOption:
    return "Yes"
  case .noOption:
    return "No"
  case .acceptAndContinue:
    return "Accept and continue"
  case .continueAction:
    return "Continue"
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
  case .nutritionStageOverview:
    return "Overview"
  case .nutritionStageLog:
    return "Meal log"
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
  case .progressStageOverview:
    return "Metrics"
  case .progressStageWeeklyReview:
    return "Weekly"
  case .progressStageGoal:
    return "Goal"
  case .progressStageCoach:
    return "AI coach"
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
    return "Log session"
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
  case .trainingStageToday:
    return "Today"
  case .trainingStagePlan:
    return "Plan"
  case .trainingStageSetup:
    return "Setup"
  case .trainingStageWorkout:
    return "Workout"
  case .trainingStageRPE:
    return "RPE"
  case .trainingStageSubstitution:
    return "Swap"
  case .trainingStageLibrary:
    return "Library"
  case .trainingStageVideo:
    return "Video"
  case .trainingStageSummary:
    return "Summary"
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
  case .inWorkoutSetupTitle:
    return "Session setup"
  case .inWorkoutSetupDescription:
    return "Prepare plan, exercise and locale before starting the workout."
  case .startInWorkoutSetup:
    return "Prepare workout"
  case .setupStatusLabel:
    return "Setup status"
  case .inWorkoutSetupNoPlan:
    return "No plans available to start the workout."
  case .inWorkoutSetupReady:
    return "Workout setup is ready."
  case .rpeRatingTitle:
    return "Session RPE"
  case .rpeRatingDescription:
    return "Record rate of perceived exertion to close the current session."
  case .selectedRPELabel:
    return "Target RPE"
  case .submitRPEAction:
    return "Save RPE"
  case .rpeSavedMessage:
    return "RPE saved to session."
  case .substitutionTitle:
    return "Exercise substitution"
  case .substitutionDescription:
    return "Replace current exercise with an available alternative."
  case .currentExerciseLabel:
    return "Current exercise"
  case .substituteExerciseLabel:
    return "Substitute exercise"
  case .applySubstitutionAction:
    return "Apply substitution"
  case .substitutionStatusLabel:
    return "Substitution status"
  case .substitutionSavedMessage:
    return "Substitution applied and session updated."
  case .substitutionInvalidSelection:
    return "Choose a different exercise than the current one."
  case .exerciseLibraryTitle:
    return "Exercise library"
  case .exerciseLibraryDescription:
    return "Browse available videos by exercise and locale."
  case .loadExerciseLibraryAction:
    return "Load library"
  case .exerciseLibraryStatusLabel:
    return "Library status"
  case .noExerciseLibraryResults:
    return "No videos available for this filter."
  case .videoPlayerTitle:
    return "Video player"
  case .videoPlayerDescription:
    return "Select a video from the library and play it in the app."
  case .videoPlayerSelectionLabel:
    return "Selected video"
  case .playSelectedVideoAction:
    return "Play video"
  case .videoPlayerStatusLabel:
    return "Player status"
  case .settingsTitle:
    return "Settings"
  case .accountProfileTitle:
    return "Account profile"
  case .notificationsTitle:
    return "Notifications"
  case .settingsStatusLabel:
    return "Settings"
  case .profileStatusLabel:
    return "Profile"
  case .notificationsStatusLabel:
    return "Notifications"
  case .notificationsPreference:
    return "Notifications enabled"
  case .trainingRemindersPreference:
    return "Training reminders"
  case .recoveryAlertsPreference:
    return "Recovery alerts"
  case .weeklyDigestPreference:
    return "Weekly digest"
  case .watchPreference:
    return "Sync Apple Watch"
  case .calendarPreference:
    return "Sync calendar"
  case .saveSettings:
    return "Save settings"
  case .saveProfile:
    return "Save profile"
  case .saveNotifications:
    return "Save notifications"
  case .goalLabel:
    return "Goal"
  case .goalSetupSubtitle:
    return "Choose objective and weekly commitment."
  case .weeklySessionsLabel:
    return "Sessions per week"
  case .sessionDurationLabel:
    return "Session duration"
  case .saveGoal:
    return "Save goal"
  case .parQTitle:
    return "PAR-Q+"
  case .heightCmLabel:
    return "Height (cm)"
  case .weightKgLabel:
    return "Weight (kg)"
  case .goalFatLoss:
    return "Fat loss"
  case .goalRecomposition:
    return "Recomposition"
  case .goalMuscleGain:
    return "Muscle gain"
  case .goalHabit:
    return "Habit"
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
  case .exportDataTitle:
    return "Data export"
  case .exportStatusLabel:
    return "Export"
  case .exportGeneratedAtLabel:
    return "Generated at"
  case .exportPayloadBytesLabel:
    return "Size (bytes)"
  case .exportPayloadPreviewLabel:
    return "Preview"
  case .exportNoPayloadPreview:
    return "No exported payload yet."
  case .deleteAccountTitle:
    return "Account deletion"
  case .deleteAccountStatusLabel:
    return "Deletion"
  case .deleteAccountReasonLabel:
    return "Deletion reason"
  case .deleteAccountLatestRequestLabel:
    return "Latest request"
  case .requestDeletion:
    return "Request deletion"
  }
}
