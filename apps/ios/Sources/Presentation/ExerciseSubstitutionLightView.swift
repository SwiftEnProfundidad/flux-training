import SwiftUI

@available(iOS 17, macOS 14, *)
public struct ExerciseSubstitutionLightView: View {
  private let viewModel: TrainingFlowViewModel
  private let userID: String
  private let copy: LocalizedCopy
  private let onOpenExerciseLibrary: () -> Void
  private let onOpenVideoPlayer: () -> Void

  public init(
    viewModel: TrainingFlowViewModel,
    userID: String,
    copy: LocalizedCopy,
    onOpenExerciseLibrary: @escaping () -> Void = {},
    onOpenVideoPlayer: @escaping () -> Void = {}
  ) {
    self.viewModel = viewModel
    self.userID = userID
    self.copy = copy
    self.onOpenExerciseLibrary = onOpenExerciseLibrary
    self.onOpenVideoPlayer = onOpenVideoPlayer
  }

  public var body: some View {
    ExerciseSubstitutionView(
      viewModel: viewModel,
      userID: userID,
      copy: copy,
      screenAccessibilityID: TrainingRouteContract.substitutionLightScreenID,
      onOpenExerciseLibrary: onOpenExerciseLibrary,
      onOpenVideoPlayer: onOpenVideoPlayer
    )
    .preferredColorScheme(.light)
    .accessibilityIdentifier(TrainingRouteContract.substitutionLightScreenID)
  }
}
