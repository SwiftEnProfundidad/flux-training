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
    Form {
      Section(copy.text(.deleteAccountTitle)) {
        TextField(copy.text(.deleteAccountReasonLabel), text: $viewModel.reason)
          .accessibilityIdentifier("delete.reason")
        LabeledContent(copy.text(.deleteAccountLatestRequestLabel), value: viewModel.latestRequestAtISO8601)
          .accessibilityIdentifier("delete.latestRequestAt")
      }

      Section {
        Button(copy.text(.requestDeletion)) {
          Task {
            await viewModel.requestDeletion(userID: userID)
          }
        }
        .buttonStyle(.borderedProminent)
        .tint(.orange)
        .accessibilityIdentifier("delete.request")
      }

      Section(copy.text(.deleteAccountStatusLabel)) {
        Text(copy.humanStatus(viewModel.status))
          .font(.footnote)
          .foregroundStyle(.secondary)
          .accessibilityIdentifier("delete.status")
      }
    }
    .navigationTitle(copy.text(.deleteAccountTitle))
    .accessibilityIdentifier(screenAccessibilityID)
    .task(id: userID) {
      await viewModel.refresh(userID: userID)
    }
  }
}
