Feature: V3 P2 T2 web core operations
  As an operations team
  I want core modules to behave deterministically with enterprise states
  So that athletes, nutrition and progress operations remain robust under filtering and domain constraints

  Scenario: Operations hub supports roster filtering and bulk assignment
    Given athletes are derived from plans, sessions and nutrition logs
    When an operator filters and selects athletes in operations hub
    Then bulk actions validate selection and expose deterministic runtime statuses

  Scenario: Nutrition and progress modules provide operational filtering
    Given nutrition logs and progress history are available
    When filters and sort modes are applied
    Then filtered counters, empty states and derived effort metrics are shown consistently

  Scenario: Enterprise runtime states are unified across core modules
    Given domain runtime state changes to offline, denied or error
    When core modules recalculate their status
    Then module status reflects domain constraints before data-derived states
    And validation errors from filter inputs are surfaced explicitly
