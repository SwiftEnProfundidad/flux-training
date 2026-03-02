Feature: V3-P0-T2 ownership matrix and done criteria
  As an implementation program
  We need explicit ownership and done criteria per module
  So that iOS, Web, Backend and Contracts can execute in parallel without ambiguity

  Scenario: Every module has accountable owners by layer
    Given the V3 module catalog is defined
    When the ownership matrix is reviewed
    Then each module must include primary owner and owners for contracts, backend, iOS, web and QA

  Scenario: Definition of done is explicit by layer
    Given module execution depends on cross-layer alignment
    When done criteria are evaluated
    Then contracts, backend, web, iOS, cross-platform and QA criteria must be defined and testable

  Scenario: Next task is unblocked
    Given ownership and done criteria are frozen
    When V3-P0-T2 is closed
    Then V3-P0-T3 can start with no critical unknowns in ownership/governance
