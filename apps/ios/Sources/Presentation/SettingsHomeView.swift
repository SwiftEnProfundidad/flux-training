import Observation
import SwiftUI

@available(iOS 17, macOS 14, *)
public struct SettingsHomeView: View {
  @Bindable private var viewModel: SettingsHomeViewModel
  @Bindable private var accountProfileViewModel: AccountProfileViewModel
  @Bindable private var notificationsViewModel: NotificationsViewModel
  @Bindable private var privacyConsentViewModel: PrivacyConsentViewModel
  @Bindable private var exportDataViewModel: ExportDataViewModel
  @Bindable private var deleteAccountViewModel: DeleteAccountViewModel
  private let userID: String
  private let copy: LocalizedCopy
  private let screenAccessibilityID: String
  private let accountProfileRouteID: String
  private let useLightAccountProfileRoute: Bool
  private let notificationsRouteID: String
  private let useLightNotificationsRoute: Bool
  private let privacyConsentRouteID: String
  private let useLightPrivacyConsentRoute: Bool
  private let exportDataRouteID: String
  private let useLightExportDataRoute: Bool
  private let deleteAccountRouteID: String
  private let useLightDeleteAccountRoute: Bool

  public init(
    viewModel: SettingsHomeViewModel,
    accountProfileViewModel: AccountProfileViewModel,
    notificationsViewModel: NotificationsViewModel,
    privacyConsentViewModel: PrivacyConsentViewModel,
    exportDataViewModel: ExportDataViewModel,
    deleteAccountViewModel: DeleteAccountViewModel,
    userID: String,
    copy: LocalizedCopy,
    screenAccessibilityID: String = SettingsRouteContract.darkHomeScreenID,
    accountProfileRouteID: String = SettingsRouteContract.accountProfileDarkRouteID,
    useLightAccountProfileRoute: Bool = false,
    notificationsRouteID: String = SettingsRouteContract.notificationsDarkRouteID,
    useLightNotificationsRoute: Bool = false,
    privacyConsentRouteID: String = SettingsRouteContract.privacyConsentDarkRouteID,
    useLightPrivacyConsentRoute: Bool = false,
    exportDataRouteID: String = SettingsRouteContract.exportDataDarkRouteID,
    useLightExportDataRoute: Bool = false,
    deleteAccountRouteID: String = SettingsRouteContract.deleteAccountDarkRouteID,
    useLightDeleteAccountRoute: Bool = false
  ) {
    self.viewModel = viewModel
    self.accountProfileViewModel = accountProfileViewModel
    self.notificationsViewModel = notificationsViewModel
    self.privacyConsentViewModel = privacyConsentViewModel
    self.exportDataViewModel = exportDataViewModel
    self.deleteAccountViewModel = deleteAccountViewModel
    self.userID = userID
    self.copy = copy
    self.screenAccessibilityID = screenAccessibilityID
    self.accountProfileRouteID = accountProfileRouteID
    self.useLightAccountProfileRoute = useLightAccountProfileRoute
    self.notificationsRouteID = notificationsRouteID
    self.useLightNotificationsRoute = useLightNotificationsRoute
    self.privacyConsentRouteID = privacyConsentRouteID
    self.useLightPrivacyConsentRoute = useLightPrivacyConsentRoute
    self.exportDataRouteID = exportDataRouteID
    self.useLightExportDataRoute = useLightExportDataRoute
    self.deleteAccountRouteID = deleteAccountRouteID
    self.useLightDeleteAccountRoute = useLightDeleteAccountRoute
  }

