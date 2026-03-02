Feature: P2 T1 iOS Auth + Onboarding + Consent completeness
  As a lead product designer
  I want the iOS access section complete across base/light and critical states
  So that the full access and legal entry flow is ready for implementation

  Scenario: Required screens and states are present in both lanes
    Given the validation artifact "docs/validation/P2_T1_IOS_AUTH_ONBOARDING_CONSENT_VALIDATION_V1.json"
    Then darkLaneComplete must be true
    And darkStateLaneComplete must be true
    And lightLaneComplete must be true
    And lightStateLaneComplete must be true

  Scenario: Critical states and flow connector are complete
    Given the same artifact
    Then criticalStateCoverageComplete must be true
    And flowConnected must be true
    And overallPass must be true
