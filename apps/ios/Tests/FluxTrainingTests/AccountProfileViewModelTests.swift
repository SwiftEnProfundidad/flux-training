import Foundation
import XCTest
@testable import FluxTraining

@MainActor
final class AccountProfileViewModelTests: XCTestCase {
  func test_refresh_withNoStoredProfile_setsEmptyStatus() async {
    let repository = InMemoryUserProfileRepositoryForTests()
    let viewModel = AccountProfileViewModel(
      loadUserProfileUseCase: LoadUserProfileUseCase(repository: repository),
      saveUserProfileUseCase: SaveUserProfileUseCase(repository: repository)
    )

    await viewModel.refresh(userID: "user-1")

    XCTAssertEqual(viewModel.status, "empty")
  }

  func test_refresh_withStoredProfile_setsLoadedStatusAndValues() async throws {
    let repository = InMemoryUserProfileRepositoryForTests()
    try await repository.save(
      profile: UserProfile(
        id: "user-1",
        displayName: "Ana",
        goal: .muscleGain,
        age: 31,
        heightCm: 168,
        weightKg: 64,
        createdAt: Date()
      )
    )
    let viewModel = AccountProfileViewModel(
      loadUserProfileUseCase: LoadUserProfileUseCase(repository: repository),
      saveUserProfileUseCase: SaveUserProfileUseCase(repository: repository)
    )

    await viewModel.refresh(userID: "user-1")

    XCTAssertEqual(viewModel.status, "loaded")
    XCTAssertEqual(viewModel.displayName, "Ana")
    XCTAssertEqual(viewModel.age, 31)
    XCTAssertEqual(viewModel.heightCm, 168)
    XCTAssertEqual(viewModel.weightKg, 64)
    XCTAssertEqual(viewModel.goal, .muscleGain)
  }

  func test_save_withValidProfile_setsSavedStatusAndPersists() async throws {
    let repository = InMemoryUserProfileRepositoryForTests()
    let viewModel = AccountProfileViewModel(
      loadUserProfileUseCase: LoadUserProfileUseCase(repository: repository),
      saveUserProfileUseCase: SaveUserProfileUseCase(repository: repository)
    )

    viewModel.displayName = "Carlos"
    viewModel.age = 35
    viewModel.heightCm = 178
    viewModel.weightKg = 82
    viewModel.goal = .recomposition

    await viewModel.save(userID: "user-2")
    let profile = try await repository.load(userID: "user-2")

    XCTAssertEqual(viewModel.status, "saved")
    XCTAssertEqual(profile?.displayName, "Carlos")
    XCTAssertEqual(profile?.age, 35)
    XCTAssertEqual(profile?.heightCm, 178)
    XCTAssertEqual(profile?.weightKg, 82)
    XCTAssertEqual(profile?.goal, .recomposition)
  }

  func test_save_withInvalidProfile_setsValidationError() async {
    let repository = InMemoryUserProfileRepositoryForTests()
    let viewModel = AccountProfileViewModel(
      loadUserProfileUseCase: LoadUserProfileUseCase(repository: repository),
      saveUserProfileUseCase: SaveUserProfileUseCase(repository: repository)
    )

    viewModel.displayName = " "
    viewModel.age = 17
    viewModel.heightCm = 170
    viewModel.weightKg = 70

    await viewModel.save(userID: "user-3")

    XCTAssertEqual(viewModel.status, "validation_error")
  }

  func test_refresh_whenRepositoryIsOffline_setsOfflineStatus() async {
    let repository = FailingUserProfileRepository(error: URLError(.notConnectedToInternet))
    let viewModel = AccountProfileViewModel(
      loadUserProfileUseCase: LoadUserProfileUseCase(repository: repository),
      saveUserProfileUseCase: SaveUserProfileUseCase(repository: repository)
    )

    await viewModel.refresh(userID: "user-4")

    XCTAssertEqual(viewModel.status, "offline")
  }

  func test_refresh_whenAuthIsMissing_setsDeniedStatus() async {
    let repository = FailingUserProfileRepository(error: FluxBackendClientError.missingAuthorizationBearer)
    let viewModel = AccountProfileViewModel(
      loadUserProfileUseCase: LoadUserProfileUseCase(repository: repository),
      saveUserProfileUseCase: SaveUserProfileUseCase(repository: repository)
    )

    await viewModel.refresh(userID: "user-5")

    XCTAssertEqual(viewModel.status, "denied")
  }
}

private actor InMemoryUserProfileRepositoryForTests: UserProfileRepository {
  private var storage: [String: UserProfile] = [:]

  func save(profile: UserProfile) async throws {
    storage[profile.id] = profile
  }

  func load(userID: String) async throws -> UserProfile? {
    storage[userID]
  }
}

private actor FailingUserProfileRepository: UserProfileRepository {
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
