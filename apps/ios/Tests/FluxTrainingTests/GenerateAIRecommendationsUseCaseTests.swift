import XCTest
@testable import FluxTraining

final class GenerateAIRecommendationsUseCaseTests: XCTestCase {
  func test_execute_returnsHighPriorityRecommendation_whenAdherenceDrops() async {
    let fixedDate = makeDate("2026-03-01T10:00:00Z")
    let useCase = GenerateAIRecommendationsUseCase(now: { fixedDate })

    let recommendations = await useCase.execute(
      userID: "user-1",
      goal: .fatLoss,
      pendingQueueCount: 2,
      daysSinceLastWorkout: 3,
      recentCompletionRate: 0.42,
      locale: "es-ES"
    )

    XCTAssertFalse(recommendations.isEmpty)
    XCTAssertEqual(recommendations.first?.priority, .high)
  }

  private func makeDate(_ raw: String) -> Date {
    let formatter = ISO8601DateFormatter()
    return formatter.date(from: raw) ?? Date()
  }
}
