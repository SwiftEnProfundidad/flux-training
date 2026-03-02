Feature: V3 P4 T2.3 Recovery paths E2E
  As a product team
  We want deterministic recovery-path coverage across backend, web and iOS
  So that transient failures can recover to consistent operational state

  Scenario: Recovery-path suites pass cross-platform
    Given recovery-path suites exist in backend, web and iOS
    When "pnpm test:recovery-paths" is executed
    Then all recovery-path suites pass with zero failures
    And the result is documented in "docs/validation/V3_P4_T2_3_RECOVERY_PATHS_E2E.json"
