Feature: V3 P4 T1 iOS/Web functional parity matrix
  As product owner
  I want parity evidence by domain before E2E hardening
  So that cross-platform divergences are closed in a controlled way

  Scenario: Parity matrix is generated with domain-level status
    Given the artifact "docs/validation/V3_P4_T1_IOS_WEB_PARITY_MATRIX.csv"
    Then each core domain must include iOS scope, web scope and shared contracts
    And each row must declare state_parity and flow_parity status

  Scenario: Parity summary surfaces open gaps for remediation
    Given the artifact "docs/validation/V3_P4_T1_IOS_WEB_PARITY_SUMMARY.json"
    Then open gaps must be explicit with severity and next subtask
    And overall parity must be measurable with pass/review/fail counters
