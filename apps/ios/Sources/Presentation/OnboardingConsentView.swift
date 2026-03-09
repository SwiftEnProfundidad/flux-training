import Observation
import SwiftUI

@available(iOS 17, macOS 14, *)
public struct OnboardingConsentView: View {
  @Bindable private var viewModel: OnboardingViewModel
  private let copy: LocalizedCopy
  private let screenAccessibilityID: String

  public init(
    viewModel: OnboardingViewModel,
    copy: LocalizedCopy,
    screenAccessibilityID: String = OnboardingRouteContract.consentDarkScreenID
  ) {
    self.viewModel = viewModel
    self.copy = copy
    self.screenAccessibilityID = screenAccessibilityID
  }

  public var body: some View {
    ScrollView {
      VStack(alignment: .leading, spacing: 14) {
        Text(copy.text(.legalSectionTitle))
          .font(.system(size: 32, weight: .black, design: .rounded))
          .foregroundStyle(.white)

        FluxCard {
          VStack(alignment: .leading, spacing: 6) {
            Text(copy.text(.policySummaryLine))
              .font(.footnote.weight(.medium))
              .foregroundStyle(.white.opacity(0.8))
            Text(copy.text(.termsSummaryLine))
              .font(.footnote.weight(.medium))
              .foregroundStyle(.white.opacity(0.8))
            Text(copy.text(.medicalDisclaimerSummaryLine))
              .font(.footnote.weight(.medium))
              .foregroundStyle(.white.opacity(0.8))
          }
        }

        consentRow(
          title: copy.text(.acceptPrivacyPolicy),
          value: $viewModel.onboardingPrivacyPolicyAccepted
        )
        .accessibilityIdentifier("onboarding.consent.privacy")

        consentRow(
          title: copy.text(.acceptTerms),
          value: $viewModel.onboardingTermsAccepted
        )
        .accessibilityIdentifier("onboarding.consent.terms")

        consentRow(
          title: copy.text(.acceptMedicalDisclaimer),
          value: $viewModel.onboardingMedicalDisclaimerAccepted
        )
        .accessibilityIdentifier("onboarding.consent.medical")

        HStack(spacing: 12) {
          Button(copy.text(.exportData)) {}
            .buttonStyle(FluxSecondaryButtonStyle())
            .accessibilityIdentifier("onboarding.consent.export")
          Button(copy.text(.deleteAccountTitle)) {}
            .buttonStyle(FluxSecondaryButtonStyle())
            .accessibilityIdentifier("onboarding.consent.delete")
        }

        Button(copy.text(.acceptAndContinue)) {
          viewModel.saveConsentStep()
        }
        .buttonStyle(FluxPrimaryButtonStyle())
        .accessibilityIdentifier("onboarding.consent.acceptContinue")

        if isStatusRelevant {
          FluxCard {
            Text(copy.humanStatus(viewModel.onboardingStatus))
              .font(.footnote.weight(.semibold))
              .foregroundStyle(.orange)
              .accessibilityIdentifier("onboarding.consent.status")
          }
        }
      }
      .padding(16)
    }
    .navigationTitle(copy.text(.legalSectionTitle))
    .fluxScreenStyle()
    .accessibilityIdentifier(screenAccessibilityID)
  }

  @ViewBuilder
  private func consentRow(title: String, value: Binding<Bool>) -> some View {
    FluxCard {
      HStack {
        Image(systemName: value.wrappedValue ? "checkmark.square.fill" : "square")
          .foregroundStyle(value.wrappedValue ? .orange : .white.opacity(0.7))
        Text(title)
          .font(.subheadline.weight(.medium))
          .foregroundStyle(.white.opacity(0.9))
        Spacer()
        Button(value.wrappedValue ? copy.text(.yesOption) : copy.text(.noOption)) {
          value.wrappedValue.toggle()
        }
        .buttonStyle(FluxSecondaryButtonStyle())
        .frame(width: 72)
      }
    }
  }

  private var isStatusRelevant: Bool {
    switch viewModel.onboardingStatus {
    case "idle", "loading":
      return false
    default:
      return true
    }
  }
}
