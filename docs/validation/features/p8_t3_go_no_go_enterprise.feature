Feature: P8-T3 Go/No-Go enterprise
  Como responsable de cierre
  Quiero un dictamen final con gates y riesgos residuales
  Para decidir salida del plan V1 con trazabilidad

  Scenario: Consolidación de gates
    Given la evidencia de validaciones P5..P8
    When genero el reporte P8-T3
    Then todos los gates deben estar en PASS para habilitar GO

  Scenario: Riesgos residuales documentados
    Given el registro de riesgos residuales
    Then cada riesgo debe incluir severidad, estado y mitigación

  Scenario: Dictamen final
    Given P8_T3_GO_NO_GO_REPORT_V1.json
    Then la decisión debe estar explícita (GO_CONDITIONAL o NO_GO)
    And overallPass debe reflejar el estado final del cierre
