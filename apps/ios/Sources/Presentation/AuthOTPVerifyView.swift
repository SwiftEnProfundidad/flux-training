import Observation
import SwiftUI

@available(iOS 17, macOS 14, *)
public struct AuthOTPVerifyView: View {
  @Bindable private var viewModel: AuthViewModel
  private let copy: LocalizedCopy
  private let screenAccessibilityID: String
  @State private var otpCode = ""

  public init(
    viewModel: AuthViewModel,
    copy: LocalizedCopy,
    screenAccessibilityID: String = AuthRouteContract.otpVerifyDarkScreenID
  ) {
    self.viewModel = viewModel
    self.copy = copy
    self.screenAccessibilityID = screenAccessibilityID
  }

  public var body: some View {
    ScrollView {
      VStack(alignment: .leading, spacing: 14) {
        Text(copy.text(.verifyOTPTitle))
          .font(.system(size: 32, weight: .black, design: .rounded))
          .foregroundStyle(.white)

        Text(copy.text(.otpSubtitle))
          .font(.subheadline.weight(.medium))
          .foregroundStyle(.white.opacity(0.74))

        HStack(spacing: 8) {
          ForEach(0..<6, id: \.self) { index in
            let character = characterAt(index)
            Text(character)
              .font(.title3.weight(.semibold))
              .foregroundStyle(.white)
              .frame(width: 44, height: 52)
              .background(Color.white.opacity(0.08))
              .clipShape(.rect(cornerRadius: 12))
              .overlay(
                RoundedRectangle(cornerRadius: 12)
                  .stroke(Color.white.opacity(0.18), lineWidth: 1)
              )
          }
        }
        .frame(maxWidth: .infinity, alignment: .leading)

        TextField(copy.text(.otpCodeField), text: $otpCode)
          .fluxInputFieldStyle()
          .accessibilityIdentifier("auth.otp.code")

        FluxCard {
          Text(copy.text(.otpExpirationHint))
            .font(.footnote.weight(.semibold))
            .foregroundStyle(.white.opacity(0.75))
        }

        Button(copy.text(.verifyCodeAction)) {
          viewModel.verifyOTP(code: otpCode)
        }
        .buttonStyle(FluxPrimaryButtonStyle())
        .accessibilityIdentifier("auth.otp.verify")

        Button(copy.text(.resendOTPAction)) {
          viewModel.resendOTP()
        }
        .buttonStyle(FluxSecondaryButtonStyle())
        .accessibilityIdentifier("auth.otp.resend")

        if let feedback = copy.authFeedback(viewModel.authStatus) {
          FluxCard {
            Text(feedback)
              .font(.footnote.weight(.semibold))
              .foregroundStyle(.orange)
              .accessibilityIdentifier("auth.otp.status")
          }
        }
      }
      .padding(16)
    }
    .navigationTitle(copy.text(.verifyOTPTitle))
    .fluxScreenStyle()
    .accessibilityIdentifier(screenAccessibilityID)
  }

  private func characterAt(_ index: Int) -> String {
    guard index < otpCode.count else {
      return ""
    }
    let stringIndex = otpCode.index(otpCode.startIndex, offsetBy: index)
    return String(otpCode[stringIndex])
  }
}
