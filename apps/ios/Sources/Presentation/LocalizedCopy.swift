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
  case operationsTab
  case progressNavigationTitle
  case operationsNavigationTitle
  case overallStatusLabel
  case languageLabel
  case readinessLabel
  case dailyObjective
  case authenticationTitle
  case signInWithApple
  case signInWithEmail
  case authStatusLabel
  case onboardingTitle
  case displayName
  case age
  case days
  case chestPainQuestion
  case dizzinessQuestion
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
  case recommendationsTitle
  case loadRecommendations
  case recommendationsStatusLabel
  case noRecommendations
  case trainingTitle
  case planName
  case createPlan
  case noPlansYet
  case logDemoSession
  case sessionsLabel
  case statusLabel
  case exerciseVideosTitle
  case exercisePicker
  case localePicker
  case loadVideos
  case videoStatusLabel
  case noVideosLoaded
  case openVideo
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
        "idle": "inactivo",
        "saved": "guardado",
        "loaded": "cargado",
        "queued": "en cola",
        "synced": "sincronizado",
        "event_saved": "evento guardado",
        "crash_saved": "crash guardado",
        "error": "error",
        "high": "alta",
        "medium": "media",
        "low": "baja"
      ],
      .en: [
        "signed_out": "signed out",
        "auth_error": "auth error",
        "idle": "idle",
        "saved": "saved",
        "loaded": "loaded",
        "queued": "queued",
        "synced": "synced",
        "event_saved": "event saved",
        "crash_saved": "crash saved",
        "error": "error",
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
  case .readinessLabel:
    return "Readiness"
  case .dailyObjective:
    return "Objetivo diario: completar entrenamiento y nutricion sin acciones pendientes."
  case .authenticationTitle:
    return "Autenticacion"
  case .signInWithApple:
    return "Iniciar con Apple"
  case .signInWithEmail:
    return "Iniciar con email"
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
  case .planName:
    return "Nombre del plan"
  case .createPlan:
    return "Crear plan"
  case .noPlansYet:
    return "Todavia no hay planes"
  case .logDemoSession:
    return "Registrar sesion demo"
  case .sessionsLabel:
    return "Sesiones"
  case .statusLabel:
    return "Estado"
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
  case .noVideosLoaded:
    return "Todavia no hay videos cargados"
  case .openVideo:
    return "Abrir video"
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
  case .readinessLabel:
    return "Readiness"
  case .dailyObjective:
    return "Daily objective: complete training and nutrition without pending actions."
  case .authenticationTitle:
    return "Authentication"
  case .signInWithApple:
    return "Sign in with Apple"
  case .signInWithEmail:
    return "Sign in with email"
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
  case .planName:
    return "Plan name"
  case .createPlan:
    return "Create plan"
  case .noPlansYet:
    return "No plans yet"
  case .logDemoSession:
    return "Log demo session"
  case .sessionsLabel:
    return "Sessions"
  case .statusLabel:
    return "Status"
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
  case .noVideosLoaded:
    return "No videos loaded yet"
  case .openVideo:
    return "Open video"
  }
}
