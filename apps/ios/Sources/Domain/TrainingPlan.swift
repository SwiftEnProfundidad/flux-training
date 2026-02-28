import Foundation

public struct TrainingPlanExercise: Sendable, Equatable {
  public let exerciseID: String
  public let targetSets: Int
  public let targetReps: Int

  public init(exerciseID: String, targetSets: Int, targetReps: Int) {
    self.exerciseID = exerciseID
    self.targetSets = targetSets
    self.targetReps = targetReps
  }
}

public struct TrainingPlanDay: Sendable, Equatable {
  public let dayIndex: Int
  public let exercises: [TrainingPlanExercise]

  public init(dayIndex: Int, exercises: [TrainingPlanExercise]) {
    self.dayIndex = dayIndex
    self.exercises = exercises
  }
}

public struct TrainingPlan: Sendable, Equatable {
  public let id: String
  public let userID: String
  public let name: String
  public let weeks: Int
  public let days: [TrainingPlanDay]
  public let createdAt: Date

  public init(
    id: String,
    userID: String,
    name: String,
    weeks: Int,
    days: [TrainingPlanDay],
    createdAt: Date
  ) {
    self.id = id
    self.userID = userID
    self.name = name
    self.weeks = weeks
    self.days = days
    self.createdAt = createdAt
  }
}

public protocol TrainingPlanRepository: Sendable {
  func save(plan: TrainingPlan) async throws
  func listByUserID(_ userID: String) async throws -> [TrainingPlan]
}
