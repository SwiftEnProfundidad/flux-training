import XCTest
@testable import FluxTraining

final class ListExerciseVideosUseCaseTests: XCTestCase {
  func test_execute_returnsLocaleAwareVideosForExercise() async throws {
    let repository = InMemoryExerciseVideoRepository(
      seed: [
        ExerciseVideo(
          id: "video-goblet-squat-es",
          exerciseID: "goblet-squat",
          title: "Sentadilla Goblet",
          coach: "Flux Coach",
          difficulty: .beginner,
          durationSeconds: 180,
          videoURL: URL(string: "https://cdn.flux.training/videos/goblet-squat-es.mp4")!,
          thumbnailURL: URL(string: "https://cdn.flux.training/videos/goblet-squat-es.jpg")!,
          tags: ["piernas", "tecnica"],
          locale: "es-ES"
        ),
        ExerciseVideo(
          id: "video-goblet-squat-en",
          exerciseID: "goblet-squat",
          title: "Goblet Squat",
          coach: "Flux Coach",
          difficulty: .beginner,
          durationSeconds: 170,
          videoURL: URL(string: "https://cdn.flux.training/videos/goblet-squat-en.mp4")!,
          thumbnailURL: URL(string: "https://cdn.flux.training/videos/goblet-squat-en.jpg")!,
          tags: ["legs", "form"],
          locale: "en-US"
        )
      ]
    )
    let useCase = ListExerciseVideosUseCase(repository: repository)

    let videos = try await useCase.execute(exerciseID: "goblet-squat", locale: "es-ES")

    XCTAssertEqual(videos.count, 2)
    XCTAssertEqual(videos.first?.exerciseID, "goblet-squat")
  }
}
