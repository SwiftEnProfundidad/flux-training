import XCTest
@testable import FluxTraining

final class CreateNutritionLogUseCaseTests: XCTestCase {
  func test_execute_savesLog() async throws {
    let repository = InMemoryNutritionLogRepository()
    let useCase = CreateNutritionLogUseCase(repository: repository)

    let log = try await useCase.execute(
      log: NutritionLog(
        userID: "user-1",
        date: "2026-02-26",
        calories: 2200,
        proteinGrams: 150,
        carbsGrams: 230,
        fatsGrams: 70
      )
    )

    let logs = try await repository.listByUserID("user-1")

    XCTAssertEqual(log.userID, "user-1")
    XCTAssertEqual(logs.count, 1)
  }
}

