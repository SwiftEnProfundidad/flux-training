import XCTest
@testable import FluxTraining

@MainActor
final class OnboardingViewModelTests: XCTestCase {
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
