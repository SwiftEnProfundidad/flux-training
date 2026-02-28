Feature: Progress metrics and history
  Scenario: User checks consolidated training and nutrition progress
    Given workout sessions and nutrition logs exist for the same user
    When progress summary is requested
    Then aggregate metrics are returned for sessions, duration and macros
    And daily history is returned in chronological order
