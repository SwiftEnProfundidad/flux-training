import XCTest
@testable import FluxTraining

final class QueueOfflineActionUseCaseTests: XCTestCase {
  func test_execute_queuesActionAndListsPendingItems() async throws {
    let repository = InMemoryOfflineSyncQueueRepository()
    let useCase = QueueOfflineActionUseCase(repository: repository)

    try await useCase.execute(
      action: .createWorkoutSession(
        CreateWorkoutSessionInput(
          userID: "user-1",
          planID: "plan-1",
          startedAt: makeDate("2026-02-27T08:00:00Z"),
          endedAt: makeDate("2026-02-27T08:30:00Z"),
          exercises: [
            ExerciseLog(exerciseID: "squat", sets: [SetLog(reps: 8, loadKg: 60, rpe: 8)])
          ]
        )
      ),
      itemID: "queue-1",
      enqueuedAt: makeDate("2026-02-27T10:00:00Z")
    )

    let items = try await useCase.list(userID: "user-1")

    XCTAssertEqual(items.count, 1)
    XCTAssertEqual(items.first?.id, "queue-1")
  }

  func test_execute_throwsWhenActionHasEmptyUserID() async {
    let repository = InMemoryOfflineSyncQueueRepository()
    let useCase = QueueOfflineActionUseCase(repository: repository)

    do {
      try await useCase.execute(
        action: .createNutritionLog(
          NutritionLog(
            userID: "",
            date: "2026-02-27",
            calories: 2200,
            proteinGrams: 150,
            carbsGrams: 230,
            fatsGrams: 70
          )
        )
      )
      XCTFail("Expected missingUserID")
    } catch let error as QueueOfflineActionUseCaseError {
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
