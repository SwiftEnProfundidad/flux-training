import XCTest
@testable import FluxTraining

final class ListCrashReportsUseCaseTests: XCTestCase {
  func test_execute_listsReportsByUser() async throws {
    let repository = InMemoryCrashReportRepository()
    try await repository.save(
      report: CrashReport(
        userID: "user-1",
        source: .ios,
        message: "Unexpected nil",
        stackTrace: "ViewModel.swift:42",
        severity: .fatal,
        occurredAt: makeDate("2026-02-27T10:00:00Z")
      )
    )
    try await repository.save(
      report: CrashReport(
        userID: "user-2",
        source: .web,
        message: "Reference error",
        stackTrace: "App.tsx:12",
        severity: .warning,
        occurredAt: makeDate("2026-02-27T10:01:00Z")
      )
    )
    let useCase = ListCrashReportsUseCase(repository: repository)

    let reports = try await useCase.execute(userID: "user-1")

    XCTAssertEqual(reports.count, 1)
    XCTAssertEqual(reports.first?.severity, .fatal)
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
