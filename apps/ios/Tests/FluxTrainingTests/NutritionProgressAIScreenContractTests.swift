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
}
