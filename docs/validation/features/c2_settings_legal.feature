Feature: Settings and legal contracts (C2)
  As a product team
  I want deterministic settings and GDPR legal contracts
  So that operations domain screens stay aligned across iOS and web

  Scenario: Settings and legal contract starts in idle state
    Given the settings legal contract is initialized without input
    When default values are read
    Then settings status is "idle"
    And legal status is "idle"
    And privacy, terms and medical disclaimer flags are false
