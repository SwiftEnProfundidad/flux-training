Feature: V4 P1 T1 unified telemetry iOS web backend
  As an enterprise operations team
  We want canonical telemetry and cross-layer correlation from iOS, Web and Backend
  So that incidents are traceable end-to-end and operational visibility is consistent

  Scenario: Canonical events, correlation identifiers and observability summary are available
    Given analytics events are normalized with canonical event names and correlation metadata
    And crash reports enforce correlation continuity when incoming payloads are incomplete
    And runtime and HTTP layers expose an aggregated observability summary endpoint
    When contracts, backend, web and iOS suites are executed
    Then canonical telemetry and correlation are validated across layers
    And observability summary metrics are available for operational dashboards
    And evidence is published in "docs/validation/V4_P1_T1_UNIFIED_TELEMETRY.json"
