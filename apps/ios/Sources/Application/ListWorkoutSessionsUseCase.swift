import Foundation

public struct ListWorkoutSessionsUseCase: Sendable {
  private let repository: any WorkoutSessionRepository

  public init(repository: any WorkoutSessionRepository) {
    self.repository = repository
  }

  public func execute(userID: String, planID: String? = nil) async throws -> [WorkoutSession] {
    guard userID.isEmpty == false else { return [] }
    let sessions = try await repository.listByUserID(userID)
    guard let planID, planID.isEmpty == false else { return sessions }
    return sessions.filter { $0.planID == planID }
  }
}

