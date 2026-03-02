Feature: Forensic inventory baseline (P0-T1)
  As a product/design team
  I want a complete inventory of the current Flux board
  So that remediation work starts with objective coverage and traceability

  Scenario: Inventory includes all iOS and web screens with hierarchy
    Given the canonical board file "flux.pen"
    When the forensic inventory is generated
    Then every node includes board and section context
    And every screen row includes a variant label

  Scenario: Inventory reports structural anomalies
    Given the forensic inventory summary
    When duplicate and orphan checks are evaluated
    Then duplicate ids are zero
    And orphan screens are zero
    And misplaced screens are zero
