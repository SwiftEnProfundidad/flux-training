Feature: V6 P3 T2 V7 backlog definition
  As product and engineering leadership
  We want a clear V7 backlog definition
  So that execution starts with aligned priorities, dependencies and capacity

  Scenario: V7 backlog definition is approved
    Given V6 outcomes are consolidated
    And a prioritization model includes impact, effort and risk
    And dependencies are mapped across product, growth, billing, data and support
    And capacity planning includes wave allocations and reserved buffers
    When evidence is consolidated for V6-P3-T2
    Then V6-P3-T2 is accepted
    And evidence is published in "docs/validation/V6_P3_T2_V7_BACKLOG_DEFINITION.json"
