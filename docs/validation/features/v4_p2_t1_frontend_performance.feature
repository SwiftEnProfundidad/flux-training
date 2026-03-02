Feature: V4 P2 T1 frontend performance on iOS and web
  As an enterprise product team
  We want frontend modules to remain responsive under dense operational data
  So that runtime UX stays stable before backend/API scale work

  Scenario: Dense rendering and loading paths are optimized cross-platform
    Given web operations modules use deferred filters and bounded row rendering
    And iOS dashboard and list-heavy sections use lazy stacks for long content
    And web build outputs vendor chunk split for runtime payload stability
    When build and test suites run across contracts, backend, web and iOS
    Then V4-P2-T1 frontend performance hardening is validated
    And evidence is published in "docs/validation/V4_P2_T1_FRONTEND_PERFORMANCE.json"
