Feature: C6-T1 backend role capabilities alignment
  As a Flux runtime owner
  I want iOS and web domain access to depend on backend capabilities
  So that RBAC does not drift across clients

  Scenario: Web runtime resolves domain access from backend role capabilities
    Given the active role is selected in the web runtime
    When role capabilities are loaded from /api/listRoleCapabilities
    Then domain access checks must use backend allowedDomains
    And local hardcoded role-domain rules are not used for authorization

  Scenario: iOS runtime resolves domain access from backend role capabilities
    Given the active role is selected in the iOS runtime
    When role capabilities are loaded from /api/listRoleCapabilities
    Then allowed domains must be derived from backend allowedDomains
    And local hardcoded role-domain rules are not used for authorization
