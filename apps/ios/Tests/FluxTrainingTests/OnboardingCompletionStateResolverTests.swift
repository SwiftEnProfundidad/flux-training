import XCTest
@testable import FluxTraining

final class OnboardingCompletionStateResolverTests: XCTestCase {
  func test_isOnboardingCompleted_whenLoadedStatus_returnsTrue() {
    XCTAssertTrue(
      OnboardingCompletionStateResolver.isOnboardingCompleted(profileLoadStatus: "loaded")
    )
  }

  func test_isOnboardingCompleted_whenSavedStatus_returnsTrue() {
    XCTAssertTrue(
      OnboardingCompletionStateResolver.isOnboardingCompleted(
        profileLoadStatus: SettingsLegalScreenStatus.saved.rawValue
      )
    )
  }

  func test_isOnboardingCompleted_whenEmptyOrErrorStatus_returnsFalse() {
    XCTAssertFalse(
      OnboardingCompletionStateResolver.isOnboardingCompleted(profileLoadStatus: "empty")
    )
    XCTAssertFalse(
      OnboardingCompletionStateResolver.isOnboardingCompleted(
        profileLoadStatus: SettingsLegalScreenStatus.error.rawValue
      )
    )
  }
}
