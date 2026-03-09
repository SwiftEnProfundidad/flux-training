import Foundation

public struct AccountDeletionRequest: Sendable, Equatable {
  public let userID: String
  public let reason: String
  public let requestedAt: Date

  public init(userID: String, reason: String, requestedAt: Date) {
    self.userID = userID
    self.reason = reason
    self.requestedAt = requestedAt
  }
}

public protocol AccountDeletionRequestRepository: Sendable {
  func save(request: AccountDeletionRequest) async throws
  func loadLatest(userID: String) async throws -> AccountDeletionRequest?
}
