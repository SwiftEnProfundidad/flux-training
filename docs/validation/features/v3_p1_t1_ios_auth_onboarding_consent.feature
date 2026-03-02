Feature: V3 P1 T1 iOS auth onboarding and consent
  As a product team
  I want iOS access flows implemented with enterprise states
  So that authentication and onboarding are reliable and auditable

  Scenario: Auth flow supports validation and recovery
    Given the iOS auth section is available in ExperienceHub
    When credentials are invalid
    Then status is "validation_error"
    And recovery by email and SMS updates status deterministically

  Scenario: Onboarding requires consent and valid profile
    Given onboarding profile data is captured
    When consent checklist is incomplete
    Then status is "consent_required"
    When profile payload is invalid
    Then status is "validation_error"
    When consent and profile are valid
    Then status becomes "saved"

  Scenario: Bilingual copy and accessibility are present
    Given ES is base language and EN is available
    Then status labels and recovery copy are localized in both languages
    And auth, onboarding and legal controls expose accessibility identifiers
