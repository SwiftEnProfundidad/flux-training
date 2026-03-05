import SwiftUI

@available(iOS 17, macOS 14, *)
public struct ExerciseLibraryLightView: View {
  private let viewModel: TrainingFlowViewModel
  private let userID: String
  private let copy: LocalizedCopy
  private let onOpenVideoPlayer: () -> Void

  public init(
    viewModel: TrainingFlowViewModel,
    userID: String,
    copy: LocalizedCopy,
    onOpenVideoPlayer: @escaping () -> Void = {}
  ) {
    self.viewModel = viewModel
    self.userID = userID
    self.copy = copy
    self.onOpenVideoPlayer = onOpenVideoPlayer
  }

  public var body: some View {
    ExerciseLibraryView(
      viewModel: viewModel,
      userID: userID,
      copy: copy,
      screenAccessibilityID: TrainingRouteContract.exerciseLibraryLightScreenID,
      onOpenVideoPlayer: onOpenVideoPlayer
    )
    .preferredColorScheme(.light)
    .accessibilityIdentifier(TrainingRouteContract.exerciseLibraryLightScreenID)
  }
}
