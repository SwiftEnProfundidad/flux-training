Feature: P6 T1 iOS/Web functional parity by domain
  As a lead product designer
  I want parity evidence across iOS and web domains
  So that platform behavior is functionally aligned before final hardening

  Scenario: Domain parity matrix passes for all mapped domains
    Given the artifact "docs/validation/P6_T1_IOS_WEB_PARITY_DETAILS_V1.json"
    Then overallPass must be true
    And each domain row must have domainPass true

  Scenario: Shared action semantics are aligned per domain
    Given the same artifact
    Then access must include ACCESS and SESSION in sharedFound
    And training must include PLAN and SESSION in sharedFound
    And nutrition_progress must include NUTRITION and PROGRESS in sharedFound
    And governance_settings must include LEGAL and EXPORT in sharedFound
