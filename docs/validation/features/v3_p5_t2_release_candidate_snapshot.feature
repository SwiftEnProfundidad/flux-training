Feature: V3 P5 T2 Release candidate snapshot
  As a product team
  We want to freeze technical and functional snapshots
  So that V3 closure and V4 handoff use the same baseline

  Scenario: Technical and functional snapshots are frozen
    Given V3 quality gate and E2E suites are in PASS
    When release candidate snapshots are generated
    Then technical baseline is published in "docs/validation/V3_P5_T2_TECHNICAL_SNAPSHOT.json"
    And functional baseline is published in "docs/validation/V3_P5_T2_FUNCTIONAL_SNAPSHOT.json"
