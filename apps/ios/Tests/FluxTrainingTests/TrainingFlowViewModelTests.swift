import XCTest
@testable import FluxTraining

@MainActor
final class TrainingFlowViewModelTests: XCTestCase {
  func test_refreshDashboard_setsLoadedStateAndSessionMetrics() async {
    let trainingPlanRepository = InMemoryTrainingPlanRepository()
    let workoutSessionRepository = InMemoryWorkoutSessionRepository()
    let exerciseVideoRepository = InMemoryExerciseVideoRepository()
    let viewModel = TrainingFlowViewModel(
      createTrainingPlanUseCase: CreateTrainingPlanUseCase(repository: trainingPlanRepository),
      listTrainingPlansUseCase: ListTrainingPlansUseCase(repository: trainingPlanRepository),
      createWorkoutSessionUseCase: CreateWorkoutSessionUseCase(repository: workoutSessionRepository),
      listWorkoutSessionsUseCase: ListWorkoutSessionsUseCase(repository: workoutSessionRepository),
      listExerciseVideosUseCase: ListExerciseVideosUseCase(repository: exerciseVideoRepository)
    )
    let now = Date()
    let plan = try? await CreateTrainingPlanUseCase(repository: trainingPlanRepository).execute(
      id: "plan-1",
      userID: "user-1",
      name: "Starter",
      weeks: 4,
      days: [
        TrainingPlanDay(
          dayIndex: 1,
          exercises: [TrainingPlanExercise(exerciseID: "goblet-squat", targetSets: 4, targetReps: 10)]
        )
      ]
    )
    XCTAssertNotNil(plan)
    _ = try? await CreateWorkoutSessionUseCase(repository: workoutSessionRepository).execute(
      input: CreateWorkoutSessionInput(
        userID: "user-1",
        planID: "plan-1",
        startedAt: now.addingTimeInterval(-1800),
        endedAt: now.addingTimeInterval(-600),
        exercises: [ExerciseLog(exerciseID: "goblet-squat", sets: [SetLog(reps: 10, loadKg: 20, rpe: 7)])]
      )
    )

    await viewModel.refreshDashboard(userID: "user-1", now: now)

    XCTAssertEqual(viewModel.status, "loaded")
    XCTAssertEqual(viewModel.todaySessionsCount, 1)
    XCTAssertEqual(viewModel.sessionStatus, "session_active")
    XCTAssertFalse(viewModel.plans.isEmpty)
  }

  func test_createPlanAndLogSession_updatesState() async {
    let trainingPlanRepository = InMemoryTrainingPlanRepository()
    let workoutSessionRepository = InMemoryWorkoutSessionRepository()
    let exerciseVideoRepository = InMemoryExerciseVideoRepository()
    let viewModel = TrainingFlowViewModel(
      createTrainingPlanUseCase: CreateTrainingPlanUseCase(repository: trainingPlanRepository),
      listTrainingPlansUseCase: ListTrainingPlansUseCase(repository: trainingPlanRepository),
      createWorkoutSessionUseCase: CreateWorkoutSessionUseCase(repository: workoutSessionRepository),
      listWorkoutSessionsUseCase: ListWorkoutSessionsUseCase(repository: workoutSessionRepository),
      listExerciseVideosUseCase: ListExerciseVideosUseCase(repository: exerciseVideoRepository)
    )

    await viewModel.createStarterPlan(userID: "user-1")
    await viewModel.logDemoSession(userID: "user-1")

    XCTAssertFalse(viewModel.plans.isEmpty)
    XCTAssertFalse(viewModel.sessions.isEmpty)
    XCTAssertEqual(viewModel.status, "saved")
    XCTAssertEqual(viewModel.sessionStatus, "session_active")
  }

  func test_createStarterPlan_withEmptyName_setsValidationError() async {
    let trainingPlanRepository = InMemoryTrainingPlanRepository()
    let workoutSessionRepository = InMemoryWorkoutSessionRepository()
    let exerciseVideoRepository = InMemoryExerciseVideoRepository()
    let viewModel = TrainingFlowViewModel(
      createTrainingPlanUseCase: CreateTrainingPlanUseCase(repository: trainingPlanRepository),
      listTrainingPlansUseCase: ListTrainingPlansUseCase(repository: trainingPlanRepository),
      createWorkoutSessionUseCase: CreateWorkoutSessionUseCase(repository: workoutSessionRepository),
      listWorkoutSessionsUseCase: ListWorkoutSessionsUseCase(repository: workoutSessionRepository),
      listExerciseVideosUseCase: ListExerciseVideosUseCase(repository: exerciseVideoRepository)
    )
    viewModel.planName = "   "

    await viewModel.createStarterPlan(userID: "user-1")

    XCTAssertEqual(viewModel.status, "validation_error")
  }

