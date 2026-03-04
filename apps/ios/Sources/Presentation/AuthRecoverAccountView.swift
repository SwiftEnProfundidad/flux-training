import Observation
import SwiftUI

@available(iOS 17, macOS 14, *)
public struct AuthRecoverAccountView: View {
  @Bindable private var viewModel: AuthViewModel
  private let copy: LocalizedCopy
  private let screenAccessibilityID: String
  @State private var email = ""

  public init(
    viewModel: AuthViewModel,
    copy: LocalizedCopy,
    screenAccessibilityID: String = AuthRouteContract.recoverAccountDarkScreenID
  ) {
    self.viewModel = viewModel
    self.copy = copy
    self.screenAccessibilityID = screenAccessibilityID
  }

  public var body: some View {
    ScrollView {
      VStack(alignment: .leading, spacing: 14) {
        Text(copy.text(.recoverAccountTitle))
          .font(.system(size: 32, weight: .black, design: .rounded))
          .foregroundStyle(.white)

        Text(copy.text(.recoverAccountSubtitle))
          .font(.subheadline.weight(.medium))
          .foregroundStyle(.white.opacity(0.74))

        VStack(alignment: .leading, spacing: 6) {
          Text(copy.text(.emailField))
            .font(.caption.weight(.semibold))
            .foregroundStyle(.white.opacity(0.8))
        TextField(copy.text(.emailField), text: $email)
            .fluxInputFieldStyle()
          .accessibilityIdentifier("auth.recover.email")
        }

        Button(copy.text(.recoverByEmail)) {
          viewModel.requestRecovery(email: email, channel: .email)
        }
        .buttonStyle(FluxSecondaryButtonStyle())
        .accessibilityIdentifier("auth.recover.byEmail")

        Button(copy.text(.recoverBySMS)) {
          viewModel.requestRecovery(email: email, channel: .sms)
        }
        .buttonStyle(FluxSecondaryButtonStyle())
        .accessibilityIdentifier("auth.recover.bySms")

        Button(copy.text(.openSupportTicketAction)) {
          viewModel.openSupportTicket()
        }
        .buttonStyle(FluxSecondaryButtonStyle())
        .accessibilityIdentifier("auth.recover.support")

        Button(copy.text(.continueAction)) {
          viewModel.requestRecovery(email: email, channel: .email)
        }
        .buttonStyle(FluxPrimaryButtonStyle())
        .accessibilityIdentifier("auth.recover.continue")

        if isStatusRelevant {
          FluxCard {
            Text(copy.humanStatus(viewModel.authStatus))
              .font(.footnote.weight(.semibold))
              .foregroundStyle(.orange)
              .accessibilityIdentifier("auth.recover.status")
          }
        }
      }
      .padding(16)
    }
    .navigationTitle(copy.text(.recoverAccountTitle))
    .fluxScreenStyle()
    .accessibilityIdentifier(screenAccessibilityID)
  }

  private var isStatusRelevant: Bool {
    switch viewModel.authStatus {
    case "signed_out", "idle", "loading":
      return false
    default:
      return true
    }
  }
}
