Feature: V5 P0 T2 environments and feature flags
  As platform operations
  We want explicit environment policies and feature flag governance
  So that rollout remains reversible and role-safe in production

  Scenario: Environment and feature-flag strategy is validated
    Given rollout wave strategy is already approved
    And environment matrix is defined for dev, staging and prod
    And feature flags are cataloged by module with role gating
    And rollback by flag uses kill-switch plus health validation
    When evidence is consolidated for V5-P0-T2
    Then V5-P0-T2 is accepted
    And evidence is published in "docs/validation/V5_P0_T2_ENV_FLAGS_STRATEGY.json"
