import Foundation

public enum RequestAccountDeletionError: Error, Equatable {
  case invalidUserID
  case reasonRequired
}

public struct RequestAccountDeletionUseCase: Sendable {
  private let repository: any AccountDeletionRequestRepository

  public init(repository: any AccountDeletionRequestRepository) {
    self.repository = repository
  }

  public func execute(request: AccountDeletionRequest) async throws {
    let resolvedUserID = request.userID.trimmingCharacters(in: .whitespacesAndNewlines)
    guard resolvedUserID.isEmpty == false else {
      throw RequestAccountDeletionError.invalidUserID
    }
    let resolvedReason = request.reason.trimmingCharacters(in: .whitespacesAndNewlines)
    guard resolvedReason.isEmpty == false else {
      throw RequestAccountDeletionError.reasonRequired
    }
    try await repository.save(
      request: AccountDeletionRequest(
        userID: resolvedUserID,
        reason: resolvedReason,
        requestedAt: request.requestedAt
      )
    )
  }
}
