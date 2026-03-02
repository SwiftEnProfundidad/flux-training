Feature: V4 P3 T2 rollback and continuity readiness
  As an enterprise operations board
  We want a deterministic rollback and continuity plan across all layers
  So that incidents can be contained and service can recover predictably

  Scenario: Rollback and continuity drill is validated across backend, web and iOS
    Given rollback triggers and actions are defined for web, iOS, backend and data/audit layers
    And backup and forensic export checks are validated through dedicated tests
    And recovery-path drill suites pass for backend, web and iOS
    When evidence is consolidated for V4-P3-T2
    Then rollback and continuity readiness is accepted
    And evidence is published in "docs/validation/V4_P3_T2_ROLLBACK_CONTINUITY.json"
