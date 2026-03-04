import Foundation

public actor InMemoryUserProfileRepository: UserProfileRepository {
  private var profilesByUserID: [String: UserProfile] = [:]

  public init() {}

  public func save(profile: UserProfile) async throws {
    profilesByUserID[profile.id] = profile
  }

  public func load(userID: String) async throws -> UserProfile? {
    profilesByUserID[userID]
  }

  public func allProfiles() async -> [UserProfile] {
    Array(profilesByUserID.values)
  }
}
