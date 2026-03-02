Feature: V3 P4 T2.1 Happy paths E2E
  As a product team
  We want deterministic happy-path coverage across backend, web and iOS
  So that critical flows can progress to edge-case hardening with low risk

  Scenario: Happy-path suites pass cross-platform
    Given happy-path suites exist in backend, web and iOS
    When "pnpm test:happy-paths" is executed
    Then all happy-path suites pass with zero failures
    And the result is documented in "docs/validation/V3_P4_T2_1_HAPPY_PATH_E2E.json"
