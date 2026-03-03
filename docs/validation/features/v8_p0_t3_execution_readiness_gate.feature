Feature: V8 P0 T3 execution readiness gate
  As V8 stream owners
  We want execution readiness validated before starting impact streams
  So that we can run V8 with controlled risk and deterministic escalation

  Scenario: V8 readiness gate is approved
    Given the operating contract for V8 is frozen
    And critical risks are documented with owners and mitigations
    And incident and debt buffers are reserved by wave
    And launch checklist entry criteria is explicitly approved
    When evidence is consolidated for V8-P0-T3
    Then V8-P0-T3 is accepted
    And evidence is published in "docs/validation/V8_P0_T3_EXECUTION_READINESS_GATE.json"
