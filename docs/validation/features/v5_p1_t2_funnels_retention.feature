Feature: V5 P1 T2 funnels and retention
  As growth and product teams
  We want measurable funnels and retention cohorts
  So that adoption decisions are based on leading and lagging indicators

  Scenario: Funnel and retention strategy is validated for rollout scale
    Given KPI framework is already approved in V5-P1-T1
    And canonical funnel stages are defined from visit to week-1 retention
    And retention cohorts are segmented by role, channel and plan state
    And alerting rules are set for conversion and retention regressions
    When evidence is consolidated for V5-P1-T2
    Then V5-P1-T2 is accepted
    And evidence is published in "docs/validation/V5_P1_T2_FUNNELS_RETENTION.json"
