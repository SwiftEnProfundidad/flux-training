Feature: P1 T1 cleanup completion
  As a board governance owner
  I want support-only sections removed from product boards
  So that iOS and Web boards contain product sections and flows only

  Scenario: Support noise sections are removed
    Given the canonical file "flux.pen"
    When I review "docs/validation/P1_T1_POST_CLEANUP_VALIDATION_V1.json"
    Then support noise remaining count must be 0
    And top-level boards must remain BOARD_IOS_APP and BOARD_WEB_APP

  Scenario: Cleanup operations are traceable
    Given "docs/validation/P1_T1_CLEANUP_PLAN_V1.json"
    Then the applied operations must include IOS_SECTION_COPY_I18N and WEB_SECTION_COPY_I18N
    And the applied operations must include IOS_SECTION_A11Y_CHECKLIST and WEB_SECTION_HANDOFF_NOTES
