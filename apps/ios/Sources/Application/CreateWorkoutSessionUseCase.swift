import Foundation

public struct CreateWorkoutSessionInput: Sendable, Equatable {
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

public enum CreateWorkoutSessionError: Error, Equatable {
  case emptyUserID
  case emptyPlanID
  case invalidDateRange
  case noExercises
}

public struct CreateWorkoutSessionUseCase: Sendable {
  private let repository: any WorkoutSessionRepository

  public init(repository: any WorkoutSessionRepository) {
    self.repository = repository
  }

  public func execute(input: CreateWorkoutSessionInput) async throws -> WorkoutSession {
    guard input.userID.isEmpty == false else { throw CreateWorkoutSessionError.emptyUserID }
    guard input.planID.isEmpty == false else { throw CreateWorkoutSessionError.emptyPlanID }
    guard input.startedAt <= input.endedAt else { throw CreateWorkoutSessionError.invalidDateRange }
    guard input.exercises.isEmpty == false else { throw CreateWorkoutSessionError.noExercises }

    let session = WorkoutSession(
      userID: input.userID,
      planID: input.planID,
      startedAt: input.startedAt,
      endedAt: input.endedAt,
      exercises: input.exercises
    )
    try await repository.save(session: session)
    return session
  }
}

