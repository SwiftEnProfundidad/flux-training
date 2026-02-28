import XCTest
@testable import FluxTraining

@MainActor
final class TrainingDashboardViewModelTests: XCTestCase {
  func test_saveDemoSession_setsSavedStatus() async {
    let repository = InMemoryWorkoutSessionRepository()
    let useCase = CreateWorkoutSessionUseCase(repository: repository)
    let viewModel = TrainingDashboardViewModel(createWorkoutSessionUseCase: useCase)

    await viewModel.saveDemoSession(now: Date())

    XCTAssertEqual(viewModel.status, "saved")
  }
}

