import Foundation
import Observation

@MainActor
@Observable
public final class TrainingFlowViewModel {
  public var planName: String = "Starter Plan"
  public var selectedPlanID: String = ""
  public var selectedExerciseIDForVideos: String = "goblet-squat"
  public var selectedSubstituteExerciseID: String = "bench-press"
  public var selectedVideoID: String = ""
  public var selectedRPE: Int = 7
  public var videoLocale: String = "es-ES"
  public private(set) var plans: [TrainingPlan] = []
  public private(set) var sessions: [WorkoutSession] = []
  public private(set) var exerciseVideos: [ExerciseVideo] = []
  public private(set) var status: String = "idle"
  public private(set) var sessionStatus: String = "idle"
  public private(set) var videoStatus: String = "idle"
  public private(set) var substitutionStatus: String = "idle"
  public private(set) var exerciseLibraryStatus: String = "idle"
  public private(set) var videoPlayerStatus: String = "idle"
  public private(set) var todaySessionsCount: Int = 0
  public private(set) var latestSessionEndedAt: Date?
  public private(set) var isVideoFallbackActive: Bool = false

  private let createTrainingPlanUseCase: CreateTrainingPlanUseCase
  private let listTrainingPlansUseCase: ListTrainingPlansUseCase
  private let createWorkoutSessionUseCase: CreateWorkoutSessionUseCase
  private let listWorkoutSessionsUseCase: ListWorkoutSessionsUseCase
  private let listExerciseVideosUseCase: ListExerciseVideosUseCase

  public init(
    createTrainingPlanUseCase: CreateTrainingPlanUseCase,
    listTrainingPlansUseCase: ListTrainingPlansUseCase,
    createWorkoutSessionUseCase: CreateWorkoutSessionUseCase,
    listWorkoutSessionsUseCase: ListWorkoutSessionsUseCase,
    listExerciseVideosUseCase: ListExerciseVideosUseCase
  ) {
    self.createTrainingPlanUseCase = createTrainingPlanUseCase
    self.listTrainingPlansUseCase = listTrainingPlansUseCase
    self.createWorkoutSessionUseCase = createWorkoutSessionUseCase
    self.listWorkoutSessionsUseCase = listWorkoutSessionsUseCase
    self.listExerciseVideosUseCase = listExerciseVideosUseCase
  }

  public var screenContract: DailyTrainingVideoScreenContract {
    DailyTrainingVideoScreenContract(
      planName: planName,
      selectedPlanID: selectedPlanID,
      selectedExerciseID: selectedExerciseIDForVideos,
      videoLocale: videoLocale,
      sessions: sessions,
      trainingStatus: mapScreenStatus(status),
      sessionStatus: mapScreenStatus(sessionStatus),
      videoStatus: mapScreenStatus(videoStatus)
    )
  }

  public func refreshDashboard(userID: String, now: Date = Date()) async {
    status = "loading"
    do {
      let planID = selectedPlanID.isEmpty ? nil : selectedPlanID
      async let plansTask = listTrainingPlansUseCase.execute(userID: userID)
      async let sessionsTask = listWorkoutSessionsUseCase.execute(userID: userID, planID: planID)
      let (loadedPlans, loadedSessions) = try await (plansTask, sessionsTask)
      plans = loadedPlans
      if selectedPlanID.isEmpty, let firstPlan = loadedPlans.first {
        selectedPlanID = firstPlan.id
      }
      applyLoadedSessions(loadedSessions, now: now)
      status = plans.isEmpty ? "empty" : "loaded"
    } catch {
      status = resolveStatus(for: error)
    }
  }

  public func prepareInWorkoutSetup(userID: String, now: Date = Date()) async {
    let resolvedUserID = userID.trimmingCharacters(in: .whitespacesAndNewlines)
    guard resolvedUserID.isEmpty == false else {
      status = "validation_error"
      return
    }

    status = "loading"
    do {
      let loadedPlans = try await listTrainingPlansUseCase.execute(userID: resolvedUserID)
      plans = loadedPlans
      guard loadedPlans.isEmpty == false else {
        selectedPlanID = ""
        sessions = []
        todaySessionsCount = 0
        latestSessionEndedAt = nil
        sessionStatus = "empty"
        exerciseVideos = []
        videoStatus = "empty"
        status = "empty"
        return
      }

      if selectedPlanID.isEmpty || loadedPlans.contains(where: { $0.id == selectedPlanID }) == false {
        selectedPlanID = loadedPlans[0].id
      }

      let loadedSessions = try await listWorkoutSessionsUseCase.execute(
        userID: resolvedUserID,
        planID: selectedPlanID
      )
      applyLoadedSessions(loadedSessions, now: now)
      await loadExerciseVideos()

      switch videoStatus {
      case "error", "offline", "denied":
        status = videoStatus
      case "empty":
        status = "empty"
      default:
        status = "saved"
      }
    } catch {
      status = resolveStatus(for: error)
    }
  }

