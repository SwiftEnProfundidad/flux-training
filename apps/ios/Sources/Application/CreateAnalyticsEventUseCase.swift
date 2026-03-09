import Foundation

public enum CreateAnalyticsEventError: Error, Equatable {
  case emptyUserID
  case emptyName
}

private let canonicalAnalyticsEventNames: Set<String> = [
  "dashboard_interaction",
  "dashboard_domain_changed",
  "dashboard_role_changed",
  "dashboard_domain_access_denied",
  "dashboard_action_blocked",
  "governance_bulk_role_assignment_saved",
  "billing_support_incidents_resolved",
  "audit_timeline_exported",
  "critical_regression_passed",
  "happy_path_completed",
  "recovery_path_completed"
]

public struct CreateAnalyticsEventUseCase: Sendable {
  private let repository: any AnalyticsEventRepository

  public init(repository: any AnalyticsEventRepository) {
    self.repository = repository
  }

  public func execute(event: AnalyticsEvent) async throws -> AnalyticsEvent {
    guard event.userID.isEmpty == false else { throw CreateAnalyticsEventError.emptyUserID }
    guard event.name.isEmpty == false else { throw CreateAnalyticsEventError.emptyName }
    let canonicalEventName = canonicalAnalyticsEventNames.contains(event.name)
      ? event.name
      : "custom"
    let trimmedCorrelationID =
      event.attributes["correlationId"]?.trimmingCharacters(in: .whitespacesAndNewlines)
    let correlationID: String
    if let trimmedCorrelationID, trimmedCorrelationID.isEmpty == false {
      correlationID = trimmedCorrelationID
    } else {
      correlationID = "corr-\(UUID().uuidString.lowercased())"
    }
    let runtimeEventIndex = event.attributes["runtimeEventIndex"] ?? "0"

    let normalizedEvent = AnalyticsEvent(
      userID: event.userID,
      name: event.name,
      source: event.source,
      occurredAt: event.occurredAt,
      attributes: event.attributes.merging(
        [
          "canonicalEventName": canonicalEventName,
          "correlationId": correlationID,
          "runtimeEventIndex": runtimeEventIndex,
          "source": event.source.rawValue
        ],
        uniquingKeysWith: { _, right in right }
      )
    )
    try await repository.save(event: normalizedEvent)
    return normalizedEvent
  }
}
