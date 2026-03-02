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
    XCTAssertEqual(viewModel.supportIncidents.count, 1)
    XCTAssertEqual(viewModel.supportIncidents.first?.severity, .medium)
    XCTAssertEqual(viewModel.supportIncidents.first?.state, .inProgress)
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
    XCTAssertEqual(viewModel.supportIncidents.count, 0)
  }

  func test_refresh_buildsSupportIncidentsForDeniedAndCrashFlows() async {
    let analyticsRepository = InMemoryAnalyticsEventRepository()
    let crashRepository = InMemoryCrashReportRepository()
    let viewModel = ObservabilityViewModel(
      createAnalyticsEventUseCase: CreateAnalyticsEventUseCase(repository: analyticsRepository),
      listAnalyticsEventsUseCase: ListAnalyticsEventsUseCase(repository: analyticsRepository),
      createCrashReportUseCase: CreateCrashReportUseCase(repository: crashRepository),
      listCrashReportsUseCase: ListCrashReportsUseCase(repository: crashRepository)
    )

    await viewModel.trackRuntimeEvent(
      userID: "user-3",
      name: "dashboard_action_blocked",
      attributes: [
        "domain": "operations",
        "reason": "domain_denied",
        "payloadValidation": "ok",
        "correlationId": "corr-123"
      ]
    )
    await viewModel.reportDemoCrash(userID: "user-3")
    await viewModel.refresh(userID: "user-3")

    XCTAssertEqual(viewModel.supportIncidents.count, 2)
    let deniedIncident = viewModel.supportIncidents.first(where: { $0.source == .analytics })
    XCTAssertEqual(deniedIncident?.severity, .high)
    XCTAssertEqual(deniedIncident?.domain, "operations")
    XCTAssertEqual(deniedIncident?.correlationID, "corr-123")
  }
}
