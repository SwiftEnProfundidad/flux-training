Feature: Auth and onboarding screen contracts (C2)
  As a product team
  I want deterministic screen contracts for auth and onboarding
  So that iOS and web can implement full screens with parity

  Scenario: Auth contract starts in idle state
    Given the auth screen contract is initialized without input
    When default values are read
    Then status is "idle"
    And email and password are empty

  Scenario: Onboarding contract starts in idle state
    Given the onboarding screen contract is initialized without input
    When default values are read
    Then status is "idle"
    And goal is "recomposition"
    And legal consent fields are false by default
