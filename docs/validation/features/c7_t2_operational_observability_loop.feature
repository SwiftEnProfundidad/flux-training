Feature: C7-T2 operational observability loop by domain
  As a Flux runtime owner
  I want denied and blocked actions correlated per session
  So that operations can audit end-to-end RBAC decisions in iOS and web

  Scenario: Correlated denied and blocked events share session and correlation identifiers
    Given a domain action is denied by RBAC
    When denied and blocked telemetry events are emitted
    Then both events include the same correlation id
    And both events include runtime session id and runtime event index

  Scenario: Denied events accumulate per-session and per-domain counters
    Given multiple denied actions occur in one runtime session
    When telemetry is emitted for each denied action
    Then denied_session_count increases monotonically
    And denied_domain_count reflects domain-local denied totals

  Scenario: Domain observability keeps backend-route and payload contract context
    Given domain telemetry is emitted for domain_changed, denied and blocked events
    When observability attributes are generated
    Then each event includes backend route and payload contract context
    And iOS and web keep parity for these operational attributes
