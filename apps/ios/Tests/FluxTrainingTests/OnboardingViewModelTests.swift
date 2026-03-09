import XCTest
@testable import FluxTraining

@MainActor
final class OnboardingViewModelTests: XCTestCase {
  func test_saveStepOne_withValidProfile_setsSavedStatus() {
    let userProfileRepository = InMemoryUserProfileRepository()
    let useCase = CompleteOnboardingUseCase(userProfileRepository: userProfileRepository)
    let viewModel = OnboardingViewModel(completeOnboardingUseCase: useCase)
    viewModel.displayName = "Juan"
    viewModel.age = 35
    viewModel.heightCm = 178
    viewModel.weightKg = 84
    viewModel.availableDaysPerWeek = 4

    viewModel.saveStepOne()

    XCTAssertEqual(viewModel.onboardingStatus, "saved")
  }

  func test_saveStepOne_withInvalidProfile_setsValidationError() {
    let userProfileRepository = InMemoryUserProfileRepository()
    let useCase = CompleteOnboardingUseCase(userProfileRepository: userProfileRepository)
    let viewModel = OnboardingViewModel(completeOnboardingUseCase: useCase)
    viewModel.displayName = " "
    viewModel.age = 17
    viewModel.heightCm = 0
    viewModel.weightKg = 0
    viewModel.availableDaysPerWeek = 0

    viewModel.saveStepOne()

    XCTAssertEqual(viewModel.onboardingStatus, "validation_error")
  }

  func test_saveGoalSetup_withValidValues_setsSuccessStatus() {
    let userProfileRepository = InMemoryUserProfileRepository()
    let useCase = CompleteOnboardingUseCase(userProfileRepository: userProfileRepository)
    let viewModel = OnboardingViewModel(completeOnboardingUseCase: useCase)
    viewModel.selectedGoal = .muscleGain
    viewModel.availableDaysPerWeek = 5
    viewModel.sessionDurationMinutes = 60

    viewModel.saveGoalSetup()

    XCTAssertEqual(viewModel.onboardingStatus, "success")
  }

  func test_saveGoalSetup_withInvalidValues_setsValidationError() {
    let userProfileRepository = InMemoryUserProfileRepository()
    let useCase = CompleteOnboardingUseCase(userProfileRepository: userProfileRepository)
    let viewModel = OnboardingViewModel(completeOnboardingUseCase: useCase)
    viewModel.selectedGoal = .fatLoss
    viewModel.availableDaysPerWeek = 0
    viewModel.sessionDurationMinutes = 10

    viewModel.saveGoalSetup()

    XCTAssertEqual(viewModel.onboardingStatus, "validation_error")
  }

  func test_saveParQ_setsResponsesAndSuccessStatus() {
    let userProfileRepository = InMemoryUserProfileRepository()
    let useCase = CompleteOnboardingUseCase(userProfileRepository: userProfileRepository)
    let viewModel = OnboardingViewModel(completeOnboardingUseCase: useCase)
    viewModel.parQChestPainAnswer = true
    viewModel.parQDizzinessAnswer = false
    viewModel.parQBoneOrJointIssue = true

    viewModel.saveParQ()

    XCTAssertEqual(viewModel.onboardingStatus, "success")
    XCTAssertEqual(viewModel.parQResponses.count, 3)
    XCTAssertEqual(viewModel.parQResponses[0], ParQResponse(questionID: "parq-chest-pain", answer: true))
    XCTAssertEqual(viewModel.parQResponses[1], ParQResponse(questionID: "parq-dizziness", answer: false))
    XCTAssertEqual(viewModel.parQResponses[2], ParQResponse(questionID: "parq-bone-joint", answer: true))
  }

  func test_saveConsentStep_whenComplete_setsSuccessStatus() {
    let userProfileRepository = InMemoryUserProfileRepository()
    let useCase = CompleteOnboardingUseCase(userProfileRepository: userProfileRepository)
    let viewModel = OnboardingViewModel(completeOnboardingUseCase: useCase)
    viewModel.onboardingPrivacyPolicyAccepted = true
    viewModel.onboardingTermsAccepted = true
    viewModel.onboardingMedicalDisclaimerAccepted = true

    viewModel.saveConsentStep()

    XCTAssertEqual(viewModel.onboardingStatus, "success")
  }

  func test_saveConsentStep_whenIncomplete_setsConsentRequiredStatus() {
    let userProfileRepository = InMemoryUserProfileRepository()
    let useCase = CompleteOnboardingUseCase(userProfileRepository: userProfileRepository)
    let viewModel = OnboardingViewModel(completeOnboardingUseCase: useCase)
    viewModel.onboardingPrivacyPolicyAccepted = true
    viewModel.onboardingTermsAccepted = false
    viewModel.onboardingMedicalDisclaimerAccepted = true

    viewModel.saveConsentStep()

    XCTAssertEqual(viewModel.onboardingStatus, "consent_required")
  }

  func test_complete_setsSavedStatus() async {
    let userProfileRepository = InMemoryUserProfileRepository()
    let useCase = CompleteOnboardingUseCase(userProfileRepository: userProfileRepository)
    let viewModel = OnboardingViewModel(completeOnboardingUseCase: useCase)
    viewModel.displayName = "Juan"
    viewModel.age = 35
    viewModel.heightCm = 178
    viewModel.weightKg = 84
    viewModel.availableDaysPerWeek = 4
    viewModel.selectedGoal = .recomposition
    viewModel.parQResponses = [
      ParQResponse(questionID: "parq-1", answer: false),
      ParQResponse(questionID: "parq-2", answer: true)
    ]

    await viewModel.complete(
      userID: "user-1",
      consent: OnboardingConsentChecklist(
        privacyPolicyAccepted: true,
        termsAccepted: true,
        medicalDisclaimerAccepted: true
      )
    )

    XCTAssertEqual(viewModel.onboardingStatus, "saved")
  }

  func test_complete_withoutConsent_setsConsentRequiredStatus() async {
    let userProfileRepository = InMemoryUserProfileRepository()
    let useCase = CompleteOnboardingUseCase(userProfileRepository: userProfileRepository)
    let viewModel = OnboardingViewModel(completeOnboardingUseCase: useCase)
    viewModel.displayName = "Juan"
    viewModel.age = 35
    viewModel.heightCm = 178
    viewModel.weightKg = 84
    viewModel.availableDaysPerWeek = 4
    viewModel.parQResponses = [
      ParQResponse(questionID: "parq-1", answer: false),
      ParQResponse(questionID: "parq-2", answer: false)
    ]

    await viewModel.complete(
      userID: "user-1",
      consent: OnboardingConsentChecklist(
        privacyPolicyAccepted: false,
        termsAccepted: true,
        medicalDisclaimerAccepted: true
      )
    )

    XCTAssertEqual(viewModel.onboardingStatus, "consent_required")
  }

  func test_complete_withInvalidProfile_setsValidationError() async {
    let userProfileRepository = InMemoryUserProfileRepository()
    let useCase = CompleteOnboardingUseCase(userProfileRepository: userProfileRepository)
    let viewModel = OnboardingViewModel(completeOnboardingUseCase: useCase)
    viewModel.displayName = "  "
    viewModel.age = 16
    viewModel.availableDaysPerWeek = 0
    viewModel.parQResponses = []

    await viewModel.complete(
      userID: "user-1",
      consent: OnboardingConsentChecklist(
        privacyPolicyAccepted: true,
        termsAccepted: true,
        medicalDisclaimerAccepted: true
      )
    )

    XCTAssertEqual(viewModel.onboardingStatus, "validation_error")
  }
}
