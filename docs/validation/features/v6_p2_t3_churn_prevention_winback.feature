Feature: V6 P2 T3 churn prevention and win-back
  As retention and growth teams
  We want proactive churn prevention and win-back playbooks
  So that retention and recurring revenue remain healthy

  Scenario: Churn prevention and win-back model is approved
    Given multichannel CRM operations are active
    And churn risk score tiers are defined with daily refresh
    And intervention playbooks exist for low, medium and high risk users
    And incremental measurement is defined with control and treatment cohorts
    When evidence is consolidated for V6-P2-T3
    Then V6-P2-T3 is accepted
    And evidence is published in "docs/validation/V6_P2_T3_CHURN_PREVENTION_WINBACK.json"
