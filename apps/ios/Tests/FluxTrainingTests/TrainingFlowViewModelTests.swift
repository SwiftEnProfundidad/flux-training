import XCTest
@testable import FluxTraining

@MainActor
final class TrainingFlowViewModelTests: XCTestCase {
  func test_createPlanAndLogSession_updatesState() async {
    let trainingPlanRepository = InMemoryTrainingPlanRepository()
    let workoutSessionRepository = InMemoryWorkoutSessionRepository()
    let exerciseVideoRepository = InMemoryExerciseVideoRepository()
    let viewModel = TrainingFlowViewModel(
      createTrainingPlanUseCase: CreateTrainingPlanUseCase(repository: trainingPlanRepository),
      listTrainingPlansUseCase: ListTrainingPlansUseCase(repository: trainingPlanRepository),
      createWorkoutSessionUseCase: CreateWorkoutSessionUseCase(repository: workoutSessionRepository),
      listWorkoutSessionsUseCase: ListWorkoutSessionsUseCase(repository: workoutSessionRepository),
      listExerciseVideosUseCase: ListExerciseVideosUseCase(repository: exerciseVideoRepository)
    )

    await viewModel.createStarterPlan(userID: "user-1")
    await viewModel.logDemoSession(userID: "user-1")

    XCTAssertFalse(viewModel.plans.isEmpty)
    XCTAssertFalse(viewModel.sessions.isEmpty)
    XCTAssertEqual(viewModel.status, "saved")
  }
}
