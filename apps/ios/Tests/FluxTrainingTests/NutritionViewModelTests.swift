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

    XCTAssertEqual(viewModel.status, NutritionProgressAIScreenStatus.loaded.rawValue)
    XCTAssertEqual(viewModel.logs.count, 1)
    XCTAssertEqual(viewModel.screenStatus, .loaded)
  }

  func test_saveLog_withEmptyUserID_setsValidationError() async {
    let repository = InMemoryNutritionLogRepository()
    let viewModel = NutritionViewModel(
      createNutritionLogUseCase: CreateNutritionLogUseCase(repository: repository),
      listNutritionLogsUseCase: ListNutritionLogsUseCase(repository: repository)
    )

    await viewModel.saveLog(userID: " ")

    XCTAssertEqual(viewModel.status, NutritionProgressAIScreenStatus.validationError.rawValue)
    XCTAssertEqual(viewModel.screenStatus, .validationError)
  }

  func test_refreshLogs_withNoData_setsEmptyStatus() async {
    let repository = InMemoryNutritionLogRepository()
    let viewModel = NutritionViewModel(
      createNutritionLogUseCase: CreateNutritionLogUseCase(repository: repository),
      listNutritionLogsUseCase: ListNutritionLogsUseCase(repository: repository)
    )

    await viewModel.refreshLogs(userID: "user-empty")

    XCTAssertEqual(viewModel.logs, [])
    XCTAssertEqual(viewModel.status, NutritionProgressAIScreenStatus.empty.rawValue)
    XCTAssertEqual(viewModel.screenStatus, .empty)
  }

  func test_saveLog_withInvalidMacro_setsValidationError() async {
    let repository = InMemoryNutritionLogRepository()
    let viewModel = NutritionViewModel(
      createNutritionLogUseCase: CreateNutritionLogUseCase(repository: repository),
      listNutritionLogsUseCase: ListNutritionLogsUseCase(repository: repository)
    )
    viewModel.calories = -1

    await viewModel.saveLog(userID: "user-1")

    XCTAssertEqual(viewModel.status, NutritionProgressAIScreenStatus.validationError.rawValue)
    XCTAssertEqual(viewModel.screenStatus, .validationError)
  }
}
