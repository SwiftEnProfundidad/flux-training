Feature: P6-T3 Localización ES/EN robusta
  Como equipo de producto enterprise
  Queremos asegurar una base bilingüe consistente en iOS y Web
  Para evitar roturas de copy y fallback en implementación

  Scenario: Cobertura por secciones iOS/Web
    Given el board canónico flux.pen
    When ejecuto la auditoría de localización P6-T3
    Then debo validar todas las secciones de dominio iOS y Web
    And la matriz P6_T3_I18N_ES_EN_COVERAGE_V1.csv debe existir

  Scenario: Reglas mínimas de localización
    Given una sección funcional de producto
    Then debe incluir lang hint ES/EN
    And debe incluir nota de fallback i18n
    And no debe tener riesgo de truncado en textos críticos detectados por la auditoría

  Scenario: Resultado de aceptación de la task
    Given la validación consolidada P6_T3_I18N_ES_EN_VALIDATION_V1.json
    Then overallPass debe ser true
    And sectionsFailing debe ser 0
