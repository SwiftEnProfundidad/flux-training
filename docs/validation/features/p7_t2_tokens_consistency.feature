Feature: P7-T2 Tokens y consistencia visual
  Como equipo de diseño enterprise
  Queremos tokenizar color/tipografía/spacing con reglas de consistencia
  Para reducir drift visual entre iOS y Web

  Scenario: Definición de token set
    Given el board flux.pen
    When ejecuto extracción de tokens P7-T2
    Then debe existir P7_T2_TOKEN_SET_V1.json
    And debe incluir colores core, tipografías y escala de spacing

  Scenario: Reglas de consistencia por sección
    Given la auditoría P7_T2_TOKEN_AUDIT_V1.csv
    Then las secciones no exentas deben cumplir dual lane dark/light
    And la validación debe reportar checks de paleta, tipografía y spacing

  Scenario: Resultado global de P7-T2
    Given P7_T2_TOKEN_VALIDATION_V1.json
    Then overallPass debe ser true
