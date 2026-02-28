import SwiftUI

@available(iOS 17, macOS 14, *)
public struct TrainingFlowView: View {
  @State private var viewModel: TrainingFlowViewModel
  private let userID: String
  private let copy: LocalizedCopy

  public init(
    viewModel: TrainingFlowViewModel,
    userID: String = "demo-user",
    copy: LocalizedCopy = LocalizedCopy(language: .es)
  ) {
    _viewModel = State(initialValue: viewModel)
    self.userID = userID
    self.copy = copy
  }

  public var body: some View {
    @Bindable var bindableViewModel = viewModel

    return VStack(alignment: .leading, spacing: 16) {
      Text(copy.text(.trainingTitle))
        .font(.title2)

      HStack {
        TextField(copy.text(.planName), text: $bindableViewModel.planName)
          .textFieldStyle(.roundedBorder)
        Button(copy.text(.createPlan)) {
          Task { await viewModel.createStarterPlan(userID: userID) }
        }
      }

      if viewModel.plans.isEmpty {
        Text(copy.text(.noPlansYet))
          .foregroundStyle(.secondary)
      } else {
        ForEach(viewModel.plans, id: \.id) { plan in
          HStack {
            Text(plan.name)
            Spacer()
            Text("\(plan.weeks)w")
              .foregroundStyle(.secondary)
          }
        }
      }

      Button(copy.text(.logDemoSession)) {
        Task { await viewModel.logDemoSession(userID: userID) }
      }

      Text("\(copy.text(.sessionsLabel)): \(viewModel.sessions.count)")
      Text("\(copy.text(.statusLabel)): \(copy.humanStatus(viewModel.status))")
        .foregroundStyle(.secondary)

      VStack(alignment: .leading, spacing: 12) {
        Text(copy.text(.exerciseVideosTitle))
          .font(.headline)
        Picker(copy.text(.exercisePicker), selection: $bindableViewModel.selectedExerciseIDForVideos) {
          Text("goblet-squat").tag("goblet-squat")
          Text("bench-press").tag("bench-press")
        }
        .pickerStyle(.segmented)
        Picker(copy.text(.localePicker), selection: $bindableViewModel.videoLocale) {
          Text("es-ES").tag("es-ES")
          Text("en-US").tag("en-US")
        }
        .pickerStyle(.segmented)
        Button(copy.text(.loadVideos)) {
          Task { await viewModel.loadExerciseVideos() }
        }
        Text("\(copy.text(.videoStatusLabel)): \(copy.humanStatus(viewModel.videoStatus))")
          .foregroundStyle(.secondary)
        if viewModel.exerciseVideos.isEmpty {
          Text(copy.text(.noVideosLoaded))
            .foregroundStyle(.secondary)
        } else {
          ForEach(viewModel.exerciseVideos, id: \.id) { video in
            VStack(alignment: .leading, spacing: 4) {
              Text(video.title)
                .font(.subheadline.bold())
              Text("\(video.coach) · \(video.difficulty.rawValue) · \(video.durationSeconds / 60)m")
                .font(.caption)
                .foregroundStyle(.secondary)
              Link(copy.text(.openVideo), destination: video.videoURL)
            }
            .padding(12)
            .background(Color(red: 0.13, green: 0.14, blue: 0.18))
            .clipShape(.rect(cornerRadius: 10))
          }
        }
      }
    }
    .padding()
  }
}
