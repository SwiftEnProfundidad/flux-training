Feature: V4 P2 T2 backend API performance hardening
  As an enterprise product team
  We want backend runtime reads to stay predictable under sustained traffic
  So that API latency and stability remain within release SLO targets

  Scenario: Profiling, caching and repository access are optimized for runtime stability
    Given backend runtime exposes endpoint-level performance profiles
    And read-heavy endpoints use TTL cache with explicit invalidation after writes
    And in-memory repositories avoid full-record scans using indexed access patterns
    When build and test suites run across backend, workspace and iOS regression
    Then V4-P2-T2 backend/API performance hardening is validated
    And evidence is published in "docs/validation/V4_P2_T2_BACKEND_API_PERFORMANCE.json"
