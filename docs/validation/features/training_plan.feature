Feature: Training plan creation
  Scenario: User creates a training plan with weekly structure
    Given a valid training plan payload
    When the system validates and saves the plan
    Then the plan is persisted
    And it can be used by workout session flows

