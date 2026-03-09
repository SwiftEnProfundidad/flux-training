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
    ScrollView {
      VStack(alignment: .leading, spacing: 14) {
        Text(copy.text(.notificationsTitle))
          .font(.system(size: 32, weight: .black, design: .rounded))
          .foregroundStyle(.white)

        Text(copy.text(.notificationsStatusLabel))
          .font(.subheadline.weight(.medium))
          .foregroundStyle(.white.opacity(0.74))

        FluxCard {
          VStack(alignment: .leading, spacing: 10) {
            toggleRow(
              title: copy.text(.trainingRemindersPreference),
              isOn: $viewModel.trainingRemindersEnabled,
              identifier: "notifications.trainingReminders"
            )
            toggleRow(
              title: copy.text(.recoveryAlertsPreference),
              isOn: $viewModel.recoveryAlertsEnabled,
              identifier: "notifications.recoveryAlerts"
            )
            toggleRow(
              title: copy.text(.weeklyDigestPreference),
              isOn: $viewModel.weeklyDigestEnabled,
              identifier: "notifications.weeklyDigest"
            )
          }
        }

        Button(copy.text(.saveNotifications)) {
          Task { await viewModel.save(userID: userID) }
        }
        .buttonStyle(FluxPrimaryButtonStyle())
        .accessibilityIdentifier("notifications.save")

        FluxCard {
          Text("\(copy.text(.notificationsStatusLabel)): \(copy.humanStatus(viewModel.status))")
            .font(.footnote.weight(.semibold))
            .foregroundStyle(.white.opacity(0.82))
            .accessibilityIdentifier("notifications.status")
        }
      }
    }
    .padding(16)
    .navigationTitle(copy.text(.notificationsTitle))
    .fluxScreenStyle()
    .accessibilityIdentifier(screenAccessibilityID)
    .task(id: userID) {
      await viewModel.refresh(userID: userID)
    }
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
}
