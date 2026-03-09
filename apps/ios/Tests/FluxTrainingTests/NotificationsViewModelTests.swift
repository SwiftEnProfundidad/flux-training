import Foundation
import XCTest
@testable import FluxTraining

@MainActor
final class NotificationsViewModelTests: XCTestCase {
  func test_refresh_withNoStoredSettings_setsEmptyStatus() async {
    let repository = InMemoryUserSettingsRepositoryForNotifications()
    let viewModel = NotificationsViewModel(
      loadUserSettingsUseCase: LoadUserSettingsUseCase(repository: repository),
      saveUserSettingsUseCase: SaveUserSettingsUseCase(repository: repository)
    )

    await viewModel.refresh(userID: "user-1")

    XCTAssertEqual(viewModel.status, "empty")
  }

  func test_refresh_withStoredSettings_setsLoadedStatusAndValues() async throws {
    let repository = InMemoryUserSettingsRepositoryForNotifications()
    try await repository.save(
      settings: UserSettings(
        userID: "user-1",
        notificationsEnabled: false,
        watchSyncEnabled: true,
        calendarSyncEnabled: true,
        updatedAt: Date()
      )
    )
    let viewModel = NotificationsViewModel(
      loadUserSettingsUseCase: LoadUserSettingsUseCase(repository: repository),
      saveUserSettingsUseCase: SaveUserSettingsUseCase(repository: repository)
    )

    await viewModel.refresh(userID: "user-1")

    XCTAssertEqual(viewModel.status, "loaded")
    XCTAssertEqual(viewModel.trainingRemindersEnabled, false)
    XCTAssertEqual(viewModel.recoveryAlertsEnabled, true)
    XCTAssertEqual(viewModel.weeklyDigestEnabled, true)
  }

  func test_save_withValidSettings_setsSavedStatusAndPersists() async throws {
    let repository = InMemoryUserSettingsRepositoryForNotifications()
    let viewModel = NotificationsViewModel(
      loadUserSettingsUseCase: LoadUserSettingsUseCase(repository: repository),
      saveUserSettingsUseCase: SaveUserSettingsUseCase(repository: repository)
    )

    viewModel.trainingRemindersEnabled = true
    viewModel.recoveryAlertsEnabled = false
    viewModel.weeklyDigestEnabled = true

    await viewModel.save(userID: "user-2")
    let savedSettings = try await repository.load(userID: "user-2")

    XCTAssertEqual(viewModel.status, "saved")
    XCTAssertEqual(savedSettings?.notificationsEnabled, true)
    XCTAssertEqual(savedSettings?.watchSyncEnabled, false)
    XCTAssertEqual(savedSettings?.calendarSyncEnabled, true)
  }

  func test_save_withEmptyUserID_setsValidationError() async {
    let repository = InMemoryUserSettingsRepositoryForNotifications()
    let viewModel = NotificationsViewModel(
      loadUserSettingsUseCase: LoadUserSettingsUseCase(repository: repository),
      saveUserSettingsUseCase: SaveUserSettingsUseCase(repository: repository)
    )

    await viewModel.save(userID: " ")

    XCTAssertEqual(viewModel.status, "validation_error")
  }

  func test_refresh_whenRepositoryIsOffline_setsOfflineStatus() async {
    let repository = FailingUserSettingsRepositoryForNotifications(error: URLError(.notConnectedToInternet))
    let viewModel = NotificationsViewModel(
      loadUserSettingsUseCase: LoadUserSettingsUseCase(repository: repository),
      saveUserSettingsUseCase: SaveUserSettingsUseCase(repository: repository)
    )

    await viewModel.refresh(userID: "user-3")

    XCTAssertEqual(viewModel.status, "offline")
  }

  func test_refresh_whenAuthIsMissing_setsDeniedStatus() async {
    let repository = FailingUserSettingsRepositoryForNotifications(
      error: FluxBackendClientError.missingAuthorizationBearer
    )
    let viewModel = NotificationsViewModel(
      loadUserSettingsUseCase: LoadUserSettingsUseCase(repository: repository),
      saveUserSettingsUseCase: SaveUserSettingsUseCase(repository: repository)
    )

    await viewModel.refresh(userID: "user-4")

    XCTAssertEqual(viewModel.status, "denied")
  }
}

private actor InMemoryUserSettingsRepositoryForNotifications: UserSettingsRepository {
  private var storage: [String: UserSettings] = [:]

  func save(settings: UserSettings) async throws {
    storage[settings.userID] = settings
  }

  func load(userID: String) async throws -> UserSettings? {
    storage[userID]
  }
}

private actor FailingUserSettingsRepositoryForNotifications: UserSettingsRepository {
  private let error: Error

  init(error: Error) {
    self.error = error
  }

  func save(settings: UserSettings) async throws {
    throw error
  }

  func load(userID: String) async throws -> UserSettings? {
    throw error
  }
}
