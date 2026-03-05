import SwiftUI

@available(iOS 17, macOS 14, *)
public struct InWorkoutSetupLightView: View {
  private let viewModel: TrainingFlowViewModel
  private let userID: String
  private let copy: LocalizedCopy
  private let onOpenRPE: () -> Void
  private let onOpenSubstitution: () -> Void
  private let onOpenVideoPlayer: () -> Void

  public init(
    viewModel: TrainingFlowViewModel,
    userID: String,
    copy: LocalizedCopy,
    onOpenRPE: @escaping () -> Void = {},
    onOpenSubstitution: @escaping () -> Void = {},
    onOpenVideoPlayer: @escaping () -> Void = {}
  ) {
    self.viewModel = viewModel
    self.userID = userID
    self.copy = copy
    self.onOpenRPE = onOpenRPE
    self.onOpenSubstitution = onOpenSubstitution
    self.onOpenVideoPlayer = onOpenVideoPlayer
  }

  public var body: some View {
    InWorkoutSetupView(
      viewModel: viewModel,
      userID: userID,
      copy: copy,
      screenAccessibilityID: TrainingRouteContract.inWorkoutSetupLightScreenID,
      onOpenRPE: onOpenRPE,
      onOpenSubstitution: onOpenSubstitution,
      onOpenVideoPlayer: onOpenVideoPlayer
    )
    .preferredColorScheme(.light)
    .accessibilityIdentifier(TrainingRouteContract.inWorkoutSetupLightScreenID)
  }
}
