Feature: V4 P0 T2 legal compliance and data governance
  As an enterprise compliance owner
  We want auditable legal consent, export/delete workflows and explicit retention policy
  So that GDPR-related operations are traceable and operationally reliable

  Scenario: Legal and data compliance flows are validated end-to-end
    Given consent payloads include policy version, locale and source metadata
    And data deletion requests include export and retention metadata
    And backend exposes data export and retention policy endpoints
    When contracts, backend and web suites are executed
    Then compliance flows are accepted by schema and use-case validations
    And runtime routes serve export and retention responses without errors
    And evidence is published in "docs/validation/V4_P0_T2_COMPLIANCE_LEGAL_DATA.json"
