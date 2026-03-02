Feature: P8-T1 QA visual y flujo completo
  Como equipo de release
  Queremos validar integridad visual y estructural del board
  Para evitar clipping, huérfanas y roturas en handoff

  Scenario: Verificación estructural global
    Given flux.pen
    When ejecuto QA P8-T1
    Then deben existir BOARD_IOS_APP y BOARD_WEB_APP
    And no debe haber pantallas huérfanas fuera de secciones de dominio

  Scenario: Integridad de layout numérico
    Given nodos con geometría numérica completa
    Then no debe detectarse overflow fuera de parent bounds

  Scenario: Resultado consolidado P8-T1
    Given P8_T1_VISUAL_FLOW_QA_V1.json
    Then overallPass debe ser true
