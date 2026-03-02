Feature: P5 T1 seven-state coverage by section
  As a lead product designer
  I want every product section to include the seven operational states
  So that resilience and failure handling are design-complete across platforms

  Scenario: Every target section has all required states
    Given the artifact "docs/validation/P5_T1_STATE_VALIDATION_V1.json"
    Then sectionsChecked must be 10
    And sectionsPassing must be 10
    And overallPass must be true

  Scenario: No section is missing state coverage
    Given the same artifact
    Then sectionsFailing must be empty
