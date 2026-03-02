Feature: V6 P3 T1 results consolidation
  As executive stakeholders
  We want a consolidated V6 outcomes package
  So that V7 planning starts from validated impact and known residual risks

  Scenario: V6 results consolidation is approved
    Given retention and churn prevention workstreams are completed
    And business impact is consolidated across conversion and retained revenue
    And operational impact is consolidated across support and billing recovery
    And residual risks include owner, mitigation and target date
    When evidence is consolidated for V6-P3-T1
    Then V6-P3-T1 is accepted
    And evidence is published in "docs/validation/V6_P3_T1_V6_RESULTS_CONSOLIDATION.json"
