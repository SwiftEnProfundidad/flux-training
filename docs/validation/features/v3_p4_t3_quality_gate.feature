Feature: V3 P4 T3 Quality gate
  As a product team
  We want a deterministic quality gate before closing P4
  So that the implementation can transition to closure and release readiness

  Scenario: V3 quality gate passes
    Given cross-platform E2E suites are already completed
    When "pnpm -r test" and "cd apps/ios && swift test" are executed
    Then all suites pass with zero failures
    And the evidence is documented in "docs/validation/V3_P4_T3_QUALITY_GATE.json"
