import Foundation

public enum CreateCrashReportError: Error, Equatable {
  case emptyUserID
  case emptyMessage
}

public struct CreateCrashReportUseCase: Sendable {
  private let repository: any CrashReportRepository

  public init(repository: any CrashReportRepository) {
    self.repository = repository
  }

  public func execute(report: CrashReport) async throws -> CrashReport {
    guard report.userID.isEmpty == false else { throw CreateCrashReportError.emptyUserID }
    guard report.message.isEmpty == false else { throw CreateCrashReportError.emptyMessage }
    try await repository.save(report: report)
    return report
  }
}
