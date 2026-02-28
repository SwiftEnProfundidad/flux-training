Feature: Recomendaciones IA para retencion
  Como usuario que quiere resultados constantes
  Quiero recomendaciones personalizadas cada dia
  Para mantener adherencia, ajustar carga y evitar abandono

  Scenario: Backend genera recomendaciones accionables por contexto
    Given un usuario con progreso, cola y objetivo cargados
    When solicita recomendaciones IA del dia
    Then recibe acciones priorizadas con motivo y metrica esperada

  Scenario: Web muestra recomendaciones en dashboard principal
    Given el panel web tiene estado de readiness y progreso
    When carga recomendaciones IA
    Then visualiza tarjetas con prioridad, accion sugerida y CTA

  Scenario: iOS expone recomendaciones en la pestaña de operaciones
    Given el hub iOS tiene datos de sesiones y sincronizacion
    When refresca recomendaciones
    Then puede ver top recomendaciones y su impacto de retencion
