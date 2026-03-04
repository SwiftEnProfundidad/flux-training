import Observation
import SwiftUI

@available(iOS 17, macOS 14, *)
public struct NotificationsView: View {
  @Bindable private var viewModel: NotificationsViewModel
  private let userID: String
  private let copy: LocalizedCopy
  private let screenAccessibilityID: String

  public init(
    viewModel: NotificationsViewModel,
    userID: String,
    copy: LocalizedCopy,
    screenAccessibilityID: String = SettingsRouteContract.notificationsDarkScreenID
  ) {
    self.viewModel = viewModel
    self.userID = userID
    self.copy = copy
    self.screenAccessibilityID = screenAccessibilityID
  }

  public var body: some View {
    Form {
      Section(copy.text(.notificationsTitle)) {
        Toggle(copy.text(.trainingRemindersPreference), isOn: $viewModel.trainingRemindersEnabled)
          .accessibilityIdentifier("notifications.trainingReminders")
        Toggle(copy.text(.recoveryAlertsPreference), isOn: $viewModel.recoveryAlertsEnabled)
          .accessibilityIdentifier("notifications.recoveryAlerts")
        Toggle(copy.text(.weeklyDigestPreference), isOn: $viewModel.weeklyDigestEnabled)
          .accessibilityIdentifier("notifications.weeklyDigest")
      }

      Section {
        Button(copy.text(.saveNotifications)) {
          Task {
            await viewModel.save(userID: userID)
          }
        }
        .buttonStyle(.borderedProminent)
        .tint(.orange)
        .accessibilityIdentifier("notifications.save")
      }

      Section(copy.text(.notificationsStatusLabel)) {
        Text(copy.humanStatus(viewModel.status))
          .font(.footnote)
          .foregroundStyle(.secondary)
          .accessibilityIdentifier("notifications.status")
      }
    }
    .navigationTitle(copy.text(.notificationsTitle))
    .accessibilityIdentifier(screenAccessibilityID)
    .task(id: userID) {
      await viewModel.refresh(userID: userID)
    }
  }
}
