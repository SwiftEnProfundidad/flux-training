Feature: V4 P1 T3 logging and audit trail
  As an enterprise security and operations team
  We want structured logs, actor activity trace and forensic export metadata
  So that audits and incident investigations are reproducible end-to-end

  Scenario: Structured logs activity log and forensic export are available cross-layer
    Given the contracts expose structured logs, activity entries and forensic export schemas
    And backend runtime and HTTP layers expose listStructuredLogs, listActivityLog and exportForensicAudit
    And the web operations module consumes those endpoints in audit/compliance
    When build and test suites run across contracts, backend, web and iOS
    Then the logging and audit trail flow is validated with production-readiness evidence
    And evidence is published in "docs/validation/V4_P1_T3_LOGGING_AUDIT_TRAIL.json"
