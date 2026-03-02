Feature: C6-T2 denied access audit tracing
  As a Flux operations owner
  I want denied domain access and blocked-action events to be auditable on iOS and web
  So that RBAC incidents can be traced in enterprise operations

  Scenario: Web emits denied-access event when role cannot open a domain
    Given the active role cannot access a selected domain
    When the user selects that domain in web runtime
    Then the runtime state must switch to denied
    And an analytics event dashboard_domain_access_denied is created
    And an analytics event dashboard_action_blocked is created

  Scenario: iOS emits denied-access event during recover on blocked domain
    Given the active role cannot access the active domain
    When recover action is requested in iOS runtime
    Then the runtime state remains denied
    And an analytics event dashboard_domain_access_denied is created
    And an analytics event dashboard_action_blocked is created

  Scenario: Domain transition telemetry is consistent across iOS and web
    Given a user changes from one domain tab to another
    When transition telemetry is emitted
    Then both clients create dashboard_domain_changed events
    And telemetry includes role and domain attributes
