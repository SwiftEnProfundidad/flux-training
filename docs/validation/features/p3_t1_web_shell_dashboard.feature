Feature: P3 T1 Web shell and operational dashboard completeness
  As a lead product designer
  I want the web shell and dashboard entry flow complete
  So that role-based operations start from a reliable web home

  Scenario: Shell and access lanes are complete
    Given the artifact "docs/validation/P3_T1_WEB_SHELL_DASHBOARD_VALIDATION_V1.json"
    Then shellHasSidebarAndMain must be true
    And shellNotesNamed must be true
    And accessMainComplete must be true
    And accessSecondaryComplete must be true

  Scenario: Dashboard and critical states are complete
    Given the same artifact
    Then dashboardMainComplete must be true
    And dashboardSecondaryComplete must be true
    And dashboardStatesComplete must be true
    And accessFlowConnected must be true
    And overallPass must be true
