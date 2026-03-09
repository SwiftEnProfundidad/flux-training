import Foundation

public enum LoadLatestAccountDeletionRequestError: Error, Equatable {
  case invalidUserID
}

public struct LoadLatestAccountDeletionRequestUseCase: Sendable {
  private let repository: any AccountDeletionRequestRepository

  public init(repository: any AccountDeletionRequestRepository) {
    self.repository = repository
  }

  public func execute(userID: String) async throws -> AccountDeletionRequest? {
    let resolvedUserID = userID.trimmingCharacters(in: .whitespacesAndNewlines)
    guard resolvedUserID.isEmpty == false else {
      throw LoadLatestAccountDeletionRequestError.invalidUserID
    }
    return try await repository.loadLatest(userID: resolvedUserID)
  }
}
