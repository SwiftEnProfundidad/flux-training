import XCTest
@testable import FluxTraining

@MainActor
final class ProgressViewModelTests: XCTestCase {
  func test_refresh_loadsSummary() async throws {
    let workoutRepository = InMemoryWorkoutSessionRepository()
    let nutritionRepository = InMemoryNutritionLogRepository()

    try await workoutRepository.save(
      session: WorkoutSession(
        userID: "user-1",
        planID: "plan-1",
        startedAt: makeDate("2026-02-25T08:00:00Z"),
        endedAt: makeDate("2026-02-25T08:30:00Z"),
        exercises: [ExerciseLog(exerciseID: "squat", sets: [SetLog(reps: 8, loadKg: 60, rpe: 8)])]
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

    let useCase = BuildProgressSummaryUseCase(
      listWorkoutSessionsUseCase: ListWorkoutSessionsUseCase(repository: workoutRepository),
      listNutritionLogsUseCase: ListNutritionLogsUseCase(repository: nutritionRepository)
    )
    let viewModel = ProgressViewModel(buildProgressSummaryUseCase: useCase)

    await viewModel.refresh(userID: "user-1")

    XCTAssertEqual(viewModel.status, NutritionProgressAIScreenStatus.loaded.rawValue)
    XCTAssertEqual(viewModel.summary?.workoutSessionsCount, 1)
    XCTAssertEqual(viewModel.summary?.nutritionLogsCount, 1)
    XCTAssertEqual(viewModel.screenStatus, .loaded)
  }

  func test_refresh_setsEmptyStatusWhenNoDataIsAvailable() async {
    let workoutRepository = InMemoryWorkoutSessionRepository()
    let nutritionRepository = InMemoryNutritionLogRepository()
    let useCase = BuildProgressSummaryUseCase(
      listWorkoutSessionsUseCase: ListWorkoutSessionsUseCase(repository: workoutRepository),
      listNutritionLogsUseCase: ListNutritionLogsUseCase(repository: nutritionRepository)
    )
    let viewModel = ProgressViewModel(buildProgressSummaryUseCase: useCase)

    await viewModel.refresh(userID: "user-empty")

    XCTAssertEqual(viewModel.status, NutritionProgressAIScreenStatus.empty.rawValue)
    XCTAssertEqual(viewModel.summary?.workoutSessionsCount, 0)
    XCTAssertEqual(viewModel.summary?.nutritionLogsCount, 0)
    XCTAssertEqual(viewModel.screenStatus, .empty)
  }

  func test_refresh_setsErrorStatusWhenUserIDIsEmpty() async {
    let workoutRepository = InMemoryWorkoutSessionRepository()
    let nutritionRepository = InMemoryNutritionLogRepository()
    let useCase = BuildProgressSummaryUseCase(
      listWorkoutSessionsUseCase: ListWorkoutSessionsUseCase(repository: workoutRepository),
      listNutritionLogsUseCase: ListNutritionLogsUseCase(repository: nutritionRepository)
    )
    let viewModel = ProgressViewModel(buildProgressSummaryUseCase: useCase)

    await viewModel.refresh(userID: "")

    XCTAssertEqual(viewModel.status, NutritionProgressAIScreenStatus.validationError.rawValue)
    XCTAssertNil(viewModel.summary)
    XCTAssertEqual(viewModel.screenStatus, .validationError)
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
