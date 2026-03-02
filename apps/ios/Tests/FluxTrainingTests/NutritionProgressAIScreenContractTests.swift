import XCTest
@testable import FluxTraining

final class NutritionProgressAIScreenContractTests: XCTestCase {
  func test_defaultsToIdleState() {
    let contract = NutritionProgressAIScreenContract()

    XCTAssertEqual(contract.nutritionLogs, [])
    XCTAssertNil(contract.progressSummary)
    XCTAssertEqual(contract.recommendations, [])
    XCTAssertEqual(contract.nutritionStatus, .idle)
    XCTAssertEqual(contract.progressStatus, .idle)
    XCTAssertEqual(contract.recommendationsStatus, .idle)
  }

  func test_fromRuntimeStatus_mapsEnterpriseStatuses() {
    XCTAssertEqual(NutritionProgressAIScreenStatus.fromRuntimeStatus("loading"), .loading)
    XCTAssertEqual(NutritionProgressAIScreenStatus.fromRuntimeStatus("empty"), .empty)
    XCTAssertEqual(NutritionProgressAIScreenStatus.fromRuntimeStatus("saved"), .saved)
    XCTAssertEqual(NutritionProgressAIScreenStatus.fromRuntimeStatus("loaded"), .loaded)
    XCTAssertEqual(NutritionProgressAIScreenStatus.fromRuntimeStatus("fallback_loaded"), .loaded)
    XCTAssertEqual(NutritionProgressAIScreenStatus.fromRuntimeStatus("validation_error"), .validationError)
    XCTAssertEqual(NutritionProgressAIScreenStatus.fromRuntimeStatus("offline"), .offline)
    XCTAssertEqual(NutritionProgressAIScreenStatus.fromRuntimeStatus("denied"), .denied)
    XCTAssertEqual(NutritionProgressAIScreenStatus.fromRuntimeStatus("unknown"), .idle)
  }
}