  public var body: some View {
    Form {
      Section {
        NavigationLink {
          accountProfileDestination
        } label: {
          VStack(alignment: .leading, spacing: 4) {
            Text(copy.text(.accountProfileTitle))
              .font(.body.weight(.semibold))
            Text(copy.text(.profileStatusLabel))
              .font(.footnote)
              .foregroundStyle(.secondary)
            Text(copy.humanStatus(accountProfileViewModel.status))
              .font(.footnote.weight(.medium))
              .foregroundStyle(.orange)
          }
          .frame(maxWidth: .infinity, alignment: .leading)
        }
        .accessibilityIdentifier(accountProfileRouteID)
      }

      Section {
        NavigationLink {
          notificationsDestination
        } label: {
          VStack(alignment: .leading, spacing: 4) {
            Text(copy.text(.notificationsTitle))
              .font(.body.weight(.semibold))
            Text(copy.text(.notificationsStatusLabel))
              .font(.footnote)
              .foregroundStyle(.secondary)
            Text(copy.humanStatus(notificationsViewModel.status))
              .font(.footnote.weight(.medium))
              .foregroundStyle(.orange)
          }
          .frame(maxWidth: .infinity, alignment: .leading)
        }
        .accessibilityIdentifier(notificationsRouteID)
      }

      Section {
        NavigationLink {
          privacyConsentDestination
        } label: {
          VStack(alignment: .leading, spacing: 4) {
            Text(copy.text(.legalSectionTitle))
              .font(.body.weight(.semibold))
            Text(copy.text(.legalStatusLabel))
              .font(.footnote)
              .foregroundStyle(.secondary)
            Text(copy.humanStatus(privacyConsentViewModel.status))
              .font(.footnote.weight(.medium))
              .foregroundStyle(.orange)
          }
          .frame(maxWidth: .infinity, alignment: .leading)
        }
        .accessibilityIdentifier(privacyConsentRouteID)
      }

      Section {
        NavigationLink {
          exportDataDestination
        } label: {
          VStack(alignment: .leading, spacing: 4) {
            Text(copy.text(.exportDataTitle))
              .font(.body.weight(.semibold))
            Text(copy.text(.exportStatusLabel))
              .font(.footnote)
              .foregroundStyle(.secondary)
            Text(copy.humanStatus(exportDataViewModel.status))
              .font(.footnote.weight(.medium))
              .foregroundStyle(.orange)
          }
          .frame(maxWidth: .infinity, alignment: .leading)
        }
        .accessibilityIdentifier(exportDataRouteID)
      }

      Section {
        NavigationLink {
          deleteAccountDestination
        } label: {
          VStack(alignment: .leading, spacing: 4) {
            Text(copy.text(.deleteAccountTitle))
              .font(.body.weight(.semibold))
            Text(copy.text(.deleteAccountStatusLabel))
              .font(.footnote)
              .foregroundStyle(.secondary)
            Text(copy.humanStatus(deleteAccountViewModel.status))
              .font(.footnote.weight(.medium))
              .foregroundStyle(.orange)
          }
          .frame(maxWidth: .infinity, alignment: .leading)
        }
        .accessibilityIdentifier(deleteAccountRouteID)
      }

      Section(copy.text(.settingsTitle)) {
        Toggle(copy.text(.notificationsPreference), isOn: $viewModel.notificationsEnabled)
          .accessibilityIdentifier("settings.home.notifications")
        Toggle(copy.text(.watchPreference), isOn: $viewModel.watchSyncEnabled)
          .accessibilityIdentifier("settings.home.watchSync")
        Toggle(copy.text(.calendarPreference), isOn: $viewModel.calendarSyncEnabled)
          .accessibilityIdentifier("settings.home.calendarSync")
      }

      Section {
        Button(copy.text(.saveSettings)) {
          Task {
            await viewModel.save(userID: userID)
          }
        }
        .buttonStyle(.borderedProminent)
        .tint(.orange)
        .accessibilityIdentifier("settings.home.save")
      }

      Section(copy.text(.settingsStatusLabel)) {
        Text(copy.humanStatus(viewModel.status))
          .font(.footnote)
          .foregroundStyle(.secondary)
          .accessibilityIdentifier("settings.home.status")
      }
    }
    .navigationTitle(copy.text(.settingsTitle))
    .accessibilityIdentifier(screenAccessibilityID)
    .task(id: userID) {
      await viewModel.refresh(userID: userID)
      await accountProfileViewModel.refresh(userID: userID)
      await notificationsViewModel.refresh(userID: userID)
      await privacyConsentViewModel.refresh(userID: userID)
      await exportDataViewModel.refresh(userID: userID)
      await deleteAccountViewModel.refresh(userID: userID)
    }
  }

  @ViewBuilder
  private var accountProfileDestination: some View {
    if useLightAccountProfileRoute {
      AccountProfileLightView(
        viewModel: accountProfileViewModel,
        userID: userID,
        copy: copy
      )
    } else {
      AccountProfileView(
        viewModel: accountProfileViewModel,
        userID: userID,
        copy: copy
      )
    }
  }

  @ViewBuilder
  private var notificationsDestination: some View {
    if useLightNotificationsRoute {
      NotificationsLightView(
        viewModel: notificationsViewModel,
        userID: userID,
        copy: copy
      )
    } else {
      NotificationsView(
        viewModel: notificationsViewModel,
        userID: userID,
        copy: copy
      )
    }
  }

  @ViewBuilder
  private var privacyConsentDestination: some View {
    if useLightPrivacyConsentRoute {
      PrivacyConsentLightView(
        viewModel: privacyConsentViewModel,
        userID: userID,
        copy: copy
      )
    } else {
      PrivacyConsentView(
        viewModel: privacyConsentViewModel,
        userID: userID,
        copy: copy
      )
    }
  }

  @ViewBuilder
  private var exportDataDestination: some View {
    if useLightExportDataRoute {
      ExportDataLightView(
        viewModel: exportDataViewModel,
        userID: userID,
        copy: copy
      )
    } else {
      ExportDataView(
        viewModel: exportDataViewModel,
        userID: userID,
        copy: copy
      )
    }
  }

  @ViewBuilder
  private var deleteAccountDestination: some View {
    if useLightDeleteAccountRoute {
      DeleteAccountLightView(
        viewModel: deleteAccountViewModel,
        userID: userID,
        copy: copy
      )
    } else {
      DeleteAccountView(
        viewModel: deleteAccountViewModel,
        userID: userID,
        copy: copy
      )
    }
  }
}
