Feature: V4 P0 T3 enterprise access control and denied audit
  As an enterprise security owner
  We want RBAC by action, conditional permissions and denied-access auditing
  So that access decisions are consistent, explainable and traceable

  Scenario: Access control and denied auditing are enforced end-to-end
    Given role capabilities expose domain permissions with allowed actions and conditions
    And backend evaluates access decisions with ownership and medical-consent constraints
    And denied access audits can be recorded and listed by user
    When contracts, backend and web suites are executed
    Then RBAC decisions are validated by schema and use-case tests
    And denied access events are persisted through runtime endpoints
    And evidence is published in "docs/validation/V4_P0_T3_ENTERPRISE_ACCESS_CONTROL.json"
