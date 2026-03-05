import Observation
import SwiftUI

@available(iOS 17, macOS 14, *)
public struct GoalAdjustView: View {
  @Bindable private var viewModel: OnboardingViewModel
  private let copy: LocalizedCopy
  private let screenAccessibilityID: String

  public init(
    viewModel: OnboardingViewModel,
    copy: LocalizedCopy,
    screenAccessibilityID: String = ProgressRouteContract.goalAdjustDarkScreenID
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

        FluxCard {
          VStack(alignment: .leading, spacing: 12) {
            Text(copy.text(.goalLabel))
              .font(.caption.weight(.semibold))
              .foregroundStyle(.white.opacity(0.8))
            Picker(copy.text(.goalLabel), selection: $viewModel.selectedGoal) {
              Text(copy.text(.goalFatLoss)).tag(TrainingGoal.fatLoss)
              Text(copy.text(.goalRecomposition)).tag(TrainingGoal.recomposition)
              Text(copy.text(.goalMuscleGain)).tag(TrainingGoal.muscleGain)
              Text(copy.text(.goalHabit)).tag(TrainingGoal.habit)
            }
            .pickerStyle(.segmented)
            .tint(.orange)
            .accessibilityIdentifier("progress.goalAdjust.goal")

            Stepper(value: $viewModel.availableDaysPerWeek, in: 1...7) {
              Text("\(copy.text(.weeklySessionsLabel)): \(viewModel.availableDaysPerWeek)")
                .foregroundStyle(.white)
            }
            .tint(.orange)
            .accessibilityIdentifier("progress.goalAdjust.weeklySessions")

            Stepper(value: $viewModel.sessionDurationMinutes, in: 15...120, step: 5) {
              Text("\(copy.text(.sessionDurationLabel)): \(viewModel.sessionDurationMinutes) min")
                .foregroundStyle(.white)
            }
            .tint(.orange)
            .accessibilityIdentifier("progress.goalAdjust.sessionDuration")
          }
        }

        Button(copy.text(.saveGoal)) {
          viewModel.saveGoalSetup()
        }
        .buttonStyle(FluxPrimaryButtonStyle())
        .accessibilityIdentifier("progress.goalAdjust.save")

        FluxCard {
          Text("\(copy.text(.statusLabel)): \(copy.humanStatus(viewModel.onboardingStatus))")
            .font(.footnote.weight(.semibold))
            .foregroundStyle(.white.opacity(0.82))
            .accessibilityIdentifier("progress.goalAdjust.status")
        }
      }
    }
    .padding(16)
    .navigationTitle(copy.text(.goalLabel))
    .fluxScreenStyle()
    .accessibilityIdentifier(screenAccessibilityID)
  }
}
