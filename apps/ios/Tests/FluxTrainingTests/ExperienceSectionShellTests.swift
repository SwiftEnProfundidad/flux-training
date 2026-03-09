import XCTest
@testable import FluxTraining

final class ExperienceSectionShellTests: XCTestCase {
  func test_visibleModules_returnsAll_whenDomainIsAll() {
    let shell = ExperienceSectionShell(activeDomain: .all)

    XCTAssertEqual(shell.visibleModules(), ExperienceModule.allCases)
  }

  func test_visibleModules_returnsOnlyTraining_whenDomainIsTraining() {
    let shell = ExperienceSectionShell(activeDomain: .training)

    XCTAssertEqual(shell.visibleModules(), [.training])
    XCTAssertTrue(shell.isModuleVisible(.training))
    XCTAssertFalse(shell.isModuleVisible(.auth))
    XCTAssertFalse(shell.isModuleVisible(.nutrition))
  }

  func test_visibleModules_returnsOperationsSet_whenDomainIsOperations() {
    let shell = ExperienceSectionShell(activeDomain: .operations)

    XCTAssertEqual(
      shell.visibleModules(),
      [.settings, .legal, .offlineSync, .observability, .recommendations]
    )
    XCTAssertTrue(shell.isModuleVisible(.settings))
    XCTAssertTrue(shell.isModuleVisible(.legal))
    XCTAssertTrue(shell.isModuleVisible(.offlineSync))
    XCTAssertTrue(shell.isModuleVisible(.observability))
    XCTAssertTrue(shell.isModuleVisible(.recommendations))
    XCTAssertFalse(shell.isModuleVisible(.progress))
  }

  func test_select_updatesActiveDomain() {
    var shell = ExperienceSectionShell(activeDomain: .onboarding)

    shell.select(domain: .nutrition)

    XCTAssertEqual(shell.activeDomain, .nutrition)
  }

  func test_persistedInitializer_restoresValidDomain() {
    let shell = ExperienceSectionShell(persistedDomainRawValue: ExperienceDomain.progress.rawValue)

    XCTAssertEqual(shell.activeDomain, .progress)
  }

  func test_persistedInitializer_fallsBackToAllForInvalidDomain() {
    let shell = ExperienceSectionShell(persistedDomainRawValue: "invalid-domain")

    XCTAssertEqual(shell.activeDomain, .all)
  }

  func test_roleEnum_rawValues_areStableForBackendContracts() {
    XCTAssertEqual(ExperienceRole.athlete.rawValue, "athlete")
    XCTAssertEqual(ExperienceRole.coach.rawValue, "coach")
    XCTAssertEqual(ExperienceRole.admin.rawValue, "admin")
  }
}
