import Observation
import SwiftUI

@available(iOS 17, macOS 14, *)
public struct OnboardingGoalSetupView: View {
  @Bindable private var viewModel: OnboardingViewModel
  private let copy: LocalizedCopy
  private let screenAccessibilityID: String

  public init(
    viewModel: OnboardingViewModel,
    copy: LocalizedCopy,
    screenAccessibilityID: String = OnboardingRouteContract.goalSetupDarkScreenID
  ) {
    self.viewModel = viewModel
    self.copy = copy
    self.screenAccessibilityID = screenAccessibilityID
  }

  public var body: some View {
    ScrollView {
      VStack(alignment: .leading, spacing: 14) {
        Text(copy.text(.goalLabel))
          .font(.system(size: 32, weight: .black, design: .rounded))
          .foregroundStyle(.white)

        Text(copy.text(.goalSetupSubtitle))
          .font(.subheadline.weight(.medium))
          .foregroundStyle(.white.opacity(0.74))

        HStack(spacing: 8) {
          goalChip(title: copy.text(.goalFatLoss), goal: .fatLoss)
          goalChip(title: copy.text(.goalRecomposition), goal: .recomposition)
          goalChip(title: copy.text(.goalMuscleGain), goal: .muscleGain)
        }
        .accessibilityIdentifier("onboarding.goalSetup.goal")

        FluxCard {
          VStack(alignment: .leading, spacing: 10) {
            stepperRow(
              title: copy.text(.weeklySessionsLabel),
              value: $viewModel.availableDaysPerWeek,
              minimum: 1,
              maximum: 7,
              step: 1,
              suffix: nil
            )
            stepperRow(
              title: copy.text(.sessionDurationLabel),
              value: $viewModel.sessionDurationMinutes,
              minimum: 15,
              maximum: 120,
              step: 5,
              suffix: "min"
            )
          }
        }

        Button(copy.text(.saveGoal)) {
          viewModel.saveGoalSetup()
        }
        .buttonStyle(FluxPrimaryButtonStyle())
        .accessibilityIdentifier("onboarding.goalSetup.saveGoal")

        if isStatusRelevant {
          FluxCard {
            Text(copy.humanStatus(viewModel.onboardingStatus))
              .font(.footnote.weight(.semibold))
              .foregroundStyle(.orange)
              .accessibilityIdentifier("onboarding.goalSetup.status")
          }
        }
      }
      .padding(16)
    }
    .navigationTitle(copy.text(.goalLabel))
    .fluxScreenStyle()
    .accessibilityIdentifier(screenAccessibilityID)
  }

  @ViewBuilder
  private func stepperRow(
    title: String,
    value: Binding<Int>,
    minimum: Int,
    maximum: Int,
    step: Int,
    suffix: String?
  ) -> some View {
    HStack {
      Text(title)
        .font(.subheadline.weight(.semibold))
        .foregroundStyle(.white.opacity(0.9))
      Spacer()
      HStack(spacing: 8) {
        Button("-") {
          value.wrappedValue = max(minimum, value.wrappedValue - step)
        }
        .buttonStyle(FluxSecondaryButtonStyle())
        .frame(width: 44)
        .accessibilityIdentifier("onboarding.goalSetup.decrement.\(title)")

        let suffixLabel = suffix.map { " \($0)" } ?? ""
        Text("\(value.wrappedValue)\(suffixLabel)")
          .font(.subheadline.weight(.semibold))
          .foregroundStyle(.white)
          .frame(minWidth: 68)

        Button("+") {
          value.wrappedValue = min(maximum, value.wrappedValue + step)
        }
        .buttonStyle(FluxSecondaryButtonStyle())
        .frame(width: 44)
        .accessibilityIdentifier("onboarding.goalSetup.increment.\(title)")
      }
    }
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
