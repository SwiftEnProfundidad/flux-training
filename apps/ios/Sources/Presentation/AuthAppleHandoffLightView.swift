import SwiftUI

@available(iOS 17, macOS 14, *)
public struct AuthAppleHandoffLightView: View {
  private let viewModel: AuthViewModel
  private let copy: LocalizedCopy

  public init(
    viewModel: AuthViewModel,
    copy: LocalizedCopy
  ) {
    self.viewModel = viewModel
    self.copy = copy
  }

  public var body: some View {
    AuthAppleHandoffView(
      viewModel: viewModel,
      copy: copy,
      screenAccessibilityID: AuthRouteContract.appleHandoffLightScreenID
    )
    .preferredColorScheme(.light)
    .accessibilityIdentifier(AuthRouteContract.appleHandoffLightScreenID)
  }
}
