Feature: V3 P2 T1 web shell access and dashboard runtime hardening
  As a product team
  I want the web shell to be role-aware and resilient
  So that access, navigation and dashboard runtime remain deterministic in enterprise scenarios

  Scenario: Shell persists and restores domain navigation safely
    Given the user navigates domains from the web shell
    When domain state is persisted in URL and local storage
    Then a browser popstate restores the selected domain without breaking runtime controls

  Scenario: Role capabilities drive domain access outcomes
    Given role capabilities are loading, errored or loaded
    When a protected domain is selected
    Then access decision resolves as pending, error, denied or allowed deterministically
    And denied access is traced with blocked-action telemetry

  Scenario: Dashboard runtime handles access, consent and recovery paths
    Given auth, onboarding and legal actions are executed from the dashboard
    When email credentials are invalid or legal consent is incomplete
    Then statuses become validation_error or consent_required
    And recovery actions by email/sms publish deterministic statuses
