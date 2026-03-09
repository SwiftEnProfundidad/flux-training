import XCTest
@testable import FluxTraining

final class AuthOnboardingScreenContractTests: XCTestCase {
  func test_authContract_defaultsToIdle() {
    let contract = AuthScreenContract()

    XCTAssertEqual(contract.email, "")
    XCTAssertEqual(contract.password, "")
    XCTAssertEqual(contract.rememberMe, false)
    XCTAssertEqual(contract.status, .idle)
  }

  func test_onboardingContract_defaultsToIdle() {
    let contract = OnboardingScreenContract()

    XCTAssertEqual(contract.displayName, "")
    XCTAssertEqual(contract.age, 0)
    XCTAssertEqual(contract.heightCm, 0)
    XCTAssertEqual(contract.weightKg, 0)
    XCTAssertEqual(contract.availableDaysPerWeek, 0)
    XCTAssertEqual(contract.goal, .recomposition)
    XCTAssertEqual(contract.parQQuestionOne, false)
    XCTAssertEqual(contract.parQQuestionTwo, false)
    XCTAssertEqual(contract.privacyPolicyAccepted, false)
    XCTAssertEqual(contract.termsAccepted, false)
    XCTAssertEqual(contract.medicalDisclaimerAccepted, false)
    XCTAssertEqual(contract.status, .idle)
  }
}
