Feature: Web domain navigation on dashboard
  As a user of Flux web
  I want to switch dashboard domains
  So I can focus on the modules of each section

  Scenario: Showing all modules
    Given the active domain is "all"
    When the dashboard resolves visible modules
    Then all dashboard modules are visible

  Scenario: Showing only training domain modules
    Given the active domain is "training"
    When the dashboard resolves visible modules
    Then only training modules are visible

  Scenario: Showing only operations domain modules
    Given the active domain is "operations"
    When the dashboard resolves visible modules
    Then only operations modules are visible

  Scenario: Restoring persisted domain after reload
    Given the persisted domain is "nutrition"
    When the dashboard initializes
    Then the active domain is restored as "nutrition"

  Scenario: Reading domain from deep-link query
    Given the URL contains "?domain=operations"
    When the dashboard initializes
    Then the active domain is "operations"
