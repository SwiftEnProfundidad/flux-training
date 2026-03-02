Feature: V4 P1 T2 alerting and runbooks
  As an enterprise operations team
  We want actionable alerts mapped to runbooks with explicit on-call ownership
  So that incidents can be operated without ambiguity

  Scenario: Operational alerts and runbooks are available end-to-end
    Given observability thresholds evaluate fatal crashes, denied access spikes and backlog pressure
    And alert payloads include severity, owner on-call, SLO target and linked runbook id
    And runbooks expose ordered steps with SLA and responsible role
    When contracts, backend and web suites execute observability flows
    Then alert and runbook endpoints are consumable from the operations dashboard
    And evidence is published in "docs/validation/V4_P1_T2_ALERTING_RUNBOOKS.json"
