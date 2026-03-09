import XCTest
@testable import FluxTraining

final class SettingsRouteContractTests: XCTestCase {
  func test_routeIdentifiers_matchCanonicalValues() {
    XCTAssertEqual(SettingsRouteContract.darkHomeRouteID, "settings.route.home")
    XCTAssertEqual(SettingsRouteContract.lightHomeRouteID, "settings.route.homeLight")
    XCTAssertEqual(SettingsRouteContract.accountProfileDarkRouteID, "settings.route.accountProfile")
    XCTAssertEqual(SettingsRouteContract.accountProfileLightRouteID, "settings.route.accountProfileLight")
    XCTAssertEqual(SettingsRouteContract.accountProfileRouteID, "settings.route.accountProfile")
    XCTAssertEqual(SettingsRouteContract.notificationsDarkRouteID, "settings.route.notifications")
    XCTAssertEqual(SettingsRouteContract.notificationsLightRouteID, "settings.route.notificationsLight")
    XCTAssertEqual(SettingsRouteContract.notificationsRouteID, "settings.route.notifications")
    XCTAssertEqual(SettingsRouteContract.privacyConsentDarkRouteID, "settings.route.privacyConsent")
    XCTAssertEqual(SettingsRouteContract.privacyConsentLightRouteID, "settings.route.privacyConsentLight")
    XCTAssertEqual(SettingsRouteContract.privacyConsentRouteID, "settings.route.privacyConsent")
    XCTAssertEqual(SettingsRouteContract.exportDataDarkRouteID, "settings.route.exportData")
    XCTAssertEqual(SettingsRouteContract.exportDataLightRouteID, "settings.route.exportDataLight")
    XCTAssertEqual(SettingsRouteContract.exportDataRouteID, "settings.route.exportData")
    XCTAssertEqual(SettingsRouteContract.deleteAccountDarkRouteID, "settings.route.deleteAccount")
    XCTAssertEqual(SettingsRouteContract.deleteAccountLightRouteID, "settings.route.deleteAccountLight")
    XCTAssertEqual(SettingsRouteContract.deleteAccountRouteID, "settings.route.deleteAccount")
  }

  func test_screenIdentifiers_matchCanonicalValues() {
    XCTAssertEqual(SettingsRouteContract.darkHomeScreenID, "settings.home.screen")
    XCTAssertEqual(SettingsRouteContract.lightHomeScreenID, "settings.home.light.screen")
    XCTAssertEqual(SettingsRouteContract.accountProfileDarkScreenID, "account.profile.screen")
    XCTAssertEqual(SettingsRouteContract.accountProfileLightScreenID, "account.profile.light.screen")
    XCTAssertEqual(SettingsRouteContract.notificationsDarkScreenID, "notifications.screen")
    XCTAssertEqual(SettingsRouteContract.notificationsLightScreenID, "notifications.light.screen")
    XCTAssertEqual(SettingsRouteContract.privacyConsentDarkScreenID, "privacy.screen")
    XCTAssertEqual(SettingsRouteContract.privacyConsentLightScreenID, "privacy.light.screen")
    XCTAssertEqual(SettingsRouteContract.exportDataDarkScreenID, "export.screen")
    XCTAssertEqual(SettingsRouteContract.exportDataLightScreenID, "export.light.screen")
    XCTAssertEqual(SettingsRouteContract.deleteAccountDarkScreenID, "delete.screen")
    XCTAssertEqual(SettingsRouteContract.deleteAccountLightScreenID, "delete.light.screen")
  }
}
