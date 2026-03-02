Feature: C4-T3 runtime gate and backend-full readiness
  As a Flux technical lead
  I want cross-platform smoke validation after C4 hardening
  So that handoff to backend-full implementation is safe

  Scenario: Cross-platform smoke passes for C4
    Given C4-T2 runtime state hardening is implemented in iOS and web
    When workspace tests and platform tests are executed
    Then JS/TS workspace tests pass
    And iOS tests pass
    And C4 cycle can be marked as ready for backend-full handoff