  func test_loadExerciseVideos_usesFallbackLocale_whenRequestedLocaleHasNoVideo() async {
    let trainingPlanRepository = InMemoryTrainingPlanRepository()
    let workoutSessionRepository = InMemoryWorkoutSessionRepository()
    let fallbackRepository = FallbackExerciseVideoRepository()
    let viewModel = TrainingFlowViewModel(
      createTrainingPlanUseCase: CreateTrainingPlanUseCase(repository: trainingPlanRepository),
      listTrainingPlansUseCase: ListTrainingPlansUseCase(repository: trainingPlanRepository),
      createWorkoutSessionUseCase: CreateWorkoutSessionUseCase(repository: workoutSessionRepository),
      listWorkoutSessionsUseCase: ListWorkoutSessionsUseCase(repository: workoutSessionRepository),
      listExerciseVideosUseCase: ListExerciseVideosUseCase(repository: fallbackRepository)
    )
    viewModel.selectedExerciseIDForVideos = "goblet-squat"
    viewModel.videoLocale = "es-ES"

    await viewModel.loadExerciseVideos()

    XCTAssertEqual(viewModel.videoStatus, "fallback_loaded")
    XCTAssertTrue(viewModel.isVideoFallbackActive)
    XCTAssertEqual(viewModel.exerciseVideos.count, 1)
    XCTAssertEqual(viewModel.exerciseVideos.first?.locale, "en-US")
  }

  func test_loadExerciseVideos_whenOffline_setsOfflineStatus() async {
    let trainingPlanRepository = InMemoryTrainingPlanRepository()
    let workoutSessionRepository = InMemoryWorkoutSessionRepository()
    let offlineRepository = OfflineExerciseVideoRepository()
    let viewModel = TrainingFlowViewModel(
      createTrainingPlanUseCase: CreateTrainingPlanUseCase(repository: trainingPlanRepository),
      listTrainingPlansUseCase: ListTrainingPlansUseCase(repository: trainingPlanRepository),
      createWorkoutSessionUseCase: CreateWorkoutSessionUseCase(repository: workoutSessionRepository),
      listWorkoutSessionsUseCase: ListWorkoutSessionsUseCase(repository: workoutSessionRepository),
      listExerciseVideosUseCase: ListExerciseVideosUseCase(repository: offlineRepository)
    )

    await viewModel.loadExerciseVideos()

    XCTAssertEqual(viewModel.videoStatus, "offline")
    XCTAssertEqual(viewModel.exerciseVideos.count, 0)
    XCTAssertFalse(viewModel.isVideoFallbackActive)
  }

  func test_screenContract_mapsRuntimeStatuses() async {
    let trainingPlanRepository = InMemoryTrainingPlanRepository()
    let workoutSessionRepository = InMemoryWorkoutSessionRepository()
    let fallbackRepository = FallbackExerciseVideoRepository()
    let viewModel = TrainingFlowViewModel(
      createTrainingPlanUseCase: CreateTrainingPlanUseCase(repository: trainingPlanRepository),
      listTrainingPlansUseCase: ListTrainingPlansUseCase(repository: trainingPlanRepository),
      createWorkoutSessionUseCase: CreateWorkoutSessionUseCase(repository: workoutSessionRepository),
      listWorkoutSessionsUseCase: ListWorkoutSessionsUseCase(repository: workoutSessionRepository),
      listExerciseVideosUseCase: ListExerciseVideosUseCase(repository: fallbackRepository)
    )
    let now = Date()

    await viewModel.createStarterPlan(userID: "user-1")
    await viewModel.logDemoSession(userID: "user-1", now: now)
    await viewModel.loadExerciseVideos()

    let contract = viewModel.screenContract

    XCTAssertEqual(contract.trainingStatus, .saved)
    XCTAssertEqual(contract.sessionStatus, .loaded)
    XCTAssertEqual(contract.videoStatus, .loaded)
    XCTAssertEqual(contract.selectedExerciseID, "goblet-squat")
  }
}

private actor FallbackExerciseVideoRepository: ExerciseVideoRepository {
  func listByExerciseID(_ exerciseID: String, locale: String) async throws -> [ExerciseVideo] {
    if locale == "es-ES" {
      return []
    }
    return [
      ExerciseVideo(
        id: "video-en-fallback",
        exerciseID: exerciseID,
        title: "Fallback video",
        coach: "Flux Coach",
        difficulty: .beginner,
        durationSeconds: 180,
        videoURL: URL(string: "https://cdn.flux.training/videos/fallback-en.mp4")!,
        thumbnailURL: URL(string: "https://cdn.flux.training/videos/fallback-en.jpg")!,
        tags: ["fallback"],
        locale: "en-US"
      )
    ]
  }
}

private actor OfflineExerciseVideoRepository: ExerciseVideoRepository {
  func listByExerciseID(_ exerciseID: String, locale: String) async throws -> [ExerciseVideo] {
    throw URLError(.notConnectedToInternet)
  }
}
