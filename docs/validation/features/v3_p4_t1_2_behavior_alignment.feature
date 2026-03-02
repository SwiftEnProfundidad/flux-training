Feature: V3 P4 T1.2 iOS/Web behavior alignment
  As product owner
  I want parity gaps from V3-P4-T1.1 to be closed with executable evidence
  So that cross-platform behavior is aligned before smoke cross-platform

  Scenario: Sync queue exposes idempotency diagnostics on web and iOS
    Given the backend returns idempotency metadata for sync processing
    When web and iOS process offline queue actions
    Then both platforms must expose key, replay and ttl diagnostics in the sync module

  Scenario: Observability iOS aligns incident semantics with web
    Given analytics and crash collections are loaded on iOS
    When incidents are derived for support operations
    Then iOS must expose incident domain, severity, state, correlation and summary labels aligned with web
