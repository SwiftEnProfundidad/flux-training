Feature: P7-T1 Componentización reusable
  Como equipo de diseño y desarrollo
  Queremos una base de componentes reutilizables en el board
  Para acelerar implementación y reducir deriva visual entre módulos

  Scenario: Inventario de componentes reutilizables
    Given el archivo flux.pen
    When ejecuto la extracción de componentes base P7-T1
    Then debe generarse P7_T1_COMPONENT_INVENTORY_V1.csv
    And cada componente inventariado debe estar marcado como reusable=true

  Scenario: Cobertura mínima de categorías enterprise
    Given el inventario de componentes P7-T1
    Then debe cubrir categorías de button, input, filter, table_action, state_action y card
    And no deben quedar targets definidos sin mapear

  Scenario: Resultado de validación P7-T1
    Given P7_T1_COMPONENT_VALIDATION_V1.json
    Then overallPass debe ser true
