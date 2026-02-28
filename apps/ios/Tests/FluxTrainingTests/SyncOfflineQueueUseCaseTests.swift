import XCTest
@testable import FluxTraining

final class SyncOfflineQueueUseCaseTests: XCTestCase {
  func test_execute_syncsQueuedActionsAndRemovesAcceptedItems() async throws {
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
    let useCase = SyncOfflineQueueUseCase(repository: queueRepository, gateway: gateway)

    try await queueUseCase.execute(
      action: .createNutritionLog(
        NutritionLog(
          userID: "user-1",
          date: "2026-02-27",
          calories: 2100,
          proteinGrams: 145,
          carbsGrams: 230,
          fatsGrams: 65
        )
      ),
      itemID: "queue-1",
      enqueuedAt: makeDate("2026-02-27T10:00:00Z")
    )

    let result = try await useCase.execute(userID: "user-1")
    let pendingItems = try await queueUseCase.list(userID: "user-1")

    XCTAssertEqual(result.acceptedIDs, ["queue-1"])
    XCTAssertTrue(result.rejected.isEmpty)
    XCTAssertEqual(pendingItems.count, 0)
  }

  func test_execute_throwsWhenUserIDIsEmpty() async {
    let repository = InMemoryOfflineSyncQueueRepository()
    let gateway = InMemoryOfflineSyncGateway(
      createTrainingPlanUseCase: CreateTrainingPlanUseCase(repository: InMemoryTrainingPlanRepository()),
      createWorkoutSessionUseCase: CreateWorkoutSessionUseCase(repository: InMemoryWorkoutSessionRepository()),
      createNutritionLogUseCase: CreateNutritionLogUseCase(repository: InMemoryNutritionLogRepository())
    )
    let useCase = SyncOfflineQueueUseCase(repository: repository, gateway: gateway)

    do {
      _ = try await useCase.execute(userID: "")
      XCTFail("Expected missingUserID")
    } catch let error as SyncOfflineQueueUseCaseError {
      XCTAssertEqual(error, .missingUserID)
    } catch {
      XCTFail("Unexpected error: \(error)")
    }
  }

  private func makeDate(_ raw: String) -> Date {
    let formatter = ISO8601DateFormatter()
    guard let date = formatter.date(from: raw) else {
      XCTFail("Invalid date: \(raw)")
      return Date()
    }
    return date
  }
}
