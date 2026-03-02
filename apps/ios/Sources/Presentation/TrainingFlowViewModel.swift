import Foundation
import Observation

@MainActor
@Observable
public final class TrainingFlowViewModel {
  public var planName: String = "Starter Plan"
  public var selectedPlanID: String = ""
  public var selectedExerciseIDForVideos: String = "goblet-squat"
  public var videoLocale: String = "es-ES"
  public private(set) var plans: [TrainingPlan] = []
  public private(set) var sessions: [WorkoutSession] = []
  public private(set) var exerciseVideos: [ExerciseVideo] = []
  public private(set) var status: String = "idle"
  public private(set) var sessionStatus: String = "idle"
  public private(set) var videoStatus: String = "idle"
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
      try await refreshPlans(userID: userID)
      try await refreshSessions(userID: userID, now: now)
      status = plans.isEmpty ? "empty" : "loaded"
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

  public func refreshSessions(userID: String, now: Date = Date()) async throws {
    let planID = selectedPlanID.isEmpty ? nil : selectedPlanID
    sessions = try await listWorkoutSessionsUseCase.execute(userID: userID, planID: planID)
    let sortedSessions = sessions.sorted { $0.endedAt > $1.endedAt }
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
    return "error"
  }

  private func mapScreenStatus(_ rawStatus: String) -> DailyTrainingVideoScreenStatus {
    switch rawStatus {
    case "loading":
      return .loading
    case "saved":
      return .saved
    case "loaded", "session_active", "fallback_loaded":
      return .loaded
    case "queued":
      return .queued
    case "offline":
      return .offline
    case "denied":
      return .denied
    case "error", "validation_error", "empty":
      return .error
    default:
      return .idle
    }
  }
}
