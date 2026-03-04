import Observation
import SwiftUI

@available(iOS 17, macOS 14, *)
public struct RPERatingView: View {
  @Bindable private var viewModel: TrainingFlowViewModel
  private let userID: String
  private let copy: LocalizedCopy
  private let screenAccessibilityID: String

  public init(
    viewModel: TrainingFlowViewModel,
    userID: String,
    copy: LocalizedCopy,
    screenAccessibilityID: String = TrainingRouteContract.rpeRatingDarkScreenID
  ) {
    self.viewModel = viewModel
    self.userID = userID
    self.copy = copy
    self.screenAccessibilityID = screenAccessibilityID
  }

  public var body: some View {
    Form {
      Section(copy.text(.rpeRatingTitle)) {
        Text(copy.text(.rpeRatingDescription))
          .font(.subheadline)
          .foregroundStyle(.secondary)
      }

      Section(copy.text(.planName)) {
        if viewModel.plans.isEmpty {
          Text(copy.text(.noPlansYet))
            .foregroundStyle(.secondary)
            .accessibilityIdentifier("training.rpe.noPlans")
        } else {
          Picker(copy.text(.planName), selection: $viewModel.selectedPlanID) {
            ForEach(viewModel.plans, id: \.id) { plan in
              Text(plan.name).tag(plan.id)
            }
          }
          .accessibilityIdentifier("training.rpe.planPicker")
        }
      }

      Section(copy.text(.exercisePicker)) {
        Picker(copy.text(.exercisePicker), selection: $viewModel.selectedExerciseIDForVideos) {
          Text("goblet-squat").tag("goblet-squat")
          Text("bench-press").tag("bench-press")
        }
        .pickerStyle(.segmented)
        .accessibilityIdentifier("training.rpe.exercisePicker")
      }

      Section(copy.text(.selectedRPELabel)) {
        Stepper(value: $viewModel.selectedRPE, in: 1...10) {
          Text("\(copy.text(.selectedRPELabel)): \(viewModel.selectedRPE)")
        }
        .accessibilityIdentifier("training.rpe.value")
      }

      Section {
        Button(copy.text(.submitRPEAction)) {
          Task { await viewModel.submitRPERating(userID: userID) }
        }
        .buttonStyle(.borderedProminent)
        .tint(.orange)
        .accessibilityIdentifier("training.rpe.submit")
      }

      Section(copy.text(.rpeRatingTitle)) {
        Text("\(copy.text(.sessionStatusLabel)): \(copy.humanStatus(viewModel.sessionStatus))")
          .foregroundStyle(.secondary)
          .accessibilityIdentifier("training.rpe.sessionStatus")
        if viewModel.status == "saved" {
          Text(copy.text(.rpeSavedMessage))
            .foregroundStyle(.secondary)
            .accessibilityIdentifier("training.rpe.saved")
        }
      }
    }
    .navigationTitle(copy.text(.rpeRatingTitle))
    .accessibilityIdentifier(screenAccessibilityID)
    .task {
      await viewModel.prepareInWorkoutSetup(userID: userID)
    }
  }
}
