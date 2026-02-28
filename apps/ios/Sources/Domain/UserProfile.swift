import Foundation

public enum TrainingGoal: String, Sendable, Equatable {
  case fatLoss
  case recomposition
  case muscleGain
  case habit
}

public struct UserProfile: Sendable, Equatable {
  public let id: String
  public let displayName: String
  public let goal: TrainingGoal
  public let age: Int
  public let heightCm: Double
  public let weightKg: Double
  public let createdAt: Date

  public init(
    id: String,
    displayName: String,
    goal: TrainingGoal,
    age: Int,
    heightCm: Double,
    weightKg: Double,
    createdAt: Date
  ) {
    self.id = id
    self.displayName = displayName
    self.goal = goal
    self.age = age
    self.heightCm = heightCm
    self.weightKg = weightKg
    self.createdAt = createdAt
  }
}

public struct OnboardingProfileInput: Sendable, Equatable {
  public let displayName: String
  public let age: Int
  public let heightCm: Double
  public let weightKg: Double
  public let availableDaysPerWeek: Int
  public let equipment: [String]
  public let injuries: [String]

  public init(
    displayName: String,
    age: Int,
    heightCm: Double,
    weightKg: Double,
    availableDaysPerWeek: Int,
    equipment: [String],
    injuries: [String]
  ) {
    self.displayName = displayName
    self.age = age
    self.heightCm = heightCm
    self.weightKg = weightKg
    self.availableDaysPerWeek = availableDaysPerWeek
    self.equipment = equipment
    self.injuries = injuries
  }
}

public struct OnboardingResult: Sendable, Equatable {
  public let profile: UserProfile
  public let screening: HealthScreening

  public init(profile: UserProfile, screening: HealthScreening) {
    self.profile = profile
    self.screening = screening
  }
}

public protocol UserProfileRepository: Sendable {
  func save(profile: UserProfile) async throws
}

