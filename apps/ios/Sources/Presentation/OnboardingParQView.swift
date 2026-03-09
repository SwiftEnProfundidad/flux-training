import Observation
import SwiftUI

@available(iOS 17, macOS 14, *)
public struct OnboardingParQView: View {
  @Bindable private var viewModel: OnboardingViewModel
  private let copy: LocalizedCopy
  private let screenAccessibilityID: String

  public init(
    viewModel: OnboardingViewModel,
    copy: LocalizedCopy,
    screenAccessibilityID: String = OnboardingRouteContract.parQDarkScreenID
  ) {
    self.viewModel = viewModel
    self.copy = copy
    self.screenAccessibilityID = screenAccessibilityID
  }

  public var body: some View {
    ScrollView {
      VStack(alignment: .leading, spacing: 14) {
        Text(copy.text(.parQTitle))
          .font(.system(size: 32, weight: .black, design: .rounded))
          .foregroundStyle(.white)

        FluxCard {
          Text(copy.text(.parQWarning))
            .font(.subheadline.weight(.medium))
            .foregroundStyle(.orange)
        }

        questionRow(
          title: copy.text(.chestPainQuestion),
          value: $viewModel.parQChestPainAnswer
        )
        .accessibilityIdentifier("onboarding.parq.chestPain")

        questionRow(
          title: copy.text(.dizzinessQuestion),
          value: $viewModel.parQDizzinessAnswer
        )
        .accessibilityIdentifier("onboarding.parq.dizziness")

        questionRow(
          title: copy.text(.parQBoneJointQuestion),
          value: $viewModel.parQBoneOrJointIssue
        )
        .accessibilityIdentifier("onboarding.parq.boneJoint")

        Button(copy.text(.parQMedicalClearanceAction)) {
          viewModel.parQBoneOrJointIssue = true
        }
        .buttonStyle(FluxSecondaryButtonStyle())
        .accessibilityIdentifier("onboarding.parq.medicalClearance")

        Button(copy.text(.continueAction)) {
          viewModel.saveParQ()
        }
        .buttonStyle(FluxPrimaryButtonStyle())
        .accessibilityIdentifier("onboarding.parq.continue")

        if isStatusRelevant {
          FluxCard {
            Text(copy.humanStatus(viewModel.onboardingStatus))
              .font(.footnote.weight(.semibold))
              .foregroundStyle(.orange)
              .accessibilityIdentifier("onboarding.parq.status")
          }
        }
      }
      .padding(16)
    }
    .navigationTitle(copy.text(.parQTitle))
    .fluxScreenStyle()
    .accessibilityIdentifier(screenAccessibilityID)
  }

  @ViewBuilder
  private func questionRow(title: String, value: Binding<Bool>) -> some View {
    FluxCard {
      HStack {
        Text(title)
          .font(.subheadline.weight(.medium))
          .foregroundStyle(.white.opacity(0.9))
        Spacer()
        Button(value.wrappedValue ? copy.text(.yesOption) : copy.text(.noOption)) {
          value.wrappedValue.toggle()
        }
        .buttonStyle(FluxSecondaryButtonStyle())
        .frame(width: 84)
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
