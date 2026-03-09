import Foundation
import Observation

public struct OnboardingConsentChecklist: Sendable, Equatable {
  public var privacyPolicyAccepted: Bool
  public var termsAccepted: Bool
  public var medicalDisclaimerAccepted: Bool

  public init(
    privacyPolicyAccepted: Bool,
    termsAccepted: Bool,
    medicalDisclaimerAccepted: Bool
  ) {
    self.privacyPolicyAccepted = privacyPolicyAccepted
    self.termsAccepted = termsAccepted
    self.medicalDisclaimerAccepted = medicalDisclaimerAccepted
  }

  public var isComplete: Bool {
    privacyPolicyAccepted && termsAccepted && medicalDisclaimerAccepted
  }
}

@MainActor
@Observable
public final class OnboardingViewModel {
  public var displayName: String = ""
  public var age: Int = 18
  public var heightCm: Double = 170
  public var weightKg: Double = 70
  public var availableDaysPerWeek: Int = 3
  public var sessionDurationMinutes: Int = 45
  public var selectedGoal: TrainingGoal = .recomposition
  public var parQChestPainAnswer: Bool = false
  public var parQDizzinessAnswer: Bool = false
  public var parQBoneOrJointIssue: Bool = false
  public var onboardingPrivacyPolicyAccepted: Bool = false
  public var onboardingTermsAccepted: Bool = false
  public var onboardingMedicalDisclaimerAccepted: Bool = false
  public var parQResponses: [ParQResponse] = []
  public private(set) var onboardingStatus: String = "idle"

  private let completeOnboardingUseCase: CompleteOnboardingUseCase

  public init(completeOnboardingUseCase: CompleteOnboardingUseCase) {
    self.completeOnboardingUseCase = completeOnboardingUseCase
  }

  public func saveStepOne() {
    let trimmedDisplayName = displayName.trimmingCharacters(in: .whitespacesAndNewlines)
    guard trimmedDisplayName.isEmpty == false else {
      onboardingStatus = "validation_error"
      return
    }

    guard age >= 18, heightCm > 0, weightKg > 0, (1...7).contains(availableDaysPerWeek) else {
      onboardingStatus = "validation_error"
      return
    }

    displayName = trimmedDisplayName
    onboardingStatus = "saved"
  }

  public func saveGoalSetup() {
    guard (1...7).contains(availableDaysPerWeek) else {
      onboardingStatus = "validation_error"
      return
    }

    guard (15...120).contains(sessionDurationMinutes) else {
      onboardingStatus = "validation_error"
      return
    }

    onboardingStatus = "success"
  }

  public func saveParQ() {
    onboardingStatus = "loading"
    parQResponses = [
      ParQResponse(questionID: "parq-chest-pain", answer: parQChestPainAnswer),
      ParQResponse(questionID: "parq-dizziness", answer: parQDizzinessAnswer),
      ParQResponse(questionID: "parq-bone-joint", answer: parQBoneOrJointIssue)
    ]
    onboardingStatus = "success"
  }

  public func saveConsentStep() {
    onboardingStatus = "loading"
    let consentChecklist = OnboardingConsentChecklist(
      privacyPolicyAccepted: onboardingPrivacyPolicyAccepted,
      termsAccepted: onboardingTermsAccepted,
      medicalDisclaimerAccepted: onboardingMedicalDisclaimerAccepted
    )
    onboardingStatus = consentChecklist.isComplete ? "success" : "consent_required"
  }

  public func complete(userID: String, consent: OnboardingConsentChecklist) async {
    guard consent.isComplete else {
      onboardingStatus = "consent_required"
      return
    }

    let trimmedDisplayName = displayName.trimmingCharacters(in: .whitespacesAndNewlines)
    guard trimmedDisplayName.isEmpty == false else {
      onboardingStatus = "validation_error"
      return
    }
    guard age >= 18, heightCm > 0, weightKg > 0, (1...7).contains(availableDaysPerWeek) else {
      onboardingStatus = "validation_error"
      return
    }
    guard parQResponses.isEmpty == false else {
      onboardingStatus = "validation_error"
      return
    }

    onboardingStatus = "loading"
    do {
      let _ = try await completeOnboardingUseCase.execute(
        userID: userID,
        goal: selectedGoal,
        onboardingProfile: OnboardingProfileInput(
          displayName: trimmedDisplayName,
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
