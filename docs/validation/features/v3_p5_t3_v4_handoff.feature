Feature: V3 P5 T3 V4 handoff
  As a product organization
  We want to close V3 and open V4 with explicit risk handoff
  So that production hardening starts with a controlled baseline

  Scenario: V3 closure and V4 activation are formalized
    Given V3 has a frozen technical and functional release candidate baseline
    When the handoff package for V4 is generated
    Then V3 closure evidence is published in "docs/validation/V3_P5_T3_V4_HANDOFF.json"
    And V4 starts with active task "V4-P0-T1" in "docs/FLUX_PRODUCTION_READINESS_TRACKING_V4.md"
