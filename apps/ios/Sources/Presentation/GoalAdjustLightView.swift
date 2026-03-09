import SwiftUI

@available(iOS 17, macOS 14, *)
public struct GoalAdjustLightView: View {
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
    GoalAdjustView(
      viewModel: viewModel,
      copy: copy,
      screenAccessibilityID: ProgressRouteContract.goalAdjustLightScreenID
    )
    .preferredColorScheme(.light)
  }
}
