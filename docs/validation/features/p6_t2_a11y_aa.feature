Feature: P6-T2 A11y AA aplicada en pantallas reales
  Como equipo de diseño enterprise
  Queremos asegurar semántica, foco y contraste base en pantallas iOS/Web
  Para reducir riesgo de accesibilidad en implementación

  Scenario: Cobertura de auditoría A11y AA por pantalla
    Given el board canonico flux.pen
    When ejecuto la auditoría P6-T2 de controles por pantalla
    Then debo validar 150 pantallas en total
    And la matriz P6_T2_A11Y_AA_SCREEN_AUDIT_V1.csv debe existir

  Scenario: Semántica y foco determinista
    Given los controles interactivos detectados por pantalla
    When reviso labels semánticos y unicidad de nombres
    Then no debe haber controles sin semántica
    And no debe haber duplicados de nombre en controles de una misma pantalla

  Scenario: Resultado de aceptación de la task
    Given la validación consolidada P6_T2_A11Y_AA_VALIDATION_V1.json
    When evalúo el resultado global
    Then overallPass debe ser true
    And screensFailing debe ser 0
