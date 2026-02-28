Feature: Analytics and crash reporting
  Scenario: User actions and runtime failures are tracked for observability
    Given the app records analytics events for relevant actions
    And crash reports can be captured with severity and context
    When observability data is submitted and queried
    Then analytics and crash records are persisted and returned for the user
