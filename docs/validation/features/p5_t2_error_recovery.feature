Feature: P5 T2 error UX and recovery coverage
  As a lead product designer
  I want each product section to define actionable error and recovery states
  So that users can recover from technical, validation, offline and denied situations

  Scenario: Every section includes complete recovery signals
    Given the artifact "docs/validation/P5_T2_ERROR_RECOVERY_VALIDATION_V1.json"
    Then sectionsChecked must be 10
    And sectionsPassing must be 10
    And overallPass must be true

  Scenario: Error state includes validation and recovery CTAs
    Given the coverage file "docs/validation/P5_T2_ERROR_RECOVERY_COVERAGE_V1.csv"
    Then technicalErrorCopy must be true for all sections
    And validationCopy must be true for all sections
    And errorRecoveryCta must be true for all sections
    And fieldRecoveryCta must be true for all sections
    And supportCta must be true for all sections
