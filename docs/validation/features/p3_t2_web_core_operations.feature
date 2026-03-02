Feature: P3 T2 web core operations completeness
  As a lead product designer
  I want athletes, plans/sessions, and nutrition/progress web flows complete
  So that core operational work can run without IA gaps

  Scenario: Athletes and plans operations are complete
    Given the artifact "docs/validation/P3_T2_WEB_CORE_OPERATIONS_VALIDATION_V1.json"
    Then athletesMainComplete must be true
    And athletesSecondaryComplete must be true
    And athletesStatesComplete must be true
    And athletesFlowConnected must be true
    And plansMainComplete must be true
    And plansSecondaryComplete must be true
    And plansFlowConnected must be true

  Scenario: Nutrition operations are complete and connected
    Given the same artifact
    Then nutritionMainComplete must be true
    And nutritionSecondaryComplete must be true
    And nutritionFlowConnected must be true
    And overallPass must be true
