Feature: P4 T1 enterprise table patterns availability
  As a lead product designer
  I want reusable table patterns across key web modules
  So that enterprise operations are consistent and scalable

  Scenario: Core modules include table pattern screens
    Given the artifact "docs/validation/P4_T1_ENTERPRISE_TABLE_PATTERNS_VALIDATION_V1.json"
    Then athletesPatternsReady must be true
    And plansPatternsReady must be true
    And nutritionPatternsReady must be true

  Scenario: Table capabilities are explicitly covered
    Given the same artifact
    Then filtersAndSavedViewsCovered must be true
    And sortingPaginationCovered must be true
    And detailInContextCovered must be true
    And overallPass must be true
