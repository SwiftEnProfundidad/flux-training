Feature: V7 P2 T1 billing provider hardening
  As billing operations and platform owners
  We want provider-specific billing hardening
  So that recovery is stable under provider volatility

  Scenario: Billing provider hardening is approved
    Given conversion friction remediation is completed
    And retry policies are hardened per provider
    And fallback routes include deterministic reconciliation
    And monitoring defines SLOs and incident alerts
    When evidence is consolidated for V7-P2-T1
    Then V7-P2-T1 is accepted
    And evidence is published in "docs/validation/V7_P2_T1_BILLING_PROVIDER_HARDENING.json"
