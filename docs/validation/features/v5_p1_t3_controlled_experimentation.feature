Feature: V5 P1 T3 controlled experimentation
  As product and growth teams
  We want controlled experiments with statistical rigor
  So that roadmap decisions are evidence-based and reproducible

  Scenario: Controlled experimentation framework is ready for execution
    Given KPI framework and funnel/retention strategy are already approved
    And experiment backlog includes hypothesis, owner and target metric
    And statistical guardrails are defined for confidence and stopping rules
    And learning closure outcomes are explicit and linked to roadmap actions
    When evidence is consolidated for V5-P1-T3
    Then V5-P1-T3 is accepted
    And evidence is published in "docs/validation/V5_P1_T3_CONTROLLED_EXPERIMENTATION.json"
