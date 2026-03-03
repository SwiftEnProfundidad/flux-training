Feature: V8 P1 T2 billing anomaly intelligence
  As billing and platform operations
  We want anomaly intelligence and fallback routing hardened
  So that recovery variability is reduced with forensic traceability

  Scenario: Billing anomaly intelligence is accepted for V8
    Given retention scaling is approved
    And anomaly classifier thresholds are defined
    And fallback auto-routing by provider and cause is configured
    And forensic reporting schema is complete for audits
    When evidence is consolidated for V8-P1-T2
    Then V8-P1-T2 is accepted
    And evidence is published in "docs/validation/V8_P1_T2_BILLING_ANOMALY_INTELLIGENCE.json"
