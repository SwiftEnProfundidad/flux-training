import Foundation

public actor InMemoryExerciseVideoRepository: ExerciseVideoRepository {
  private let videos: [ExerciseVideo]

  public init(seed: [ExerciseVideo]? = nil) {
    videos = seed ?? InMemoryExerciseVideoRepository.defaultCatalog
  }

  public func listByExerciseID(_ exerciseID: String, locale: String) async throws -> [ExerciseVideo] {
    videos
      .filter { video in
        video.exerciseID == exerciseID && (video.locale == locale || video.locale == "en-US")
      }
      .sorted { left, right in
        if left.locale == locale && right.locale != locale {
          return true
        }
        if left.locale != locale && right.locale == locale {
          return false
        }
        return left.id < right.id
      }
  }

  private static let defaultCatalog: [ExerciseVideo] = [
    ExerciseVideo(
      id: "video-goblet-squat-es",
      exerciseID: "goblet-squat",
      title: "Sentadilla Goblet: tecnica base",
      coach: "Flux Coach",
      difficulty: .beginner,
      durationSeconds: 182,
      videoURL: URL(string: "https://cdn.flux.training/videos/goblet-squat-es.mp4")!,
      thumbnailURL: URL(string: "https://cdn.flux.training/videos/goblet-squat-es.jpg")!,
      tags: ["piernas", "movilidad", "tecnica"],
      locale: "es-ES"
    ),
    ExerciseVideo(
      id: "video-goblet-squat-en",
      exerciseID: "goblet-squat",
      title: "Goblet Squat Form Fundamentals",
      coach: "Flux Coach",
      difficulty: .beginner,
      durationSeconds: 176,
      videoURL: URL(string: "https://cdn.flux.training/videos/goblet-squat-en.mp4")!,
      thumbnailURL: URL(string: "https://cdn.flux.training/videos/goblet-squat-en.jpg")!,
      tags: ["legs", "form", "mobility"],
      locale: "en-US"
    ),
    ExerciseVideo(
      id: "video-bench-press-es",
      exerciseID: "bench-press",
      title: "Press banca: control y estabilidad",
      coach: "Flux Coach",
      difficulty: .intermediate,
      durationSeconds: 166,
      videoURL: URL(string: "https://cdn.flux.training/videos/bench-press-es.mp4")!,
      thumbnailURL: URL(string: "https://cdn.flux.training/videos/bench-press-es.jpg")!,
      tags: ["pecho", "fuerza", "estabilidad"],
      locale: "es-ES"
    ),
    ExerciseVideo(
      id: "video-bench-press-en",
      exerciseID: "bench-press",
      title: "Bench Press Setup and Drive",
      coach: "Flux Coach",
      difficulty: .intermediate,
      durationSeconds: 158,
      videoURL: URL(string: "https://cdn.flux.training/videos/bench-press-en.mp4")!,
      thumbnailURL: URL(string: "https://cdn.flux.training/videos/bench-press-en.jpg")!,
      tags: ["chest", "strength", "setup"],
      locale: "en-US"
    )
  ]
}
