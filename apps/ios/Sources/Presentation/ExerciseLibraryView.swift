import Observation
import SwiftUI

@available(iOS 17, macOS 14, *)
public struct ExerciseLibraryView: View {
  @Bindable private var viewModel: TrainingFlowViewModel
  private let userID: String
  private let copy: LocalizedCopy
  private let screenAccessibilityID: String

  public init(
    viewModel: TrainingFlowViewModel,
    userID: String,
    copy: LocalizedCopy,
    screenAccessibilityID: String = TrainingRouteContract.exerciseLibraryDarkScreenID
  ) {
    self.viewModel = viewModel
    self.userID = userID
    self.copy = copy
    self.screenAccessibilityID = screenAccessibilityID
  }

  public var body: some View {
    Form {
      Section(copy.text(.exerciseLibraryTitle)) {
        Text(copy.text(.exerciseLibraryDescription))
          .font(.subheadline)
          .foregroundStyle(.secondary)
      }

      Section(copy.text(.exercisePicker)) {
        Picker(copy.text(.exercisePicker), selection: $viewModel.selectedExerciseIDForVideos) {
          Text("goblet-squat").tag("goblet-squat")
          Text("bench-press").tag("bench-press")
        }
        .pickerStyle(.segmented)
        .accessibilityIdentifier("training.library.exercisePicker")
      }

      Section(copy.text(.localePicker)) {
        Picker(copy.text(.localePicker), selection: $viewModel.videoLocale) {
          Text("es-ES").tag("es-ES")
          Text("en-US").tag("en-US")
        }
        .pickerStyle(.segmented)
        .accessibilityIdentifier("training.library.localePicker")
      }

      Section {
        Button(copy.text(.loadExerciseLibraryAction)) {
          Task { await viewModel.loadExerciseLibrary(userID: userID) }
        }
        .buttonStyle(.borderedProminent)
        .tint(.orange)
        .accessibilityIdentifier("training.library.load")
      }

      Section(copy.text(.exerciseLibraryStatusLabel)) {
        Text("\(copy.text(.exerciseLibraryStatusLabel)): \(copy.humanStatus(viewModel.exerciseLibraryStatus))")
          .foregroundStyle(.secondary)
          .accessibilityIdentifier("training.library.status")
        Text("\(copy.text(.videoStatusLabel)): \(copy.humanStatus(viewModel.videoStatus))")
          .foregroundStyle(.secondary)
          .accessibilityIdentifier("training.library.videoStatus")
      }

      Section(copy.text(.exerciseVideosTitle)) {
        if viewModel.exerciseVideos.isEmpty {
          Text(copy.text(.noExerciseLibraryResults))
            .foregroundStyle(.secondary)
            .accessibilityIdentifier("training.library.empty")
        } else {
          ForEach(viewModel.exerciseVideos, id: \.id) { video in
            VStack(alignment: .leading, spacing: 4) {
              Text(video.title)
                .font(.subheadline.bold())
              Text("\(video.coach) · \(video.difficulty.rawValue) · \(video.locale)")
                .font(.caption)
                .foregroundStyle(.secondary)
              Link(copy.text(.openVideo), destination: video.videoURL)
                .accessibilityIdentifier("training.library.open.\(video.id)")
            }
            .padding(.vertical, 4)
          }
        }
      }
    }
    .navigationTitle(copy.text(.exerciseLibraryTitle))
    .accessibilityIdentifier(screenAccessibilityID)
    .task {
      await viewModel.loadExerciseLibrary(userID: userID)
    }
  }
}
