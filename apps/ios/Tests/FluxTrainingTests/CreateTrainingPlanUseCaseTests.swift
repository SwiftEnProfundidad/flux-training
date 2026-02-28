import XCTest
@testable import FluxTraining

final class CreateTrainingPlanUseCaseTests: XCTestCase {
  func test_execute_savesPlan() async throws {
    let repository = InMemoryTrainingPlanRepository()
    let useCase = CreateTrainingPlanUseCase(repository: repository)

    let plan = try await useCase.execute(
      id: "plan-1",
      userID: "user-1",
      name: "Starter Plan",
      weeks: 4,
      days: [
        TrainingPlanDay(
          dayIndex: 1,
          exercises: [TrainingPlanExercise(exerciseID: "squat", targetSets: 4, targetReps: 10)]
        )
      ]
    )

    let allPlans = await repository.allPlans()

    XCTAssertEqual(plan.id, "plan-1")
    XCTAssertEqual(allPlans.count, 1)
  }
}

