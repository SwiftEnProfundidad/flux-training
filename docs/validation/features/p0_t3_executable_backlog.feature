Feature: P0 T3 executable backlog matrix for enterprise remediation
  As a product design lead
  I want a severity/dependency mapped backlog from forensic findings
  So that execution can proceed without ambiguity across iOS and Web

  Scenario: Backlog matrix is complete and traceable
    Given the canonical tracking file "docs/FLUX_ENTERPRISE_REMEDIATION_TRACKING_V1.md"
    When I open "docs/validation/P0_T3_EXECUTABLE_BACKLOG_V1.csv"
    Then each remediation task has a mapped finding id
    And each item includes severity, dependency, and execution wave
    And each item references a target phase task from P1 to P8

  Scenario: Execution waves are prioritized and measurable
    Given the summary file "docs/validation/P0_T3_EXECUTION_WAVES_V1.json"
    Then it must define W1 to W8 in order
    And each wave must include exit criteria
    And severity totals must be consistent with the backlog matrix
