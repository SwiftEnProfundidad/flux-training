Feature: V5 P3 T3 executive closure
  As executive product and engineering stakeholders
  We want a formal closure package for V5
  So that continuity decisions and transition to V6 are auditable

  Scenario: V5 executive closure is approved
    Given V5 learning consolidation is completed
    And V6 backlog definition is validated
    And rollout, adoption and operations outcomes are consolidated
    When evidence is consolidated for V5-P3-T3
    Then V5-P3-T3 is accepted
    And evidence is published in "docs/validation/V5_P3_T3_V5_EXECUTIVE_CLOSURE.json"
