import XCTest
@testable import FluxTraining

final class CreateCrashReportUseCaseTests: XCTestCase {
  func test_execute_savesReport() async throws {
    let repository = InMemoryCrashReportRepository()
    let useCase = CreateCrashReportUseCase(repository: repository)

    let report = try await useCase.execute(
      report: CrashReport(
        userID: "user-1",
        source: .ios,
        message: "Unexpected nil",
        stackTrace: "ViewModel.swift:23",
        severity: .warning,
        occurredAt: makeDate("2026-02-27T10:00:00Z")
      )
    )
    let savedCount = try await repository.listByUserID("user-1").count

    XCTAssertEqual(report.message, "Unexpected nil")
    XCTAssertEqual(savedCount, 1)
  }

  func test_execute_throwsWhenMessageIsEmpty() async {
    let repository = InMemoryCrashReportRepository()
    let useCase = CreateCrashReportUseCase(repository: repository)

    do {
      _ = try await useCase.execute(
        report: CrashReport(
          userID: "user-1",
          source: .ios,
          message: "",
          stackTrace: nil,
          severity: .warning,
          occurredAt: Date()
        )
      )
      XCTFail("Expected emptyMessage")
    } catch let error as CreateCrashReportError {
      XCTAssertEqual(error, .emptyMessage)
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
