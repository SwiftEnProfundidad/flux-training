Feature: V5 P2 T3 continuous quality post-release
  As platform and quality teams
  We want a continuous quality operating model after release
  So that reliability and product health remain stable at scale

  Scenario: Continuous quality model is approved
    Given support, SLA and self-service foundations are completed
    And a regression cadence is defined for daily, weekly and monthly controls
    And technical debt has a prioritized scoring and release policy
    And monthly health review has defined KPIs, participants and outputs
    When evidence is consolidated for V5-P2-T3
    Then V5-P2-T3 is accepted
    And evidence is published in "docs/validation/V5_P2_T3_CONTINUOUS_QUALITY.json"
