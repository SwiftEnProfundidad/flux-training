import SwiftUI

@available(iOS 17, macOS 14, *)
public struct PrivacyConsentLightView: View {
  private let viewModel: PrivacyConsentViewModel
  private let userID: String
  private let copy: LocalizedCopy

  public init(
    viewModel: PrivacyConsentViewModel,
    userID: String,
    copy: LocalizedCopy
  ) {
    self.viewModel = viewModel
    self.userID = userID
    self.copy = copy
  }

  public var body: some View {
    PrivacyConsentView(
      viewModel: viewModel,
      userID: userID,
      copy: copy,
      screenAccessibilityID: SettingsRouteContract.privacyConsentLightScreenID
    )
    .preferredColorScheme(.light)
  }
}
