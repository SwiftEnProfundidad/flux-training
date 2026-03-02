Feature: P1 T1 board noise cleanup baseline
  As a design operations owner
  I want to identify non-product sections before cleanup
  So that product boards remain focused on sections, screens, and flows

  Scenario: Noise candidates are identified per board
    Given the canonical file "flux.pen"
    When I review "docs/validation/P1_T1_NOISE_AUDIT_V1.csv"
    Then every candidate must belong to BOARD_IOS_APP or BOARD_WEB_APP
    And each candidate must include reason and recommended action

  Scenario: Cleanup summary is traceable
    Given the summary file "docs/validation/P1_T1_NOISE_SUMMARY_V1.json"
    Then it must list candidate section ids for cleanup
    And it must include per-board counts
