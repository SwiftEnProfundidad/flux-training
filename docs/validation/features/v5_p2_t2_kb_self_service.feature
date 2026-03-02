Feature: V5 P2 T2 knowledge base and self-service
  As support and operations teams
  We want a role-oriented knowledge base and self-service runbooks
  So that repetitive incidents are solved faster without escalating every ticket

  Scenario: Knowledge base and self-service baseline is ready
    Given enterprise support and SLA model is already defined
    And knowledge base taxonomy is defined by domain and role
    And FAQ baseline covers top operational support drivers
    And user/admin runbooks include escalation conditions and owners
    When evidence is consolidated for V5-P2-T2
    Then V5-P2-T2 is accepted
    And evidence is published in "docs/validation/V5_P2_T2_KB_SELF_SERVICE.json"
