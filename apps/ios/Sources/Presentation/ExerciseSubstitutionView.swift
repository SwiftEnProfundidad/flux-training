import Observation
import SwiftUI

@available(iOS 17, macOS 14, *)
public struct ExerciseSubstitutionView: View {
  @Bindable private var viewModel: TrainingFlowViewModel
  private let userID: String
  private let copy: LocalizedCopy
  private let screenAccessibilityID: String

  public init(
    viewModel: TrainingFlowViewModel,
    userID: String,
    copy: LocalizedCopy,
    screenAccessibilityID: String = TrainingRouteContract.substitutionDarkScreenID
  ) {
    self.viewModel = viewModel
    self.userID = userID
    self.copy = copy
    self.screenAccessibilityID = screenAccessibilityID
  }

  public var body: some View {
    ScrollView {
      VStack(alignment: .leading, spacing: 14) {
        Text(copy.text(.substitutionTitle))
          .font(.system(size: 32, weight: .black, design: .rounded))
          .foregroundStyle(.white)

        Text(copy.text(.substitutionDescription))
          .font(.subheadline)
          .foregroundStyle(.white.opacity(0.74))

        FluxCard {
          VStack(alignment: .leading, spacing: 12) {
            Text(copy.text(.currentExerciseLabel))
              .font(.caption.weight(.semibold))
              .foregroundStyle(.white.opacity(0.8))
            Picker(copy.text(.currentExerciseLabel), selection: $viewModel.selectedExerciseIDForVideos) {
              Text("goblet-squat").tag("goblet-squat")
              Text("bench-press").tag("bench-press")
            }
            .pickerStyle(.segmented)
            .tint(.orange)
            .accessibilityIdentifier("training.substitution.currentExercise")

            Text(copy.text(.substituteExerciseLabel))
              .font(.caption.weight(.semibold))
              .foregroundStyle(.white.opacity(0.8))
            Picker(copy.text(.substituteExerciseLabel), selection: $viewModel.selectedSubstituteExerciseID) {
              Text("goblet-squat").tag("goblet-squat")
              Text("bench-press").tag("bench-press")
            }
            .pickerStyle(.segmented)
            .tint(.orange)
            .accessibilityIdentifier("training.substitution.substituteExercise")

            Text(copy.text(.localePicker))
              .font(.caption.weight(.semibold))
              .foregroundStyle(.white.opacity(0.8))
            Picker(copy.text(.localePicker), selection: $viewModel.videoLocale) {
              Text("es-ES").tag("es-ES")
              Text("en-US").tag("en-US")
            }
            .pickerStyle(.segmented)
            .tint(.orange)
            .accessibilityIdentifier("training.substitution.localePicker")

            Button(copy.text(.applySubstitutionAction)) {
              Task { await viewModel.applyExerciseSubstitution(userID: userID) }
            }
            .buttonStyle(FluxPrimaryButtonStyle())
            .accessibilityIdentifier("training.substitution.apply")
          }
        }

        FluxCard {
          VStack(alignment: .leading, spacing: 8) {
            Text("\(copy.text(.substitutionStatusLabel)): \(copy.humanStatus(viewModel.substitutionStatus))")
              .font(.footnote.weight(.semibold))
              .foregroundStyle(.white.opacity(0.82))
              .accessibilityIdentifier("training.substitution.status")
            Text("\(copy.text(.videoStatusLabel)): \(copy.humanStatus(viewModel.videoStatus))")
              .font(.footnote.weight(.semibold))
              .foregroundStyle(.white.opacity(0.82))
              .accessibilityIdentifier("training.substitution.videoStatus")
            if viewModel.substitutionStatus == "saved" {
              Text(copy.text(.substitutionSavedMessage))
                .foregroundStyle(.white.opacity(0.7))
                .accessibilityIdentifier("training.substitution.saved")
            }
            if viewModel.substitutionStatus == "validation_error" {
              Text(copy.text(.substitutionInvalidSelection))
                .foregroundStyle(.white.opacity(0.7))
                .accessibilityIdentifier("training.substitution.validationError")
            }
          }
        }
      }
    }
    .padding(16)
    .navigationTitle(copy.text(.substitutionTitle))
    .fluxScreenStyle()
    .accessibilityIdentifier(screenAccessibilityID)
    .task(id: userID) {
      await viewModel.prepareInWorkoutSetup(userID: userID)
    }
  }
}
