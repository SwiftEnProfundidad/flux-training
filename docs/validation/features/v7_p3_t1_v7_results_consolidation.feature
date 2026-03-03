Feature: V7 P3 T1 results consolidation
  As leadership stakeholders
  We want consolidated V7 outcomes
  So that closure and next-cycle planning are based on auditable evidence

  Scenario: V7 results consolidation is approved
    Given weekly operating governance is completed
    And business outcome metrics are consolidated
    And operational impact and support signals are consolidated
    And residual risks are prioritized for transition
    When evidence is consolidated for V7-P3-T1
    Then V7-P3-T1 is accepted
    And evidence is published in "docs/validation/V7_P3_T1_V7_RESULTS_CONSOLIDATION.json"
