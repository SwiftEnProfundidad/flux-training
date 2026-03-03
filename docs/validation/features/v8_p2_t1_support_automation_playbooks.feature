Feature: V8 P2 T1 support automation playbooks
  As support and operations teams
  We want automated playbooks with controlled escalation
  So that MTTR improves without losing governance and safety

  Scenario: Support automation playbooks are accepted for V8
    Given intervention signal integration is approved
    And automation matrix is defined by incident type and severity
    And assisted responses are enabled with human-approval rules
    And escalation control protects SLA and fallback behavior
    When evidence is consolidated for V8-P2-T1
    Then V8-P2-T1 is accepted
    And evidence is published in "docs/validation/V8_P2_T1_SUPPORT_AUTOMATION_PLAYBOOKS.json"
