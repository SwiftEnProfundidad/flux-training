import Foundation

public struct ListAnalyticsEventsUseCase: Sendable {
  private let repository: any AnalyticsEventRepository

  public init(repository: any AnalyticsEventRepository) {
    self.repository = repository
  }

  public func execute(userID: String) async throws -> [AnalyticsEvent] {
    guard userID.isEmpty == false else { return [] }
    return try await repository.listByUserID(userID)
  }
}
