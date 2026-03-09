import Foundation

public enum LoadUserSettingsError: Error, Equatable {
  case invalidUserID
}

public struct LoadUserSettingsUseCase: Sendable {
  private let repository: any UserSettingsRepository

  public init(repository: any UserSettingsRepository) {
    self.repository = repository
  }

  public func execute(userID: String) async throws -> UserSettings? {
    let resolvedUserID = userID.trimmingCharacters(in: .whitespacesAndNewlines)
    guard resolvedUserID.isEmpty == false else {
      throw LoadUserSettingsError.invalidUserID
    }
    return try await repository.load(userID: resolvedUserID)
  }
}
