Feature: V8 P0 T2 operating contract freeze
  As cross-domain leads
  We want an operational contract frozen for V8
  So that streams execute with clear dependencies and deterministic QA rules

  Scenario: V8 operating contract is frozen
    Given V8 kickoff baseline is approved
    And operational signal dictionary is defined with owners and SLAs
    And cross-domain dependencies are sequenced with accountability
    And operational QA rules are explicit
    When evidence is consolidated for V8-P0-T2
    Then V8-P0-T2 is accepted
    And evidence is published in "docs/validation/V8_P0_T2_OPERATING_CONTRACT_FREEZE.json"
