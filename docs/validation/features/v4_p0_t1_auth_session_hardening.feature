Feature: V4 P0 T1 auth session hardening
  As an enterprise platform
  We want hardened auth sessions with deterministic policy and abuse guards
  So that session lifecycle is secure, traceable and testable across layers

  Scenario: Auth session contract and runtime enforce policy, rotation and expiration
    Given auth session payloads include policy, issued timestamp and hard expiration windows
    When backend, web, contracts and iOS suites execute session flows
    Then session policy fields are validated consistently across platforms
    And invalid or abusive provider tokens are rejected before session creation
    And evidence is published in "docs/validation/V4_P0_T1_AUTH_SESSION_HARDENING.json"
