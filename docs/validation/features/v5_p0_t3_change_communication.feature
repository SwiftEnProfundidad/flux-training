Feature: V5 P0 T3 change communication
  As product and operations
  We want a structured communication plan for rollout
  So that enterprise users understand changes and support pathways

  Scenario: Communication readiness is validated before broader rollout
    Given rollout and environment strategy tasks are completed
    And communication channels are defined per audience segment
    And support escalation path is documented
    And in-app messages include ES/EN readiness requirements
    When communication evidence is consolidated for V5-P0-T3
    Then V5-P0-T3 is accepted
    And evidence is published in "docs/validation/V5_P0_T3_CHANGE_COMMUNICATION.json"
