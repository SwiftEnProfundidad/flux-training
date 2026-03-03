Feature: V6 P3 T3 executive closure
  As executive stakeholders
  We want a formal V6 closure package
  So that continuity to V7 is auditable and operationally ready

  Scenario: V6 executive closure is approved
    Given V6 results are consolidated
    And V7 backlog definition is validated
    And continuity decision criteria are met
    When evidence is consolidated for V6-P3-T3
    Then V6-P3-T3 is accepted
    And evidence is published in "docs/validation/V6_P3_T3_V6_EXECUTIVE_CLOSURE.json"
