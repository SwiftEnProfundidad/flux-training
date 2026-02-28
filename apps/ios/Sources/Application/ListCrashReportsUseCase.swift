import Foundation

public struct ListCrashReportsUseCase: Sendable {
  private let repository: any CrashReportRepository

  public init(repository: any CrashReportRepository) {
    self.repository = repository
  }

  public func execute(userID: String) async throws -> [CrashReport] {
    guard userID.isEmpty == false else { return [] }
    return try await repository.listByUserID(userID)
  }
}
