import XCTest
@testable import FluxTraining

final class ProgressRouteContractTests: XCTestCase {
  func test_routeIdentifiers_matchCanonicalValues() {
    XCTAssertEqual(ProgressRouteContract.metricsDarkRouteID, "progress.route.metrics")
    XCTAssertEqual(ProgressRouteContract.goalAdjustDarkRouteID, "progress.route.goalAdjust")
    XCTAssertEqual(ProgressRouteContract.aiCoachDarkRouteID, "progress.route.aiCoach")
    XCTAssertEqual(ProgressRouteContract.weeklyReviewDarkRouteID, "progress.route.weeklyReview")
    XCTAssertEqual(ProgressRouteContract.metricsLightRouteID, "progress.route.metricsLight")
    XCTAssertEqual(ProgressRouteContract.goalAdjustLightRouteID, "progress.route.goalAdjustLight")
    XCTAssertEqual(ProgressRouteContract.aiCoachLightRouteID, "progress.route.aiCoachLight")
    XCTAssertEqual(ProgressRouteContract.weeklyReviewLightRouteID, "progress.route.weeklyReviewLight")
    XCTAssertEqual(ProgressRouteContract.metricsRouteID, "progress.route.metrics")
    XCTAssertEqual(ProgressRouteContract.goalAdjustRouteID, "progress.route.goalAdjust")
    XCTAssertEqual(ProgressRouteContract.aiCoachRouteID, "progress.route.aiCoach")
    XCTAssertEqual(ProgressRouteContract.weeklyReviewRouteID, "progress.route.weeklyReview")
  }

  func test_screenIdentifiers_matchCanonicalValues() {
    XCTAssertEqual(ProgressRouteContract.metricsDarkScreenID, "progress.metrics.screen")
    XCTAssertEqual(ProgressRouteContract.goalAdjustDarkScreenID, "progress.goalAdjust.screen")
    XCTAssertEqual(ProgressRouteContract.aiCoachDarkScreenID, "progress.aiCoach.screen")
    XCTAssertEqual(ProgressRouteContract.weeklyReviewDarkScreenID, "progress.weeklyReview.screen")
    XCTAssertEqual(ProgressRouteContract.metricsLightScreenID, "progress.metrics.light.screen")
    XCTAssertEqual(ProgressRouteContract.goalAdjustLightScreenID, "progress.goalAdjust.light.screen")
    XCTAssertEqual(ProgressRouteContract.aiCoachLightScreenID, "progress.aiCoach.light.screen")
    XCTAssertEqual(ProgressRouteContract.weeklyReviewLightScreenID, "progress.weeklyReview.light.screen")
    XCTAssertEqual(ProgressRouteContract.metricsScreenID, "progress.metrics.screen")
    XCTAssertEqual(ProgressRouteContract.goalAdjustScreenID, "progress.goalAdjust.screen")
    XCTAssertEqual(ProgressRouteContract.aiCoachScreenID, "progress.aiCoach.screen")
    XCTAssertEqual(ProgressRouteContract.weeklyReviewScreenID, "progress.weeklyReview.screen")
  }
}
