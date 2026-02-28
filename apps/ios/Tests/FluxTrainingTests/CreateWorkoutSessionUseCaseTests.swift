import XCTest
@testable import FluxTraining

final class CreateWorkoutSessionUseCaseTests: XCTestCase {
  func test_execute_savesSession() async throws {
    let repository = InMemoryWorkoutSessionRepository()
    let useCase = CreateWorkoutSessionUseCase(repository: repository)
    let now = Date()

    let output = try await useCase.execute(
      input: CreateWorkoutSessionInput(
        userID: "u1",
        planID: "p1",
        startedAt: now.addingTimeInterval(-1200),
        endedAt: now,
        exercises: [ExerciseLog(exerciseID: "bench", sets: [SetLog(reps: 8, loadKg: 50, rpe: 8)])]
      )
    )

    let allSessions = await repository.allSessions()

    XCTAssertEqual(output.userID, "u1")
    XCTAssertEqual(allSessions.count, 1)
  }

  func test_execute_throwsWhenExercisesAreEmpty() async {
    let repository = InMemoryWorkoutSessionRepository()
    let useCase = CreateWorkoutSessionUseCase(repository: repository)
    let now = Date()

    do {
      _ = try await useCase.execute(
        input: CreateWorkoutSessionInput(
          userID: "u1",
          planID: "p1",
          startedAt: now.addingTimeInterval(-1200),
          endedAt: now,
          exercises: []
        )
      )
      XCTFail("Expected failure")
    } catch let error as CreateWorkoutSessionError {
      XCTAssertEqual(error, .noExercises)
    } catch {
      XCTFail("Unexpected error \(error)")
    }
  }
}

