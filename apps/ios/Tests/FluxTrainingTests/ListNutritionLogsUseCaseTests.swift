import XCTest
@testable import FluxTraining

final class ListNutritionLogsUseCaseTests: XCTestCase {
  func test_execute_returnsLogsForUser() async throws {
    let repository = InMemoryNutritionLogRepository()
    try await repository.save(
      log: NutritionLog(
        userID: "user-1",
        date: "2026-02-26",
        calories: 2200,
        proteinGrams: 150,
        carbsGrams: 230,
        fatsGrams: 70
      )
    )
    let useCase = ListNutritionLogsUseCase(repository: repository)

    let logs = try await useCase.execute(userID: "user-1")

    XCTAssertEqual(logs.count, 1)
    XCTAssertEqual(logs.first?.date, "2026-02-26")
  }
}

