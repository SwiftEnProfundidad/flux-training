import XCTest
@testable import FluxTraining

final class AuthRouteContractTests: XCTestCase {
  func test_routeIdentifiers_matchCanonicalValues() {
    XCTAssertEqual(AuthRouteContract.welcomeDarkRouteID, "auth.route.welcome")
    XCTAssertEqual(AuthRouteContract.emailLoginDarkRouteID, "auth.route.emailLogin")
    XCTAssertEqual(AuthRouteContract.appleHandoffDarkRouteID, "auth.route.appleHandoff")
    XCTAssertEqual(AuthRouteContract.otpVerifyDarkRouteID, "auth.route.otpVerify")
    XCTAssertEqual(AuthRouteContract.recoverAccountDarkRouteID, "auth.route.recoverAccount")
    XCTAssertEqual(AuthRouteContract.sessionExpiredDarkRouteID, "auth.route.sessionExpired")
    XCTAssertEqual(AuthRouteContract.welcomeLightRouteID, "auth.route.welcomeLight")
    XCTAssertEqual(AuthRouteContract.emailLoginLightRouteID, "auth.route.emailLoginLight")
    XCTAssertEqual(AuthRouteContract.appleHandoffLightRouteID, "auth.route.appleHandoffLight")
    XCTAssertEqual(AuthRouteContract.otpVerifyLightRouteID, "auth.route.otpVerifyLight")
    XCTAssertEqual(AuthRouteContract.recoverAccountLightRouteID, "auth.route.recoverAccountLight")
    XCTAssertEqual(AuthRouteContract.sessionExpiredLightRouteID, "auth.route.sessionExpiredLight")
    XCTAssertEqual(AuthRouteContract.welcomeRouteID, "auth.route.welcome")
    XCTAssertEqual(AuthRouteContract.emailLoginRouteID, "auth.route.emailLogin")
    XCTAssertEqual(AuthRouteContract.appleHandoffRouteID, "auth.route.appleHandoff")
    XCTAssertEqual(AuthRouteContract.otpVerifyRouteID, "auth.route.otpVerify")
    XCTAssertEqual(AuthRouteContract.recoverAccountRouteID, "auth.route.recoverAccount")
    XCTAssertEqual(AuthRouteContract.sessionExpiredRouteID, "auth.route.sessionExpired")
  }

  func test_screenIdentifiers_matchCanonicalValues() {
    XCTAssertEqual(AuthRouteContract.welcomeDarkScreenID, "auth.welcome.screen")
    XCTAssertEqual(AuthRouteContract.emailLoginDarkScreenID, "auth.emailLogin.screen")
    XCTAssertEqual(AuthRouteContract.appleHandoffDarkScreenID, "auth.appleHandoff.screen")
    XCTAssertEqual(AuthRouteContract.otpVerifyDarkScreenID, "auth.otpVerify.screen")
    XCTAssertEqual(AuthRouteContract.recoverAccountDarkScreenID, "auth.recoverAccount.screen")
    XCTAssertEqual(AuthRouteContract.sessionExpiredDarkScreenID, "auth.sessionExpired.screen")
    XCTAssertEqual(AuthRouteContract.welcomeLightScreenID, "auth.welcome.light.screen")
    XCTAssertEqual(AuthRouteContract.emailLoginLightScreenID, "auth.emailLogin.light.screen")
    XCTAssertEqual(AuthRouteContract.appleHandoffLightScreenID, "auth.appleHandoff.light.screen")
    XCTAssertEqual(AuthRouteContract.otpVerifyLightScreenID, "auth.otpVerify.light.screen")
    XCTAssertEqual(AuthRouteContract.recoverAccountLightScreenID, "auth.recoverAccount.light.screen")
    XCTAssertEqual(AuthRouteContract.sessionExpiredLightScreenID, "auth.sessionExpired.light.screen")
    XCTAssertEqual(AuthRouteContract.welcomeScreenID, "auth.welcome.screen")
    XCTAssertEqual(AuthRouteContract.emailLoginScreenID, "auth.emailLogin.screen")
    XCTAssertEqual(AuthRouteContract.appleHandoffScreenID, "auth.appleHandoff.screen")
    XCTAssertEqual(AuthRouteContract.otpVerifyScreenID, "auth.otpVerify.screen")
    XCTAssertEqual(AuthRouteContract.recoverAccountScreenID, "auth.recoverAccount.screen")
    XCTAssertEqual(AuthRouteContract.sessionExpiredScreenID, "auth.sessionExpired.screen")
  }
}
