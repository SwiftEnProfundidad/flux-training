import XCTest
@testable import FluxTraining

@MainActor
final class NutritionViewModelTests: XCTestCase {
  func test_saveAndLoadLogs_updatesState() async {
    let repository = InMemoryNutritionLogRepository()
    let viewModel = NutritionViewModel(
      createNutritionLogUseCase: CreateNutritionLogUseCase(repository: repository),
      listNutritionLogsUseCase: ListNutritionLogsUseCase(repository: repository)
    )

    await viewModel.saveLog(userID: "user-1")
    await viewModel.refreshLogs(userID: "user-1")

    XCTAssertEqual(viewModel.status, "loaded")
    XCTAssertEqual(viewModel.logs.count, 1)
  }
}

