Feature: Shared contracts
  Scenario: Contracts validate training payloads
    Given training input includes required fields
    When contracts schema parses the payload
    Then parsing succeeds with typed output
    And invalid payloads are rejected

