Feature: C4-T2 runtime enterprise state hardening
  As a Flux product owner
  I want runtime states by domain in iOS and web
  So that loading/empty/error/offline/denied are visible and recoverable

  Scenario: Web enforces domain runtime state gates
    Given the active domain is a concrete domain (not all)
    When runtime mode changes to loading/empty/error/offline/denied
    Then the dashboard shows a blocked-state card for that domain
    And module cards are hidden until runtime mode returns to success
    And a recovery action restores runtime mode to success

  Scenario: iOS enforces domain runtime state gates
    Given the active domain is a concrete domain (not all)
    When runtime mode changes to loading/empty/error/offline/denied
    Then the tab content shows a blocked-state card for that domain
    And module cards are hidden until runtime mode returns to success
    And a recovery action restores runtime mode to success
