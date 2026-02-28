Feature: Authentication base
  Scenario: User creates a session from an identity provider token
    Given the provider token is valid
    When auth session creation is requested
    Then the system returns an application session payload

