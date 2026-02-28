import Foundation

public struct SetLog: Sendable, Equatable {
  public let reps: Int
  public let loadKg: Double
  public let rpe: Double

  public init(reps: Int, loadKg: Double, rpe: Double) {
    self.reps = reps
    self.loadKg = loadKg
    self.rpe = rpe
  }
}

public struct ExerciseLog: Sendable, Equatable {
  public let exerciseID: String
  public let sets: [SetLog]

  public init(exerciseID: String, sets: [SetLog]) {
    self.exerciseID = exerciseID
    self.sets = sets
  }
}

public struct WorkoutSession: Sendable, Equatable {
  public let userID: String
  public let planID: String
  public let startedAt: Date
  public let endedAt: Date
  public let exercises: [ExerciseLog]

  public init(
    userID: String,
    planID: String,
    startedAt: Date,
    endedAt: Date,
    exercises: [ExerciseLog]
  ) {
    self.userID = userID
    self.planID = planID
    self.startedAt = startedAt
    self.endedAt = endedAt
    self.exercises = exercises
  }
}

public protocol WorkoutSessionRepository: Sendable {
  func save(session: WorkoutSession) async throws
  func listByUserID(_ userID: String) async throws -> [WorkoutSession]
}
