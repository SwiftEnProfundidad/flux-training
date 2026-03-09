import SwiftUI

@available(iOS 17, macOS 14, *)
public struct AuthOTPVerifyLightView: View {
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
    AuthOTPVerifyView(
      viewModel: viewModel,
      copy: copy,
      screenAccessibilityID: AuthRouteContract.otpVerifyLightScreenID
    )
    .preferredColorScheme(.light)
    .accessibilityIdentifier(AuthRouteContract.otpVerifyLightScreenID)
  }
}
