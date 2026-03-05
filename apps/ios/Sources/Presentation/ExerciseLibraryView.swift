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
    ScrollView {
      VStack(alignment: .leading, spacing: 14) {
        Text(copy.text(.exerciseLibraryTitle))
          .font(.system(size: 32, weight: .black, design: .rounded))
          .foregroundStyle(.white)

        Text(copy.text(.exerciseLibraryDescription))
          .font(.subheadline)
          .foregroundStyle(.white.opacity(0.74))

        FluxCard {
          VStack(alignment: .leading, spacing: 12) {
            Text(copy.text(.exercisePicker))
              .font(.caption.weight(.semibold))
              .foregroundStyle(.white.opacity(0.8))
            Picker(copy.text(.exercisePicker), selection: $viewModel.selectedExerciseIDForVideos) {
              Text("goblet-squat").tag("goblet-squat")
              Text("bench-press").tag("bench-press")
            }
            .pickerStyle(.segmented)
            .tint(.orange)
            .accessibilityIdentifier("training.library.exercisePicker")

            Text(copy.text(.localePicker))
              .font(.caption.weight(.semibold))
              .foregroundStyle(.white.opacity(0.8))
            Picker(copy.text(.localePicker), selection: $viewModel.videoLocale) {
              Text("es-ES").tag("es-ES")
              Text("en-US").tag("en-US")
            }
            .pickerStyle(.segmented)
            .tint(.orange)
            .accessibilityIdentifier("training.library.localePicker")

            Button(copy.text(.loadExerciseLibraryAction)) {
              Task { await viewModel.loadExerciseLibrary(userID: userID) }
            }
            .buttonStyle(FluxPrimaryButtonStyle())
            .accessibilityIdentifier("training.library.load")
          }
        }

        FluxCard {
          VStack(alignment: .leading, spacing: 8) {
            Text("\(copy.text(.exerciseLibraryStatusLabel)): \(copy.humanStatus(viewModel.exerciseLibraryStatus))")
              .font(.footnote.weight(.semibold))
              .foregroundStyle(.white.opacity(0.82))
              .accessibilityIdentifier("training.library.status")
            Text("\(copy.text(.videoStatusLabel)): \(copy.humanStatus(viewModel.videoStatus))")
              .font(.footnote.weight(.semibold))
              .foregroundStyle(.white.opacity(0.82))
              .accessibilityIdentifier("training.library.videoStatus")
          }
        }

        FluxCard {
          VStack(alignment: .leading, spacing: 10) {
            Text(copy.text(.exerciseVideosTitle))
              .font(.footnote.weight(.semibold))
              .foregroundStyle(.white.opacity(0.82))
            if viewModel.exerciseVideos.isEmpty {
              Text(copy.text(.noExerciseLibraryResults))
                .foregroundStyle(.white.opacity(0.7))
                .accessibilityIdentifier("training.library.empty")
            } else {
              ForEach(viewModel.exerciseVideos, id: \.id) { video in
                VStack(alignment: .leading, spacing: 4) {
                  Text(video.title)
                    .font(.subheadline.bold())
                    .foregroundStyle(.white)
                  Text("\(video.coach) · \(video.difficulty.rawValue) · \(video.locale)")
                    .font(.caption)
                    .foregroundStyle(.white.opacity(0.7))
                  Link(copy.text(.openVideo), destination: video.videoURL)
                    .accessibilityIdentifier("training.library.open.\(video.id)")
                }
                .padding(.vertical, 4)
              }
            }
          }
        }
      }
    }
    .padding(16)
    .navigationTitle(copy.text(.exerciseLibraryTitle))
    .fluxScreenStyle()
    .accessibilityIdentifier(screenAccessibilityID)
    .task(id: userID) {
      await viewModel.loadExerciseLibrary(userID: userID)
    }
  }
}
