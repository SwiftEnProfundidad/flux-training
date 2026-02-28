import XCTest
@testable import FluxTraining

final class ListAnalyticsEventsUseCaseTests: XCTestCase {
  func test_execute_listsEventsByUser() async throws {
    let repository = InMemoryAnalyticsEventRepository()
    try await repository.save(
      event: AnalyticsEvent(
        userID: "user-1",
        name: "screen_view",
        source: .ios,
        occurredAt: makeDate("2026-02-27T10:00:00Z"),
        attributes: [:]
      )
    )
    try await repository.save(
      event: AnalyticsEvent(
        userID: "user-2",
        name: "button_click",
        source: .web,
        occurredAt: makeDate("2026-02-27T10:01:00Z"),
        attributes: [:]
      )
    )
    let useCase = ListAnalyticsEventsUseCase(repository: repository)

    let events = try await useCase.execute(userID: "user-1")

    XCTAssertEqual(events.count, 1)
    XCTAssertEqual(events.first?.userID, "user-1")
  }

  private func makeDate(_ raw: String) -> Date {
    let formatter = ISO8601DateFormatter()
    guard let date = formatter.date(from: raw) else {
      XCTFail("Invalid date: \(raw)")
      return Date()
    }
    return date
  }
}
