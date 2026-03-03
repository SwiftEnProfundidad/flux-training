Feature: V7 P0 T1 kickoff and baseline
  As executive and domain owners
  We want a formal V7 kickoff baseline
  So that execution starts aligned across KPIs, ownership and wave planning

  Scenario: V7 kickoff baseline is approved
    Given V6 executive closure is completed
    And baseline KPIs are defined for growth and operations
    And cross-domain owners are confirmed
    And wave planning includes incident and debt reserves
    When evidence is consolidated for V7-P0-T1
    Then V7-P0-T1 is accepted
    And evidence is published in "docs/validation/V7_P0_T1_V7_KICKOFF_BASELINE.json"
