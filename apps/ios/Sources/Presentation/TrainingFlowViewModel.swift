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
  public private(set) var videoStatus: String = "idle"

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

  public func createStarterPlan(userID: String) async {
    do {
      let plan = try await createTrainingPlanUseCase.execute(
        id: "plan-\(Int(Date().timeIntervalSince1970))",
        userID: userID,
        name: planName,
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
      status = "error"
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
      try await refreshSessions(userID: userID)
      status = "saved"
    } catch {
      status = "error"
    }
  }

  public func refreshSessions(userID: String) async throws {
    let planID = selectedPlanID.isEmpty ? nil : selectedPlanID
    sessions = try await listWorkoutSessionsUseCase.execute(userID: userID, planID: planID)
  }

  public func loadExerciseVideos() async {
    do {
      exerciseVideos = try await listExerciseVideosUseCase.execute(
        exerciseID: selectedExerciseIDForVideos,
        locale: videoLocale
      )
      videoStatus = "loaded"
    } catch {
      videoStatus = "error"
    }
  }
}
