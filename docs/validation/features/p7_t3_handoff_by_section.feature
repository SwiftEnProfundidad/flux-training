Feature: P7-T3 Handoff técnico por sección
  Como equipo de implementación
  Queremos especificaciones accionables por pantalla y sección
  Para codificar sin ambigüedad en iOS y Web

  Scenario: Especificación de pantallas
    Given el board flux.pen
    When genero el handoff P7-T3
    Then debe existir P7_T3_HANDOFF_SCREEN_SPECS_V1.csv con cobertura completa de pantallas

  Scenario: Matriz de interacciones
    Given las acciones primarias por pantalla
    Then debe existir P7_T3_HANDOFF_INTERACTIONS_V1.csv
    And cada pantalla debe tener al menos un trigger documentado (acción o estado view-only)

  Scenario: Checklist QA de implementación
    Given P7_T3_HANDOFF_QA_CHECKLIST_V1.json
    Then overallPass debe ser true
    And el checklist debe incluir estados críticos y requisitos de i18n/a11y
