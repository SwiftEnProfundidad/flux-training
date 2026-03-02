Feature: V6 P0 T2 conversion instrumentation
  As growth and analytics teams
  We want freemium conversion instrumentation across platforms
  So that leaks can be detected and optimized with confidence

  Scenario: Conversion instrumentation is approved
    Given V6 north-star foundation is completed
    And conversion event taxonomy is defined for iOS and web
    And funnel stages are mapped end to end
    And leakage alerts have thresholds and owners
    When evidence is consolidated for V6-P0-T2
    Then V6-P0-T2 is accepted
    And evidence is published in "docs/validation/V6_P0_T2_CONVERSION_INSTRUMENTATION.json"
