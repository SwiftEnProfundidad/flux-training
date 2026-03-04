import SwiftUI

@available(iOS 17, macOS 14, *)
public struct ExerciseLibraryLightView: View {
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
    ExerciseLibraryView(
      viewModel: viewModel,
      userID: userID,
      copy: copy,
      screenAccessibilityID: TrainingRouteContract.exerciseLibraryLightScreenID
    )
    .preferredColorScheme(.light)
    .accessibilityIdentifier(TrainingRouteContract.exerciseLibraryLightScreenID)
  }
}
