Feature: C5-T2 role persistence and telemetry
  As a Flux operations team
  I want role selection persisted and tracked
  So that RBAC runtime behavior is stable and auditable

  Scenario: Web persists active role and emits role change event
    Given a role is selected in web runtime
    When the app reloads
    Then the selected role is restored from local storage
    And a role change event is sent to observability on user change

  Scenario: iOS persists active role and emits role change event
    Given a role is selected in iOS runtime
    When the app reopens
    Then the selected role is restored from AppStorage
    And role change is tracked as analytics event with role and domain attributes
