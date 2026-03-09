import XCTest
@testable import FluxTraining

final class RuntimeObservabilitySessionTests: XCTestCase {
  func test_nextEventAttributes_incrementsEventIndexWithoutDeniedCounters() {
    var session = RuntimeObservabilitySession(sessionID: "rt-fixed")

    let first = session.nextEventAttributes(domain: .training)
    let second = session.nextEventAttributes(domain: .training)

    XCTAssertEqual(first["runtime_session_id"], "rt-fixed")
    XCTAssertEqual(first["runtime_event_index"], "1")
    XCTAssertEqual(first["denied_session_count"], "0")
    XCTAssertEqual(first["denied_domain_count"], "0")
    XCTAssertEqual(second["runtime_event_index"], "2")
    XCTAssertEqual(second["denied_session_count"], "0")
  }

  func test_nextDeniedEventAttributes_incrementsSessionAndDomainDeniedCounters() {
    var session = RuntimeObservabilitySession(sessionID: "rt-denied")

    let firstDenied = session.nextDeniedEventAttributes(domain: .operations)
    let secondDenied = session.nextDeniedEventAttributes(domain: .operations)
    let onboardingDenied = session.nextDeniedEventAttributes(domain: .onboarding)

    XCTAssertEqual(firstDenied["denied_session_count"], "1")
    XCTAssertEqual(firstDenied["denied_domain_count"], "1")
    XCTAssertEqual(secondDenied["denied_session_count"], "2")
    XCTAssertEqual(secondDenied["denied_domain_count"], "2")
    XCTAssertEqual(onboardingDenied["denied_session_count"], "3")
    XCTAssertEqual(onboardingDenied["denied_domain_count"], "1")
  }

  func test_nextCorrelationID_propagatesToEvents() {
    var session = RuntimeObservabilitySession(sessionID: "rt-correlation")

    let correlationID = session.nextCorrelationID(domain: .progress, trigger: "domain_select")
    let deniedAttributes = session.nextDeniedEventAttributes(
      domain: .progress,
      correlationID: correlationID
    )
    let blockedAttributes = session.nextEventAttributes(
      domain: .progress,
      correlationID: correlationID
    )

    XCTAssertEqual(correlationID, "rt-correlation:progress:domain_select:1")
    XCTAssertEqual(deniedAttributes["correlation_id"], correlationID)
    XCTAssertEqual(blockedAttributes["correlation_id"], correlationID)
    XCTAssertEqual(deniedAttributes["runtime_event_index"], "1")
    XCTAssertEqual(blockedAttributes["runtime_event_index"], "2")
  }
}
