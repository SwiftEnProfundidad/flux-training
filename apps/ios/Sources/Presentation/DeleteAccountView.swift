import Observation
import SwiftUI

@available(iOS 17, macOS 14, *)
public struct DeleteAccountView: View {
  @Bindable private var viewModel: DeleteAccountViewModel
  private let userID: String
  private let copy: LocalizedCopy
  private let screenAccessibilityID: String

  public init(
    viewModel: DeleteAccountViewModel,
    userID: String,
    copy: LocalizedCopy,
    screenAccessibilityID: String = SettingsRouteContract.deleteAccountDarkScreenID
  ) {
    self.viewModel = viewModel
    self.userID = userID
    self.copy = copy
    self.screenAccessibilityID = screenAccessibilityID
  }

  public var body: some View {
    ScrollView {
      VStack(alignment: .leading, spacing: 14) {
        Text(copy.text(.deleteAccountTitle))
          .font(.system(size: 32, weight: .black, design: .rounded))
          .foregroundStyle(.white)

        Text(copy.text(.deleteAccountStatusLabel))
          .font(.subheadline.weight(.medium))
          .foregroundStyle(.white.opacity(0.74))

        FluxCard {
          VStack(alignment: .leading, spacing: 12) {
            fieldLabel(copy.text(.deleteAccountReasonLabel))
            TextField(copy.text(.deleteAccountReasonLabel), text: $viewModel.reason)
              .fluxInputFieldStyle()
              .accessibilityIdentifier("delete.reason")
            metricRow(copy.text(.deleteAccountLatestRequestLabel), viewModel.latestRequestAtISO8601)
              .accessibilityIdentifier("delete.latestRequestAt")
          }
        }

        Button(copy.text(.requestDeletion)) {
          Task { await viewModel.requestDeletion(userID: userID) }
        }
        .buttonStyle(FluxPrimaryButtonStyle())
        .accessibilityIdentifier("delete.request")

        FluxCard {
          Text("\(copy.text(.deleteAccountStatusLabel)): \(copy.humanStatus(viewModel.status))")
            .font(.footnote.weight(.semibold))
            .foregroundStyle(.white.opacity(0.82))
            .accessibilityIdentifier("delete.status")
        }
      }
    }
    .padding(16)
    .navigationTitle(copy.text(.deleteAccountTitle))
    .fluxScreenStyle()
    .accessibilityIdentifier(screenAccessibilityID)
    .task(id: userID) {
      await viewModel.refresh(userID: userID)
    }
  }

  @ViewBuilder
  private func fieldLabel(_ title: String) -> some View {
    Text(title)
      .font(.caption.weight(.semibold))
      .foregroundStyle(.white.opacity(0.8))
  }

  @ViewBuilder
  private func metricRow(_ title: String, _ value: String) -> some View {
    HStack(alignment: .firstTextBaseline) {
      Text(title)
        .foregroundStyle(.white.opacity(0.7))
      Spacer(minLength: 12)
      Text(value)
        .font(.body.weight(.semibold))
        .foregroundStyle(.white)
    }
  }
}
