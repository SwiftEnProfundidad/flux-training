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
    Form {
      Section(copy.text(.legalSectionTitle)) {
        Toggle(copy.text(.acceptPrivacyPolicy), isOn: $viewModel.privacyPolicyAccepted)
          .accessibilityIdentifier("privacy.acceptPolicy")
        Toggle(copy.text(.acceptTerms), isOn: $viewModel.termsAccepted)
          .accessibilityIdentifier("privacy.acceptTerms")
        Toggle(copy.text(.acceptMedicalDisclaimer), isOn: $viewModel.medicalDisclaimerAccepted)
          .accessibilityIdentifier("privacy.acceptMedical")
      }

      Section {
        Button(copy.text(.saveConsent)) {
          Task {
            await viewModel.saveConsent(userID: userID)
          }
        }
        .buttonStyle(.borderedProminent)
        .tint(.orange)
        .accessibilityIdentifier("privacy.save")

        Button(copy.text(.exportData)) {
          Task {
            await viewModel.exportData(userID: userID)
          }
        }
        .buttonStyle(.bordered)
        .accessibilityIdentifier("privacy.export")

        Button(copy.text(.requestDeletion)) {
          Task {
            await viewModel.requestDeletion(userID: userID)
          }
        }
        .buttonStyle(.bordered)
        .accessibilityIdentifier("privacy.requestDeletion")
      }

      Section(copy.text(.legalStatusLabel)) {
        Text(copy.humanStatus(viewModel.status))
          .font(.footnote)
          .foregroundStyle(.secondary)
          .accessibilityIdentifier("privacy.status")
      }
    }
    .navigationTitle(copy.text(.legalSectionTitle))
    .accessibilityIdentifier(screenAccessibilityID)
    .task(id: userID) {
      await viewModel.refresh(userID: userID)
    }
  }
}
