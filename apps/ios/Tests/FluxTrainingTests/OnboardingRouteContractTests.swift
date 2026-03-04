import XCTest
@testable import FluxTraining

final class OnboardingRouteContractTests: XCTestCase {
  func test_routeIdentifiers_matchCanonicalValues() {
    XCTAssertEqual(OnboardingRouteContract.stepOneDarkRouteID, "onboarding.route.step1")
    XCTAssertEqual(OnboardingRouteContract.goalSetupDarkRouteID, "onboarding.route.goalSetup")
    XCTAssertEqual(OnboardingRouteContract.parQDarkRouteID, "onboarding.route.parQ")
    XCTAssertEqual(OnboardingRouteContract.consentDarkRouteID, "onboarding.route.consent")
    XCTAssertEqual(OnboardingRouteContract.stepOneLightRouteID, "onboarding.route.step1Light")
    XCTAssertEqual(OnboardingRouteContract.goalSetupLightRouteID, "onboarding.route.goalSetupLight")
    XCTAssertEqual(OnboardingRouteContract.parQLightRouteID, "onboarding.route.parQLight")
    XCTAssertEqual(OnboardingRouteContract.consentLightRouteID, "onboarding.route.consentLight")
    XCTAssertEqual(OnboardingRouteContract.stepOneRouteID, "onboarding.route.step1")
    XCTAssertEqual(OnboardingRouteContract.goalSetupRouteID, "onboarding.route.goalSetup")
    XCTAssertEqual(OnboardingRouteContract.parQRouteID, "onboarding.route.parQ")
    XCTAssertEqual(OnboardingRouteContract.consentRouteID, "onboarding.route.consent")
  }

  func test_screenIdentifiers_matchCanonicalValues() {
    XCTAssertEqual(OnboardingRouteContract.stepOneDarkScreenID, "onboarding.step1.screen")
    XCTAssertEqual(OnboardingRouteContract.goalSetupDarkScreenID, "onboarding.goalSetup.screen")
    XCTAssertEqual(OnboardingRouteContract.parQDarkScreenID, "onboarding.parQ.screen")
    XCTAssertEqual(OnboardingRouteContract.consentDarkScreenID, "onboarding.consent.screen")
    XCTAssertEqual(OnboardingRouteContract.stepOneLightScreenID, "onboarding.step1.light.screen")
    XCTAssertEqual(OnboardingRouteContract.goalSetupLightScreenID, "onboarding.goalSetup.light.screen")
    XCTAssertEqual(OnboardingRouteContract.parQLightScreenID, "onboarding.parQ.light.screen")
    XCTAssertEqual(OnboardingRouteContract.consentLightScreenID, "onboarding.consent.light.screen")
    XCTAssertEqual(OnboardingRouteContract.stepOneScreenID, "onboarding.step1.screen")
    XCTAssertEqual(OnboardingRouteContract.goalSetupScreenID, "onboarding.goalSetup.screen")
    XCTAssertEqual(OnboardingRouteContract.parQScreenID, "onboarding.parQ.screen")
    XCTAssertEqual(OnboardingRouteContract.consentScreenID, "onboarding.consent.screen")
  }
}
