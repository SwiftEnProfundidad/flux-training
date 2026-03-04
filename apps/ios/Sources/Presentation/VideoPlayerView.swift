import AVKit
import Observation
import SwiftUI

@available(iOS 17, macOS 14, *)
public struct VideoPlayerView: View {
  @Bindable private var viewModel: TrainingFlowViewModel
  private let userID: String
  private let copy: LocalizedCopy
  private let screenAccessibilityID: String
  @State private var playbackSession: VideoPlaybackSession?

  public init(
    viewModel: TrainingFlowViewModel,
    userID: String,
    copy: LocalizedCopy,
    screenAccessibilityID: String = TrainingRouteContract.videoPlayerDarkScreenID
  ) {
    self.viewModel = viewModel
    self.userID = userID
    self.copy = copy
    self.screenAccessibilityID = screenAccessibilityID
  }

  public var body: some View {
    Form {
      Section(copy.text(.videoPlayerTitle)) {
        Text(copy.text(.videoPlayerDescription))
          .font(.subheadline)
          .foregroundStyle(.secondary)
      }

      Section(copy.text(.exercisePicker)) {
        Picker(copy.text(.exercisePicker), selection: $viewModel.selectedExerciseIDForVideos) {
          Text("goblet-squat").tag("goblet-squat")
          Text("bench-press").tag("bench-press")
        }
        .pickerStyle(.segmented)
        .accessibilityIdentifier("training.videoPlayer.exercisePicker")
      }

      Section(copy.text(.localePicker)) {
        Picker(copy.text(.localePicker), selection: $viewModel.videoLocale) {
          Text("es-ES").tag("es-ES")
          Text("en-US").tag("en-US")
        }
        .pickerStyle(.segmented)
        .accessibilityIdentifier("training.videoPlayer.localePicker")
      }

      Section {
        Button(copy.text(.loadVideos)) {
          Task { await viewModel.loadVideoPlayer(userID: userID) }
        }
        .buttonStyle(.bordered)
        .accessibilityIdentifier("training.videoPlayer.load")
      }

      Section(copy.text(.videoPlayerSelectionLabel)) {
        if viewModel.exerciseVideos.isEmpty {
          Text(copy.text(.noVideosLoaded))
            .foregroundStyle(.secondary)
            .accessibilityIdentifier("training.videoPlayer.empty")
        } else {
          Picker(copy.text(.videoPlayerSelectionLabel), selection: $viewModel.selectedVideoID) {
            ForEach(viewModel.exerciseVideos, id: \.id) { video in
              Text(video.title).tag(video.id)
            }
          }
          .accessibilityIdentifier("training.videoPlayer.videoPicker")

          if let selectedVideo = selectedVideo {
            VStack(alignment: .leading, spacing: 4) {
              Text(selectedVideo.title)
                .font(.subheadline.bold())
              Text("\(selectedVideo.coach) · \(selectedVideo.difficulty.rawValue) · \(selectedVideo.locale)")
                .font(.caption)
                .foregroundStyle(.secondary)
            }
            .accessibilityIdentifier("training.videoPlayer.selected")

            Link(copy.text(.openVideo), destination: selectedVideo.videoURL)
              .accessibilityIdentifier("training.videoPlayer.open.\(selectedVideo.id)")
          }
        }
      }

      Section {
        Button(copy.text(.playSelectedVideoAction)) {
          Task {
            await viewModel.playSelectedVideo(userID: userID)
            guard viewModel.videoPlayerStatus == "success", let selectedVideo else {
              return
            }
            playbackSession = VideoPlaybackSession(
              id: selectedVideo.id,
              title: selectedVideo.title,
              url: selectedVideo.videoURL
            )
          }
        }
        .buttonStyle(.borderedProminent)
        .tint(.orange)
        .disabled(selectedVideo == nil)
        .accessibilityIdentifier("training.videoPlayer.play")
      }

      Section(copy.text(.videoPlayerStatusLabel)) {
        Text("\(copy.text(.videoPlayerStatusLabel)): \(copy.humanStatus(viewModel.videoPlayerStatus))")
          .foregroundStyle(.secondary)
          .accessibilityIdentifier("training.videoPlayer.status")
        Text("\(copy.text(.videoStatusLabel)): \(copy.humanStatus(viewModel.videoStatus))")
          .foregroundStyle(.secondary)
          .accessibilityIdentifier("training.videoPlayer.videoStatus")
      }
    }
    .navigationTitle(copy.text(.videoPlayerTitle))
    .accessibilityIdentifier(screenAccessibilityID)
    .task {
      await viewModel.loadVideoPlayer(userID: userID)
    }
    .sheet(item: $playbackSession) { session in
      VideoPlaybackSheet(session: session)
    }
  }

  private var selectedVideo: ExerciseVideo? {
    viewModel.exerciseVideos.first(where: { $0.id == viewModel.selectedVideoID })
  }
}

@available(iOS 17, macOS 14, *)
private struct VideoPlaybackSheet: View {
  let session: VideoPlaybackSession
  @State private var player: AVPlayer?

  var body: some View {
    VStack(spacing: 16) {
      Text(session.title)
        .font(.headline)
      if let player {
        VideoPlayer(player: player)
          .frame(minHeight: 220)
      }
    }
    .padding(16)
    .task {
      let currentPlayer = AVPlayer(url: session.url)
      player = currentPlayer
      currentPlayer.play()
    }
    .onDisappear {
      player?.pause()
    }
  }
}

private struct VideoPlaybackSession: Identifiable {
  let id: String
  let title: String
  let url: URL
}
