Feature: Onboarding and PAR-Q+
  Scenario: User completes onboarding and receives risk classification
    Given a user submits profile and PAR-Q answers
    When onboarding validation is executed
    Then the profile is accepted
    And a health risk level is assigned