  public func createStarterPlan(userID: String) async {
    let resolvedPlanName = planName.trimmingCharacters(in: .whitespacesAndNewlines)
    guard resolvedPlanName.isEmpty == false else {
      status = "validation_error"
      return
    }

    status = "loading"
    do {
      let plan = try await createTrainingPlanUseCase.execute(
        id: "plan-\(Int(Date().timeIntervalSince1970))",
        userID: userID,
        name: resolvedPlanName,
        weeks: 4,
        days: [
          TrainingPlanDay(
            dayIndex: 1,
            exercises: [
              TrainingPlanExercise(exerciseID: "goblet-squat", targetSets: 4, targetReps: 10)
            ]
          )
        ]
      )
      selectedPlanID = plan.id
      try await refreshPlans(userID: userID)
      status = "saved"
    } catch {
      status = resolveStatus(for: error)
    }
  }

  public func refreshPlans(userID: String) async throws {
    let loadedPlans = try await listTrainingPlansUseCase.execute(userID: userID)
    plans = loadedPlans
    if selectedPlanID.isEmpty, let firstPlan = loadedPlans.first {
      selectedPlanID = firstPlan.id
    }
  }

  public func logDemoSession(userID: String, now: Date = Date()) async {
    sessionStatus = "loading"
    do {
      let resolvedPlanID = selectedPlanID.isEmpty ? "starter-plan" : selectedPlanID
      let _ = try await createWorkoutSessionUseCase.execute(
        input: CreateWorkoutSessionInput(
          userID: userID,
          planID: resolvedPlanID,
          startedAt: now.addingTimeInterval(-1800),
          endedAt: now,
          exercises: [
            ExerciseLog(
              exerciseID: "goblet-squat",
              sets: [SetLog(reps: 12, loadKg: 20, rpe: 7)]
            )
          ]
        )
      )
      try await refreshSessions(userID: userID, now: now)
      status = "saved"
    } catch {
      sessionStatus = resolveStatus(for: error)
      status = resolveStatus(for: error)
    }
  }

  public func submitRPERating(userID: String, now: Date = Date()) async {
    let resolvedUserID = userID.trimmingCharacters(in: .whitespacesAndNewlines)
    guard resolvedUserID.isEmpty == false else {
      sessionStatus = "validation_error"
      status = "validation_error"
      return
    }

    guard selectedRPE >= 1, selectedRPE <= 10 else {
      sessionStatus = "validation_error"
      status = "validation_error"
      return
    }

    sessionStatus = "loading"
    do {
      if plans.isEmpty {
        plans = try await listTrainingPlansUseCase.execute(userID: resolvedUserID)
      }
      guard plans.isEmpty == false else {
        selectedPlanID = ""
        sessionStatus = "empty"
        status = "empty"
        return
      }

      if selectedPlanID.isEmpty || plans.contains(where: { $0.id == selectedPlanID }) == false {
        selectedPlanID = plans[0].id
      }

      let _ = try await createWorkoutSessionUseCase.execute(
        input: CreateWorkoutSessionInput(
          userID: resolvedUserID,
          planID: selectedPlanID,
          startedAt: now.addingTimeInterval(-900),
          endedAt: now,
          exercises: [
            ExerciseLog(
              exerciseID: selectedExerciseIDForVideos,
              sets: [SetLog(reps: 8, loadKg: 0, rpe: Double(selectedRPE))]
            )
          ]
        )
      )
      try await refreshSessions(userID: resolvedUserID, now: now)
      sessionStatus = "saved"
      status = "saved"
    } catch {
      let resolvedStatus = resolveStatus(for: error)
      sessionStatus = resolvedStatus
      status = resolvedStatus
    }
  }

