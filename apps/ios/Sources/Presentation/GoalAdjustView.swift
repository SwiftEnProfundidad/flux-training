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
    Form {
      Section(copy.text(.goalLabel)) {
        Picker(copy.text(.goalLabel), selection: $viewModel.selectedGoal) {
          Text(copy.text(.goalFatLoss)).tag(TrainingGoal.fatLoss)
          Text(copy.text(.goalRecomposition)).tag(TrainingGoal.recomposition)
          Text(copy.text(.goalMuscleGain)).tag(TrainingGoal.muscleGain)
          Text(copy.text(.goalHabit)).tag(TrainingGoal.habit)
        }
        .pickerStyle(.segmented)
        .accessibilityIdentifier("progress.goalAdjust.goal")
      }

      Section(copy.text(.weeklySessionsLabel)) {
        Stepper(value: $viewModel.availableDaysPerWeek, in: 1...7) {
          Text("\(copy.text(.weeklySessionsLabel)): \(viewModel.availableDaysPerWeek)")
        }
        .accessibilityIdentifier("progress.goalAdjust.weeklySessions")
      }

      Section(copy.text(.sessionDurationLabel)) {
        Stepper(value: $viewModel.sessionDurationMinutes, in: 15...120, step: 5) {
          Text("\(copy.text(.sessionDurationLabel)): \(viewModel.sessionDurationMinutes) min")
        }
        .accessibilityIdentifier("progress.goalAdjust.sessionDuration")
      }

      Section {
        Button(copy.text(.saveGoal)) {
          viewModel.saveGoalSetup()
        }
        .buttonStyle(.borderedProminent)
        .tint(.orange)
        .accessibilityIdentifier("progress.goalAdjust.save")
      }

      Section(copy.text(.statusLabel)) {
        Text(copy.humanStatus(viewModel.onboardingStatus))
          .font(.footnote)
          .foregroundStyle(.secondary)
          .accessibilityIdentifier("progress.goalAdjust.status")
      }
    }
    .navigationTitle(copy.text(.goalLabel))
    .accessibilityIdentifier(screenAccessibilityID)
  }
}
