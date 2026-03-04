import Observation
import SwiftUI

@available(iOS 17, macOS 14, *)
public struct InWorkoutSetupView: View {
  @Bindable private var viewModel: TrainingFlowViewModel
  private let userID: String
  private let copy: LocalizedCopy
  private let screenAccessibilityID: String

  public init(
    viewModel: TrainingFlowViewModel,
    userID: String,
    copy: LocalizedCopy,
    screenAccessibilityID: String = TrainingRouteContract.inWorkoutSetupDarkScreenID
  ) {
    self.viewModel = viewModel
    self.userID = userID
    self.copy = copy
    self.screenAccessibilityID = screenAccessibilityID
  }

  public var body: some View {
    Form {
      Section(copy.text(.inWorkoutSetupTitle)) {
        Text(copy.text(.inWorkoutSetupDescription))
          .font(.subheadline)
          .foregroundStyle(.secondary)
      }

      Section(copy.text(.planName)) {
        if viewModel.plans.isEmpty {
          Text(copy.text(.noPlansYet))
            .foregroundStyle(.secondary)
            .accessibilityIdentifier("training.inWorkoutSetup.noPlans")
        } else {
          Picker(copy.text(.planName), selection: $viewModel.selectedPlanID) {
            ForEach(viewModel.plans, id: \.id) { plan in
              Text(plan.name).tag(plan.id)
            }
          }
          .accessibilityIdentifier("training.inWorkoutSetup.planPicker")
        }
      }

      Section(copy.text(.exercisePicker)) {
        Picker(copy.text(.exercisePicker), selection: $viewModel.selectedExerciseIDForVideos) {
          Text("goblet-squat").tag("goblet-squat")
          Text("bench-press").tag("bench-press")
        }
        .pickerStyle(.segmented)
        .accessibilityIdentifier("training.inWorkoutSetup.exercisePicker")
      }

      Section(copy.text(.localePicker)) {
        Picker(copy.text(.localePicker), selection: $viewModel.videoLocale) {
          Text("es-ES").tag("es-ES")
          Text("en-US").tag("en-US")
        }
        .pickerStyle(.segmented)
        .accessibilityIdentifier("training.inWorkoutSetup.localePicker")
      }

      Section {
        Button(copy.text(.startInWorkoutSetup)) {
          Task { await viewModel.prepareInWorkoutSetup(userID: userID) }
        }
        .buttonStyle(.borderedProminent)
        .tint(.orange)
        .accessibilityIdentifier("training.inWorkoutSetup.prepare")
      }

      Section(copy.text(.setupStatusLabel)) {
        Text("\(copy.text(.statusLabel)): \(copy.humanStatus(viewModel.status))")
          .foregroundStyle(.secondary)
          .accessibilityIdentifier("training.inWorkoutSetup.trainingStatus")
        Text("\(copy.text(.videoStatusLabel)): \(copy.humanStatus(viewModel.videoStatus))")
          .foregroundStyle(.secondary)
          .accessibilityIdentifier("training.inWorkoutSetup.videoStatus")
        if viewModel.status == "empty" {
          Text(copy.text(.inWorkoutSetupNoPlan))
            .foregroundStyle(.secondary)
            .accessibilityIdentifier("training.inWorkoutSetup.emptyState")
        }
        if viewModel.status == "saved" {
          Text(copy.text(.inWorkoutSetupReady))
            .foregroundStyle(.secondary)
            .accessibilityIdentifier("training.inWorkoutSetup.readyState")
        }
      }
    }
    .navigationTitle(copy.text(.inWorkoutSetupTitle))
    .accessibilityIdentifier(screenAccessibilityID)
    .task {
      await viewModel.prepareInWorkoutSetup(userID: userID)
    }
  }
}
