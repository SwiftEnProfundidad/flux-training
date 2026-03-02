import XCTest
@testable import FluxTraining

@MainActor
final class ObservabilityViewModelTests: XCTestCase {
  func test_trackReportAndRefresh_updatesStatusAndCounts() async {
    let analyticsRepository = InMemoryAnalyticsEventRepository()
    let crashRepository = InMemoryCrashReportRepository()
    let viewModel = ObservabilityViewModel(
      createAnalyticsEventUseCase: CreateAnalyticsEventUseCase(repository: analyticsRepository),
      listAnalyticsEventsUseCase: ListAnalyticsEventsUseCase(repository: analyticsRepository),
      createCrashReportUseCase: CreateCrashReportUseCase(repository: crashRepository),
      listCrashReportsUseCase: ListCrashReportsUseCase(repository: crashRepository)
    )

    await viewModel.trackDemoEvent(userID: "user-1")
    XCTAssertEqual(viewModel.status, "event_saved")

    await viewModel.reportDemoCrash(userID: "user-1")
    XCTAssertEqual(viewModel.status, "crash_saved")

    await viewModel.refresh(userID: "user-1")
    XCTAssertEqual(viewModel.status, "loaded")
    XCTAssertEqual(viewModel.analyticsEvents.count, 1)
    XCTAssertEqual(viewModel.crashReports.count, 1)
  }

  func test_trackRuntimeEvent_persistsCustomNameAndAttributes() async {
    let analyticsRepository = InMemoryAnalyticsEventRepository()
    let crashRepository = InMemoryCrashReportRepository()
    let viewModel = ObservabilityViewModel(
      createAnalyticsEventUseCase: CreateAnalyticsEventUseCase(repository: analyticsRepository),
      listAnalyticsEventsUseCase: ListAnalyticsEventsUseCase(repository: analyticsRepository),
      createCrashReportUseCase: CreateCrashReportUseCase(repository: crashRepository),
      listCrashReportsUseCase: ListCrashReportsUseCase(repository: crashRepository)
    )

    await viewModel.trackRuntimeEvent(
      userID: "user-2",
      name: "dashboard_role_changed",
      attributes: ["role": "coach", "domain": "operations"]
    )
    await viewModel.refresh(userID: "user-2")

    XCTAssertEqual(viewModel.status, "loaded")
    XCTAssertEqual(viewModel.analyticsEvents.count, 1)
    XCTAssertEqual(viewModel.analyticsEvents.first?.name, "dashboard_role_changed")
    XCTAssertEqual(viewModel.analyticsEvents.first?.attributes["role"], "coach")
  }
}
