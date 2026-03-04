import SwiftUI

@available(iOS 17, macOS 14, *)
public struct TrainingFlowView: View {
  @State private var viewModel: TrainingFlowViewModel
  private let userID: String
  private let copy: LocalizedCopy

  public init(
    viewModel: TrainingFlowViewModel,
    userID: String = "flux-user-local",
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
        .accessibilityIdentifier("training.title")

      VStack(alignment: .leading, spacing: 8) {
        HStack {
          Text(copy.text(.trainingCockpitTitle))
            .font(.headline)
          Spacer()
          Button(copy.text(.refreshTrainingCockpit)) {
            Task { await viewModel.refreshDashboard(userID: userID) }
          }
          .buttonStyle(.bordered)
          .accessibilityIdentifier("training.refreshCockpit")
        }
        Text("\(copy.text(.plansLoadedLabel)): \(viewModel.plans.count)")
        Text("\(copy.text(.todaySessionsLabel)): \(viewModel.todaySessionsCount)")
        Text("\(copy.text(.statusLabel)): \(copy.humanStatus(viewModel.status))")
          .foregroundStyle(.secondary)
        Text("\(copy.text(.sessionStatusLabel)): \(copy.humanStatus(viewModel.sessionStatus))")
          .foregroundStyle(.secondary)
        if let latestSessionEndedAt = viewModel.latestSessionEndedAt {
          Text("\(copy.text(.lastSessionLabel)): \(latestSessionEndedAt.formatted(date: .abbreviated, time: .shortened))")
            .foregroundStyle(.secondary)
        }
      }
      .padding(12)
      .background(Color(red: 0.13, green: 0.14, blue: 0.18))
      .clipShape(.rect(cornerRadius: 10))
      .accessibilityIdentifier("training.cockpit")

      HStack {
        TextField(copy.text(.planName), text: $bindableViewModel.planName)
          .textFieldStyle(.roundedBorder)
          .accessibilityIdentifier("training.planName")
        Button(copy.text(.createPlan)) {
          Task { await viewModel.createStarterPlan(userID: userID) }
        }
        .buttonStyle(.borderedProminent)
        .accessibilityIdentifier("training.createPlan")
      }

      if viewModel.plans.isEmpty {
        Text(copy.text(.noPlansYet))
          .foregroundStyle(.secondary)
      } else {
        LazyVStack(spacing: 6) {
          ForEach(viewModel.plans, id: \.id) { plan in
            HStack {
              Text(plan.name)
              Spacer()
              Text("\(plan.weeks)w")
                .foregroundStyle(.secondary)
            }
          }
        }
      }

      Button(copy.text(.logDemoSession)) {
        Task { await viewModel.logDemoSession(userID: userID) }
      }
      .buttonStyle(.bordered)
      .accessibilityIdentifier("training.logDemoSession")

      Text("\(copy.text(.sessionsLabel)): \(viewModel.sessions.count)")
        .accessibilityIdentifier("training.sessions")

      VStack(alignment: .leading, spacing: 12) {
        Text(copy.text(.exerciseVideosTitle))
          .font(.headline)
          .accessibilityIdentifier("training.videos.title")
        Picker(copy.text(.exercisePicker), selection: $bindableViewModel.selectedExerciseIDForVideos) {
          Text("goblet-squat").tag("goblet-squat")
          Text("bench-press").tag("bench-press")
        }
        .pickerStyle(.segmented)
        .accessibilityIdentifier("training.videos.exercisePicker")
        Picker(copy.text(.localePicker), selection: $bindableViewModel.videoLocale) {
          Text("es-ES").tag("es-ES")
          Text("en-US").tag("en-US")
        }
        .pickerStyle(.segmented)
        .accessibilityIdentifier("training.videos.localePicker")
        Button(copy.text(.loadVideos)) {
          Task { await viewModel.loadExerciseVideos() }
        }
        .buttonStyle(.borderedProminent)
        .accessibilityIdentifier("training.videos.load")
        Text("\(copy.text(.videoStatusLabel)): \(copy.humanStatus(viewModel.videoStatus))")
          .foregroundStyle(.secondary)
          .accessibilityIdentifier("training.videos.status")
        if viewModel.isVideoFallbackActive {
          Text(copy.text(.videoFallbackNotice))
            .font(.footnote)
            .foregroundStyle(.secondary)
            .accessibilityIdentifier("training.videos.fallback")
        }
        if viewModel.videoStatus == "offline" {
          Text(copy.text(.videoOfflineNotice))
            .font(.footnote)
            .foregroundStyle(.secondary)
            .accessibilityIdentifier("training.videos.offline")
        }
        if viewModel.videoStatus == "empty" {
          Text(copy.text(.videoEmptyNotice))
            .font(.footnote)
            .foregroundStyle(.secondary)
            .accessibilityIdentifier("training.videos.empty")
        }
        if viewModel.exerciseVideos.isEmpty {
          Text(copy.text(.noVideosLoaded))
            .foregroundStyle(.secondary)
        } else {
          LazyVStack(spacing: 8) {
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
    }
    .padding()
    .task {
      await viewModel.refreshDashboard(userID: userID)
    }
  }
}
