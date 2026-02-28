Feature: Critical regression suite
  Scenario: Core user journeys remain stable after iterative delivery
    Given onboarding, training, nutrition, progress and observability capabilities are implemented
    When the critical regression suite is executed across backend, web and iOS
    Then no behavioral regressions are detected in critical user flows
