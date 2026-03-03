Feature: V7 P3 T3 executive closure
  As executive stakeholders
  We want V7 formally closed
  So that transition to V8 is explicit and auditable

  Scenario: V7 executive closure is approved
    Given V8 backlog definition is completed
    And final report includes business, operations and risk outcomes
    And continuity decision is explicitly approved
    And handoff package includes ownership and evidence references
    When evidence is consolidated for V7-P3-T3
    Then V7-P3-T3 is accepted
    And evidence is published in "docs/validation/V7_P3_T3_V7_EXECUTIVE_CLOSURE.json"
