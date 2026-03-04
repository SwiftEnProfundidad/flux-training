import Foundation

public enum LoadUserLegalConsentError: Error, Equatable {
  case invalidUserID
}

public struct LoadUserLegalConsentUseCase: Sendable {
  private let repository: any UserLegalConsentRepository

  public init(repository: any UserLegalConsentRepository) {
    self.repository = repository
  }

  public func execute(userID: String) async throws -> UserLegalConsent? {
    let resolvedUserID = userID.trimmingCharacters(in: .whitespacesAndNewlines)
    guard resolvedUserID.isEmpty == false else {
      throw LoadUserLegalConsentError.invalidUserID
    }
    return try await repository.load(userID: resolvedUserID)
  }
}
