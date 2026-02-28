Feature: iOS workout session creation
  Scenario: User records a training session
    Given a valid workout input
    When the iOS application executes session creation
    Then the session is persisted in the configured repository

