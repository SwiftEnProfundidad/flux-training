import SwiftUI

@available(iOS 17, macOS 14, *)
public struct ProgressMetricsLightView: View {
  private let viewModel: ProgressViewModel
  private let userID: String
  private let copy: LocalizedCopy

  public init(
    viewModel: ProgressViewModel,
    userID: String,
    copy: LocalizedCopy
  ) {
    self.viewModel = viewModel
    self.userID = userID
    self.copy = copy
  }

  public var body: some View {
    ProgressMetricsView(
      viewModel: viewModel,
      userID: userID,
      copy: copy,
      screenAccessibilityID: ProgressRouteContract.metricsLightScreenID
    )
    .preferredColorScheme(.light)
  }
}
