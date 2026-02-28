import XCTest
@testable import FluxTraining

@MainActor
final class OfflineSyncViewModelTests: XCTestCase {
  func test_refreshAndSync_updatesCountersAndStatus() async throws {
    let queueRepository = InMemoryOfflineSyncQueueRepository()
    let trainingPlanRepository = InMemoryTrainingPlanRepository()
    let workoutSessionRepository = InMemoryWorkoutSessionRepository()
    let nutritionLogRepository = InMemoryNutritionLogRepository()
    let queueUseCase = QueueOfflineActionUseCase(repository: queueRepository)
    let gateway = InMemoryOfflineSyncGateway(
      createTrainingPlanUseCase: CreateTrainingPlanUseCase(repository: trainingPlanRepository),
      createWorkoutSessionUseCase: CreateWorkoutSessionUseCase(repository: workoutSessionRepository),
      createNutritionLogUseCase: CreateNutritionLogUseCase(repository: nutritionLogRepository)
    )
    let syncUseCase = SyncOfflineQueueUseCase(repository: queueRepository, gateway: gateway)
    let viewModel = OfflineSyncViewModel(
      queueOfflineActionUseCase: queueUseCase,
      syncOfflineQueueUseCase: syncUseCase
    )

    try await queueUseCase.execute(
      action: .createNutritionLog(
        NutritionLog(
          userID: "user-1",
          date: "2026-02-27",
          calories: 2150,
          proteinGrams: 150,
          carbsGrams: 225,
          fatsGrams: 68
        )
      )
    )

    await viewModel.refresh(userID: "user-1")
    XCTAssertEqual(viewModel.pendingCount, 1)

    await viewModel.sync(userID: "user-1")

    XCTAssertEqual(viewModel.pendingCount, 0)
    XCTAssertEqual(viewModel.lastRejectedCount, 0)
    XCTAssertEqual(viewModel.syncStatus, "synced")
  }
}
