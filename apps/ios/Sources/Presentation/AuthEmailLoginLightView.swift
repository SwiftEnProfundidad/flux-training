import SwiftUI

@available(iOS 17, macOS 14, *)
public struct AuthEmailLoginLightView: View {
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
    AuthEmailLoginView(
      viewModel: viewModel,
      copy: copy,
      screenAccessibilityID: AuthRouteContract.emailLoginLightScreenID
    )
    .preferredColorScheme(.light)
    .accessibilityIdentifier(AuthRouteContract.emailLoginLightScreenID)
  }
}
