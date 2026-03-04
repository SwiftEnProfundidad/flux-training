import Foundation
import Observation

@MainActor
@Observable
public final class TrainingDashboardViewModel {
  public private(set) var status: String = "idle"
  private let createWorkoutSessionUseCase: CreateWorkoutSessionUseCase

  public init(createWorkoutSessionUseCase: CreateWorkoutSessionUseCase) {
    self.createWorkoutSessionUseCase = createWorkoutSessionUseCase
  }

  public func saveDemoSession(now: Date = Date()) async {
    let input = CreateWorkoutSessionInput(
      userID: "flux-user-local",
      planID: "starter-plan",
      startedAt: now.addingTimeInterval(-1800),
      endedAt: now,
      exercises: [
        ExerciseLog(
          exerciseID: "goblet-squat",
          sets: [SetLog(reps: 12, loadKg: 20, rpe: 7)]
        )
      ]
    )

    do {
      _ = try await createWorkoutSessionUseCase.execute(input: input)
      status = "saved"
    } catch {
      status = "error"
    }
  }
}
