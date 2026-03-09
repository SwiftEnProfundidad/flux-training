import XCTest
@testable import FluxTraining

final class EnterpriseRuntimeStateTests: XCTestCase {
  func test_defaultStore_setsSuccessForAllDomains() {
    let store = ExperienceDomainRuntimeStateStore()

    XCTAssertEqual(store.state(for: .all), .success)
    XCTAssertEqual(store.state(for: .onboarding), .success)
    XCTAssertEqual(store.state(for: .training), .success)
    XCTAssertEqual(store.state(for: .nutrition), .success)
    XCTAssertEqual(store.state(for: .progress), .success)
    XCTAssertEqual(store.state(for: .operations), .success)
  }

  func test_set_and_reset_runtimeState_forConcreteDomain() {
    var store = ExperienceDomainRuntimeStateStore()

    store.set(state: .offline, for: .operations)
    XCTAssertEqual(store.state(for: .operations), .offline)

    store.reset(for: .operations)
    XCTAssertEqual(store.state(for: .operations), .success)
  }

  func test_set_onAllDomain_isIgnored() {
    var store = ExperienceDomainRuntimeStateStore()

    store.set(state: .denied, for: .all)

    XCTAssertEqual(store.state(for: .all), .success)
    XCTAssertEqual(store.state(for: .operations), .success)
  }
}
