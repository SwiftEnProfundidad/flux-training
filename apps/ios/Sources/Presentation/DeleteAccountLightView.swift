import SwiftUI

@available(iOS 17, macOS 14, *)
public struct DeleteAccountLightView: View {
  private let viewModel: DeleteAccountViewModel
  private let userID: String
  private let copy: LocalizedCopy

  public init(
    viewModel: DeleteAccountViewModel,
    userID: String,
    copy: LocalizedCopy
  ) {
    self.viewModel = viewModel
    self.userID = userID
    self.copy = copy
  }

  public var body: some View {
    DeleteAccountView(
      viewModel: viewModel,
      userID: userID,
      copy: copy,
      screenAccessibilityID: SettingsRouteContract.deleteAccountLightScreenID
    )
    .preferredColorScheme(.light)
  }
}
