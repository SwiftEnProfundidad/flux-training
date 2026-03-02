Feature: V3 P4 T2.2 Edge cases E2E
  As a product team
  We want edge-case coverage across backend, web and iOS
  So that negative paths are controlled before recovery-path hardening

  Scenario: Edge-case suites pass cross-platform
    Given edge-case suites exist in backend, web and iOS
    When "pnpm test:edge-cases" is executed
    Then all edge-case suites pass with zero failures
    And the result is documented in "docs/validation/V3_P4_T2_2_EDGE_CASES_E2E.json"
