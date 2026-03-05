import SwiftUI

@available(iOS 17, macOS 14, *)
public struct VideoPlayerLightView: View {
  private let viewModel: TrainingFlowViewModel
  private let userID: String
  private let copy: LocalizedCopy
  private let onOpenSessionSummary: () -> Void

  public init(
    viewModel: TrainingFlowViewModel,
    userID: String,
    copy: LocalizedCopy,
    onOpenSessionSummary: @escaping () -> Void = {}
  ) {
    self.viewModel = viewModel
    self.userID = userID
    self.copy = copy
    self.onOpenSessionSummary = onOpenSessionSummary
  }

  public var body: some View {
    VideoPlayerView(
      viewModel: viewModel,
      userID: userID,
      copy: copy,
      screenAccessibilityID: TrainingRouteContract.videoPlayerLightScreenID,
      onOpenSessionSummary: onOpenSessionSummary
    )
    .preferredColorScheme(.light)
    .accessibilityIdentifier(TrainingRouteContract.videoPlayerLightScreenID)
  }
}
