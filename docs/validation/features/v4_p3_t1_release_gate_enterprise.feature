Feature: V4 P3 T1 enterprise release gate
  As an enterprise release board
  We want an auditable go/no-go gate across technical, legal and operational dimensions
  So that production rollout decisions are deterministic and traceable

  Scenario: Release gate validates technical, legal and operational readiness
    Given technical gate runs with "pnpm release:check" in green
    And legal evidence chain is present for consent, access control and GDPR data flows
    And operational evidence chain is present for observability, runbooks, audit trail and load/degradation
    When release gate evidence is consolidated for V4 phase P3
    Then V4-P3-T1 release governance is accepted
    And evidence is published in "docs/validation/V4_P3_T1_RELEASE_GATE_ENTERPRISE.json"
