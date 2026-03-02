import Foundation

public struct RuntimeObservabilitySession: Sendable, Equatable {
  public let sessionID: String
  private(set) var eventIndex: Int
  private(set) var correlationIndex: Int
  private(set) var deniedSessionCount: Int
  private(set) var deniedByDomain: [ExperienceDomain: Int]

  public init(
    sessionID: String = "rt-\(UUID().uuidString.lowercased())",
    eventIndex: Int = 0,
    correlationIndex: Int = 0,
    deniedSessionCount: Int = 0,
    deniedByDomain: [ExperienceDomain: Int] = [:]
  ) {
    self.sessionID = sessionID
    self.eventIndex = eventIndex
    self.correlationIndex = correlationIndex
    self.deniedSessionCount = deniedSessionCount
    self.deniedByDomain = deniedByDomain
  }

  public mutating func nextCorrelationID(domain: ExperienceDomain, trigger: String) -> String {
    correlationIndex += 1
    return "\(sessionID):\(domain.rawValue):\(trigger):\(correlationIndex)"
  }

  public mutating func nextEventAttributes(
    domain: ExperienceDomain,
    correlationID: String? = nil
  ) -> [String: String] {
    eventIndex += 1
    var attributes: [String: String] = [
      "runtime_session_id": sessionID,
      "runtime_event_index": String(eventIndex),
      "denied_session_count": String(deniedSessionCount),
      "denied_domain_count": String(deniedByDomain[domain] ?? 0)
    ]
    if let correlationID {
      attributes["correlation_id"] = correlationID
    }
    return attributes
  }

  public mutating func nextDeniedEventAttributes(
    domain: ExperienceDomain,
    correlationID: String? = nil
  ) -> [String: String] {
    deniedSessionCount += 1
    deniedByDomain[domain] = (deniedByDomain[domain] ?? 0) + 1
    return nextEventAttributes(domain: domain, correlationID: correlationID)
  }
}
