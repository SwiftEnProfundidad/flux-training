import XCTest
@testable import FluxTraining

final class ListWorkoutSessionsUseCaseTests: XCTestCase {
  func test_execute_filtersByPlanID() async throws {
    let repository = InMemoryWorkoutSessionRepository()
    let now = Date()
    try await repository.save(
      session: WorkoutSession(
        userID: "user-1",
        planID: "plan-1",
        startedAt: now.addingTimeInterval(-1200),
        endedAt: now,
        exercises: [ExerciseLog(exerciseID: "squat", sets: [SetLog(reps: 8, loadKg: 60, rpe: 8)])]
      )
    )
    try await repository.save(
      session: WorkoutSession(
        userID: "user-1",
        planID: "plan-2",
        startedAt: now.addingTimeInterval(-1200),
        endedAt: now,
        exercises: [ExerciseLog(exerciseID: "bench", sets: [SetLog(reps: 8, loadKg: 50, rpe: 8)])]
      )
    )
    let useCase = ListWorkoutSessionsUseCase(repository: repository)

    let sessions = try await useCase.execute(userID: "user-1", planID: "plan-1")

    XCTAssertEqual(sessions.count, 1)
    XCTAssertEqual(sessions.first?.planID, "plan-1")
  }
}

