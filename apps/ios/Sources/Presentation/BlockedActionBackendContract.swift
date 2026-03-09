import Foundation

public enum PayloadValidationStatus: String, Sendable {
  case valid
  case invalid
}

public struct DomainPayloadValidationResult: Equatable, Sendable {
  public let contract: String
  public let status: PayloadValidationStatus
  public let missingFields: String

  public init(contract: String, status: PayloadValidationStatus, missingFields: String) {
    self.contract = contract
    self.status = status
    self.missingFields = missingFields
  }
}

public struct DomainPayloadValidationInput: Equatable, Sendable {
  public let userID: String
  public let goal: String
  public let onboardingDisplayName: String
  public let onboardingAge: Int
  public let onboardingHeightCm: Double
  public let onboardingWeightKg: Double
  public let onboardingAvailableDaysPerWeek: Int
  public let onboardingParQResponsesCount: Int
  public let selectedPlanID: String
  public let selectedExerciseID: String
  public let nutritionDate: String
  public let calories: Double
  public let proteinGrams: Double
  public let carbsGrams: Double
  public let fatsGrams: Double

  public init(
    userID: String,
    goal: String,
    onboardingDisplayName: String,
    onboardingAge: Int,
    onboardingHeightCm: Double,
    onboardingWeightKg: Double,
    onboardingAvailableDaysPerWeek: Int,
    onboardingParQResponsesCount: Int,
    selectedPlanID: String,
    selectedExerciseID: String,
    nutritionDate: String,
    calories: Double,
    proteinGrams: Double,
    carbsGrams: Double,
    fatsGrams: Double
  ) {
    self.userID = userID
    self.goal = goal
    self.onboardingDisplayName = onboardingDisplayName
    self.onboardingAge = onboardingAge
    self.onboardingHeightCm = onboardingHeightCm
    self.onboardingWeightKg = onboardingWeightKg
    self.onboardingAvailableDaysPerWeek = onboardingAvailableDaysPerWeek
    self.onboardingParQResponsesCount = onboardingParQResponsesCount
    self.selectedPlanID = selectedPlanID
    self.selectedExerciseID = selectedExerciseID
    self.nutritionDate = nutritionDate
    self.calories = calories
    self.proteinGrams = proteinGrams
    self.carbsGrams = carbsGrams
    self.fatsGrams = fatsGrams
  }
}

public enum BlockedActionBackendContract {
  public static func resolveRoute(for domain: ExperienceDomain) -> String {
    switch domain {
    case .onboarding:
      return "/api/completeOnboarding"
    case .training:
      return "/api/createWorkoutSession"
    case .nutrition:
      return "/api/createNutritionLog"
    case .progress:
      return "/api/getProgressSummary"
    case .operations:
      return "/api/processSyncQueue"
    case .all:
      return "/api/health"
    }
  }

  public static func resolvePayloadValidation(
    for domain: ExperienceDomain,
    input: DomainPayloadValidationInput
  ) -> DomainPayloadValidationResult {
    switch domain {
    case .onboarding:
      return onboardingValidation(input: input)
    case .training:
      return trainingValidation(input: input)
    case .nutrition:
      return nutritionValidation(input: input)
    case .progress:
      return progressValidation(input: input)
    case .operations:
      return operationsValidation(input: input)
    case .all:
      return DomainPayloadValidationResult(
        contract: "healthCheck",
        status: .valid,
        missingFields: "none"
      )
    }
  }

  private static func onboardingValidation(
    input: DomainPayloadValidationInput
  ) -> DomainPayloadValidationResult {
    let missing = missingFields([
      ("userId", input.userID.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty == false),
      ("goal", input.goal.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty == false),
      (
        "onboardingProfile.displayName",
        input.onboardingDisplayName.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty == false
      ),
      ("onboardingProfile.age", input.onboardingAge >= 18),
      ("onboardingProfile.heightCm", input.onboardingHeightCm > 0),
      ("onboardingProfile.weightKg", input.onboardingWeightKg > 0),
      ("onboardingProfile.availableDaysPerWeek", (1...7).contains(input.onboardingAvailableDaysPerWeek)),
      ("responses", input.onboardingParQResponsesCount >= 1)
    ])
    return result(contract: "onboardingSubmissionInputSchema", missing: missing)
  }

  private static func trainingValidation(
    input: DomainPayloadValidationInput
  ) -> DomainPayloadValidationResult {
    let missing = missingFields([
      ("userId", input.userID.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty == false),
      ("planId", input.selectedPlanID.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty == false),
      (
        "exercises.0.exerciseId",
        input.selectedExerciseID.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty == false
      )
    ])
    return result(contract: "workoutSessionInputSchema", missing: missing)
  }

  private static func nutritionValidation(
    input: DomainPayloadValidationInput
  ) -> DomainPayloadValidationResult {
    let dateIsValid = input.nutritionDate.range(
      of: #"^\d{4}-\d{2}-\d{2}$"#,
      options: .regularExpression
    ) != nil
    let missing = missingFields([
      ("userId", input.userID.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty == false),
      ("date", dateIsValid),
      ("calories", input.calories >= 0),
      ("proteinGrams", input.proteinGrams >= 0),
      ("carbsGrams", input.carbsGrams >= 0),
      ("fatsGrams", input.fatsGrams >= 0)
    ])
    return result(contract: "nutritionLogSchema", missing: missing)
  }

  private static func progressValidation(
    input: DomainPayloadValidationInput
  ) -> DomainPayloadValidationResult {
    let missing = missingFields([
      ("userId", input.userID.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty == false)
    ])
    return result(contract: "getProgressSummaryQuery", missing: missing)
  }

  private static func operationsValidation(
    input: DomainPayloadValidationInput
  ) -> DomainPayloadValidationResult {
    let missing = missingFields([
      ("userId", input.userID.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty == false)
    ])
    return result(contract: "syncQueueProcessInputSchema", missing: missing)
  }

  private static func missingFields(_ checks: [(String, Bool)]) -> [String] {
    checks.compactMap { name, isValid in
      isValid ? nil : name
    }
  }

  private static func result(contract: String, missing: [String]) -> DomainPayloadValidationResult {
    if missing.isEmpty {
      return DomainPayloadValidationResult(
        contract: contract,
        status: .valid,
        missingFields: "none"
      )
    }
    return DomainPayloadValidationResult(
      contract: contract,
      status: .invalid,
      missingFields: missing.joined(separator: ",")
    )
  }
}
