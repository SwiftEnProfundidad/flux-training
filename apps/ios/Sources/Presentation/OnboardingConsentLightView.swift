import SwiftUI

@available(iOS 17, macOS 14, *)
public struct OnboardingConsentLightView: View {
  private let viewModel: OnboardingViewModel
  private let copy: LocalizedCopy

  public init(
    viewModel: OnboardingViewModel,
    copy: LocalizedCopy
  ) {
    self.viewModel = viewModel
    self.copy = copy
  }

  public var body: some View {
    OnboardingConsentView(
      viewModel: viewModel,
      copy: copy,
      screenAccessibilityID: OnboardingRouteContract.consentLightScreenID
    )
    .preferredColorScheme(.light)
    .accessibilityIdentifier(OnboardingRouteContract.consentLightScreenID)
  }
}
