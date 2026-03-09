import Foundation
import XCTest
@testable import FluxTraining

@MainActor
final class PrivacyConsentViewModelTests: XCTestCase {
  func test_refresh_withNoStoredConsent_setsEmptyStatus() async {
    let repository = InMemoryUserLegalConsentRepositoryForTests()
    let viewModel = PrivacyConsentViewModel(
      loadUserLegalConsentUseCase: LoadUserLegalConsentUseCase(repository: repository),
      saveUserLegalConsentUseCase: SaveUserLegalConsentUseCase(repository: repository)
    )

    await viewModel.refresh(userID: "user-1")

    XCTAssertEqual(viewModel.status, "empty")
  }

  func test_refresh_withStoredConsent_setsLoadedStatusAndValues() async throws {
    let repository = InMemoryUserLegalConsentRepositoryForTests()
    try await repository.save(
      consent: UserLegalConsent(
        userID: "user-1",
        privacyPolicyAccepted: true,
        termsAccepted: true,
        medicalDisclaimerAccepted: false,
        updatedAt: Date()
      )
    )
    let viewModel = PrivacyConsentViewModel(
      loadUserLegalConsentUseCase: LoadUserLegalConsentUseCase(repository: repository),
      saveUserLegalConsentUseCase: SaveUserLegalConsentUseCase(repository: repository)
    )

    await viewModel.refresh(userID: "user-1")

    XCTAssertEqual(viewModel.status, "loaded")
    XCTAssertEqual(viewModel.privacyPolicyAccepted, true)
    XCTAssertEqual(viewModel.termsAccepted, true)
    XCTAssertEqual(viewModel.medicalDisclaimerAccepted, false)
  }

  func test_saveConsent_whenChecklistIsComplete_setsSavedStatus() async throws {
    let repository = InMemoryUserLegalConsentRepositoryForTests()
    let viewModel = PrivacyConsentViewModel(
      loadUserLegalConsentUseCase: LoadUserLegalConsentUseCase(repository: repository),
      saveUserLegalConsentUseCase: SaveUserLegalConsentUseCase(repository: repository)
    )

    viewModel.privacyPolicyAccepted = true
    viewModel.termsAccepted = true
    viewModel.medicalDisclaimerAccepted = true

    await viewModel.saveConsent(userID: "user-2")
    let stored = try await repository.load(userID: "user-2")

    XCTAssertEqual(viewModel.status, "saved")
    XCTAssertEqual(stored?.privacyPolicyAccepted, true)
    XCTAssertEqual(stored?.termsAccepted, true)
    XCTAssertEqual(stored?.medicalDisclaimerAccepted, true)
  }

  func test_saveConsent_whenChecklistIsIncomplete_setsConsentRequiredStatus() async throws {
    let repository = InMemoryUserLegalConsentRepositoryForTests()
    let viewModel = PrivacyConsentViewModel(
      loadUserLegalConsentUseCase: LoadUserLegalConsentUseCase(repository: repository),
      saveUserLegalConsentUseCase: SaveUserLegalConsentUseCase(repository: repository)
    )

    viewModel.privacyPolicyAccepted = true
    viewModel.termsAccepted = false
    viewModel.medicalDisclaimerAccepted = true

    await viewModel.saveConsent(userID: "user-3")
    let stored = try await repository.load(userID: "user-3")

    XCTAssertEqual(viewModel.status, "consent_required")
    XCTAssertEqual(stored?.privacyPolicyAccepted, true)
    XCTAssertEqual(stored?.termsAccepted, false)
    XCTAssertEqual(stored?.medicalDisclaimerAccepted, true)
  }

  func test_exportData_whenConsentIncomplete_setsConsentRequiredStatus() async {
    let repository = InMemoryUserLegalConsentRepositoryForTests()
    let viewModel = PrivacyConsentViewModel(
      loadUserLegalConsentUseCase: LoadUserLegalConsentUseCase(repository: repository),
      saveUserLegalConsentUseCase: SaveUserLegalConsentUseCase(repository: repository)
    )

    viewModel.privacyPolicyAccepted = true
    viewModel.termsAccepted = false
    viewModel.medicalDisclaimerAccepted = true

    await viewModel.exportData(userID: "user-4")

    XCTAssertEqual(viewModel.status, "consent_required")
  }

  func test_exportData_whenConsentComplete_setsExportedStatus() async {
    let repository = InMemoryUserLegalConsentRepositoryForTests()
    let viewModel = PrivacyConsentViewModel(
      loadUserLegalConsentUseCase: LoadUserLegalConsentUseCase(repository: repository),
      saveUserLegalConsentUseCase: SaveUserLegalConsentUseCase(repository: repository)
    )

    viewModel.privacyPolicyAccepted = true
    viewModel.termsAccepted = true
    viewModel.medicalDisclaimerAccepted = true

    await viewModel.exportData(userID: "user-5")

    XCTAssertEqual(viewModel.status, "exported")
  }

  func test_requestDeletion_whenConsentComplete_setsDeletionRequestedStatus() async {
    let repository = InMemoryUserLegalConsentRepositoryForTests()
    let viewModel = PrivacyConsentViewModel(
      loadUserLegalConsentUseCase: LoadUserLegalConsentUseCase(repository: repository),
      saveUserLegalConsentUseCase: SaveUserLegalConsentUseCase(repository: repository)
    )

    viewModel.privacyPolicyAccepted = true
    viewModel.termsAccepted = true
    viewModel.medicalDisclaimerAccepted = true

    await viewModel.requestDeletion(userID: "user-6")

    XCTAssertEqual(viewModel.status, "deletion_requested")
  }

  func test_refresh_whenRepositoryIsOffline_setsOfflineStatus() async {
    let repository = FailingUserLegalConsentRepositoryForTests(error: URLError(.notConnectedToInternet))
    let viewModel = PrivacyConsentViewModel(
      loadUserLegalConsentUseCase: LoadUserLegalConsentUseCase(repository: repository),
      saveUserLegalConsentUseCase: SaveUserLegalConsentUseCase(repository: repository)
    )

    await viewModel.refresh(userID: "user-7")

    XCTAssertEqual(viewModel.status, "offline")
  }

  func test_refresh_whenAuthIsMissing_setsDeniedStatus() async {
    let repository = FailingUserLegalConsentRepositoryForTests(
      error: FluxBackendClientError.missingAuthorizationBearer
    )
    let viewModel = PrivacyConsentViewModel(
      loadUserLegalConsentUseCase: LoadUserLegalConsentUseCase(repository: repository),
      saveUserLegalConsentUseCase: SaveUserLegalConsentUseCase(repository: repository)
    )

    await viewModel.refresh(userID: "user-8")

    XCTAssertEqual(viewModel.status, "denied")
  }
}

private actor InMemoryUserLegalConsentRepositoryForTests: UserLegalConsentRepository {
  private var storage: [String: UserLegalConsent] = [:]

  func save(consent: UserLegalConsent) async throws {
    storage[consent.userID] = consent
  }

  func load(userID: String) async throws -> UserLegalConsent? {
    storage[userID]
  }
}

private actor FailingUserLegalConsentRepositoryForTests: UserLegalConsentRepository {
  private let error: Error

  init(error: Error) {
    self.error = error
  }

  func save(consent: UserLegalConsent) async throws {
    throw error
  }

  func load(userID: String) async throws -> UserLegalConsent? {
    throw error
  }
}
