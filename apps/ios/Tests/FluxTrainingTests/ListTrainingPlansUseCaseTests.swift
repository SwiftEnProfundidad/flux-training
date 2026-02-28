import XCTest
@testable import FluxTraining

final class ListTrainingPlansUseCaseTests: XCTestCase {
  func test_execute_returnsPlansForUser() async throws {
    let repository = InMemoryTrainingPlanRepository()
    try await repository.save(
      plan: TrainingPlan(
        id: "plan-1",
        userID: "user-1",
        name: "Starter",
        weeks: 4,
        days: [
          TrainingPlanDay(
            dayIndex: 1,
            exercises: [TrainingPlanExercise(exerciseID: "squat", targetSets: 4, targetReps: 10)]
          )
        ],
        createdAt: Date()
      )
    )
    let useCase = ListTrainingPlansUseCase(repository: repository)

    let plans = try await useCase.execute(userID: "user-1")

    XCTAssertEqual(plans.count, 1)
    XCTAssertEqual(plans.first?.id, "plan-1")
  }
}

