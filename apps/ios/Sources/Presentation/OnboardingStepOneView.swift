import Observation
import SwiftUI

@available(iOS 17, macOS 14, *)
public struct OnboardingStepOneView: View {
  @Bindable private var viewModel: OnboardingViewModel
  private let copy: LocalizedCopy
  private let screenAccessibilityID: String

  public init(
    viewModel: OnboardingViewModel,
    copy: LocalizedCopy,
    screenAccessibilityID: String = OnboardingRouteContract.stepOneDarkScreenID
  ) {
    self.viewModel = viewModel
    self.copy = copy
    self.screenAccessibilityID = screenAccessibilityID
  }

  public var body: some View {
    ScrollView {
      VStack(alignment: .leading, spacing: 14) {
        Text(copy.text(.onboardingTitle))
          .font(.system(size: 32, weight: .black, design: .rounded))
          .foregroundStyle(.white)

        Text(copy.text(.onboardingStepOneSubtitle))
          .font(.subheadline.weight(.medium))
          .foregroundStyle(.white.opacity(0.74))

        HStack(spacing: 8) {
          goalChip(title: copy.text(.goalFatLoss), goal: .fatLoss)
          goalChip(title: copy.text(.goalMuscleGain), goal: .muscleGain)
          goalChip(title: copy.text(.goalHabit), goal: .habit)
        }

        VStack(alignment: .leading, spacing: 6) {
          Text(copy.text(.displayName))
            .font(.caption.weight(.semibold))
            .foregroundStyle(.white.opacity(0.8))
        TextField(copy.text(.displayName), text: $viewModel.displayName)
          .fluxInputFieldStyle()
          .accessibilityIdentifier("onboarding.step1.displayName")
        }

        HStack(spacing: 10) {
          decimalField(title: copy.text(.heightCmLabel), value: $viewModel.heightCm)
            .accessibilityIdentifier("onboarding.step1.height")
          decimalField(title: copy.text(.weightKgLabel), value: $viewModel.weightKg)
            .accessibilityIdentifier("onboarding.step1.weight")
        }

        HStack(spacing: 10) {
          numberField(title: copy.text(.age), value: $viewModel.age)
            .accessibilityIdentifier("onboarding.step1.age")
          numberField(title: copy.text(.days), value: $viewModel.availableDaysPerWeek)
            .accessibilityIdentifier("onboarding.step1.days")
        }

        Button(copy.text(.continueAction)) {
          viewModel.saveStepOne()
        }
        .buttonStyle(FluxPrimaryButtonStyle())
        .accessibilityIdentifier("onboarding.step1.continue")

        if isStatusRelevant {
          FluxCard {
            Text(copy.humanStatus(viewModel.onboardingStatus))
              .font(.footnote.weight(.semibold))
              .foregroundStyle(.orange)
              .accessibilityIdentifier("onboarding.step1.status")
          }
        }
      }
      .padding(16)
    }
    .navigationTitle(copy.text(.onboardingTitle))
    .fluxScreenStyle()
    .accessibilityIdentifier(screenAccessibilityID)
  }

  @ViewBuilder
  private func numberField(title: String, value: Binding<Int>) -> some View {
    VStack(alignment: .leading, spacing: 6) {
      Text(title)
        .font(.caption.weight(.semibold))
        .foregroundStyle(.white.opacity(0.8))
      TextField(title, value: value, format: .number)
        .fluxInputFieldStyle()
    }
    .frame(maxWidth: .infinity, alignment: .leading)
  }

  @ViewBuilder
  private func decimalField(title: String, value: Binding<Double>) -> some View {
    VStack(alignment: .leading, spacing: 6) {
      Text(title)
        .font(.caption.weight(.semibold))
        .foregroundStyle(.white.opacity(0.8))
      TextField(title, value: value, format: .number)
        .fluxInputFieldStyle()
    }
    .frame(maxWidth: .infinity, alignment: .leading)
  }

  @ViewBuilder
  private func goalChip(title: String, goal: TrainingGoal) -> some View {
    Button(title) {
      viewModel.selectedGoal = goal
    }
    .font(.caption.weight(.semibold))
    .foregroundStyle(viewModel.selectedGoal == goal ? Color.black.opacity(0.85) : .white)
    .padding(.horizontal, 12)
    .padding(.vertical, 8)
    .frame(maxWidth: .infinity)
    .background(viewModel.selectedGoal == goal ? Color.orange : Color.white.opacity(0.08))
    .clipShape(.capsule)
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
