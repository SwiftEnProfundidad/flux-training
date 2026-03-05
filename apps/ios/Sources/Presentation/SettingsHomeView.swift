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
    ScrollView {
      VStack(alignment: .leading, spacing: 14) {
        Text(copy.text(.settingsTitle))
          .font(.system(size: 32, weight: .black, design: .rounded))
          .foregroundStyle(.white)

        routeLink(
          title: copy.text(.accountProfileTitle),
          subtitle: copy.text(.profileStatusLabel),
          status: copy.humanStatus(accountProfileViewModel.status),
          accessibilityID: accountProfileRouteID
        ) {
          accountProfileDestination
        }

        routeLink(
          title: copy.text(.notificationsTitle),
          subtitle: copy.text(.notificationsStatusLabel),
          status: copy.humanStatus(notificationsViewModel.status),
          accessibilityID: notificationsRouteID
        ) {
          notificationsDestination
        }

        routeLink(
          title: copy.text(.legalSectionTitle),
          subtitle: copy.text(.legalStatusLabel),
          status: copy.humanStatus(privacyConsentViewModel.status),
          accessibilityID: privacyConsentRouteID
        ) {
          privacyConsentDestination
        }

        routeLink(
          title: copy.text(.exportDataTitle),
          subtitle: copy.text(.exportStatusLabel),
          status: copy.humanStatus(exportDataViewModel.status),
          accessibilityID: exportDataRouteID
        ) {
          exportDataDestination
        }

        routeLink(
          title: copy.text(.deleteAccountTitle),
          subtitle: copy.text(.deleteAccountStatusLabel),
          status: copy.humanStatus(deleteAccountViewModel.status),
          accessibilityID: deleteAccountRouteID
        ) {
          deleteAccountDestination
        }

        FluxCard {
          VStack(alignment: .leading, spacing: 10) {
            toggleRow(
              title: copy.text(.notificationsPreference),
              isOn: $viewModel.notificationsEnabled,
              identifier: "settings.home.notifications"
            )
            toggleRow(
              title: copy.text(.watchPreference),
              isOn: $viewModel.watchSyncEnabled,
              identifier: "settings.home.watchSync"
            )
            toggleRow(
              title: copy.text(.calendarPreference),
              isOn: $viewModel.calendarSyncEnabled,
              identifier: "settings.home.calendarSync"
            )
          }
        }

        Button(copy.text(.saveSettings)) {
          Task { await viewModel.save(userID: userID) }
        }
        .buttonStyle(FluxPrimaryButtonStyle())
        .accessibilityIdentifier("settings.home.save")

        FluxCard {
          Text("\(copy.text(.settingsStatusLabel)): \(copy.humanStatus(viewModel.status))")
            .font(.footnote.weight(.semibold))
            .foregroundStyle(.white.opacity(0.82))
            .accessibilityIdentifier("settings.home.status")
        }
      }
      .padding(16)
    }
    .navigationTitle(copy.text(.settingsTitle))
    .fluxScreenStyle()
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
  private func routeCard(title: String, subtitle: String, status: String) -> some View {
    FluxCard {
      VStack(alignment: .leading, spacing: 4) {
        Text(title)
          .font(.body.weight(.semibold))
          .foregroundStyle(.white)
        Text(subtitle)
          .font(.footnote)
          .foregroundStyle(.white.opacity(0.65))
        Text(status)
          .font(.footnote.weight(.semibold))
          .foregroundStyle(.orange)
      }
    }
  }

  @ViewBuilder
  private func routeLink<Destination: View>(
    title: String,
    subtitle: String,
    status: String,
    accessibilityID: String,
    @ViewBuilder destination: () -> Destination
  ) -> some View {
    NavigationLink {
      destination()
    } label: {
      routeCard(title: title, subtitle: subtitle, status: status)
    }
    .buttonStyle(.plain)
    .accessibilityIdentifier(accessibilityID)
  }

  @ViewBuilder
  private func toggleRow(title: String, isOn: Binding<Bool>, identifier: String) -> some View {
    Toggle(isOn: isOn) {
      Text(title)
        .font(.body.weight(.medium))
        .foregroundStyle(.white.opacity(0.86))
    }
    .tint(.orange)
    .accessibilityIdentifier(identifier)
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
