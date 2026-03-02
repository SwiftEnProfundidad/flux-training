Feature: P1 T3 global E2E flow definition by platform
  As a product architect
  I want complete iOS and Web global flows with branches
  So that no product screen is orphaned and execution paths are explicit

  Scenario: Global flow sections exist and include required branches
    Given the validation artifact "docs/validation/P1_T3_E2E_FLOW_VALIDATION_V1.json"
    Then flowSectionsPresent must be true
    And iosHasMainRow must be true
    And iosHasDecisionTracks must be true
    And webHasRoleRows must be true
    And webHasDecisionTracks must be true

  Scenario: Screen coverage is fully connected
    Given the same validation artifact
    Then orphanScreensZero must be true
    And overallPass must be true
