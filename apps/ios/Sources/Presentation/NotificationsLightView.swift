import SwiftUI

@available(iOS 17, macOS 14, *)
public struct NotificationsLightView: View {
  private let viewModel: NotificationsViewModel
  private let userID: String
  private let copy: LocalizedCopy

  public init(
    viewModel: NotificationsViewModel,
    userID: String,
    copy: LocalizedCopy
  ) {
    self.viewModel = viewModel
    self.userID = userID
    self.copy = copy
  }

  public var body: some View {
    NotificationsView(
      viewModel: viewModel,
      userID: userID,
      copy: copy,
      screenAccessibilityID: SettingsRouteContract.notificationsLightScreenID
    )
    .preferredColorScheme(.light)
  }
}
