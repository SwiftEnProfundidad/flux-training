import Observation
import SwiftUI

@available(iOS 17, macOS 14, *)
public struct PrivacyConsentView: View {
  @Bindable private var viewModel: PrivacyConsentViewModel
  private let userID: String
  private let copy: LocalizedCopy
  private let screenAccessibilityID: String

  public init(
    viewModel: PrivacyConsentViewModel,
    userID: String,
    copy: LocalizedCopy,
    screenAccessibilityID: String = SettingsRouteContract.privacyConsentDarkScreenID
  ) {
    self.viewModel = viewModel
    self.userID = userID
    self.copy = copy
    self.screenAccessibilityID = screenAccessibilityID
  }

  public var body: some View {
    ScrollView {
      VStack(alignment: .leading, spacing: 14) {
        Text(copy.text(.legalSectionTitle))
          .font(.system(size: 32, weight: .black, design: .rounded))
          .foregroundStyle(.white)

        Text(copy.text(.legalStatusLabel))
          .font(.subheadline.weight(.medium))
          .foregroundStyle(.white.opacity(0.74))

        FluxCard {
          VStack(alignment: .leading, spacing: 10) {
            toggleRow(
              title: copy.text(.acceptPrivacyPolicy),
              isOn: $viewModel.privacyPolicyAccepted,
              identifier: "privacy.acceptPolicy"
            )
            toggleRow(
              title: copy.text(.acceptTerms),
              isOn: $viewModel.termsAccepted,
              identifier: "privacy.acceptTerms"
            )
            toggleRow(
              title: copy.text(.acceptMedicalDisclaimer),
              isOn: $viewModel.medicalDisclaimerAccepted,
              identifier: "privacy.acceptMedical"
            )
          }
        }

        Button(copy.text(.saveConsent)) {
          Task { await viewModel.saveConsent(userID: userID) }
        }
        .buttonStyle(FluxPrimaryButtonStyle())
        .accessibilityIdentifier("privacy.save")

        HStack(spacing: 10) {
          Button(copy.text(.exportData)) {
            Task { await viewModel.exportData(userID: userID) }
          }
          .buttonStyle(FluxSecondaryButtonStyle())
          .accessibilityIdentifier("privacy.export")

          Button(copy.text(.requestDeletion)) {
            Task { await viewModel.requestDeletion(userID: userID) }
          }
          .buttonStyle(FluxSecondaryButtonStyle())
          .accessibilityIdentifier("privacy.requestDeletion")
        }

        FluxCard {
          Text("\(copy.text(.legalStatusLabel)): \(copy.humanStatus(viewModel.status))")
            .font(.footnote.weight(.semibold))
            .foregroundStyle(.white.opacity(0.82))
            .accessibilityIdentifier("privacy.status")
        }
      }
    }
    .padding(16)
    .navigationTitle(copy.text(.legalSectionTitle))
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
