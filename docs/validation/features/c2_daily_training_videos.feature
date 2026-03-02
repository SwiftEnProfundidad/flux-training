Feature: Daily training and videos contracts (C2)
  As a product team
  I want deterministic contracts for training session and exercise videos
  So that web and iOS keep parity on daily execution states

  Scenario: Daily training contract starts in idle state
    Given the daily training contract is initialized without input
    When default values are read
    Then training, session and video statuses are "idle"
    And selected exercise defaults to "goblet-squat"
