Feature: C2 cross-platform integration
  As a release owner
  I want parity evidence for C2 screens across web and iOS
  So that V2 tracking can be closed with objective proof

  Scenario: C2 parity matrix is complete
    Given the C2 parity matrix exists
    When the matrix is reviewed by domain
    Then onboarding, training, nutrition and operations are marked as PASS
    And evidence references web and iOS tests for each screen group
