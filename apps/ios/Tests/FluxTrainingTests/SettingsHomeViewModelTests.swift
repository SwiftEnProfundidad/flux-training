import Foundation
import XCTest
@testable import FluxTraining

@MainActor
final class SettingsHomeViewModelTests: XCTestCase {
  func test_refresh_withNoStoredSettings_setsEmptyStatus() async {
    let repository = InMemoryUserSettingsRepository()
    let viewModel = SettingsHomeViewModel(
      loadUserSettingsUseCase: LoadUserSettingsUseCase(repository: repository),
      saveUserSettingsUseCase: SaveUserSettingsUseCase(repository: repository)
    )

    await viewModel.refresh(userID: "user-1")

    XCTAssertEqual(viewModel.status, "empty")
  }

  func test_refresh_withStoredSettings_setsLoadedStatusAndValues() async throws {
    let repository = InMemoryUserSettingsRepository()
    try await repository.save(
      settings: UserSettings(
        userID: "user-1",
        notificationsEnabled: false,
        watchSyncEnabled: false,
        calendarSyncEnabled: true,
        updatedAt: Date()
      )
    )
    let viewModel = SettingsHomeViewModel(
      loadUserSettingsUseCase: LoadUserSettingsUseCase(repository: repository),
      saveUserSettingsUseCase: SaveUserSettingsUseCase(repository: repository)
    )

    await viewModel.refresh(userID: "user-1")

    XCTAssertEqual(viewModel.status, "loaded")
    XCTAssertEqual(viewModel.notificationsEnabled, false)
    XCTAssertEqual(viewModel.watchSyncEnabled, false)
    XCTAssertEqual(viewModel.calendarSyncEnabled, true)
  }

  func test_save_withValidUserID_setsSavedStatus() async {
    let repository = InMemoryUserSettingsRepository()
    let viewModel = SettingsHomeViewModel(
      loadUserSettingsUseCase: LoadUserSettingsUseCase(repository: repository),
      saveUserSettingsUseCase: SaveUserSettingsUseCase(repository: repository)
    )

    viewModel.notificationsEnabled = false
    viewModel.watchSyncEnabled = true
    viewModel.calendarSyncEnabled = true
    await viewModel.save(userID: "user-2")
    let savedSettings = try? await repository.load(userID: "user-2")

    XCTAssertEqual(viewModel.status, "saved")
    XCTAssertEqual(savedSettings?.notificationsEnabled, false)
    XCTAssertEqual(savedSettings?.watchSyncEnabled, true)
    XCTAssertEqual(savedSettings?.calendarSyncEnabled, true)
  }

  func test_save_withEmptyUserID_setsValidationError() async {
    let repository = InMemoryUserSettingsRepository()
    let viewModel = SettingsHomeViewModel(
      loadUserSettingsUseCase: LoadUserSettingsUseCase(repository: repository),
      saveUserSettingsUseCase: SaveUserSettingsUseCase(repository: repository)
    )

    await viewModel.save(userID: " ")

    XCTAssertEqual(viewModel.status, "validation_error")
  }

  func test_refresh_whenRepositoryIsOffline_setsOfflineStatus() async {
    let repository = FailingUserSettingsRepository(error: URLError(.notConnectedToInternet))
    let viewModel = SettingsHomeViewModel(
      loadUserSettingsUseCase: LoadUserSettingsUseCase(repository: repository),
      saveUserSettingsUseCase: SaveUserSettingsUseCase(repository: repository)
    )

    await viewModel.refresh(userID: "user-3")

    XCTAssertEqual(viewModel.status, "offline")
  }

  func test_refresh_whenAuthIsMissing_setsDeniedStatus() async {
    let repository = FailingUserSettingsRepository(error: FluxBackendClientError.missingAuthorizationBearer)
    let viewModel = SettingsHomeViewModel(
      loadUserSettingsUseCase: LoadUserSettingsUseCase(repository: repository),
      saveUserSettingsUseCase: SaveUserSettingsUseCase(repository: repository)
    )

    await viewModel.refresh(userID: "user-4")

    XCTAssertEqual(viewModel.status, "denied")
  }
}

private actor InMemoryUserSettingsRepository: UserSettingsRepository {
  private var storage: [String: UserSettings] = [:]

  func save(settings: UserSettings) async throws {
    storage[settings.userID] = settings
  }

  func load(userID: String) async throws -> UserSettings? {
    storage[userID]
  }
}

private actor FailingUserSettingsRepository: UserSettingsRepository {
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
