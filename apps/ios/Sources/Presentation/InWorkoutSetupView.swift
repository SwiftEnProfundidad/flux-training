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
    ScrollView {
      VStack(alignment: .leading, spacing: 14) {
        Text(copy.text(.inWorkoutSetupTitle))
          .font(.system(size: 32, weight: .black, design: .rounded))
          .foregroundStyle(.white)

        Text(copy.text(.inWorkoutSetupDescription))
          .font(.subheadline)
          .foregroundStyle(.white.opacity(0.74))

        FluxCard {
          VStack(alignment: .leading, spacing: 12) {
            Text(copy.text(.planName))
              .font(.caption.weight(.semibold))
              .foregroundStyle(.white.opacity(0.8))
            if viewModel.plans.isEmpty {
              Text(copy.text(.noPlansYet))
                .foregroundStyle(.white.opacity(0.7))
                .accessibilityIdentifier("training.inWorkoutSetup.noPlans")
            } else {
              Picker(copy.text(.planName), selection: $viewModel.selectedPlanID) {
                ForEach(viewModel.plans, id: \.id) { plan in
                  Text(plan.name).tag(plan.id)
                }
              }
              .pickerStyle(.menu)
              .tint(.orange)
              .accessibilityIdentifier("training.inWorkoutSetup.planPicker")
            }

            Text(copy.text(.exercisePicker))
              .font(.caption.weight(.semibold))
              .foregroundStyle(.white.opacity(0.8))
            Picker(copy.text(.exercisePicker), selection: $viewModel.selectedExerciseIDForVideos) {
              Text("goblet-squat").tag("goblet-squat")
              Text("bench-press").tag("bench-press")
            }
            .pickerStyle(.segmented)
            .tint(.orange)
            .accessibilityIdentifier("training.inWorkoutSetup.exercisePicker")

            Text(copy.text(.localePicker))
              .font(.caption.weight(.semibold))
              .foregroundStyle(.white.opacity(0.8))
            Picker(copy.text(.localePicker), selection: $viewModel.videoLocale) {
              Text("es-ES").tag("es-ES")
              Text("en-US").tag("en-US")
            }
            .pickerStyle(.segmented)
            .tint(.orange)
            .accessibilityIdentifier("training.inWorkoutSetup.localePicker")

            Button(copy.text(.startInWorkoutSetup)) {
              Task { await viewModel.prepareInWorkoutSetup(userID: userID) }
            }
            .buttonStyle(FluxPrimaryButtonStyle())
            .accessibilityIdentifier("training.inWorkoutSetup.prepare")
          }
        }

        FluxCard {
          VStack(alignment: .leading, spacing: 8) {
            Text("\(copy.text(.statusLabel)): \(copy.humanStatus(viewModel.status))")
              .font(.footnote.weight(.semibold))
              .foregroundStyle(.white.opacity(0.82))
              .accessibilityIdentifier("training.inWorkoutSetup.trainingStatus")
            Text("\(copy.text(.videoStatusLabel)): \(copy.humanStatus(viewModel.videoStatus))")
              .font(.footnote.weight(.semibold))
              .foregroundStyle(.white.opacity(0.82))
              .accessibilityIdentifier("training.inWorkoutSetup.videoStatus")
            if viewModel.status == "empty" {
              Text(copy.text(.inWorkoutSetupNoPlan))
                .foregroundStyle(.white.opacity(0.7))
                .accessibilityIdentifier("training.inWorkoutSetup.emptyState")
            }
            if viewModel.status == "saved" {
              Text(copy.text(.inWorkoutSetupReady))
                .foregroundStyle(.white.opacity(0.7))
                .accessibilityIdentifier("training.inWorkoutSetup.readyState")
            }
          }
        }
      }
    }
    .padding(16)
    .navigationTitle(copy.text(.inWorkoutSetupTitle))
    .fluxScreenStyle()
    .accessibilityIdentifier(screenAccessibilityID)
    .task(id: userID) {
      await viewModel.prepareInWorkoutSetup(userID: userID)
    }
  }
}
