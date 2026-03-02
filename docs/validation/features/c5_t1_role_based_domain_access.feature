Feature: C5-T1 role-based domain access in runtime
  As a Flux enterprise operator
  I want domain visibility and access control by role
  So that unauthorized flows are blocked with explicit denied state

  Scenario: Web denies unauthorized domain for coach role
    Given the active role is coach
    When onboarding domain is selected
    Then runtime state for onboarding is denied
    And blocked-state recovery keeps denied while role is unauthorized

  Scenario: iOS denies unauthorized domain for coach role
    Given the active role is coach
    When onboarding domain is selected
    Then runtime state for onboarding is denied
    And switching to admin restores access to success state
