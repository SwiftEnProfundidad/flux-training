Feature: V3 P4 T1.3 cross-platform parity smoke
  As product owner
  I want a smoke validation after parity behavior alignment
  So that we can start E2E critical flows with controlled risk

  Scenario: Web and iOS smoke suites pass after parity adjustments
    Given parity behavior adjustments were applied on web and iOS
    When smoke commands are executed for web, iOS and critical suite
    Then all suites must pass without regressions
