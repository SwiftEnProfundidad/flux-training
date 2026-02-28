import Foundation

public struct ProgressHistoryEntry: Sendable, Equatable, Identifiable {
  public let date: String
  public let workoutSessions: Int
  public let trainingMinutes: Double
  public let completedSets: Int
  public let calories: Double?
  public let proteinGrams: Double?
  public let carbsGrams: Double?
  public let fatsGrams: Double?

  public var id: String {
    date
  }

  public init(
    date: String,
    workoutSessions: Int,
    trainingMinutes: Double,
    completedSets: Int,
    calories: Double?,
    proteinGrams: Double?,
    carbsGrams: Double?,
    fatsGrams: Double?
  ) {
    self.date = date
    self.workoutSessions = workoutSessions
    self.trainingMinutes = trainingMinutes
    self.completedSets = completedSets
    self.calories = calories
    self.proteinGrams = proteinGrams
    self.carbsGrams = carbsGrams
    self.fatsGrams = fatsGrams
  }
}

public struct ProgressSummary: Sendable, Equatable {
  public let userID: String
  public let generatedAt: Date
  public let workoutSessionsCount: Int
  public let totalTrainingMinutes: Double
  public let totalCompletedSets: Int
  public let nutritionLogsCount: Int
  public let averageCalories: Double
  public let averageProteinGrams: Double
  public let averageCarbsGrams: Double
  public let averageFatsGrams: Double
  public let history: [ProgressHistoryEntry]

  public init(
    userID: String,
    generatedAt: Date,
    workoutSessionsCount: Int,
    totalTrainingMinutes: Double,
    totalCompletedSets: Int,
    nutritionLogsCount: Int,
    averageCalories: Double,
    averageProteinGrams: Double,
    averageCarbsGrams: Double,
    averageFatsGrams: Double,
    history: [ProgressHistoryEntry]
  ) {
    self.userID = userID
    self.generatedAt = generatedAt
    self.workoutSessionsCount = workoutSessionsCount
    self.totalTrainingMinutes = totalTrainingMinutes
    self.totalCompletedSets = totalCompletedSets
    self.nutritionLogsCount = nutritionLogsCount
    self.averageCalories = averageCalories
    self.averageProteinGrams = averageProteinGrams
    self.averageCarbsGrams = averageCarbsGrams
    self.averageFatsGrams = averageFatsGrams
    self.history = history
  }
}
