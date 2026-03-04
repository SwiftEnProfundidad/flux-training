import SwiftUI

@available(iOS 17, macOS 14, *)
public struct OnboardingGoalSetupLightView: View {
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
    OnboardingGoalSetupView(
      viewModel: viewModel,
      copy: copy,
      screenAccessibilityID: OnboardingRouteContract.goalSetupLightScreenID
    )
    .preferredColorScheme(.light)
    .accessibilityIdentifier(OnboardingRouteContract.goalSetupLightScreenID)
  }
}
