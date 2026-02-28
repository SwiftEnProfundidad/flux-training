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

    await viewModel.complete(userID: "user-1")

    XCTAssertEqual(viewModel.onboardingStatus, "saved")
  }
}

