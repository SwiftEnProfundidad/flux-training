import Foundation

public actor InMemoryAnalyticsEventRepository: AnalyticsEventRepository {
  private var records: [AnalyticsEvent] = []

  public init() {}

  public func save(event: AnalyticsEvent) async throws {
    records.append(event)
  }

  public func listByUserID(_ userID: String) async throws -> [AnalyticsEvent] {
    records.filter { $0.userID == userID }
  }
}
