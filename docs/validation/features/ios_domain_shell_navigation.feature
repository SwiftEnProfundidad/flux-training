Feature: iOS domain shell navigation
  As a Flux iOS user
  I want to select a product domain in the experience hub
  So that I only see the modules relevant to that domain

  Scenario: all domain shows all available modules
    Given the iOS experience shell is active with domain "all"
    When visible modules are requested
    Then all iOS hub modules are returned

  Scenario: training domain scopes modules to training
    Given the iOS experience shell is active with domain "training"
    When visible modules are requested
    Then only the "training" module is visible
    And onboarding, nutrition, progress and operations modules are hidden

  Scenario: operations domain scopes modules to operations cards
    Given the iOS experience shell is active with domain "operations"
    When visible modules are requested
    Then "offlineSync", "observability" and "recommendations" are visible
    And training and progress modules are hidden

  Scenario: restoring persisted domain on app relaunch
    Given a persisted iOS domain value "progress"
    When the experience shell is restored from persisted state
    Then the active iOS domain is "progress"
