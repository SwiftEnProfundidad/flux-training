import Foundation

public enum BuildProgressSummaryUseCaseError: Error, Equatable {
  case missingUserID
}

private func roundMetric(_ value: Double) -> Double {
  (value * 100).rounded() / 100
}

private func dayKey(from date: Date) -> String {
  let formatter = DateFormatter()
  formatter.calendar = Calendar(identifier: .gregorian)
  formatter.locale = Locale(identifier: "en_US_POSIX")
  formatter.timeZone = TimeZone(secondsFromGMT: 0)
  formatter.dateFormat = "yyyy-MM-dd"
  return formatter.string(from: date)
}

private func emptyHistoryEntry(for day: String) -> ProgressHistoryEntry {
  ProgressHistoryEntry(
    date: day,
    workoutSessions: 0,
    trainingMinutes: 0,
    completedSets: 0,
    calories: nil,
    proteinGrams: nil,
    carbsGrams: nil,
    fatsGrams: nil
  )
}

public struct BuildProgressSummaryUseCase: Sendable {
  private let listWorkoutSessionsUseCase: ListWorkoutSessionsUseCase
  private let listNutritionLogsUseCase: ListNutritionLogsUseCase

  public init(
    listWorkoutSessionsUseCase: ListWorkoutSessionsUseCase,
    listNutritionLogsUseCase: ListNutritionLogsUseCase
  ) {
    self.listWorkoutSessionsUseCase = listWorkoutSessionsUseCase
    self.listNutritionLogsUseCase = listNutritionLogsUseCase
  }

  public func execute(userID: String, generatedAt: Date = Date()) async throws -> ProgressSummary {
    guard userID.isEmpty == false else {
      throw BuildProgressSummaryUseCaseError.missingUserID
    }

    async let sessionsTask = listWorkoutSessionsUseCase.execute(userID: userID, planID: nil)
    async let logsTask = listNutritionLogsUseCase.execute(userID: userID)
    let (sessions, logs) = try await (sessionsTask, logsTask)

    var historyByDate: [String: ProgressHistoryEntry] = [:]
    var totalTrainingMinutes = 0.0
    var totalCompletedSets = 0

    for session in sessions {
      let day = dayKey(from: session.startedAt)
      let current = historyByDate[day] ?? emptyHistoryEntry(for: day)
      let durationMinutes = max(0, session.endedAt.timeIntervalSince(session.startedAt) / 60)
      let completedSets = session.exercises.reduce(0) { partialResult, exercise in
        partialResult + exercise.sets.count
      }

      totalTrainingMinutes += durationMinutes
      totalCompletedSets += completedSets

      historyByDate[day] = ProgressHistoryEntry(
        date: day,
        workoutSessions: current.workoutSessions + 1,
        trainingMinutes: roundMetric(current.trainingMinutes + durationMinutes),
        completedSets: current.completedSets + completedSets,
        calories: current.calories,
        proteinGrams: current.proteinGrams,
        carbsGrams: current.carbsGrams,
        fatsGrams: current.fatsGrams
      )
    }

    var caloriesTotal = 0.0
    var proteinTotal = 0.0
    var carbsTotal = 0.0
    var fatsTotal = 0.0

    for log in logs {
      caloriesTotal += log.calories
      proteinTotal += log.proteinGrams
      carbsTotal += log.carbsGrams
      fatsTotal += log.fatsGrams

      let current = historyByDate[log.date] ?? emptyHistoryEntry(for: log.date)
      historyByDate[log.date] = ProgressHistoryEntry(
        date: log.date,
        workoutSessions: current.workoutSessions,
        trainingMinutes: current.trainingMinutes,
        completedSets: current.completedSets,
        calories: roundMetric((current.calories ?? 0) + log.calories),
        proteinGrams: roundMetric((current.proteinGrams ?? 0) + log.proteinGrams),
        carbsGrams: roundMetric((current.carbsGrams ?? 0) + log.carbsGrams),
        fatsGrams: roundMetric((current.fatsGrams ?? 0) + log.fatsGrams)
      )
    }

    let logCount = Double(logs.count)
    let history = historyByDate.values.sorted { left, right in
      left.date < right.date
    }

    return ProgressSummary(
      userID: userID,
      generatedAt: generatedAt,
      workoutSessionsCount: sessions.count,
      totalTrainingMinutes: roundMetric(totalTrainingMinutes),
      totalCompletedSets: totalCompletedSets,
      nutritionLogsCount: logs.count,
      averageCalories: logCount == 0 ? 0 : roundMetric(caloriesTotal / logCount),
      averageProteinGrams: logCount == 0 ? 0 : roundMetric(proteinTotal / logCount),
      averageCarbsGrams: logCount == 0 ? 0 : roundMetric(carbsTotal / logCount),
      averageFatsGrams: logCount == 0 ? 0 : roundMetric(fatsTotal / logCount),
      history: history
    )
  }
}
