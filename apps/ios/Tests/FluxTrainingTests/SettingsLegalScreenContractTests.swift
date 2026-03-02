import XCTest
@testable import FluxTraining

final class SettingsLegalScreenContractTests: XCTestCase {
  func test_defaultsToIdleState() {
    let contract = SettingsLegalScreenContract()

    XCTAssertEqual(contract.notificationsEnabled, true)
    XCTAssertEqual(contract.watchSyncEnabled, true)
    XCTAssertEqual(contract.calendarSyncEnabled, false)
    XCTAssertEqual(contract.privacyPolicyAccepted, false)
    XCTAssertEqual(contract.termsAccepted, false)
    XCTAssertEqual(contract.medicalDisclaimerAccepted, false)
    XCTAssertEqual(contract.settingsStatus, .idle)
    XCTAssertEqual(contract.legalStatus, .idle)
  }
}
