Feature: V7 P3 T2 V8 backlog definition
  As product and operations leadership
  We want a prioritized V8 backlog
  So that the next cycle starts with clear sequencing and feasible capacity

  Scenario: V8 backlog definition is approved
    Given V7 results are consolidated
    And streams are prioritized by impact and risk
    And dependencies are mapped across domains
    And capacity buffers are defined by wave
    When evidence is consolidated for V7-P3-T2
    Then V7-P3-T2 is accepted
    And evidence is published in "docs/validation/V7_P3_T2_V8_BACKLOG_DEFINITION.json"
