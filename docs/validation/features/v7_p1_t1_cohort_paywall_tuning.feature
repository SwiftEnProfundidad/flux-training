Feature: V7 P1 T1 cohort paywall tuning
  As growth and product owners
  We want cohort-specific paywall tuning
  So that conversion improves without harming retention

  Scenario: Cohort paywall strategy is approved
    Given provider fallback readiness is completed
    And cohort matrix defines high intent, at-risk and returning user behaviors
    And contextual triggers are defined for high-value moments
    And fatigue guardrails cap paywall pressure
    When evidence is consolidated for V7-P1-T1
    Then V7-P1-T1 is accepted
    And evidence is published in "docs/validation/V7_P1_T1_COHORT_PAYWALL_TUNING.json"
