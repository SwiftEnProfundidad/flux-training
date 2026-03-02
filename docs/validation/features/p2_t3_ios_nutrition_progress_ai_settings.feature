Feature: P2 T3 iOS Nutrition + Progress + AI Coach + Settings completeness
  As a lead product designer
  I want the iOS core domains complete for nutrition/progress and settings/legal
  So that iOS core experience is implementable end-to-end

  Scenario: Nutrition and settings lanes are complete in base and light variants
    Given the artifact "docs/validation/P2_T3_IOS_NUTRITION_PROGRESS_AI_SETTINGS_VALIDATION_V1.json"
    Then nutritionDarkComplete must be true
    And nutritionLightComplete must be true
    And settingsDarkComplete must be true
    And settingsLightComplete must be true

  Scenario: Flows and domain-specific coverage are connected
    Given the same artifact
    Then nutritionFlowConnected must be true
    And settingsFlowConnected must be true
    And aiCoachCoverage must be true
    And legalCoverage must be true
    And overallPass must be true
