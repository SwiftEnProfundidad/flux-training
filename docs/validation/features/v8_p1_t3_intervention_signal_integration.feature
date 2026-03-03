Feature: V8 P1 T3 intervention signal integration
  As cross-domain operators
  We want integrated signals for early intervention
  So that high-risk situations are routed to owners within SLA

  Scenario: Intervention signal integration is accepted for V8
    Given billing anomaly intelligence is approved
    And churn-risk feed inputs are consolidated with freshness rules
    And ownership routing is defined by domain and severity
    And intervention SLA includes deterministic escalation
    When evidence is consolidated for V8-P1-T3
    Then V8-P1-T3 is accepted
    And evidence is published in "docs/validation/V8_P1_T3_INTERVENTION_SIGNAL_INTEGRATION.json"
