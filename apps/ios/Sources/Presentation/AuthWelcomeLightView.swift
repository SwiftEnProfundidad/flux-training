import SwiftUI

@available(iOS 17, macOS 14, *)
public struct AuthWelcomeLightView: View {
  private let viewModel: AuthViewModel
  private let copy: LocalizedCopy
  private let readinessScore: Int
  private let goalLabel: String

  public init(
    viewModel: AuthViewModel,
    copy: LocalizedCopy,
    readinessScore: Int,
    goalLabel: String
  ) {
    self.viewModel = viewModel
    self.copy = copy
    self.readinessScore = readinessScore
    self.goalLabel = goalLabel
  }

  public var body: some View {
    AuthWelcomeView(
      viewModel: viewModel,
      copy: copy,
      readinessScore: readinessScore,
      goalLabel: goalLabel,
      screenAccessibilityID: AuthRouteContract.welcomeLightScreenID
    )
    .preferredColorScheme(.light)
    .accessibilityIdentifier(AuthRouteContract.welcomeLightScreenID)
  }
}
