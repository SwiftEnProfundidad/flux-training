Feature: V3 P0 T3 quality gate readiness
  As a delivery lead
  I want a minimum technical quality gate for V3
  So that implementation starts with verified cross-layer stability

  Scenario: Minimum tests per layer are green
    Given the contracts, backend and web suites are executed with "pnpm -r test"
    And the iOS suite is executed with "cd apps/ios && swift test"
    Then all layer suites pass with exit code 0
    And evidence is recorded in "docs/validation/V3_P0_T3_MIN_TEST_MATRIX.csv"

  Scenario: Critical cross-layer smoke is green
    Given the critical regression suite is executed with "pnpm test:critical"
    Then backend, web and iOS critical paths pass
    And no blocking regression remains open for V3 baseline

  Scenario: Gate evidence is publishable and auditable
    Given gate evidence is consolidated in "docs/validation/V3_P0_T3_QUALITY_GATE.json"
    Then task "V3-P0-T3" is marked as done in tracking
    And next task "V3-P1-T1" is the only task in progress
