import XCTest
@testable import FluxTraining

final class BuildProgressSummaryUseCaseTests: XCTestCase {
  func test_execute_aggregatesTrainingAndNutritionData() async throws {
    let workoutRepository = InMemoryWorkoutSessionRepository()
    let nutritionRepository = InMemoryNutritionLogRepository()

    try await workoutRepository.save(
      session: WorkoutSession(
        userID: "user-1",
        planID: "plan-1",
        startedAt: makeDate("2026-02-25T08:00:00Z"),
        endedAt: makeDate("2026-02-25T08:50:00Z"),
        exercises: [
          ExerciseLog(
            exerciseID: "squat",
            sets: [SetLog(reps: 8, loadKg: 60, rpe: 8), SetLog(reps: 8, loadKg: 62.5, rpe: 8)]
          )
        ]
      )
    )
    try await workoutRepository.save(
      session: WorkoutSession(
        userID: "user-1",
        planID: "plan-1",
        startedAt: makeDate("2026-02-26T09:00:00Z"),
        endedAt: makeDate("2026-02-26T09:45:00Z"),
        exercises: [
          ExerciseLog(exerciseID: "bench", sets: [SetLog(reps: 10, loadKg: 50, rpe: 7)])
        ]
      )
    )

    try await nutritionRepository.save(
      log: NutritionLog(
        userID: "user-1",
        date: "2026-02-25",
        calories: 2200,
        proteinGrams: 150,
        carbsGrams: 230,
        fatsGrams: 70
      )
    )
    try await nutritionRepository.save(
      log: NutritionLog(
        userID: "user-1",
        date: "2026-02-26",
        calories: 2100,
        proteinGrams: 145,
        carbsGrams: 225,
        fatsGrams: 68
      )
    )

    let useCase = BuildProgressSummaryUseCase(
      listWorkoutSessionsUseCase: ListWorkoutSessionsUseCase(repository: workoutRepository),
      listNutritionLogsUseCase: ListNutritionLogsUseCase(repository: nutritionRepository)
    )

    let summary = try await useCase.execute(
      userID: "user-1",
      generatedAt: makeDate("2026-02-26T10:00:00Z")
    )

    XCTAssertEqual(summary.userID, "user-1")
    XCTAssertEqual(summary.workoutSessionsCount, 2)
    XCTAssertEqual(summary.totalTrainingMinutes, 95)
    XCTAssertEqual(summary.totalCompletedSets, 3)
    XCTAssertEqual(summary.nutritionLogsCount, 2)
    XCTAssertEqual(summary.averageCalories, 2150)
    XCTAssertEqual(summary.averageProteinGrams, 147.5)
    XCTAssertEqual(summary.averageCarbsGrams, 227.5)
    XCTAssertEqual(summary.averageFatsGrams, 69)
    XCTAssertEqual(summary.history.count, 2)
    XCTAssertEqual(summary.history.first?.date, "2026-02-25")
    XCTAssertEqual(summary.history.last?.date, "2026-02-26")
  }

  func test_execute_throwsForEmptyUserID() async {
    let workoutRepository = InMemoryWorkoutSessionRepository()
    let nutritionRepository = InMemoryNutritionLogRepository()
    let useCase = BuildProgressSummaryUseCase(
      listWorkoutSessionsUseCase: ListWorkoutSessionsUseCase(repository: workoutRepository),
      listNutritionLogsUseCase: ListNutritionLogsUseCase(repository: nutritionRepository)
    )

    do {
      let _ = try await useCase.execute(userID: "")
      XCTFail("Expected missingUserID error")
    } catch let error as BuildProgressSummaryUseCaseError {
      XCTAssertEqual(error, .missingUserID)
    } catch {
      XCTFail("Unexpected error: \(error)")
    }
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
