Feature: V5 P3 T2 define V6 backlog
  As product and engineering leadership
  We want a prioritized and capacity-aware V6 backlog
  So that the next cycle starts with clear sequencing and dependencies

  Scenario: V6 backlog definition is approved
    Given V5 learnings are consolidated and validated
    And a prioritization model exists with impact, effort and risk criteria
    And critical dependencies are mapped with owners and gating rules
    And execution capacity is defined by waves with reserved operational bandwidth
    When evidence is consolidated for V5-P3-T2
    Then V5-P3-T2 is accepted
    And evidence is published in "docs/validation/V5_P3_T2_V6_BACKLOG_DEFINITION.json"
