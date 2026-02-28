import XCTest
@testable import FluxTraining

final class CreateAnalyticsEventUseCaseTests: XCTestCase {
  func test_execute_savesEvent() async throws {
    let repository = InMemoryAnalyticsEventRepository()
    let useCase = CreateAnalyticsEventUseCase(repository: repository)

    let event = try await useCase.execute(
      event: AnalyticsEvent(
        userID: "user-1",
        name: "screen_view",
        source: .ios,
        occurredAt: makeDate("2026-02-27T10:00:00Z"),
        attributes: ["screen": "dashboard"]
      )
    )
    let savedCount = try await repository.listByUserID("user-1").count

    XCTAssertEqual(event.name, "screen_view")
    XCTAssertEqual(savedCount, 1)
  }

  func test_execute_throwsWhenUserIDIsEmpty() async {
    let repository = InMemoryAnalyticsEventRepository()
    let useCase = CreateAnalyticsEventUseCase(repository: repository)

    do {
      _ = try await useCase.execute(
        event: AnalyticsEvent(
          userID: "",
          name: "screen_view",
          source: .ios,
          occurredAt: Date(),
          attributes: [:]
        )
      )
      XCTFail("Expected emptyUserID")
    } catch let error as CreateAnalyticsEventError {
      XCTAssertEqual(error, .emptyUserID)
    } catch {
      XCTFail("Unexpected error: \(error)")
    }
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
