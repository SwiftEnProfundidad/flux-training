Feature: V3 P1 T3 iOS nutrition progress ai and settings runtime hardening
  As a product team
  I want the iOS nutrition, progress, AI and legal domains to expose deterministic enterprise states
  So that the app remains operational and auditable under normal and recovery conditions

  Scenario: Nutrition and progress handle empty and validation states
    Given the user opens nutrition and progress domains
    When user id is invalid or payload is malformed
    Then runtime status becomes "validation_error"
    When there is no data yet
    Then runtime status becomes "empty"
    And status transitions are mapped to typed screen contracts

  Scenario: AI recommendations expose deterministic loading and result states
    Given recommendations are requested from operations tab
    When loading starts
    Then recommendations status becomes "loading"
    When recommendations are available
    Then recommendations status becomes "loaded"
    When user context is invalid
    Then recommendations status becomes "validation_error"

  Scenario: Settings and legal GDPR actions enforce consent gates
    Given legal toggles are visible in the operations domain
    When required consent is missing
    Then save/export/deletion actions return "consent_required"
    When all legal consents are accepted
    Then save consent is "saved" and deletion request is "deletion_requested"
    And all controls expose stable accessibility identifiers
