import XCTest
@testable import FluxTraining

final class CompleteOnboardingUseCaseTests: XCTestCase {
  func test_execute_savesProfileAndReturnsScreening() async throws {
    let userProfileRepository = InMemoryUserProfileRepository()
    let useCase = CompleteOnboardingUseCase(userProfileRepository: userProfileRepository)

    let result = try await useCase.execute(
      userID: "user-1",
      goal: .recomposition,
      onboardingProfile: OnboardingProfileInput(
        displayName: "Juan",
        age: 35,
        heightCm: 178,
        weightKg: 84,
        availableDaysPerWeek: 4,
        equipment: ["dumbbells"],
        injuries: []
      ),
      responses: [
        ParQResponse(questionID: "parq-1", answer: false),
        ParQResponse(questionID: "parq-2", answer: true)
      ]
    )

    let allProfiles = await userProfileRepository.allProfiles()

    XCTAssertEqual(result.profile.id, "user-1")
    XCTAssertEqual(result.screening.risk, .moderate)
    XCTAssertEqual(allProfiles.count, 1)
  }
}

