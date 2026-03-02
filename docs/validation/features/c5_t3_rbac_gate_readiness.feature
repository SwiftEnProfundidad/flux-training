Feature: C5-T3 RBAC runtime gate and readiness
  As a Flux technical owner
  I want a global smoke gate after RBAC runtime implementation
  So that cycle C5 can be closed without unknowns

  Scenario: Workspace and platform tests pass after RBAC cycle
    Given RBAC runtime and role persistence are implemented in iOS and web
    When full workspace tests and iOS tests run
    Then all suites pass without regressions
    And C5 can be marked as ready for backend-full RBAC handoff
