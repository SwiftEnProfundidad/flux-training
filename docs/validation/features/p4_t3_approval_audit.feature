Feature: P4 T3 approval workflow and audit trail completeness
  As a lead product designer
  I want workflow and audit coverage explicit in governance
  So that enterprise operations are traceable end-to-end

  Scenario: Approval and audit screens are complete
    Given the artifact "docs/validation/P4_T3_APPROVAL_AUDIT_VALIDATION_V1.json"
    Then workflowScreensComplete must be true
    And auditTrailScreensComplete must be true
    And governanceSupportComplete must be true

  Scenario: Flow includes approval states and audit/export narrative
    Given the same artifact
    Then flowConnected must be true
    And flowMentionsApprovalStates must be true
    And flowMentionsAuditExport must be true
    And overallPass must be true
