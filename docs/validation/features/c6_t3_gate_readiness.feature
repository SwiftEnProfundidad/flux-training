Feature: C6-T3 gate readiness
  As a Flux delivery owner
  I want a final C6 gate with objective evidence
  So that backend-full integration starts from a stable runtime baseline

  Scenario: Global smoke passes after C6 runtime alignment
    Given C6-T1 and C6-T2 changes are integrated
    When regression tests are executed for contracts, web, backend and iOS
    Then all suites must pass without RBAC telemetry regressions

  Scenario: C6 checklist includes parity evidence
    Given iOS and web runtime telemetry are instrumented
    When parity evidence is collected
    Then dashboard_domain_changed exists in both clients
    And dashboard_domain_access_denied exists in both clients
    And dashboard_action_blocked exists in both clients
