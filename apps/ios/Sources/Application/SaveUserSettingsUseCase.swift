import Foundation

public enum SaveUserSettingsError: Error, Equatable {
  case invalidUserID
}

public struct SaveUserSettingsUseCase: Sendable {
  private let repository: any UserSettingsRepository

  public init(repository: any UserSettingsRepository) {
    self.repository = repository
  }

  public func execute(settings: UserSettings) async throws {
    let resolvedUserID = settings.userID.trimmingCharacters(in: .whitespacesAndNewlines)
    guard resolvedUserID.isEmpty == false else {
      throw SaveUserSettingsError.invalidUserID
    }
    try await repository.save(
      settings: UserSettings(
        userID: resolvedUserID,
        notificationsEnabled: settings.notificationsEnabled,
        watchSyncEnabled: settings.watchSyncEnabled,
        calendarSyncEnabled: settings.calendarSyncEnabled,
        updatedAt: settings.updatedAt
      )
    )
  }
}
