Feature: Nutrition logging
  Scenario: User registers daily calories and macros
    Given the user enters calories and macro values
    When the nutrition log is submitted
    Then the log is persisted and can be listed later

