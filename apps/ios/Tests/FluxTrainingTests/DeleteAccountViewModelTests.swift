import Foundation
import XCTest
@testable import FluxTraining

@MainActor
final class DeleteAccountViewModelTests: XCTestCase {
  func test_refresh_withNoStoredRequest_setsEmptyStatus() async {
    let deletionRepository = InMemoryAccountDeletionRequestRepositoryForTests()
    let legalRepository = InMemoryUserLegalConsentRepositoryForDeleteTests()
    let viewModel = makeViewModel(
      deletionRepository: deletionRepository,
      legalRepository: legalRepository
    )

    await viewModel.refresh(userID: "user-1")

    XCTAssertEqual(viewModel.status, "empty")
  }

  func test_refresh_withStoredRequest_setsLoadedStatus() async throws {
    let deletionRepository = InMemoryAccountDeletionRequestRepositoryForTests()
    let legalRepository = InMemoryUserLegalConsentRepositoryForDeleteTests()
    try await deletionRepository.save(
      request: AccountDeletionRequest(
        userID: "user-2",
        reason: "Necesito cerrar la cuenta",
        requestedAt: Date()
      )
    )
    let viewModel = makeViewModel(
      deletionRepository: deletionRepository,
      legalRepository: legalRepository
    )

    await viewModel.refresh(userID: "user-2")

    XCTAssertEqual(viewModel.status, "loaded")
    XCTAssertEqual(viewModel.reason, "Necesito cerrar la cuenta")
  }

  func test_requestDeletion_withCompleteConsent_setsDeletionRequested() async throws {
    let deletionRepository = InMemoryAccountDeletionRequestRepositoryForTests()
    let legalRepository = InMemoryUserLegalConsentRepositoryForDeleteTests()
    try await legalRepository.save(
      consent: UserLegalConsent(
        userID: "user-3",
        privacyPolicyAccepted: true,
        termsAccepted: true,
        medicalDisclaimerAccepted: true,
        updatedAt: Date()
      )
    )
    let viewModel = makeViewModel(
      deletionRepository: deletionRepository,
      legalRepository: legalRepository
    )
    viewModel.reason = "Cerrar cuenta por uso personal"

    await viewModel.requestDeletion(userID: "user-3")
    let stored = try await deletionRepository.loadLatest(userID: "user-3")

    XCTAssertEqual(viewModel.status, "deletion_requested")
    XCTAssertEqual(stored?.reason, "Cerrar cuenta por uso personal")
  }

  func test_requestDeletion_withoutCompleteConsent_setsConsentRequired() async {
    let deletionRepository = InMemoryAccountDeletionRequestRepositoryForTests()
    let legalRepository = InMemoryUserLegalConsentRepositoryForDeleteTests()
    let viewModel = makeViewModel(
      deletionRepository: deletionRepository,
      legalRepository: legalRepository
    )
    viewModel.reason = "Cerrar cuenta"

    await viewModel.requestDeletion(userID: "user-4")

    XCTAssertEqual(viewModel.status, "consent_required")
  }

  func test_requestDeletion_withEmptyReason_setsValidationError() async throws {
    let deletionRepository = InMemoryAccountDeletionRequestRepositoryForTests()
    let legalRepository = InMemoryUserLegalConsentRepositoryForDeleteTests()
    try await legalRepository.save(
      consent: UserLegalConsent(
        userID: "user-5",
        privacyPolicyAccepted: true,
        termsAccepted: true,
        medicalDisclaimerAccepted: true,
        updatedAt: Date()
      )
    )
    let viewModel = makeViewModel(
      deletionRepository: deletionRepository,
      legalRepository: legalRepository
    )
    viewModel.reason = " "

    await viewModel.requestDeletion(userID: "user-5")

    XCTAssertEqual(viewModel.status, "validation_error")
  }

  func test_requestDeletion_whenRepositoryIsOffline_setsOffline() async throws {
    let deletionRepository = FailingAccountDeletionRequestRepositoryForTests(
      error: URLError(.notConnectedToInternet)
    )
    let legalRepository = InMemoryUserLegalConsentRepositoryForDeleteTests()
    try await legalRepository.save(
      consent: UserLegalConsent(
        userID: "user-6",
        privacyPolicyAccepted: true,
        termsAccepted: true,
        medicalDisclaimerAccepted: true,
        updatedAt: Date()
      )
    )
    let viewModel = makeViewModel(
      deletionRepository: deletionRepository,
      legalRepository: legalRepository
    )
    viewModel.reason = "Cerrar"

    await viewModel.requestDeletion(userID: "user-6")

    XCTAssertEqual(viewModel.status, "offline")
  }

  func test_requestDeletion_whenRepositoryIsDenied_setsDenied() async throws {
    let deletionRepository = FailingAccountDeletionRequestRepositoryForTests(
      error: FluxBackendClientError.missingAuthorizationBearer
    )
    let legalRepository = InMemoryUserLegalConsentRepositoryForDeleteTests()
    try await legalRepository.save(
      consent: UserLegalConsent(
        userID: "user-7",
        privacyPolicyAccepted: true,
        termsAccepted: true,
        medicalDisclaimerAccepted: true,
        updatedAt: Date()
      )
    )
    let viewModel = makeViewModel(
      deletionRepository: deletionRepository,
      legalRepository: legalRepository
    )
    viewModel.reason = "Cerrar"

    await viewModel.requestDeletion(userID: "user-7")

    XCTAssertEqual(viewModel.status, "denied")
  }

  private func makeViewModel(
    deletionRepository: any AccountDeletionRequestRepository,
    legalRepository: any UserLegalConsentRepository
  ) -> DeleteAccountViewModel {
    DeleteAccountViewModel(
      loadLatestAccountDeletionRequestUseCase: LoadLatestAccountDeletionRequestUseCase(
        repository: deletionRepository
      ),
      requestAccountDeletionUseCase: RequestAccountDeletionUseCase(
        repository: deletionRepository
      ),
      loadUserLegalConsentUseCase: LoadUserLegalConsentUseCase(
        repository: legalRepository
      )
    )
  }
}

private actor InMemoryAccountDeletionRequestRepositoryForTests: AccountDeletionRequestRepository {
  private var storage: [String: AccountDeletionRequest] = [:]

  func save(request: AccountDeletionRequest) async throws {
    storage[request.userID] = request
  }

  func loadLatest(userID: String) async throws -> AccountDeletionRequest? {
    storage[userID]
  }
}

private actor FailingAccountDeletionRequestRepositoryForTests: AccountDeletionRequestRepository {
  private let error: Error

  init(error: Error) {
    self.error = error
  }

  func save(request: AccountDeletionRequest) async throws {
    throw error
  }

  func loadLatest(userID: String) async throws -> AccountDeletionRequest? {
    throw error
  }
}

private actor InMemoryUserLegalConsentRepositoryForDeleteTests: UserLegalConsentRepository {
  private var storage: [String: UserLegalConsent] = [:]

  func save(consent: UserLegalConsent) async throws {
    storage[consent.userID] = consent
  }

  func load(userID: String) async throws -> UserLegalConsent? {
    storage[userID]
  }
}
