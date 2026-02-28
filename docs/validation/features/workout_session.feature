Feature: Workout session logging
  Scenario: User logs a workout session against a selected training plan
    Given a training plan exists for the user
    When the user logs a workout session
    Then the session is stored with the selected plan identifier

