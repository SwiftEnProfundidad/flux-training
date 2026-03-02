Feature: Nutrition, progress and AI contracts (C2)
  As a product team
  I want deterministic contracts for nutrition, progress and AI recommendations
  So that both clients render complete screens with predictable states

  Scenario: Nutrition, progress and AI contract starts in idle state
    Given the nutrition progress AI contract is initialized without input
    When default values are read
    Then nutrition, progress and recommendations statuses are "idle"
    And logs, summary and recommendations are empty
