import SwiftUI

@available(iOS 17, macOS 14, *)
public struct AccountProfileLightView: View {
  private let viewModel: AccountProfileViewModel
  private let userID: String
  private let copy: LocalizedCopy

  public init(
    viewModel: AccountProfileViewModel,
    userID: String,
    copy: LocalizedCopy
  ) {
    self.viewModel = viewModel
    self.userID = userID
    self.copy = copy
  }

  public var body: some View {
    AccountProfileView(
      viewModel: viewModel,
      userID: userID,
      copy: copy,
      screenAccessibilityID: SettingsRouteContract.accountProfileLightScreenID
    )
    .preferredColorScheme(.light)
  }
}
