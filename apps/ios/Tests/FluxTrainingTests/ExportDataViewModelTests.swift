import Foundation
import XCTest
@testable import FluxTraining

@MainActor
final class ExportDataViewModelTests: XCTestCase {
  func test_refresh_whenRepositoriesAreEmpty_setsEmptyStatus() async {
    let useCase = ExportUserDataUseCase(
      userProfileRepository: InMemoryUserProfileRepositoryForExportTests(),
      userSettingsRepository: InMemoryUserSettingsRepositoryForExportTests(),
      userLegalConsentRepository: InMemoryUserLegalConsentRepositoryForExportTests()
    )
    let viewModel = ExportDataViewModel(exportUserDataUseCase: useCase)

    await viewModel.refresh(userID: "user-1")

    XCTAssertEqual(viewModel.status, "empty")
    XCTAssertGreaterThan(viewModel.payloadBytes, 0)
    XCTAssertFalse(viewModel.payloadPreview.isEmpty)
  }

  func test_export_whenDataExists_setsExportedStatusAndPayload() async throws {
    let profileRepository = InMemoryUserProfileRepositoryForExportTests()
    let settingsRepository = InMemoryUserSettingsRepositoryForExportTests()
    let legalRepository = InMemoryUserLegalConsentRepositoryForExportTests()
    try await profileRepository.save(
      profile: UserProfile(
        id: "user-2",
        displayName: "Nora",
        goal: .recomposition,
        age: 34,
        heightCm: 167,
        weightKg: 62,
        createdAt: Date()
      )
    )
    try await settingsRepository.save(
      settings: UserSettings(
        userID: "user-2",
        notificationsEnabled: true,
        watchSyncEnabled: false,
        calendarSyncEnabled: true,
        updatedAt: Date()
      )
    )
    try await legalRepository.save(
      consent: UserLegalConsent(
        userID: "user-2",
        privacyPolicyAccepted: true,
        termsAccepted: true,
        medicalDisclaimerAccepted: true,
        updatedAt: Date()
      )
    )

    let useCase = ExportUserDataUseCase(
      userProfileRepository: profileRepository,
      userSettingsRepository: settingsRepository,
      userLegalConsentRepository: legalRepository
    )
    let viewModel = ExportDataViewModel(exportUserDataUseCase: useCase)

    await viewModel.export(userID: "user-2")

    XCTAssertEqual(viewModel.status, "exported")
    XCTAssertGreaterThan(viewModel.payloadBytes, 0)
    XCTAssertTrue(viewModel.payloadPreview.contains("\"userID\" : \"user-2\""))
    XCTAssertNotEqual(viewModel.generatedAtISO8601, "-")
  }

  func test_export_withInvalidUserID_setsValidationError() async {
    let useCase = ExportUserDataUseCase(
      userProfileRepository: InMemoryUserProfileRepositoryForExportTests(),
      userSettingsRepository: InMemoryUserSettingsRepositoryForExportTests(),
      userLegalConsentRepository: InMemoryUserLegalConsentRepositoryForExportTests()
    )
    let viewModel = ExportDataViewModel(exportUserDataUseCase: useCase)

    await viewModel.export(userID: " ")

    XCTAssertEqual(viewModel.status, "validation_error")
  }

  func test_export_whenRepositoryFailsWithOffline_setsOfflineStatus() async {
    let useCase = ExportUserDataUseCase(
      userProfileRepository: FailingUserProfileRepositoryForExportTests(error: URLError(.notConnectedToInternet)),
      userSettingsRepository: InMemoryUserSettingsRepositoryForExportTests(),
      userLegalConsentRepository: InMemoryUserLegalConsentRepositoryForExportTests()
    )
    let viewModel = ExportDataViewModel(exportUserDataUseCase: useCase)

    await viewModel.export(userID: "user-3")

    XCTAssertEqual(viewModel.status, "offline")
  }

  func test_export_whenRepositoryFailsWithAuthMissing_setsDeniedStatus() async {
    let useCase = ExportUserDataUseCase(
      userProfileRepository: FailingUserProfileRepositoryForExportTests(
        error: FluxBackendClientError.missingAuthorizationBearer
      ),
      userSettingsRepository: InMemoryUserSettingsRepositoryForExportTests(),
      userLegalConsentRepository: InMemoryUserLegalConsentRepositoryForExportTests()
    )
    let viewModel = ExportDataViewModel(exportUserDataUseCase: useCase)

    await viewModel.export(userID: "user-4")

    XCTAssertEqual(viewModel.status, "denied")
  }
}

private actor InMemoryUserProfileRepositoryForExportTests: UserProfileRepository {
  private var storage: [String: UserProfile] = [:]

  func save(profile: UserProfile) async throws {
    storage[profile.id] = profile
  }

  func load(userID: String) async throws -> UserProfile? {
    storage[userID]
  }
}

private actor InMemoryUserSettingsRepositoryForExportTests: UserSettingsRepository {
  private var storage: [String: UserSettings] = [:]

  func save(settings: UserSettings) async throws {
    storage[settings.userID] = settings
  }

  func load(userID: String) async throws -> UserSettings? {
    storage[userID]
  }
}

private actor InMemoryUserLegalConsentRepositoryForExportTests: UserLegalConsentRepository {
  private var storage: [String: UserLegalConsent] = [:]

  func save(consent: UserLegalConsent) async throws {
    storage[consent.userID] = consent
  }

  func load(userID: String) async throws -> UserLegalConsent? {
    storage[userID]
  }
}

private actor FailingUserProfileRepositoryForExportTests: UserProfileRepository {
  private let error: Error

  init(error: Error) {
    self.error = error
  }

  func save(profile: UserProfile) async throws {
    throw error
  }

  func load(userID: String) async throws -> UserProfile? {
    throw error
  }
}
