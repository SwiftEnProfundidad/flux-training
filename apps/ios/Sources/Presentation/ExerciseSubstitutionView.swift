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
    Form {
      Section(copy.text(.substitutionTitle)) {
        Text(copy.text(.substitutionDescription))
          .font(.subheadline)
          .foregroundStyle(.secondary)
      }

      Section(copy.text(.currentExerciseLabel)) {
        Picker(copy.text(.currentExerciseLabel), selection: $viewModel.selectedExerciseIDForVideos) {
          Text("goblet-squat").tag("goblet-squat")
          Text("bench-press").tag("bench-press")
        }
        .pickerStyle(.segmented)
        .accessibilityIdentifier("training.substitution.currentExercise")
      }

      Section(copy.text(.substituteExerciseLabel)) {
        Picker(copy.text(.substituteExerciseLabel), selection: $viewModel.selectedSubstituteExerciseID) {
          Text("goblet-squat").tag("goblet-squat")
          Text("bench-press").tag("bench-press")
        }
        .pickerStyle(.segmented)
        .accessibilityIdentifier("training.substitution.substituteExercise")
      }

      Section(copy.text(.localePicker)) {
        Picker(copy.text(.localePicker), selection: $viewModel.videoLocale) {
          Text("es-ES").tag("es-ES")
          Text("en-US").tag("en-US")
        }
        .pickerStyle(.segmented)
        .accessibilityIdentifier("training.substitution.localePicker")
      }

      Section {
        Button(copy.text(.applySubstitutionAction)) {
          Task { await viewModel.applyExerciseSubstitution(userID: userID) }
        }
        .buttonStyle(.borderedProminent)
        .tint(.orange)
        .accessibilityIdentifier("training.substitution.apply")
      }

      Section(copy.text(.substitutionStatusLabel)) {
        Text("\(copy.text(.substitutionStatusLabel)): \(copy.humanStatus(viewModel.substitutionStatus))")
          .foregroundStyle(.secondary)
          .accessibilityIdentifier("training.substitution.status")
        Text("\(copy.text(.videoStatusLabel)): \(copy.humanStatus(viewModel.videoStatus))")
          .foregroundStyle(.secondary)
          .accessibilityIdentifier("training.substitution.videoStatus")
        if viewModel.substitutionStatus == "saved" {
          Text(copy.text(.substitutionSavedMessage))
            .foregroundStyle(.secondary)
            .accessibilityIdentifier("training.substitution.saved")
        }
        if viewModel.substitutionStatus == "validation_error" {
          Text(copy.text(.substitutionInvalidSelection))
            .foregroundStyle(.secondary)
            .accessibilityIdentifier("training.substitution.validationError")
        }
      }
    }
    .navigationTitle(copy.text(.substitutionTitle))
    .accessibilityIdentifier(screenAccessibilityID)
    .task {
      await viewModel.prepareInWorkoutSetup(userID: userID)
    }
  }
}
