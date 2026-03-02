Feature: V6 P2 T2 multichannel CRM operations
  As growth and lifecycle teams
  We want a multichannel CRM operating model
  So that re-engagement is consistent and risk-aware across channels

  Scenario: Multichannel CRM operations are approved
    Given weekly activation loops are defined
    And in-app, push and email orchestration is specified
    And re-engagement journeys are mapped by risk segment
    And segmentation rules define ownership and review cadence
    When evidence is consolidated for V6-P2-T2
    Then V6-P2-T2 is accepted
    And evidence is published in "docs/validation/V6_P2_T2_MULTICHANNEL_CRM_OPERATIONS.json"
