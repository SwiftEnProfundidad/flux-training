import XCTest
@testable import FluxTraining

final class HappyPathFlowTests: XCTestCase {
  func test_happyPath_authOnboardingSyncProgressAndObservability() async throws {
    let authUseCase = CreateAuthSessionUseCase(authGateway: DemoAuthGateway())
    let authSession = try await authUseCase.execute(
      method: .email(email: "happy@flux.app", password: "123456")
    )

    let userProfileRepository = InMemoryUserProfileRepository()
    let trainingPlanRepository = InMemoryTrainingPlanRepository()
    let workoutSessionRepository = InMemoryWorkoutSessionRepository()
    let nutritionLogRepository = InMemoryNutritionLogRepository()
    let analyticsEventRepository = InMemoryAnalyticsEventRepository()
    let crashReportRepository = InMemoryCrashReportRepository()
    let exerciseVideoRepository = InMemoryExerciseVideoRepository()
    let queueRepository = InMemoryOfflineSyncQueueRepository()

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
    let listPlansUseCase = ListTrainingPlansUseCase(repository: trainingPlanRepository)
    let listWorkoutSessionsUseCase = ListWorkoutSessionsUseCase(repository: workoutSessionRepository)
    let listNutritionLogsUseCase = ListNutritionLogsUseCase(repository: nutritionLogRepository)
    let progressUseCase = BuildProgressSummaryUseCase(
      listWorkoutSessionsUseCase: listWorkoutSessionsUseCase,
      listNutritionLogsUseCase: listNutritionLogsUseCase
    )
    let createAnalyticsEventUseCase = CreateAnalyticsEventUseCase(repository: analyticsEventRepository)
    let listAnalyticsEventsUseCase = ListAnalyticsEventsUseCase(repository: analyticsEventRepository)
    let createCrashReportUseCase = CreateCrashReportUseCase(repository: crashReportRepository)
    let listCrashReportsUseCase = ListCrashReportsUseCase(repository: crashReportRepository)
    let listExerciseVideosUseCase = ListExerciseVideosUseCase(repository: exerciseVideoRepository)
    let fixedRecommendationDate = makeDate("2026-03-02T18:15:00Z")
    let generateAIRecommendationsUseCase = GenerateAIRecommendationsUseCase(
      now: { fixedRecommendationDate }
    )

    let onboardingResult = try await onboardingUseCase.execute(
      userID: authSession.userID,
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
      responses: [ParQResponse(questionID: "parq-1", answer: false)]
    )

    try await queueUseCase.execute(
      action: .createTrainingPlan(
        QueuedTrainingPlanInput(
          id: "plan-happy-1",
          userID: authSession.userID,
          name: "Starter Plan",
          weeks: 4,
          days: [
            TrainingPlanDay(
              dayIndex: 1,
              exercises: [TrainingPlanExercise(exerciseID: "squat", targetSets: 4, targetReps: 8)]
            )
          ]
        )
      ),
      itemID: "queue-plan",
      enqueuedAt: makeDate("2026-03-02T18:00:00Z")
    )

    try await queueUseCase.execute(
      action: .createWorkoutSession(
        CreateWorkoutSessionInput(
          userID: authSession.userID,
          planID: "plan-happy-1",
          startedAt: makeDate("2026-03-02T07:00:00Z"),
          endedAt: makeDate("2026-03-02T07:40:00Z"),
          exercises: [ExerciseLog(exerciseID: "squat", sets: [SetLog(reps: 8, loadKg: 65, rpe: 8)])]
        )
      ),
      itemID: "queue-workout",
      enqueuedAt: makeDate("2026-03-02T18:01:00Z")
    )

    try await queueUseCase.execute(
      action: .createNutritionLog(
        NutritionLog(
          userID: authSession.userID,
          date: "2026-03-02",
          calories: 2200,
          proteinGrams: 150,
          carbsGrams: 230,
          fatsGrams: 70
        )
      ),
      itemID: "queue-nutrition",
      enqueuedAt: makeDate("2026-03-02T18:02:00Z")
    )

    let pendingBeforeSync = try await queueUseCase.list(userID: authSession.userID)
    let syncResult = try await syncUseCase.execute(userID: authSession.userID)
    let plans = try await listPlansUseCase.execute(userID: authSession.userID)
    let sessions = try await listWorkoutSessionsUseCase.execute(userID: authSession.userID)
    let nutritionLogs = try await listNutritionLogsUseCase.execute(userID: authSession.userID)
    let progressSummary = try await progressUseCase.execute(
      userID: authSession.userID,
      generatedAt: makeDate("2026-03-02T18:10:00Z")
    )

    _ = try await createAnalyticsEventUseCase.execute(
      event: AnalyticsEvent(
        userID: authSession.userID,
        name: "happy_path_completed",
        source: .ios,
        occurredAt: makeDate("2026-03-02T18:11:00Z"),
        attributes: ["planID": "plan-happy-1"]
      )
    )

    _ = try await createCrashReportUseCase.execute(
      report: CrashReport(
        userID: authSession.userID,
        source: .ios,
        message: "No-op warning",
        stackTrace: "HappyPathFlowTests.swift",
        severity: .warning,
        occurredAt: makeDate("2026-03-02T18:12:00Z")
      )
    )

    let analyticsEvents = try await listAnalyticsEventsUseCase.execute(userID: authSession.userID)
    let crashReports = try await listCrashReportsUseCase.execute(userID: authSession.userID)
    let exerciseVideos = try await listExerciseVideosUseCase.execute(
      exerciseID: "goblet-squat",
      locale: "es-ES"
    )
    let aiRecommendations = await generateAIRecommendationsUseCase.execute(
      userID: authSession.userID,
      goal: .recomposition,
      pendingQueueCount: 0,
      daysSinceLastWorkout: 3,
      recentCompletionRate: 0.8,
      locale: "es-ES"
    )

    XCTAssertEqual(authSession.userID, "happy@flux.app")
    XCTAssertEqual(onboardingResult.profile.id, "happy@flux.app")
    XCTAssertEqual(pendingBeforeSync.count, 3)
    XCTAssertEqual(syncResult.acceptedIDs, ["queue-plan", "queue-workout", "queue-nutrition"])
    XCTAssertTrue(syncResult.rejected.isEmpty)
    XCTAssertEqual(syncResult.idempotency?.replayed, false)
    XCTAssertEqual(syncResult.idempotency?.ttlSeconds, 300)
    XCTAssertEqual(plans.count, 1)
    XCTAssertEqual(sessions.count, 1)
    XCTAssertEqual(nutritionLogs.count, 1)
    XCTAssertEqual(progressSummary.workoutSessionsCount, 1)
    XCTAssertEqual(progressSummary.nutritionLogsCount, 1)
    XCTAssertEqual(analyticsEvents.count, 1)
    XCTAssertEqual(crashReports.count, 1)
    XCTAssertFalse(exerciseVideos.isEmpty)
    XCTAssertFalse(aiRecommendations.isEmpty)
    XCTAssertEqual(aiRecommendations.first?.priority, .high)
  }

  private func makeDate(_ raw: String) -> Date {
    let formatter = ISO8601DateFormatter()
    guard let date = formatter.date(from: raw) else {
      XCTFail("Invalid date: \(raw)")
      return Date()
    }
    return date
  }
}
