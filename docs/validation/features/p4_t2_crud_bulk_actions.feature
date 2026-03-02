Feature: P4 T2 CRUD and bulk actions coverage
  As a lead product designer
  I want explicit CRUD and bulk action screens in web operations
  So that enterprise operators have clear create/edit/delete and mass-action paths

  Scenario: CRUD coverage exists across core domains
    Given the artifact "docs/validation/P4_T2_CRUD_BULK_ACTIONS_VALIDATION_V1.json"
    Then athletesCrudComplete must be true
    And plansCrudComplete must be true
    And nutritionCrudComplete must be true

  Scenario: Confirmation and bulk operations are explicitly covered
    Given the same artifact
    Then createEditCovered must be true
    And deleteConfirmCovered must be true
    And bulkActionsCovered must be true
    And overallPass must be true
