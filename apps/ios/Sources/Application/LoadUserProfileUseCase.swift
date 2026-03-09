import Foundation

public enum LoadUserProfileError: Error, Equatable {
  case invalidUserID
}

public struct LoadUserProfileUseCase: Sendable {
  private let repository: any UserProfileRepository

  public init(repository: any UserProfileRepository) {
    self.repository = repository
  }

  public func execute(userID: String) async throws -> UserProfile? {
    let resolvedUserID = userID.trimmingCharacters(in: .whitespacesAndNewlines)
    guard resolvedUserID.isEmpty == false else {
      throw LoadUserProfileError.invalidUserID
    }
    return try await repository.load(userID: resolvedUserID)
  }
}
