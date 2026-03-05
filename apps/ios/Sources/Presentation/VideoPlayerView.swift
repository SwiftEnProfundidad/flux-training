import AVKit
import Observation
import SwiftUI

@available(iOS 17, macOS 14, *)
public struct VideoPlayerView: View {
  @Bindable private var viewModel: TrainingFlowViewModel
  private let userID: String
  private let copy: LocalizedCopy
  private let screenAccessibilityID: String
  private let onOpenSessionSummary: () -> Void
  @State private var playbackSession: VideoPlaybackSession?

  public init(
    viewModel: TrainingFlowViewModel,
    userID: String,
    copy: LocalizedCopy,
    screenAccessibilityID: String = TrainingRouteContract.videoPlayerDarkScreenID,
    onOpenSessionSummary: @escaping () -> Void = {}
  ) {
    self.viewModel = viewModel
    self.userID = userID
    self.copy = copy
    self.screenAccessibilityID = screenAccessibilityID
    self.onOpenSessionSummary = onOpenSessionSummary
  }

  public var body: some View {
    ScrollView {
      VStack(alignment: .leading, spacing: 14) {
        Text(copy.text(.videoPlayerTitle))
          .font(.system(size: 32, weight: .black, design: .rounded))
          .foregroundStyle(.white)

        Text(copy.text(.videoPlayerDescription))
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
            .accessibilityIdentifier("training.videoPlayer.exercisePicker")

            Text(copy.text(.localePicker))
              .font(.caption.weight(.semibold))
              .foregroundStyle(.white.opacity(0.8))
            Picker(copy.text(.localePicker), selection: $viewModel.videoLocale) {
              Text("es-ES").tag("es-ES")
              Text("en-US").tag("en-US")
            }
            .pickerStyle(.segmented)
            .tint(.orange)
            .accessibilityIdentifier("training.videoPlayer.localePicker")

            Button(copy.text(.loadVideos)) {
              Task { await viewModel.loadVideoPlayer(userID: userID) }
            }
            .buttonStyle(FluxSecondaryButtonStyle())
            .accessibilityIdentifier("training.videoPlayer.load")
          }
        }

        FluxCard {
          VStack(alignment: .leading, spacing: 10) {
            Text(copy.text(.videoPlayerSelectionLabel))
              .font(.footnote.weight(.semibold))
              .foregroundStyle(.white.opacity(0.82))
            if viewModel.exerciseVideos.isEmpty {
              Text(copy.text(.noVideosLoaded))
                .foregroundStyle(.white.opacity(0.7))
                .accessibilityIdentifier("training.videoPlayer.empty")
            } else {
              Picker(copy.text(.videoPlayerSelectionLabel), selection: $viewModel.selectedVideoID) {
                ForEach(viewModel.exerciseVideos, id: \.id) { video in
                  Text(video.title).tag(video.id)
                }
              }
              .pickerStyle(.menu)
              .tint(.orange)
              .accessibilityIdentifier("training.videoPlayer.videoPicker")

              if let selectedVideo = selectedVideo {
                VStack(alignment: .leading, spacing: 4) {
                  Text(selectedVideo.title)
                    .font(.subheadline.bold())
                    .foregroundStyle(.white)
                  Text("\(selectedVideo.coach) · \(selectedVideo.difficulty.rawValue) · \(selectedVideo.locale)")
                    .font(.caption)
                    .foregroundStyle(.white.opacity(0.7))
                }
                .accessibilityIdentifier("training.videoPlayer.selected")

                Link(copy.text(.openVideo), destination: selectedVideo.videoURL)
                  .accessibilityIdentifier("training.videoPlayer.open.\(selectedVideo.id)")
              }
            }
          }
        }

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
        .buttonStyle(FluxPrimaryButtonStyle())
        .disabled(selectedVideo == nil)
        .accessibilityIdentifier("training.videoPlayer.play")

        FluxCard {
          VStack(alignment: .leading, spacing: 8) {
            Text("\(copy.text(.videoPlayerStatusLabel)): \(copy.humanStatus(viewModel.videoPlayerStatus))")
              .font(.footnote.weight(.semibold))
              .foregroundStyle(.white.opacity(0.82))
              .accessibilityIdentifier("training.videoPlayer.status")
            Text("\(copy.text(.videoStatusLabel)): \(copy.humanStatus(viewModel.videoStatus))")
              .font(.footnote.weight(.semibold))
              .foregroundStyle(.white.opacity(0.82))
              .accessibilityIdentifier("training.videoPlayer.videoStatus")
          }
        }

        Button(copy.text(.trainingStageSummary), action: onOpenSessionSummary)
          .buttonStyle(FluxSecondaryButtonStyle())
          .accessibilityIdentifier("training.videoPlayer.openSummary")
      }
    }
    .padding(16)
    .navigationTitle(copy.text(.videoPlayerTitle))
    .fluxScreenStyle()
    .accessibilityIdentifier(screenAccessibilityID)
    .task(id: userID) {
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
