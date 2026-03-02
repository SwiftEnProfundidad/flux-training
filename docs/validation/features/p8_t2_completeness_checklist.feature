Feature: P8-T2 Checklist de completitud
  Como responsable de release
  Quiero validar cobertura total de pantallas, estados y evidencia
  Para cerrar el board con trazabilidad verificable

  Scenario: Cobertura de pantallas
    Given el baseline de pantallas auditadas
    When comparo handoff técnico contra baseline
    Then la cobertura de pantallas debe ser 100%

  Scenario: Cobertura de estados críticos
    Given la validación P5-T1
    Then el coverage de estados críticos debe permanecer en 100%

  Scenario: Gate de completitud
    Given P8_T2_COMPLETENESS_VALIDATION_V1.json
    Then overallPass debe ser true
