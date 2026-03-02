Feature: V3 P1 T2 iOS today training and video runtime
  As a product team
  I want the iOS daily training domain to behave under enterprise runtime states
  So that execution remains reliable during normal, fallback and offline conditions

  Scenario: Daily cockpit reflects training readiness
    Given the training screen is opened
    When dashboard data is refreshed
    Then plans loaded, sessions today and runtime statuses are visible
    And cockpit status transitions from loading to loaded or empty

  Scenario: Session flow exposes active runtime state
    Given a session is logged from the training screen
    Then session status is updated to active when the latest session is recent
    And the contract status remains mapped to enterprise screen states

  Scenario: Video load supports fallback and offline paths
    Given a requested locale has no exercise videos
    When videos are loaded
    Then EN fallback videos are used and fallback status is exposed
    When connectivity fails
    Then video status becomes offline with recovery hint in UI
