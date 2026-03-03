Feature: V7 P2 T2 churn runbook parity
  As operations and support leadership
  We want churn scenario runbooks aligned by role
  So that response quality is consistent and auditable

  Scenario: Churn runbook parity is approved
    Given billing provider hardening is completed
    And top churn scenarios are defined with matching runbooks
    And role-specific action ownership is explicit
    And SLA audit thresholds are defined for response and recovery
    When evidence is consolidated for V7-P2-T2
    Then V7-P2-T2 is accepted
    And evidence is published in "docs/validation/V7_P2_T2_CHURN_RUNBOOK_PARITY.json"
