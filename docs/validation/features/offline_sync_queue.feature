Feature: Offline core and synchronization queue
  Scenario: User actions are queued offline and synchronized later
    Given network-dependent actions fail while user is offline
    When actions are enqueued for deferred synchronization
    Then pending actions are persisted locally
    And accepted actions are removed from the queue after sync
