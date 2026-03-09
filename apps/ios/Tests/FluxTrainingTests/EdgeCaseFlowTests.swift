import XCTest
@testable import FluxTraining

final class EdgeCaseFlowTests: XCTestCase {
  func test_edgeCases_failFastOnInvalidInputAndKeepDeterministicEmptySync() async throws {
    let authUseCase = CreateAuthSessionUseCase(authGateway: DemoAuthGateway())
    let authSession = try await authUseCase.execute(
      method: .email(email: "edge@flux.app", password: "123456")
    )

    let userProfileRepository = InMemoryUserProfileRepository()
    let queueRepository = InMemoryOfflineSyncQueueRepository()
    let trainingPlanRepository = InMemoryTrainingPlanRepository()
    let workoutSessionRepository = InMemoryWorkoutSessionRepository()
    let nutritionLogRepository = InMemoryNutritionLogRepository()

    let onboardingUseCase = CompleteOnboardingUseCase(userProfileRepository: userProfileRepository)
    let queueUseCase = QueueOfflineActionUseCase(repository: queueRepository)
    let syncUseCase = SyncOfflineQueueUseCase(
      repository: queueRepository,
      gateway: InMemoryOfflineSyncGateway(
        createTrainingPlanUseCase: CreateTrainingPlanUseCase(repository: trainingPlanRepository),
        createWorkoutSessionUseCase: CreateWorkoutSessionUseCase(repository: workoutSessionRepository),
        createNutritionLogUseCase: CreateNutritionLogUseCase(repository: nutritionLogRepository)
      )
    )
    let progressUseCase = BuildProgressSummaryUseCase(
      listWorkoutSessionsUseCase: ListWorkoutSessionsUseCase(repository: workoutSessionRepository),
      listNutritionLogsUseCase: ListNutritionLogsUseCase(repository: nutritionLogRepository)
    )

    XCTAssertEqual(authSession.userID, "edge@flux.app")

    do {
      _ = try await onboardingUseCase.execute(
        userID: authSession.userID,
        goal: .fatLoss,
        onboardingProfile: OnboardingProfileInput(
          displayName: "Edge",
          age: 16,
          heightCm: 170,
          weightKg: 70,
          availableDaysPerWeek: 3,
          equipment: [],
          injuries: []
        ),
        responses: [ParQResponse(questionID: "parq-1", answer: false)]
      )
      XCTFail("Expected invalidAge error")
    } catch let error as CompleteOnboardingError {
      XCTAssertEqual(error, .invalidAge)
    }

    do {
      try await queueUseCase.execute(
        action: .createTrainingPlan(
          QueuedTrainingPlanInput(
            id: "plan-edge-1",
            userID: "",
            name: "Edge Plan",
            weeks: 4,
            days: []
          )
        )
      )
      XCTFail("Expected missingUserID error")
    } catch let error as QueueOfflineActionUseCaseError {
      XCTAssertEqual(error, .missingUserID)
    }

    do {
      _ = try await syncUseCase.execute(userID: "")
      XCTFail("Expected missingUserID error")
    } catch let error as SyncOfflineQueueUseCaseError {
      XCTAssertEqual(error, .missingUserID)
    }

    do {
      _ = try await progressUseCase.execute(userID: "")
      XCTFail("Expected missingUserID error")
    } catch let error as BuildProgressSummaryUseCaseError {
      XCTAssertEqual(error, .missingUserID)
    }

    let emptySyncResult = try await syncUseCase.execute(userID: authSession.userID)
    XCTAssertTrue(emptySyncResult.acceptedIDs.isEmpty)
    XCTAssertTrue(emptySyncResult.rejected.isEmpty)
    XCTAssertNil(emptySyncResult.idempotency)
  }
}
