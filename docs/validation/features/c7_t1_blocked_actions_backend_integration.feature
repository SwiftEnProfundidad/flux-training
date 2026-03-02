Feature: C7-T1 blocked actions backend integration
  As a Flux runtime owner
  I want blocked/recovery actions to map to backend endpoints by domain
  So that runtime behavior remains functional and auditable in backend-full mode

  Scenario: Blocked action emits telemetry and references backend domain route
    Given an action is blocked by RBAC in runtime
    When the domain context is known
    Then the blocked action must be traceable to an operational backend route for that domain
    And telemetry includes the backend route attribute for the blocked action

  Scenario: Recovery path executes backend-safe flow for allowed domain
    Given a user regains access to a previously denied domain
    When recover action is triggered
    Then runtime transitions from denied to success
    And the flow references backend-compatible payload contracts