  public func applyExerciseSubstitution(userID: String, now: Date = Date()) async {
    let resolvedUserID = userID.trimmingCharacters(in: .whitespacesAndNewlines)
    guard resolvedUserID.isEmpty == false else {
      substitutionStatus = "validation_error"
      status = "validation_error"
      return
    }

    guard selectedExerciseIDForVideos != selectedSubstituteExerciseID else {
      substitutionStatus = "validation_error"
      status = "validation_error"
      return
    }

    substitutionStatus = "loading"
    status = "loading"
    do {
      if plans.isEmpty {
        plans = try await listTrainingPlansUseCase.execute(userID: resolvedUserID)
      }
      guard plans.isEmpty == false else {
        selectedPlanID = ""
        substitutionStatus = "empty"
        status = "empty"
        return
      }

      if selectedPlanID.isEmpty || plans.contains(where: { $0.id == selectedPlanID }) == false {
        selectedPlanID = plans[0].id
      }

      selectedExerciseIDForVideos = selectedSubstituteExerciseID
      await loadExerciseVideos()
      if videoStatus == "error" || videoStatus == "offline" || videoStatus == "denied" {
        substitutionStatus = videoStatus
        status = videoStatus
        return
      }
      if videoStatus == "empty" {
        substitutionStatus = "empty"
        status = "empty"
        return
      }

      let _ = try await createWorkoutSessionUseCase.execute(
        input: CreateWorkoutSessionInput(
          userID: resolvedUserID,
          planID: selectedPlanID,
          startedAt: now.addingTimeInterval(-600),
          endedAt: now,
          exercises: [
            ExerciseLog(
              exerciseID: selectedSubstituteExerciseID,
              sets: [SetLog(reps: 8, loadKg: 0, rpe: 7)]
            )
          ]
        )
      )
      try await refreshSessions(userID: resolvedUserID, now: now)
      substitutionStatus = "saved"
      status = "saved"
    } catch {
      let resolvedStatus = resolveStatus(for: error)
      substitutionStatus = resolvedStatus
      status = resolvedStatus
    }
  }

  public func loadExerciseLibrary(userID: String) async {
    let resolvedUserID = userID.trimmingCharacters(in: .whitespacesAndNewlines)
    guard resolvedUserID.isEmpty == false else {
      exerciseLibraryStatus = "validation_error"
      status = "validation_error"
      return
    }

    exerciseLibraryStatus = "loading"
    status = "loading"
    do {
      if plans.isEmpty {
        plans = try await listTrainingPlansUseCase.execute(userID: resolvedUserID)
      }
      guard plans.isEmpty == false else {
        selectedPlanID = ""
        exerciseVideos = []
        videoStatus = "empty"
        exerciseLibraryStatus = "empty"
        status = "empty"
        return
      }
      if selectedPlanID.isEmpty || plans.contains(where: { $0.id == selectedPlanID }) == false {
        selectedPlanID = plans[0].id
      }

      await loadExerciseVideos()
      switch videoStatus {
      case "error", "offline", "denied":
        exerciseLibraryStatus = videoStatus
        status = videoStatus
      case "empty":
        exerciseLibraryStatus = "empty"
        status = "empty"
      default:
        exerciseLibraryStatus = "loaded"
        status = "loaded"
      }
    } catch {
      let resolvedStatus = resolveStatus(for: error)
      exerciseLibraryStatus = resolvedStatus
      status = resolvedStatus
    }
  }

  public func loadVideoPlayer(userID: String) async {
    let resolvedUserID = userID.trimmingCharacters(in: .whitespacesAndNewlines)
    guard resolvedUserID.isEmpty == false else {
      videoPlayerStatus = "validation_error"
      status = "validation_error"
      return
    }

    videoPlayerStatus = "loading"
    status = "loading"
    do {
      if plans.isEmpty {
        plans = try await listTrainingPlansUseCase.execute(userID: resolvedUserID)
      }
      guard plans.isEmpty == false else {
        selectedPlanID = ""
        selectedVideoID = ""
        exerciseVideos = []
        videoStatus = "empty"
        videoPlayerStatus = "empty"
        status = "empty"
        return
      }
      if selectedPlanID.isEmpty || plans.contains(where: { $0.id == selectedPlanID }) == false {
        selectedPlanID = plans[0].id
      }

      await loadExerciseVideos()
      switch videoStatus {
      case "error", "offline", "denied":
        selectedVideoID = ""
        videoPlayerStatus = videoStatus
        status = videoStatus
      case "empty":
        selectedVideoID = ""
        videoPlayerStatus = "empty"
        status = "empty"
      default:
        if exerciseVideos.contains(where: { $0.id == selectedVideoID }) == false {
          selectedVideoID = exerciseVideos.first?.id ?? ""
        }
        videoPlayerStatus = "loaded"
        status = "loaded"
      }
    } catch {
      let resolvedStatus = resolveStatus(for: error)
      selectedVideoID = ""
      videoPlayerStatus = resolvedStatus
      status = resolvedStatus
    }
  }

