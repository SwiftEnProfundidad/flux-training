Feature: V8 P1 T1 retention scaling
  As growth and product operations
  We want retention scaling controls activated
  So that churn risk is reduced without fatigue side effects

  Scenario: Retention scaling is accepted for V8
    Given V8 execution readiness gate is approved
    And cohort expansion is defined with ownership and priorities
    And personalized nudges are configured by signal and domain
    And fatigue guardrails are enforced by cadence and silent windows
    When evidence is consolidated for V8-P1-T1
    Then V8-P1-T1 is accepted
    And evidence is published in "docs/validation/V8_P1_T1_RETENTION_SCALING.json"
