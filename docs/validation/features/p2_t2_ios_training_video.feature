Feature: P2 T2 iOS Today + Training + Exercise Video completeness
  As a lead product designer
  I want daily execution and exercise-video flows complete in iOS
  So that session operation is implementable end-to-end without gaps

  Scenario: Training and video lanes are complete
    Given the artifact "docs/validation/P2_T2_IOS_TRAINING_VIDEO_VALIDATION_V1.json"
    Then trainingDarkComplete must be true
    And trainingLightComplete must be true
    And videoDarkComplete must be true
    And videoLightComplete must be true

  Scenario: States, flow connectors and fallback are covered
    Given the same artifact
    Then trainingStatesComplete must be true
    And trainingFlowConnected must be true
    And videoFlowConnected must be true
    And fallbackCovered must be true
    And overallPass must be true
