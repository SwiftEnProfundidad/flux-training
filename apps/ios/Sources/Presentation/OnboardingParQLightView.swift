import SwiftUI

@available(iOS 17, macOS 14, *)
public struct OnboardingParQLightView: View {
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
    OnboardingParQView(
      viewModel: viewModel,
      copy: copy,
      screenAccessibilityID: OnboardingRouteContract.parQLightScreenID
    )
    .preferredColorScheme(.light)
    .accessibilityIdentifier(OnboardingRouteContract.parQLightScreenID)
  }
}
