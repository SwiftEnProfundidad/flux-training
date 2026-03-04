import Foundation

public enum SaveUserProfileError: Error, Equatable {
  case invalidUserID
  case invalidDisplayName
  case invalidAge
  case invalidHeight
  case invalidWeight
}

public struct SaveUserProfileUseCase: Sendable {
  private let repository: any UserProfileRepository

  public init(repository: any UserProfileRepository) {
    self.repository = repository
  }

  public func execute(profile: UserProfile) async throws {
    let resolvedUserID = profile.id.trimmingCharacters(in: .whitespacesAndNewlines)
    guard resolvedUserID.isEmpty == false else {
      throw SaveUserProfileError.invalidUserID
    }
    guard profile.displayName.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty == false else {
      throw SaveUserProfileError.invalidDisplayName
    }
    guard profile.age >= 18 else {
      throw SaveUserProfileError.invalidAge
    }
    guard profile.heightCm > 0 else {
      throw SaveUserProfileError.invalidHeight
    }
    guard profile.weightKg > 0 else {
      throw SaveUserProfileError.invalidWeight
    }

    try await repository.save(
      profile: UserProfile(
        id: resolvedUserID,
        displayName: profile.displayName.trimmingCharacters(in: .whitespacesAndNewlines),
        goal: profile.goal,
        age: profile.age,
        heightCm: profile.heightCm,
        weightKg: profile.weightKg,
        createdAt: profile.createdAt
      )
    )
  }
}
