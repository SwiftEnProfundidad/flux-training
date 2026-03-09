import SwiftUI

@available(iOS 17, macOS 14, *)
public struct PlanActiveLightView: View {
  private let viewModel: TrainingFlowViewModel
  private let userID: String
  private let copy: LocalizedCopy
  private let onOpenSessionSetup: () -> Void
  private let onOpenExerciseLibrary: () -> Void

  public init(
    viewModel: TrainingFlowViewModel,
    userID: String,
    copy: LocalizedCopy,
    onOpenSessionSetup: @escaping () -> Void = {},
    onOpenExerciseLibrary: @escaping () -> Void = {}
  ) {
    self.viewModel = viewModel
    self.userID = userID
    self.copy = copy
    self.onOpenSessionSetup = onOpenSessionSetup
    self.onOpenExerciseLibrary = onOpenExerciseLibrary
  }

  public var body: some View {
    PlanActiveView(
      viewModel: viewModel,
      userID: userID,
      copy: copy,
      screenAccessibilityID: TrainingRouteContract.planActiveLightScreenID,
      onOpenSessionSetup: onOpenSessionSetup,
      onOpenExerciseLibrary: onOpenExerciseLibrary
    )
    .preferredColorScheme(.light)
  }
}
