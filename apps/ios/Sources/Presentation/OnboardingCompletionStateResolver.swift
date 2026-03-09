import Foundation

enum OnboardingCompletionStateResolver {
  static func isOnboardingCompleted(profileLoadStatus: String) -> Bool {
    profileLoadStatus == "loaded" || profileLoadStatus == SettingsLegalScreenStatus.saved.rawValue
  }
}
