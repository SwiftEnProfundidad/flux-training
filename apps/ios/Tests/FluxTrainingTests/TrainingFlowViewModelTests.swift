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

  func test_prepareInWorkoutSetup_withAvailablePlan_setsSavedStatus() async {
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

    _ = try? await CreateTrainingPlanUseCase(repository: trainingPlanRepository).execute(
      id: "plan-setup",
      userID: "user-1",
      name: "Plan Setup",
      weeks: 4,
      days: [
        TrainingPlanDay(
          dayIndex: 1,
          exercises: [TrainingPlanExercise(exerciseID: "goblet-squat", targetSets: 4, targetReps: 8)]
        )
      ]
    )

    await viewModel.prepareInWorkoutSetup(userID: "user-1")

    XCTAssertEqual(viewModel.status, "saved")
    XCTAssertFalse(viewModel.selectedPlanID.isEmpty)
    XCTAssertFalse(viewModel.exerciseVideos.isEmpty)
  }

  func test_prepareInWorkoutSetup_withoutPlans_setsEmptyStatus() async {
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

    await viewModel.prepareInWorkoutSetup(userID: "user-1")

    XCTAssertEqual(viewModel.status, "empty")
    XCTAssertEqual(viewModel.videoStatus, "empty")
  }

  func test_prepareInWorkoutSetup_whenAuthorizationMissing_setsDeniedStatus() async {
    let trainingPlanRepository = DeniedTrainingPlanRepository()
    let workoutSessionRepository = InMemoryWorkoutSessionRepository()
    let exerciseVideoRepository = InMemoryExerciseVideoRepository()
    let viewModel = TrainingFlowViewModel(
      createTrainingPlanUseCase: CreateTrainingPlanUseCase(repository: trainingPlanRepository),
      listTrainingPlansUseCase: ListTrainingPlansUseCase(repository: trainingPlanRepository),
      createWorkoutSessionUseCase: CreateWorkoutSessionUseCase(repository: workoutSessionRepository),
      listWorkoutSessionsUseCase: ListWorkoutSessionsUseCase(repository: workoutSessionRepository),
      listExerciseVideosUseCase: ListExerciseVideosUseCase(repository: exerciseVideoRepository)
    )

    await viewModel.prepareInWorkoutSetup(userID: "user-1")

    XCTAssertEqual(viewModel.status, "denied")
  }

  func test_submitRPERating_withAvailablePlan_setsSavedStatusAndCreatesSession() async {
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
    viewModel.selectedRPE = 9
    viewModel.selectedExerciseIDForVideos = "bench-press"
    _ = try? await CreateTrainingPlanUseCase(repository: trainingPlanRepository).execute(
      id: "plan-rpe",
      userID: "user-1",
      name: "RPE Plan",
      weeks: 4,
      days: [
        TrainingPlanDay(
          dayIndex: 1,
          exercises: [TrainingPlanExercise(exerciseID: "bench-press", targetSets: 4, targetReps: 8)]
        )
      ]
    )

    await viewModel.submitRPERating(userID: "user-1")

    XCTAssertEqual(viewModel.status, "saved")
    XCTAssertEqual(viewModel.sessionStatus, "saved")
    XCTAssertEqual(viewModel.sessions.last?.exercises.first?.sets.first?.rpe, 9)
  }

  func test_submitRPERating_withoutPlan_setsEmptyStatus() async {
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

    await viewModel.submitRPERating(userID: "user-1")

    XCTAssertEqual(viewModel.status, "empty")
    XCTAssertEqual(viewModel.sessionStatus, "empty")
  }

  func test_submitRPERating_whenAuthorizationMissing_setsDeniedStatus() async {
    let trainingPlanRepository = DeniedTrainingPlanRepository()
    let workoutSessionRepository = InMemoryWorkoutSessionRepository()
    let exerciseVideoRepository = InMemoryExerciseVideoRepository()
    let viewModel = TrainingFlowViewModel(
      createTrainingPlanUseCase: CreateTrainingPlanUseCase(repository: trainingPlanRepository),
      listTrainingPlansUseCase: ListTrainingPlansUseCase(repository: trainingPlanRepository),
      createWorkoutSessionUseCase: CreateWorkoutSessionUseCase(repository: workoutSessionRepository),
      listWorkoutSessionsUseCase: ListWorkoutSessionsUseCase(repository: workoutSessionRepository),
      listExerciseVideosUseCase: ListExerciseVideosUseCase(repository: exerciseVideoRepository)
    )

    await viewModel.submitRPERating(userID: "user-1")

    XCTAssertEqual(viewModel.status, "denied")
    XCTAssertEqual(viewModel.sessionStatus, "denied")
  }

  func test_applyExerciseSubstitution_withAvailablePlan_setsSavedStatusAndUpdatesExercise() async {
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
    _ = try? await CreateTrainingPlanUseCase(repository: trainingPlanRepository).execute(
      id: "plan-sub",
      userID: "user-1",
      name: "Sub Plan",
      weeks: 4,
      days: [
        TrainingPlanDay(
          dayIndex: 1,
          exercises: [TrainingPlanExercise(exerciseID: "goblet-squat", targetSets: 4, targetReps: 8)]
        )
      ]
    )
    viewModel.selectedExerciseIDForVideos = "goblet-squat"
    viewModel.selectedSubstituteExerciseID = "bench-press"

    await viewModel.applyExerciseSubstitution(userID: "user-1")

    XCTAssertEqual(viewModel.status, "saved")
    XCTAssertEqual(viewModel.substitutionStatus, "saved")
    XCTAssertEqual(viewModel.selectedExerciseIDForVideos, "bench-press")
    XCTAssertFalse(viewModel.sessions.isEmpty)
  }

  func test_applyExerciseSubstitution_withSameExercise_setsValidationError() async {
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
    viewModel.selectedExerciseIDForVideos = "goblet-squat"
    viewModel.selectedSubstituteExerciseID = "goblet-squat"

    await viewModel.applyExerciseSubstitution(userID: "user-1")

    XCTAssertEqual(viewModel.status, "validation_error")
    XCTAssertEqual(viewModel.substitutionStatus, "validation_error")
  }

  func test_applyExerciseSubstitution_whenAuthorizationMissing_setsDeniedStatus() async {
    let trainingPlanRepository = DeniedTrainingPlanRepository()
    let workoutSessionRepository = InMemoryWorkoutSessionRepository()
    let exerciseVideoRepository = InMemoryExerciseVideoRepository()
    let viewModel = TrainingFlowViewModel(
      createTrainingPlanUseCase: CreateTrainingPlanUseCase(repository: trainingPlanRepository),
      listTrainingPlansUseCase: ListTrainingPlansUseCase(repository: trainingPlanRepository),
      createWorkoutSessionUseCase: CreateWorkoutSessionUseCase(repository: workoutSessionRepository),
      listWorkoutSessionsUseCase: ListWorkoutSessionsUseCase(repository: workoutSessionRepository),
      listExerciseVideosUseCase: ListExerciseVideosUseCase(repository: exerciseVideoRepository)
    )

    await viewModel.applyExerciseSubstitution(userID: "user-1")

    XCTAssertEqual(viewModel.status, "denied")
    XCTAssertEqual(viewModel.substitutionStatus, "denied")
  }

  func test_loadExerciseLibrary_withAvailablePlan_setsLoadedStatusAndReturnsVideos() async {
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
    _ = try? await CreateTrainingPlanUseCase(repository: trainingPlanRepository).execute(
      id: "plan-library",
      userID: "user-1",
      name: "Library Plan",
      weeks: 4,
      days: [
        TrainingPlanDay(
          dayIndex: 1,
          exercises: [TrainingPlanExercise(exerciseID: "goblet-squat", targetSets: 4, targetReps: 8)]
        )
      ]
    )

    await viewModel.loadExerciseLibrary(userID: "user-1")

    XCTAssertEqual(viewModel.status, "loaded")
    XCTAssertEqual(viewModel.exerciseLibraryStatus, "loaded")
    XCTAssertFalse(viewModel.exerciseVideos.isEmpty)
  }

  func test_loadExerciseLibrary_withoutPlan_setsEmptyStatus() async {
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

    await viewModel.loadExerciseLibrary(userID: "user-1")

    XCTAssertEqual(viewModel.status, "empty")
    XCTAssertEqual(viewModel.exerciseLibraryStatus, "empty")
    XCTAssertTrue(viewModel.exerciseVideos.isEmpty)
  }

  func test_loadExerciseLibrary_whenAuthorizationMissing_setsDeniedStatus() async {
    let trainingPlanRepository = DeniedTrainingPlanRepository()
    let workoutSessionRepository = InMemoryWorkoutSessionRepository()
    let exerciseVideoRepository = InMemoryExerciseVideoRepository()
    let viewModel = TrainingFlowViewModel(
      createTrainingPlanUseCase: CreateTrainingPlanUseCase(repository: trainingPlanRepository),
      listTrainingPlansUseCase: ListTrainingPlansUseCase(repository: trainingPlanRepository),
      createWorkoutSessionUseCase: CreateWorkoutSessionUseCase(repository: workoutSessionRepository),
      listWorkoutSessionsUseCase: ListWorkoutSessionsUseCase(repository: workoutSessionRepository),
      listExerciseVideosUseCase: ListExerciseVideosUseCase(repository: exerciseVideoRepository)
    )

    await viewModel.loadExerciseLibrary(userID: "user-1")

    XCTAssertEqual(viewModel.status, "denied")
    XCTAssertEqual(viewModel.exerciseLibraryStatus, "denied")
  }

  func test_loadVideoPlayer_withAvailablePlan_setsLoadedStatusAndSelectsVideo() async {
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
    _ = try? await CreateTrainingPlanUseCase(repository: trainingPlanRepository).execute(
      id: "plan-player",
      userID: "user-1",
      name: "Video Player Plan",
      weeks: 4,
      days: [
        TrainingPlanDay(
          dayIndex: 1,
          exercises: [TrainingPlanExercise(exerciseID: "goblet-squat", targetSets: 4, targetReps: 8)]
        )
      ]
    )

    await viewModel.loadVideoPlayer(userID: "user-1")

    XCTAssertEqual(viewModel.status, "loaded")
    XCTAssertEqual(viewModel.videoPlayerStatus, "loaded")
    XCTAssertFalse(viewModel.exerciseVideos.isEmpty)
    XCTAssertFalse(viewModel.selectedVideoID.isEmpty)
  }

  func test_loadVideoPlayer_withoutPlan_setsEmptyStatus() async {
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

    await viewModel.loadVideoPlayer(userID: "user-1")

    XCTAssertEqual(viewModel.status, "empty")
    XCTAssertEqual(viewModel.videoPlayerStatus, "empty")
    XCTAssertEqual(viewModel.selectedVideoID, "")
  }

  func test_loadVideoPlayer_whenAuthorizationMissing_setsDeniedStatus() async {
    let trainingPlanRepository = DeniedTrainingPlanRepository()
    let workoutSessionRepository = InMemoryWorkoutSessionRepository()
    let exerciseVideoRepository = InMemoryExerciseVideoRepository()
    let viewModel = TrainingFlowViewModel(
      createTrainingPlanUseCase: CreateTrainingPlanUseCase(repository: trainingPlanRepository),
      listTrainingPlansUseCase: ListTrainingPlansUseCase(repository: trainingPlanRepository),
      createWorkoutSessionUseCase: CreateWorkoutSessionUseCase(repository: workoutSessionRepository),
      listWorkoutSessionsUseCase: ListWorkoutSessionsUseCase(repository: workoutSessionRepository),
      listExerciseVideosUseCase: ListExerciseVideosUseCase(repository: exerciseVideoRepository)
    )

    await viewModel.loadVideoPlayer(userID: "user-1")

    XCTAssertEqual(viewModel.status, "denied")
    XCTAssertEqual(viewModel.videoPlayerStatus, "denied")
  }

  func test_playSelectedVideo_withSelectedVideo_setsSuccessStatus() async {
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
    _ = try? await CreateTrainingPlanUseCase(repository: trainingPlanRepository).execute(
      id: "plan-player-play",
      userID: "user-1",
      name: "Video Player Play Plan",
      weeks: 4,
      days: [
        TrainingPlanDay(
          dayIndex: 1,
          exercises: [TrainingPlanExercise(exerciseID: "goblet-squat", targetSets: 4, targetReps: 8)]
        )
      ]
    )
    await viewModel.loadVideoPlayer(userID: "user-1")

    await viewModel.playSelectedVideo(userID: "user-1")

    XCTAssertEqual(viewModel.videoPlayerStatus, "success")
    XCTAssertEqual(viewModel.status, "success")
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

private actor DeniedTrainingPlanRepository: TrainingPlanRepository {
  func save(plan: TrainingPlan) async throws {}

  func listByUserID(_ userID: String) async throws -> [TrainingPlan] {
    throw FluxBackendClientError.missingAuthorizationBearer
  }
}
