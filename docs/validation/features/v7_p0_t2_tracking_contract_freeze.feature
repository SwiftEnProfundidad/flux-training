Feature: V7 P0 T2 tracking contract freeze
  As growth, data and operations owners
  We want the V7 tracking contract frozen
  So that metric governance and QA checks are stable before reliability hardening

  Scenario: V7 tracking contract is frozen and auditable
    Given V7 kickoff baseline is approved
    And event schema taxonomy is defined with mandatory fields
    And metrics dictionary includes owner, formula and cadence
    And tracking QA rules define naming, cardinality and freshness checks
    When evidence is consolidated for V7-P0-T2
    Then V7-P0-T2 is accepted
    And evidence is published in "docs/validation/V7_P0_T2_TRACKING_CONTRACT_FREEZE.json"
