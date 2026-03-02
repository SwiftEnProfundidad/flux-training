Feature: V4 closure and V5 handoff
  As a release governance board
  We want to close V4 with auditable evidence and kickoff V5 with a single active task
  So that rollout execution starts from a controlled and validated baseline

  Scenario: V4 closes and hands off to V5 without governance gaps
    Given release governance tasks V4-P3-T1 and V4-P3-T2 are completed
    And final release check runs in green
    And all V4 validation artifacts are present
    When closure evidence is consolidated for V4-P3-T3
    Then cycle V4 is marked as closed
    And cycle V5 starts with V5-P0-T1 as the only task in construction
    And evidence is published in "docs/validation/V4_P3_T3_V5_HANDOFF.json"
