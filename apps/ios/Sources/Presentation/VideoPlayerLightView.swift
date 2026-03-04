import SwiftUI

@available(iOS 17, macOS 14, *)
public struct VideoPlayerLightView: View {
  private let viewModel: TrainingFlowViewModel
  private let userID: String
  private let copy: LocalizedCopy

  public init(
    viewModel: TrainingFlowViewModel,
    userID: String,
    copy: LocalizedCopy
  ) {
    self.viewModel = viewModel
    self.userID = userID
    self.copy = copy
  }

  public var body: some View {
    VideoPlayerView(
      viewModel: viewModel,
      userID: userID,
      copy: copy,
      screenAccessibilityID: TrainingRouteContract.videoPlayerLightScreenID
    )
    .preferredColorScheme(.light)
    .accessibilityIdentifier(TrainingRouteContract.videoPlayerLightScreenID)
  }
}
