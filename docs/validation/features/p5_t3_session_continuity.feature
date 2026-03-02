Feature: P5 T3 session continuity and sync conflict recovery
  As a lead product designer
  I want explicit continuity coverage for session timeout, token refresh, sync retry and data conflict
  So that users do not lose work across iOS and web

  Scenario: Continuity signals are present across all product sections
    Given the artifact "docs/validation/P5_T3_SESSION_CONTINUITY_VALIDATION_V1.json"
    Then sectionsChecked must be 10
    And sectionContinuityCoverage must be true
    And duplicateIdsZero must be true

  Scenario: Platform continuity entry points are explicitly covered
    Given the same artifact
    Then iosSessionTimeoutScreen must be true
    And webSessionTimeoutScreen must be true
    And iosFlowMentionsContinuity must be true
    And webFlowMentionsContinuity must be true
    And overallPass must be true
