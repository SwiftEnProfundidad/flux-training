import XCTest
@testable import FluxTraining

final class DailyTrainingVideoScreenContractTests: XCTestCase {
  func test_defaultsToIdleState() {
    let contract = DailyTrainingVideoScreenContract()

    XCTAssertEqual(contract.planName, "")
    XCTAssertEqual(contract.selectedPlanID, "")
    XCTAssertEqual(contract.selectedExerciseID, "goblet-squat")
    XCTAssertEqual(contract.videoLocale, "es-ES")
    XCTAssertEqual(contract.sessions, [])
    XCTAssertEqual(contract.trainingStatus, .idle)
    XCTAssertEqual(contract.sessionStatus, .idle)
    XCTAssertEqual(contract.videoStatus, .idle)
  }
}
