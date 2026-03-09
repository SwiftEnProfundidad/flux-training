import XCTest
@testable import FluxTraining

final class BlockedActionBackendContractTests: XCTestCase {
  private let validInput = DomainPayloadValidationInput(
    userID: "demo-user",
    goal: "recomposition",
    onboardingDisplayName: "Juan",
    onboardingAge: 35,
    onboardingHeightCm: 178,
    onboardingWeightKg: 84,
    onboardingAvailableDaysPerWeek: 4,
    onboardingParQResponsesCount: 2,
    selectedPlanID: "plan-1",
    selectedExerciseID: "goblet-squat",
    nutritionDate: "2026-02-26",
    calories: 2200,
    proteinGrams: 150,
    carbsGrams: 230,
    fatsGrams: 70
  )

  func test_resolveRoute_mapsAllRuntimeDomains() {
    XCTAssertEqual(
      BlockedActionBackendContract.resolveRoute(for: .onboarding),
      "/api/completeOnboarding"
    )
    XCTAssertEqual(
      BlockedActionBackendContract.resolveRoute(for: .training),
      "/api/createWorkoutSession"
    )
    XCTAssertEqual(
      BlockedActionBackendContract.resolveRoute(for: .nutrition),
      "/api/createNutritionLog"
    )
    XCTAssertEqual(
      BlockedActionBackendContract.resolveRoute(for: .progress),
      "/api/getProgressSummary"
    )
    XCTAssertEqual(
      BlockedActionBackendContract.resolveRoute(for: .operations),
      "/api/processSyncQueue"
    )
    XCTAssertEqual(
      BlockedActionBackendContract.resolveRoute(for: .all),
      "/api/health"
    )
  }

  func test_resolvePayloadValidation_returnsInvalidWhenTrainingPayloadIsIncomplete() {
    let validation = BlockedActionBackendContract.resolvePayloadValidation(
      for: .training,
      input: DomainPayloadValidationInput(
        userID: validInput.userID,
        goal: validInput.goal,
        onboardingDisplayName: validInput.onboardingDisplayName,
        onboardingAge: validInput.onboardingAge,
        onboardingHeightCm: validInput.onboardingHeightCm,
        onboardingWeightKg: validInput.onboardingWeightKg,
        onboardingAvailableDaysPerWeek: validInput.onboardingAvailableDaysPerWeek,
        onboardingParQResponsesCount: validInput.onboardingParQResponsesCount,
        selectedPlanID: "",
        selectedExerciseID: validInput.selectedExerciseID,
        nutritionDate: validInput.nutritionDate,
        calories: validInput.calories,
        proteinGrams: validInput.proteinGrams,
        carbsGrams: validInput.carbsGrams,
        fatsGrams: validInput.fatsGrams
      )
    )

    XCTAssertEqual(validation.contract, "workoutSessionInputSchema")
    XCTAssertEqual(validation.status, .invalid)
    XCTAssertTrue(validation.missingFields.contains("planId"))
  }

  func test_resolvePayloadValidation_returnsValidWhenNutritionPayloadMatchesContract() {
    let validation = BlockedActionBackendContract.resolvePayloadValidation(
      for: .nutrition,
      input: validInput
    )

    XCTAssertEqual(validation.contract, "nutritionLogSchema")
    XCTAssertEqual(validation.status, .valid)
    XCTAssertEqual(validation.missingFields, "none")
  }
}
