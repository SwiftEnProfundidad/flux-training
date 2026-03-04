import Observation
import SwiftUI

@available(iOS 17, macOS 14, *)
public struct AuthSessionExpiredView: View {
  @Bindable private var viewModel: AuthViewModel
  private let copy: LocalizedCopy
  private let screenAccessibilityID: String

  public init(
    viewModel: AuthViewModel,
    copy: LocalizedCopy,
    screenAccessibilityID: String = AuthRouteContract.sessionExpiredDarkScreenID
  ) {
    self.viewModel = viewModel
    self.copy = copy
    self.screenAccessibilityID = screenAccessibilityID
  }

  public var body: some View {
    ScrollView {
      VStack(alignment: .leading, spacing: 14) {
        Text(copy.text(.sessionExpiredTitle))
          .font(.system(size: 32, weight: .black, design: .rounded))
          .foregroundStyle(.white)

        Text(copy.text(.sessionExpiredMessage))
          .font(.subheadline)
          .foregroundStyle(.white.opacity(0.74))
          .accessibilityIdentifier("auth.sessionExpired.message")

        FluxCard {
          Text(copy.text(.sessionExpiredCauses))
            .font(.footnote)
            .foregroundStyle(.white.opacity(0.78))
        }

        Button(copy.text(.backToSignInAction)) {
          viewModel.backToSignInAfterSessionExpired()
        }
        .buttonStyle(FluxPrimaryButtonStyle())
        .accessibilityIdentifier("auth.sessionExpired.backToSignIn")

        Button(copy.text(.openOfflineModeAction)) {
          viewModel.openOfflineModeAfterSessionExpired()
        }
        .buttonStyle(FluxSecondaryButtonStyle())
        .accessibilityIdentifier("auth.sessionExpired.openOfflineMode")

        if isStatusRelevant {
          FluxCard {
            Text(copy.humanStatus(viewModel.authStatus))
              .font(.footnote.weight(.semibold))
              .foregroundStyle(.orange)
              .accessibilityIdentifier("auth.sessionExpired.status")
          }
        }
      }
      .padding(16)
    }
    .navigationTitle(copy.text(.sessionExpiredTitle))
    .fluxScreenStyle()
    .accessibilityIdentifier(screenAccessibilityID)
    .onAppear {
      viewModel.markSessionExpired()
    }
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
