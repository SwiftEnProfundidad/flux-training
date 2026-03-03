Feature: V7 P1 T2 retention hypothesis experimentation
  As product, growth and operations owners
  We want role-based retention experiments defined
  So that D7 and D30 retention can be improved with controlled evidence

  Scenario: Retention experimentation framework is approved
    Given cohort paywall tuning is completed
    And role-based hypotheses are defined for athlete, coach and admin
    And A/B setup includes allocation, sample and significance criteria
    And promote/iterate/rollback rules are explicit
    When evidence is consolidated for V7-P1-T2
    Then V7-P1-T2 is accepted
    And evidence is published in "docs/validation/V7_P1_T2_RETENTION_HYPOTHESIS_EXPERIMENTATION.json"
