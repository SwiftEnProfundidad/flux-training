import Foundation

public enum AuthScreenStatus: String, Sendable, Equatable {
  case idle
  case loading
  case success
  case error
  case offline
  case denied
}

public enum OnboardingScreenStatus: String, Sendable, Equatable {
  case idle
  case loading
  case success
  case error
  case offline
  case denied
}

public struct AuthScreenContract: Sendable, Equatable {
  public var email: String
  public var password: String
  public var rememberMe: Bool
  public var status: AuthScreenStatus

  public init(
    email: String = "",
    password: String = "",
    rememberMe: Bool = false,
    status: AuthScreenStatus = .idle
  ) {
    self.email = email
    self.password = password
    self.rememberMe = rememberMe
    self.status = status
  }
}

public struct OnboardingScreenContract: Sendable, Equatable {
  public var displayName: String
  public var age: Int
  public var heightCm: Int
  public var weightKg: Int
  public var availableDaysPerWeek: Int
  public var goal: TrainingGoal
  public var parQQuestionOne: Bool
  public var parQQuestionTwo: Bool
  public var privacyPolicyAccepted: Bool
  public var termsAccepted: Bool
  public var medicalDisclaimerAccepted: Bool
  public var status: OnboardingScreenStatus

  public init(
    displayName: String = "",
    age: Int = 0,
    heightCm: Int = 0,
    weightKg: Int = 0,
    availableDaysPerWeek: Int = 0,
    goal: TrainingGoal = .recomposition,
    parQQuestionOne: Bool = false,
    parQQuestionTwo: Bool = false,
    privacyPolicyAccepted: Bool = false,
    termsAccepted: Bool = false,
    medicalDisclaimerAccepted: Bool = false,
    status: OnboardingScreenStatus = .idle
  ) {
    self.displayName = displayName
    self.age = age
    self.heightCm = heightCm
    self.weightKg = weightKg
    self.availableDaysPerWeek = availableDaysPerWeek
    self.goal = goal
    self.parQQuestionOne = parQQuestionOne
    self.parQQuestionTwo = parQQuestionTwo
    self.privacyPolicyAccepted = privacyPolicyAccepted
    self.termsAccepted = termsAccepted
    self.medicalDisclaimerAccepted = medicalDisclaimerAccepted
    self.status = status
  }
}
