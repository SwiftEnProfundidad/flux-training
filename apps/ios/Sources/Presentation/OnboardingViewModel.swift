import Foundation
import Observation

@MainActor
@Observable
public final class OnboardingViewModel {
  public var displayName: String = ""
  public var age: Int = 18
  public var heightCm: Double = 170
  public var weightKg: Double = 70
  public var availableDaysPerWeek: Int = 3
  public var selectedGoal: TrainingGoal = .recomposition
  public var parQResponses: [ParQResponse] = []
  public private(set) var onboardingStatus: String = "idle"

  private let completeOnboardingUseCase: CompleteOnboardingUseCase

  public init(completeOnboardingUseCase: CompleteOnboardingUseCase) {
    self.completeOnboardingUseCase = completeOnboardingUseCase
  }

  public func complete(userID: String) async {
    do {
      let _ = try await completeOnboardingUseCase.execute(
        userID: userID,
        goal: selectedGoal,
        onboardingProfile: OnboardingProfileInput(
          displayName: displayName,
          age: age,
          heightCm: heightCm,
          weightKg: weightKg,
          availableDaysPerWeek: availableDaysPerWeek,
          equipment: ["dumbbells"],
          injuries: []
        ),
        responses: parQResponses
      )
      onboardingStatus = "saved"
    } catch {
      onboardingStatus = "error"
    }
  }
}