  public func playSelectedVideo(userID: String) async {
    let resolvedUserID = userID.trimmingCharacters(in: .whitespacesAndNewlines)
    guard resolvedUserID.isEmpty == false else {
      videoPlayerStatus = "validation_error"
      status = "validation_error"
      return
    }

    if exerciseVideos.isEmpty {
      await loadVideoPlayer(userID: resolvedUserID)
      if exerciseVideos.isEmpty {
        return
      }
    }

    guard let selectedVideo = exerciseVideos.first(where: { $0.id == selectedVideoID }) else {
      videoPlayerStatus = "validation_error"
      status = "validation_error"
      return
    }

    guard selectedVideo.videoURL.scheme?.isEmpty == false else {
      videoPlayerStatus = "validation_error"
      status = "validation_error"
      return
    }

    videoPlayerStatus = "success"
    status = "success"
  }

  public func refreshSessions(userID: String, now: Date = Date()) async throws {
    let planID = selectedPlanID.isEmpty ? nil : selectedPlanID
    let loadedSessions = try await listWorkoutSessionsUseCase.execute(userID: userID, planID: planID)
    applyLoadedSessions(loadedSessions, now: now)
  }

  private func applyLoadedSessions(_ loadedSessions: [WorkoutSession], now: Date) {
    sessions = loadedSessions
    let sortedSessions = loadedSessions.sorted { $0.endedAt > $1.endedAt }
    latestSessionEndedAt = sortedSessions.first?.endedAt
    todaySessionsCount = sortedSessions.filter { Calendar.current.isDateInToday($0.endedAt) }.count
    if sortedSessions.isEmpty {
      sessionStatus = "empty"
      return
    }
    if let latestSession = latestSessionEndedAt, now.timeIntervalSince(latestSession) <= 5_400 {
      sessionStatus = "session_active"
      return
    }
    sessionStatus = "loaded"
  }

  public func loadExerciseVideos() async {
    videoStatus = "loading"
    isVideoFallbackActive = false
    do {
      let localizedVideos = try await listExerciseVideosUseCase.execute(
        exerciseID: selectedExerciseIDForVideos,
        locale: videoLocale
      )

      if localizedVideos.isEmpty {
        if videoLocale == "en-US" {
          exerciseVideos = []
          videoStatus = "empty"
          return
        }

        let fallbackVideos = try await listExerciseVideosUseCase.execute(
          exerciseID: selectedExerciseIDForVideos,
          locale: "en-US"
        )
        exerciseVideos = fallbackVideos
        if fallbackVideos.isEmpty {
          videoStatus = "empty"
        } else {
          videoStatus = "fallback_loaded"
          isVideoFallbackActive = true
        }
        return
      }

      exerciseVideos = localizedVideos
      videoStatus = "loaded"
    } catch {
      exerciseVideos = []
      videoStatus = resolveStatus(for: error)
    }
  }

  private func resolveStatus(for error: Error) -> String {
    if let urlError = error as? URLError, urlError.code == .notConnectedToInternet {
      return "offline"
    }
    if case FluxBackendClientError.missingAuthorizationBearer = error {
      return "denied"
    }
    if case let FluxBackendClientError.backend(code, _, _, _) = error,
       code == "missing_authorization_bearer" || code == "invalid_authorization_bearer" || code == "permission_denied" {
      return "denied"
    }
    return "error"
  }

  private func mapScreenStatus(_ rawStatus: String) -> DailyTrainingVideoScreenStatus {
    switch rawStatus {
    case "loading":
      return .loading
    case "saved":
      return .saved
    case "loaded", "success", "session_active", "fallback_loaded":
      return .loaded
    case "queued":
      return .queued
    case "empty":
      return .empty
    case "offline":
      return .offline
    case "denied":
      return .denied
    case "error", "validation_error":
      return .error
    default:
      return .idle
    }
  }
}
