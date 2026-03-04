import Observation
import SwiftUI

@available(iOS 17, macOS 14, *)
public struct AuthEmailLoginView: View {
  @Bindable private var viewModel: AuthViewModel
  private let copy: LocalizedCopy
  private let screenAccessibilityID: String
  private let onUseAppleHandoff: () -> Void
  private let onRecoverAccount: () -> Void
  @State private var email = ""
  @State private var password = ""
  @State private var rememberMe = true

  public init(
    viewModel: AuthViewModel,
    copy: LocalizedCopy,
    screenAccessibilityID: String = AuthRouteContract.emailLoginDarkScreenID,
    onUseAppleHandoff: @escaping () -> Void = {},
    onRecoverAccount: @escaping () -> Void = {}
  ) {
    self.viewModel = viewModel
    self.copy = copy
    self.screenAccessibilityID = screenAccessibilityID
    self.onUseAppleHandoff = onUseAppleHandoff
    self.onRecoverAccount = onRecoverAccount
  }

  public var body: some View {
    ScrollView {
      VStack(alignment: .leading, spacing: 14) {
        Text(copy.text(.signInWithEmail))
          .font(.system(size: 34, weight: .black, design: .rounded))
          .foregroundStyle(.white)

        Text(copy.text(.signInEmailSubtitle))
          .font(.subheadline.weight(.medium))
          .foregroundStyle(.white.opacity(0.74))

        VStack(alignment: .leading, spacing: 6) {
          Text(copy.text(.emailField))
            .font(.caption.weight(.semibold))
            .foregroundStyle(.white.opacity(0.8))
          TextField(copy.text(.emailField), text: $email)
            .fluxInputFieldStyle()
            .accessibilityIdentifier("auth.emailLogin.email")
        }

        VStack(alignment: .leading, spacing: 6) {
          Text(copy.text(.passwordField))
            .font(.caption.weight(.semibold))
            .foregroundStyle(.white.opacity(0.8))
          SecureField(copy.text(.passwordField), text: $password)
            .fluxInputFieldStyle()
            .accessibilityIdentifier("auth.emailLogin.password")
        }

        HStack(spacing: 10) {
          Button(copy.text(.rememberMe)) {
            rememberMe.toggle()
          }
          .buttonStyle(FluxSecondaryButtonStyle())
          .opacity(rememberMe ? 1 : 0.65)
          .accessibilityIdentifier("auth.emailLogin.rememberMe")

          Button(copy.text(.forgotPassword)) {
            onRecoverAccount()
          }
          .buttonStyle(FluxSecondaryButtonStyle())
          .accessibilityIdentifier("auth.emailLogin.forgotPassword")
        }

        Button(copy.text(.signInWithEmail)) {
          Task {
            await viewModel.signInWithEmail(email: email, password: password)
          }
        }
        .buttonStyle(FluxPrimaryButtonStyle())
        .accessibilityIdentifier("auth.emailLogin.signIn")

        HStack {
          Button("Apple") {
            onUseAppleHandoff()
          }
          .buttonStyle(FluxSecondaryButtonStyle())

          Button("Google") {
            onRecoverAccount()
          }
          .buttonStyle(FluxSecondaryButtonStyle())
        }
        .accessibilityIdentifier("auth.emailLogin.providers")

        FluxCard {
          Text(copy.text(.authEmailHelpText))
            .font(.footnote)
            .foregroundStyle(.white.opacity(0.75))
        }

        if let feedback = copy.authFeedback(viewModel.authStatus) {
          FluxCard {
            Text(feedback)
              .font(.footnote.weight(.semibold))
              .foregroundStyle(.orange)
              .accessibilityIdentifier("auth.emailLogin.status")
          }
        }
      }
      .padding(16)
    }
    .navigationTitle(copy.text(.signInWithEmail))
    .fluxScreenStyle()
    .accessibilityIdentifier(screenAccessibilityID)
  }
}
