import Foundation

public struct UserSettings: Sendable, Equatable {
  public let userID: String
  public let notificationsEnabled: Bool
  public let watchSyncEnabled: Bool
  public let calendarSyncEnabled: Bool
  public let updatedAt: Date

  public init(
    userID: String,
    notificationsEnabled: Bool,
    watchSyncEnabled: Bool,
    calendarSyncEnabled: Bool,
    updatedAt: Date
  ) {
    self.userID = userID
    self.notificationsEnabled = notificationsEnabled
    self.watchSyncEnabled = watchSyncEnabled
    self.calendarSyncEnabled = calendarSyncEnabled
    self.updatedAt = updatedAt
  }
}

public protocol UserSettingsRepository: Sendable {
  func save(settings: UserSettings) async throws
  func load(userID: String) async throws -> UserSettings?
}
