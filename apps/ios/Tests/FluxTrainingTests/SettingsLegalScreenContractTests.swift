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

  func test_fromRuntimeStatus_mapsLegalStatuses() {
    XCTAssertEqual(SettingsLegalScreenStatus.fromRuntimeStatus("loading"), .loading)
    XCTAssertEqual(SettingsLegalScreenStatus.fromRuntimeStatus("validation_error"), .validationError)
    XCTAssertEqual(SettingsLegalScreenStatus.fromRuntimeStatus("consent_required"), .consentRequired)
    XCTAssertEqual(SettingsLegalScreenStatus.fromRuntimeStatus("saved"), .saved)
    XCTAssertEqual(SettingsLegalScreenStatus.fromRuntimeStatus("exported"), .exported)
    XCTAssertEqual(SettingsLegalScreenStatus.fromRuntimeStatus("deletion_requested"), .deletionRequested)
    XCTAssertEqual(SettingsLegalScreenStatus.fromRuntimeStatus("offline"), .offline)
    XCTAssertEqual(SettingsLegalScreenStatus.fromRuntimeStatus("denied"), .denied)
    XCTAssertEqual(SettingsLegalScreenStatus.fromRuntimeStatus("unknown"), .idle)
  }
}
