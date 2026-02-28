import Foundation

public struct ListExerciseVideosUseCase: Sendable {
  private let repository: any ExerciseVideoRepository

  public init(repository: any ExerciseVideoRepository) {
    self.repository = repository
  }

  public func execute(exerciseID: String, locale: String) async throws -> [ExerciseVideo] {
    guard exerciseID.isEmpty == false else { return [] }
    guard locale.isEmpty == false else { return [] }
    return try await repository.listByExerciseID(exerciseID, locale: locale)
  }
}
