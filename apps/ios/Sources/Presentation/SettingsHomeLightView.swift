import SwiftUI

@available(iOS 17, macOS 14, *)
public struct SettingsHomeLightView: View {
  private let viewModel: SettingsHomeViewModel
  private let accountProfileViewModel: AccountProfileViewModel
  private let notificationsViewModel: NotificationsViewModel
  private let privacyConsentViewModel: PrivacyConsentViewModel
  private let exportDataViewModel: ExportDataViewModel
  private let deleteAccountViewModel: DeleteAccountViewModel
  private let userID: String
  private let copy: LocalizedCopy

  public init(
    viewModel: SettingsHomeViewModel,
    accountProfileViewModel: AccountProfileViewModel,
    notificationsViewModel: NotificationsViewModel,
    privacyConsentViewModel: PrivacyConsentViewModel,
    exportDataViewModel: ExportDataViewModel,
    deleteAccountViewModel: DeleteAccountViewModel,
    userID: String,
    copy: LocalizedCopy
  ) {
    self.viewModel = viewModel
    self.accountProfileViewModel = accountProfileViewModel
    self.notificationsViewModel = notificationsViewModel
    self.privacyConsentViewModel = privacyConsentViewModel
    self.exportDataViewModel = exportDataViewModel
    self.deleteAccountViewModel = deleteAccountViewModel
    self.userID = userID
    self.copy = copy
  }

  public var body: some View {
    SettingsHomeView(
      viewModel: viewModel,
      accountProfileViewModel: accountProfileViewModel,
      notificationsViewModel: notificationsViewModel,
      privacyConsentViewModel: privacyConsentViewModel,
      exportDataViewModel: exportDataViewModel,
      deleteAccountViewModel: deleteAccountViewModel,
      userID: userID,
      copy: copy,
      screenAccessibilityID: SettingsRouteContract.lightHomeScreenID,
      accountProfileRouteID: SettingsRouteContract.accountProfileLightRouteID,
      useLightAccountProfileRoute: true,
      notificationsRouteID: SettingsRouteContract.notificationsLightRouteID,
      useLightNotificationsRoute: true,
      privacyConsentRouteID: SettingsRouteContract.privacyConsentLightRouteID,
      useLightPrivacyConsentRoute: true,
      exportDataRouteID: SettingsRouteContract.exportDataLightRouteID,
      useLightExportDataRoute: true,
      deleteAccountRouteID: SettingsRouteContract.deleteAccountLightRouteID,
      useLightDeleteAccountRoute: true
    )
    .preferredColorScheme(.light)
    .accessibilityIdentifier(SettingsRouteContract.lightHomeScreenID)
  }
}
