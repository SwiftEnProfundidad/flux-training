Feature: P1 T2 IA domain restructure
  As a product design lead
  I want iOS and Web sections grouped by functional domains
  So that navigation and execution follow a clear enterprise IA

  Scenario: Canonical domain order is applied
    Given the canonical file "flux.pen"
    When I validate "docs/validation/P1_T2_IA_VALIDATION_V1.json"
    Then iosPass must be true
    And webPass must be true

  Scenario: Legacy section naming is removed
    Given the same validation artifact
    Then legacySectionTokensRemaining must be empty
    And domainNamingViolations must be empty
