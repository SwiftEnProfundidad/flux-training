import XCTest
@testable import FluxTraining

final class UXReadinessTests: XCTestCase {
  func test_make_returnsReadyToTrain_whenCoreStatusesAreHealthy() {
    let snapshot = UXReadinessBuilder.make(
      authStatus: "signed_in:apple",
      onboardingStatus: "saved",
      trainingStatus: "saved",
      nutritionStatus: "saved",
      progressStatus: "loaded",
      syncStatus: "synced",
      observabilityStatus: "loaded",
      pendingQueueCount: 0
    )

    XCTAssertGreaterThanOrEqual(snapshot.score, 90)
    XCTAssertEqual(snapshot.label, .readyToTrain)
    XCTAssertEqual(snapshot.tone, .positive)
  }

  func test_make_returnsNeedsSetup_whenMostStatusesAreIdle() {
    let snapshot = UXReadinessBuilder.make(
      authStatus: "signed_out",
      onboardingStatus: "idle",
      trainingStatus: "idle",
      nutritionStatus: "idle",
      progressStatus: "idle",
      syncStatus: "idle",
      observabilityStatus: "idle",
      pendingQueueCount: 3
    )

    XCTAssertLessThan(snapshot.score, 50)
    XCTAssertEqual(snapshot.label, .needsSetup)
    XCTAssertEqual(snapshot.tone, .warning)
  }
}
