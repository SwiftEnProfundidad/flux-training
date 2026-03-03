Feature: V7 P0 T3 provider fallback readiness
  As billing and operations owners
  We want provider fallback readiness validated
  So that monetization remains resilient during provider degradation

  Scenario: Provider fallback readiness is approved
    Given V7 tracking contract is frozen
    And fallback paths are defined for stripe, apple_iap and google_play
    And alerting thresholds are set for retry failures and recovery lag
    And runbook responsibilities are assigned across billing, support, backend and data
    When evidence is consolidated for V7-P0-T3
    Then V7-P0-T3 is accepted
    And evidence is published in "docs/validation/V7_P0_T3_PROVIDER_FALLBACK_READINESS.json"
