import Foundation

public actor InMemoryCrashReportRepository: CrashReportRepository {
  private var records: [CrashReport] = []

  public init() {}

  public func save(report: CrashReport) async throws {
    records.append(report)
  }

  public func listByUserID(_ userID: String) async throws -> [CrashReport] {
    records.filter { $0.userID == userID }
  }
}
