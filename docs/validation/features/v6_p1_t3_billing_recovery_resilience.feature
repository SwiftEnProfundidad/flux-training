Feature: V6 P1 T3 billing recovery resilience
  As product, billing and support teams
  We want resilient billing recovery flows
  So that revenue loss and involuntary churn are minimized

  Scenario: Billing recovery resilience model is approved
    Given contextual paywall and upgrade strategy is active
    And payment failures are classified by recoverability
    And grace-period policy is defined by plan tier
    And win-back journeys include channels, offers and measurable outcomes
    When evidence is consolidated for V6-P1-T3
    Then V6-P1-T3 is accepted
    And evidence is published in "docs/validation/V6_P1_T3_BILLING_RECOVERY_RESILIENCE.json"
