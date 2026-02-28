import Foundation

public enum CreateAnalyticsEventError: Error, Equatable {
  case emptyUserID
  case emptyName
}

public struct CreateAnalyticsEventUseCase: Sendable {
  private let repository: any AnalyticsEventRepository

  public init(repository: any AnalyticsEventRepository) {
    self.repository = repository
  }

  public func execute(event: AnalyticsEvent) async throws -> AnalyticsEvent {
    guard event.userID.isEmpty == false else { throw CreateAnalyticsEventError.emptyUserID }
    guard event.name.isEmpty == false else { throw CreateAnalyticsEventError.emptyName }
    try await repository.save(event: event)
    return event
  }
}
