Feature: V5 P0 T1 rollout wave strategy
  As a release operations team
  We want rollout waves with explicit cohorts, windows and promotion criteria
  So that deployment risk is controlled while scaling adoption

  Scenario: Rollout strategy is approved with auditable progression rules
    Given V5 starts from a validated V4 handoff
    And rollout cohorts are defined by role criticality
    And release windows include mandatory health checkpoints
    And advancement and rollback criteria are measurable
    When strategy evidence is consolidated
    Then V5-P0-T1 is accepted
    And evidence is published in "docs/validation/V5_P0_T1_ROLLOUT_WAVE_STRATEGY.json"
