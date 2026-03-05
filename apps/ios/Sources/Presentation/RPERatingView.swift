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
    ScrollView {
      VStack(alignment: .leading, spacing: 14) {
        Text(copy.text(.rpeRatingTitle))
          .font(.system(size: 32, weight: .black, design: .rounded))
          .foregroundStyle(.white)

        Text(copy.text(.rpeRatingDescription))
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
                .accessibilityIdentifier("training.rpe.noPlans")
            } else {
              Picker(copy.text(.planName), selection: $viewModel.selectedPlanID) {
                ForEach(viewModel.plans, id: \.id) { plan in
                  Text(plan.name).tag(plan.id)
                }
              }
              .pickerStyle(.menu)
              .tint(.orange)
              .accessibilityIdentifier("training.rpe.planPicker")
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
            .accessibilityIdentifier("training.rpe.exercisePicker")

            Stepper(value: $viewModel.selectedRPE, in: 1...10) {
              Text("\(copy.text(.selectedRPELabel)): \(viewModel.selectedRPE)")
                .foregroundStyle(.white)
            }
            .tint(.orange)
            .accessibilityIdentifier("training.rpe.value")

            Button(copy.text(.submitRPEAction)) {
              Task { await viewModel.submitRPERating(userID: userID) }
            }
            .buttonStyle(FluxPrimaryButtonStyle())
            .accessibilityIdentifier("training.rpe.submit")
          }
        }

        FluxCard {
          VStack(alignment: .leading, spacing: 8) {
            Text("\(copy.text(.sessionStatusLabel)): \(copy.humanStatus(viewModel.sessionStatus))")
              .font(.footnote.weight(.semibold))
              .foregroundStyle(.white.opacity(0.82))
              .accessibilityIdentifier("training.rpe.sessionStatus")
            if viewModel.status == "saved" {
              Text(copy.text(.rpeSavedMessage))
                .foregroundStyle(.white.opacity(0.7))
                .accessibilityIdentifier("training.rpe.saved")
            }
          }
        }
      }
    }
    .padding(16)
    .navigationTitle(copy.text(.rpeRatingTitle))
    .fluxScreenStyle()
    .accessibilityIdentifier(screenAccessibilityID)
    .task(id: userID) {
      await viewModel.prepareInWorkoutSetup(userID: userID)
    }
  }
}
