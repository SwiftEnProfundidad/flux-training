Feature: Foundation workspace
  Scenario: Monorepo structure is ready
    Given the repository starts from an empty baseline
    When foundation setup is completed
    Then root workspace commands are available
    And apps and shared package folders are present

