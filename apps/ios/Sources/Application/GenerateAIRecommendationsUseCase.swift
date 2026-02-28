import Foundation

public struct GenerateAIRecommendationsUseCase: Sendable {
  private let now: @Sendable () -> Date

  public init(now: @escaping @Sendable () -> Date = Date.init) {
    self.now = now
  }

  public func execute(
    userID: String,
    goal: TrainingGoal,
    pendingQueueCount: Int,
    daysSinceLastWorkout: Int,
    recentCompletionRate: Double,
    locale: String
  ) async -> [AIRecommendation] {
    guard userID.isEmpty == false else { return [] }

    let generatedAt = now()
    let isSpanish = locale.starts(with: "es")
    var recommendations: [AIRecommendation] = []

    if daysSinceLastWorkout >= 2 {
      recommendations.append(
        AIRecommendation(
          id: "rec-training-activation",
          userID: userID,
          title: isSpanish ? "Completa una sesion corta hoy" : "Complete a short session today",
          rationale: isSpanish
            ? "Varios dias sin entrenar incrementan riesgo de abandono semanal."
            : "Several days without training increase weekly drop risk.",
          priority: .high,
          category: .training,
          expectedImpact: .retention,
          actionLabel: isSpanish ? "Iniciar sesion de 20 min" : "Start a 20 min session",
          generatedAt: generatedAt
        )
      )
    }

    if pendingQueueCount > 0 {
      recommendations.append(
        AIRecommendation(
          id: "rec-sync-queue",
          userID: userID,
          title: isSpanish ? "Sincroniza la cola offline" : "Sync offline queue",
          rationale: isSpanish
            ? "Hay acciones pendientes; sincronizar mantiene metrica consistente."
            : "Pending actions exist; syncing keeps metrics consistent.",
          priority: pendingQueueCount > 2 ? .high : .medium,
          category: .sync,
          expectedImpact: .consistency,
          actionLabel: isSpanish ? "Sincronizar ahora" : "Sync now",
          generatedAt: generatedAt
        )
      )
    }

    if recentCompletionRate < 0.6 {
      recommendations.append(
        AIRecommendation(
          id: "rec-load-adjustment",
          userID: userID,
          title: isSpanish ? "Ajusta carga para recuperar ritmo" : "Adjust load to recover rhythm",
          rationale: isSpanish
            ? "La tasa reciente es baja; reducir volumen ayuda a retomar adherencia."
            : "Recent completion is low; reducing volume improves adherence recovery.",
          priority: .medium,
          category: .recovery,
          expectedImpact: .retention,
          actionLabel: isSpanish ? "Aplicar semana de ajuste" : "Apply adjustment week",
          generatedAt: generatedAt
        )
      )
    }

    if recommendations.isEmpty {
      recommendations.append(
        AIRecommendation(
          id: "rec-maintain-momentum",
          userID: userID,
          title: isSpanish ? "Mantener el momentum" : "Keep momentum",
          rationale: isSpanish
            ? "Tu adherencia es estable; mantener consistencia consolida resultados."
            : "Your adherence is stable; consistency consolidates results.",
          priority: .low,
          category: goal == .muscleGain ? .training : .nutrition,
          expectedImpact: .performance,
          actionLabel: isSpanish ? "Seguir plan semanal" : "Continue weekly plan",
          generatedAt: generatedAt
        )
      )
    }

    return recommendations.sorted { left, right in
      let rank: [AIRecommendationPriority: Int] = [.high: 3, .medium: 2, .low: 1]
      return (rank[left.priority] ?? 0) > (rank[right.priority] ?? 0)
    }
  }
}
