Feature: Cross-platform domain state parity
  As a product owner
  I want domain states to behave consistently on iOS and web
  So that operation and UX quality are equivalent across clients

  Scenario: onboarding domain supports full state model
    Given the active domain is "onboarding" on iOS and web
    When state coverage is validated
    Then default, loading, empty, error, offline, denied and success are covered

  Scenario: training domain keeps videos in the same state lane
    Given the active domain is "training" on iOS and web
    When state coverage is validated
    Then training and videos states are represented in the training lane

  Scenario: operations domain aligns offline sync and observability states
    Given the active domain is "operations" on iOS and web
    When state coverage is validated
    Then offline sync, recommendations and observability states are aligned

  Scenario: persisted domain is restored consistently across clients
    Given the persisted domain value is "training" on iOS and web
    When both clients relaunch
    Then both clients restore the active domain as "training"
