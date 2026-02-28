import Foundation

public enum ExerciseVideoDifficulty: String, Sendable, Equatable {
  case beginner
  case intermediate
  case advanced
}

public struct ExerciseVideo: Sendable, Equatable {
  public let id: String
  public let exerciseID: String
  public let title: String
  public let coach: String
  public let difficulty: ExerciseVideoDifficulty
  public let durationSeconds: Int
  public let videoURL: URL
  public let thumbnailURL: URL
  public let tags: [String]
  public let locale: String

  public init(
    id: String,
    exerciseID: String,
    title: String,
    coach: String,
    difficulty: ExerciseVideoDifficulty,
    durationSeconds: Int,
    videoURL: URL,
    thumbnailURL: URL,
    tags: [String],
    locale: String
  ) {
    self.id = id
    self.exerciseID = exerciseID
    self.title = title
    self.coach = coach
    self.difficulty = difficulty
    self.durationSeconds = durationSeconds
    self.videoURL = videoURL
    self.thumbnailURL = thumbnailURL
    self.tags = tags
    self.locale = locale
  }
}

public protocol ExerciseVideoRepository: Sendable {
  func listByExerciseID(_ exerciseID: String, locale: String) async throws -> [ExerciseVideo]
}
