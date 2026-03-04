import SwiftUI

@available(iOS 17, macOS 14, *)
public struct AuthSessionExpiredLightView: View {
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
    AuthSessionExpiredView(
      viewModel: viewModel,
      copy: copy,
      screenAccessibilityID: AuthRouteContract.sessionExpiredLightScreenID
    )
    .preferredColorScheme(.light)
    .accessibilityIdentifier(AuthRouteContract.sessionExpiredLightScreenID)
  }
}
