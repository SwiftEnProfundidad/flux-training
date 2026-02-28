import Foundation

public actor InMemoryWorkoutSessionRepository: WorkoutSessionRepository {
  private var sessions: [WorkoutSession] = []

  public init() {}

  public func save(session: WorkoutSession) async throws {
    sessions.append(session)
  }

  public func allSessions() async -> [WorkoutSession] {
    sessions
  }

  public func listByUserID(_ userID: String) async throws -> [WorkoutSession] {
    sessions.filter { $0.userID == userID }
  }
}
