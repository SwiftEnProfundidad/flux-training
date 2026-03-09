import Foundation
import Observation

@MainActor
@Observable
public final class ObservabilityViewModel {
  public private(set) var analyticsEvents: [AnalyticsEvent] = []
  public private(set) var crashReports: [CrashReport] = []
  public private(set) var supportIncidents: [SupportIncident] = []
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
    await trackRuntimeEvent(
      userID: userID,
      name: "dashboard_interaction",
      attributes: ["screen": "dashboard"],
      now: now
    )
  }

  public func trackRuntimeEvent(
    userID: String,
    name: String,
    attributes: [String: String],
    now: Date = Date()
  ) async {
    do {
      _ = try await createAnalyticsEventUseCase.execute(
        event: AnalyticsEvent(
          userID: userID,
          name: name,
          source: .ios,
          occurredAt: now,
          attributes: attributes
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
      supportIncidents = buildSupportIncidents(analyticsEvents: events, crashReports: reports)
      status = "loaded"
    } catch {
      status = "error"
    }
  }
}

private func buildSupportIncidents(
  analyticsEvents: [AnalyticsEvent],
  crashReports: [CrashReport]
) -> [SupportIncident] {
  let analyticsIncidents = analyticsEvents
    .filter(shouldIncludeAnalyticsEvent)
    .map { event in
      let reason = event.attributes["reason"]?.trimmingCharacters(in: .whitespacesAndNewlines)
      let normalizedReason = reason?.isEmpty == false ? reason! : "runtime_event"
      let payloadValidation =
        event.attributes["payloadValidation"]?.trimmingCharacters(in: .whitespacesAndNewlines)
      let domain = event.attributes["domain"]?.trimmingCharacters(in: .whitespacesAndNewlines)
      let correlationID =
        event.attributes["correlationId"]?.trimmingCharacters(in: .whitespacesAndNewlines)
      let severity = resolveAnalyticsSeverity(
        reason: normalizedReason,
        payloadValidation: payloadValidation ?? "ok"
      )
      return SupportIncident(
        id: "INC-\(event.source.rawValue.uppercased())-\(event.occurredAt.timeIntervalSince1970)-\(event.name)",
        openedAt: event.occurredAt,
        domain: domain?.isEmpty == false ? domain! : "operations",
        severity: severity,
        state: resolveIncidentState(severity: severity),
        summary: "\(event.name) · \(normalizedReason)",
        source: .analytics,
        correlationID: correlationID?.isEmpty == false ? correlationID! : "-"
      )
    }

  let crashIncidents = crashReports.map { report in
    let severity: SupportIncidentSeverity = report.severity == .fatal ? .high : .medium
    return SupportIncident(
      id: "INC-CRASH-\(report.source.rawValue.uppercased())-\(report.occurredAt.timeIntervalSince1970)",
      openedAt: report.occurredAt,
      domain: "operations",
      severity: severity,
      state: resolveIncidentState(severity: severity),
      summary: report.message,
      source: .crash,
      correlationID: "-"
    )
  }

  return (analyticsIncidents + crashIncidents).sorted(by: { $0.openedAt > $1.openedAt })
}

private func shouldIncludeAnalyticsEvent(_ event: AnalyticsEvent) -> Bool {
  let loweredName = event.name.lowercased()
  if loweredName.contains("blocked") || loweredName.contains("denied") || loweredName.contains("error") {
    return true
  }
  let payloadValidation = (event.attributes["payloadValidation"] ?? "ok").lowercased()
  return payloadValidation != "ok"
}

private func resolveAnalyticsSeverity(
  reason: String,
  payloadValidation: String
) -> SupportIncidentSeverity {
  let loweredReason = reason.lowercased()
  if loweredReason.contains("denied")
    || loweredReason.contains("forbidden")
    || payloadValidation.lowercased() == "error"
  {
    return .high
  }
  if loweredReason.contains("validation") || loweredReason.contains("missing") {
    return .medium
  }
  return .low
}

private func resolveIncidentState(severity: SupportIncidentSeverity) -> SupportIncidentState {
  switch severity {
  case .high:
    return .open
  case .medium, .low:
    return .inProgress
  }
}
