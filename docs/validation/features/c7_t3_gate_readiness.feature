Feature: C7-T3 gate readiness end-to-end
  As a Flux runtime owner
  I want a final C7 gate in green
  So that backend-full runtime can continue as product-ready baseline

  Scenario: Global smoke remains green after C7 observability integration
    Given runtime observability loop has been integrated in iOS and web
    When full workspace and iOS test suites are executed
    Then all tests pass without regressions

  Scenario: Operational telemetry parity is preserved across clients
    Given C7 telemetry attributes are emitted by iOS and web
    When denied and blocked actions are traced
    Then both clients expose correlation, session and payload-context attributes
    And runtime events remain auditable end-to-end
