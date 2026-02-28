import XCTest
@testable import FluxTraining

final class CriticalRegressionFlowTests: XCTestCase {
  func test_criticalFlow_onboardingOfflineSyncProgressAndObservability() async throws {
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
    let progressUseCase = BuildProgressSummaryUseCase(
      listWorkoutSessionsUseCase: ListWorkoutSessionsUseCase(repository: workoutSessionRepository),
      listNutritionLogsUseCase: ListNutritionLogsUseCase(repository: nutritionLogRepository)
    )
    let createAnalyticsEventUseCase = CreateAnalyticsEventUseCase(repository: analyticsEventRepository)
    let listAnalyticsEventsUseCase = ListAnalyticsEventsUseCase(repository: analyticsEventRepository)
    let createCrashReportUseCase = CreateCrashReportUseCase(repository: crashReportRepository)
    let listCrashReportsUseCase = ListCrashReportsUseCase(repository: crashReportRepository)
    let listExerciseVideosUseCase = ListExerciseVideosUseCase(repository: exerciseVideoRepository)
    let fixedRecommendationDate = makeDate("2026-03-01T10:15:00Z")
    let generateAIRecommendationsUseCase = GenerateAIRecommendationsUseCase(
      now: { fixedRecommendationDate }
    )

    let onboardingResult = try await onboardingUseCase.execute(
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
      responses: [ParQResponse(questionID: "parq-1", answer: false)]
    )

    try await queueUseCase.execute(
      action: .createTrainingPlan(
        QueuedTrainingPlanInput(
          id: "plan-1",
          userID: "user-1",
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
      enqueuedAt: makeDate("2026-03-01T10:00:00Z")
    )

    try await queueUseCase.execute(
      action: .createWorkoutSession(
        CreateWorkoutSessionInput(
          userID: "user-1",
          planID: "plan-1",
          startedAt: makeDate("2026-03-01T08:00:00Z"),
          endedAt: makeDate("2026-03-01T08:45:00Z"),
          exercises: [
            ExerciseLog(
              exerciseID: "squat",
              sets: [SetLog(reps: 8, loadKg: 60, rpe: 8)]
            )
          ]
        )
      ),
      itemID: "queue-workout",
      enqueuedAt: makeDate("2026-03-01T10:01:00Z")
    )

    try await queueUseCase.execute(
      action: .createNutritionLog(
        NutritionLog(
          userID: "user-1",
          date: "2026-03-01",
          calories: 2200,
          proteinGrams: 150,
          carbsGrams: 230,
          fatsGrams: 70
        )
      ),
      itemID: "queue-nutrition",
      enqueuedAt: makeDate("2026-03-01T10:02:00Z")
    )

    let pendingBeforeSync = try await queueUseCase.list(userID: "user-1")
    let syncResult = try await syncUseCase.execute(userID: "user-1")
    let progressSummary = try await progressUseCase.execute(
      userID: "user-1",
      generatedAt: makeDate("2026-03-01T10:10:00Z")
    )

    _ = try await createAnalyticsEventUseCase.execute(
      event: AnalyticsEvent(
        userID: "user-1",
        name: "critical_regression_passed",
        source: .ios,
        occurredAt: makeDate("2026-03-01T10:11:00Z"),
        attributes: ["planID": "plan-1"]
      )
    )

    _ = try await createCrashReportUseCase.execute(
      report: CrashReport(
        userID: "user-1",
        source: .ios,
        message: "Simulated warning",
        stackTrace: "CriticalRegressionFlowTests.swift",
        severity: .warning,
        occurredAt: makeDate("2026-03-01T10:12:00Z")
      )
    )

    let analyticsEvents = try await listAnalyticsEventsUseCase.execute(userID: "user-1")
    let crashReports = try await listCrashReportsUseCase.execute(userID: "user-1")
    let exerciseVideos = try await listExerciseVideosUseCase.execute(
      exerciseID: "goblet-squat",
      locale: "es-ES"
    )
    let aiRecommendations = await generateAIRecommendationsUseCase.execute(
      userID: "user-1",
      goal: .recomposition,
      pendingQueueCount: 2,
      daysSinceLastWorkout: 3,
      recentCompletionRate: 0.5,
      locale: "es-ES"
    )

    XCTAssertEqual(onboardingResult.profile.id, "user-1")
    XCTAssertEqual(pendingBeforeSync.count, 3)
    XCTAssertEqual(syncResult.acceptedIDs, ["queue-plan", "queue-workout", "queue-nutrition"])
    XCTAssertTrue(syncResult.rejected.isEmpty)
    XCTAssertEqual(progressSummary.workoutSessionsCount, 1)
    XCTAssertEqual(progressSummary.nutritionLogsCount, 1)
    XCTAssertEqual(progressSummary.history.count, 1)
    XCTAssertFalse(exerciseVideos.isEmpty)
    XCTAssertEqual(aiRecommendations.first?.priority, .high)
    XCTAssertEqual(analyticsEvents.count, 1)
    XCTAssertEqual(crashReports.count, 1)
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
