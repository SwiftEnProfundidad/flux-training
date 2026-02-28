import Foundation

public enum CompleteOnboardingError: Error, Equatable {
  case emptyUserID
  case emptyDisplayName
  case invalidAge
  case invalidHeight
  case invalidWeight
  case invalidDaysPerWeek
}

public struct CompleteOnboardingUseCase: Sendable {
  private let userProfileRepository: any UserProfileRepository
  private let evaluateParQUseCase: EvaluateParQUseCase

  public init(
    userProfileRepository: any UserProfileRepository,
    evaluateParQUseCase: EvaluateParQUseCase = EvaluateParQUseCase()
  ) {
    self.userProfileRepository = userProfileRepository
    self.evaluateParQUseCase = evaluateParQUseCase
  }

  public func execute(
    userID: String,
    goal: TrainingGoal,
    onboardingProfile: OnboardingProfileInput,
    responses: [ParQResponse]
  ) async throws -> OnboardingResult {
    guard userID.isEmpty == false else { throw CompleteOnboardingError.emptyUserID }
    guard onboardingProfile.displayName.isEmpty == false else {
      throw CompleteOnboardingError.emptyDisplayName
    }
    guard onboardingProfile.age >= 18 else { throw CompleteOnboardingError.invalidAge }
    guard onboardingProfile.heightCm > 0 else { throw CompleteOnboardingError.invalidHeight }
    guard onboardingProfile.weightKg > 0 else { throw CompleteOnboardingError.invalidWeight }
    guard (1...7).contains(onboardingProfile.availableDaysPerWeek) else {
      throw CompleteOnboardingError.invalidDaysPerWeek
    }

    let profile = UserProfile(
      id: userID,
      displayName: onboardingProfile.displayName,
      goal: goal,
      age: onboardingProfile.age,
      heightCm: onboardingProfile.heightCm,
      weightKg: onboardingProfile.weightKg,
      createdAt: Date()
    )
    try await userProfileRepository.save(profile: profile)
    let screening = try evaluateParQUseCase.execute(userID: userID, responses: responses)
    return OnboardingResult(profile: profile, screening: screening)
  }
}

