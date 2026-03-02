Feature: V4 P2 T3 load and controlled degradation validation
  As an enterprise product team
  We want API behavior to remain predictable under baseline and stress traffic
  So that release decisions can rely on measurable degradation criteria

  Scenario: Baseline and stress suites validate runtime resilience and degradation signals
    Given backend load tests execute baseline and stress traffic against runtime endpoints
    And p95 latency guardrails are asserted for both baseline and stress phases
    And server-side failures are expected to remain at zero during the suite
    And degradation alerts must expose runbooks and operational traceability
    When build and test suites run for backend, workspace and iOS regression
    Then V4-P2-T3 load and degradation validation is accepted
    And evidence is published in "docs/validation/V4_P2_T3_LOAD_DEGRADATION.json"
