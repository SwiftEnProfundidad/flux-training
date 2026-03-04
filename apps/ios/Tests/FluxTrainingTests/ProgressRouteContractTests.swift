import XCTest
@testable import FluxTraining

final class ProgressRouteContractTests: XCTestCase {
  func test_routeIdentifiers_matchCanonicalValues() {
    XCTAssertEqual(ProgressRouteContract.metricsDarkRouteID, "progress.route.metrics")
    XCTAssertEqual(ProgressRouteContract.metricsLightRouteID, "progress.route.metricsLight")
    XCTAssertEqual(ProgressRouteContract.metricsRouteID, "progress.route.metrics")
  }

  func test_screenIdentifiers_matchCanonicalValues() {
    XCTAssertEqual(ProgressRouteContract.metricsDarkScreenID, "progress.metrics.screen")
    XCTAssertEqual(ProgressRouteContract.metricsLightScreenID, "progress.metrics.light.screen")
    XCTAssertEqual(ProgressRouteContract.metricsScreenID, "progress.metrics.screen")
  }
}
