import Foundation
import Observation

@MainActor
@Observable
public final class ObservabilityViewModel {
  public private(set) var analyticsEvents: [AnalyticsEvent] = []
  public private(set) var crashReports: [CrashReport] = []
  public private(set) var status: String = "idle"

  private let createAnalyticsEventUseCase: CreateAnalyticsEventUseCase
  private let listAnalyticsEventsUseCase: ListAnalyticsEventsUseCase
  private let createCrashReportUseCase: CreateCrashReportUseCase
  private let listCrashReportsUseCase: ListCrashReportsUseCase

  public init(
    createAnalyticsEventUseCase: CreateAnalyticsEventUseCase,
    listAnalyticsEventsUseCase: ListAnalyticsEventsUseCase,
    createCrashReportUseCase: CreateCrashReportUseCase,
    listCrashReportsUseCase: ListCrashReportsUseCase
  ) {
    self.createAnalyticsEventUseCase = createAnalyticsEventUseCase
    self.listAnalyticsEventsUseCase = listAnalyticsEventsUseCase
    self.createCrashReportUseCase = createCrashReportUseCase
    self.listCrashReportsUseCase = listCrashReportsUseCase
  }

  public func trackDemoEvent(userID: String, now: Date = Date()) async {
    do {
      _ = try await createAnalyticsEventUseCase.execute(
        event: AnalyticsEvent(
          userID: userID,
          name: "dashboard_interaction",
          source: .ios,
          occurredAt: now,
          attributes: ["screen": "dashboard"]
        )
      )
      status = "event_saved"
    } catch {
      status = "error"
    }
  }

  public func reportDemoCrash(userID: String, now: Date = Date()) async {
    do {
      _ = try await createCrashReportUseCase.execute(
        report: CrashReport(
          userID: userID,
          source: .ios,
          message: "Simulated crash report",
          stackTrace: "ObservabilityViewModel.swift",
          severity: .warning,
          occurredAt: now
        )
      )
      status = "crash_saved"
    } catch {
      status = "error"
    }
  }

  public func refresh(userID: String) async {
    do {
      async let eventsTask = listAnalyticsEventsUseCase.execute(userID: userID)
      async let reportsTask = listCrashReportsUseCase.execute(userID: userID)
      let (events, reports) = try await (eventsTask, reportsTask)
      analyticsEvents = events
      crashReports = reports
      status = "loaded"
    } catch {
      status = "error"
    }
  }
}
