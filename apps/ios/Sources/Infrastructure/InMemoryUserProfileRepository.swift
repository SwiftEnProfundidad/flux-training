import Foundation

public actor InMemoryUserProfileRepository: UserProfileRepository {
  private var profiles: [UserProfile] = []

  public init() {}

  public func save(profile: UserProfile) async throws {
    profiles.append(profile)
  }

  public func allProfiles() async -> [UserProfile] {
    profiles
  }
}

