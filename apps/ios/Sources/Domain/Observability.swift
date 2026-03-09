import Foundation

public enum ObservabilitySource: String, Sendable, Equatable {
  case web
  case ios
  case backend
}

public struct AnalyticsEvent: Sendable, Equatable, Identifiable {
  public let userID: String
  public let name: String
  public let source: ObservabilitySource
  public let occurredAt: Date
  public let attributes: [String: String]

  public var id: String {
    "\(name)-\(occurredAt.timeIntervalSince1970)"
  }

  public init(
    userID: String,
    name: String,
    source: ObservabilitySource,
    occurredAt: Date,
    attributes: [String: String]
  ) {
    self.userID = userID
    self.name = name
    self.source = source
    self.occurredAt = occurredAt
    self.attributes = attributes
  }
}

public enum CrashSeverity: String, Sendable, Equatable {
  case warning
  case fatal
}

public struct CrashReport: Sendable, Equatable, Identifiable {
  public let userID: String
  public let source: ObservabilitySource
  public let message: String
  public let stackTrace: String?
  public let severity: CrashSeverity
  public let occurredAt: Date

  public var id: String {
    "\(severity.rawValue)-\(occurredAt.timeIntervalSince1970)"
  }

  public init(
    userID: String,
    source: ObservabilitySource,
    message: String,
    stackTrace: String?,
    severity: CrashSeverity,
    occurredAt: Date
  ) {
    self.userID = userID
    self.source = source
    self.message = message
    self.stackTrace = stackTrace
    self.severity = severity
    self.occurredAt = occurredAt
  }
}

public enum SupportIncidentSource: String, Sendable, Equatable {
  case analytics
  case crash
}

public enum SupportIncidentSeverity: String, Sendable, Equatable {
  case high
  case medium
  case low
}

public enum SupportIncidentState: String, Sendable, Equatable {
  case open
  case inProgress = "in_progress"
  case resolved
}

public struct SupportIncident: Sendable, Equatable, Identifiable {
  public let id: String
  public let openedAt: Date
  public let domain: String
  public let severity: SupportIncidentSeverity
  public let state: SupportIncidentState
  public let summary: String
  public let source: SupportIncidentSource
  public let correlationID: String

  public init(
    id: String,
    openedAt: Date,
    domain: String,
    severity: SupportIncidentSeverity,
    state: SupportIncidentState,
    summary: String,
    source: SupportIncidentSource,
    correlationID: String
  ) {
    self.id = id
    self.openedAt = openedAt
    self.domain = domain
    self.severity = severity
    self.state = state
    self.summary = summary
    self.source = source
    self.correlationID = correlationID
  }
}

public protocol AnalyticsEventRepository: Sendable {
  func save(event: AnalyticsEvent) async throws
  func listByUserID(_ userID: String) async throws -> [AnalyticsEvent]
}

public protocol CrashReportRepository: Sendable {
  func save(report: CrashReport) async throws
  func listByUserID(_ userID: String) async throws -> [CrashReport]
}
