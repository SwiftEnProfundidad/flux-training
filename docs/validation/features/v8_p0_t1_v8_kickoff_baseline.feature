Feature: V8 P0 T1 kickoff baseline
  As executive and domain leads
  We want the V8 kickoff baseline validated
  So that cycle execution starts aligned and auditable

  Scenario: V8 kickoff baseline is approved
    Given V7 executive closure is completed
    And baseline KPIs are defined for V8 streams
    And cross-domain ownership is confirmed including platform
    And wave planning includes explicit incident and debt buffers
    When evidence is consolidated for V8-P0-T1
    Then V8-P0-T1 is accepted
    And evidence is published in "docs/validation/V8_P0_T1_V8_KICKOFF_BASELINE.json"
