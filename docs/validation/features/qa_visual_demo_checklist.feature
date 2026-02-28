Feature: QA visual end-to-end y checklist demo funcional
  Como equipo de release
  Quiero validar la experiencia visible y el smoke funcional
  Para detectar riesgos antes de una demo o entrega

  Scenario: Baseline visual web renderiza todos los modulos de producto
    Given el frontend web esta levantado localmente
    When se abre el dashboard principal
    Then se observan hero de readiness, onboarding, training, videos, recomendaciones IA, nutricion, progreso, sync y observabilidad

  Scenario: Degradacion controlada cuando no existe runtime API local
    Given el frontend se ejecuta sin backend HTTP local
    When el usuario ejecuta acciones que requieren /api
    Then la UI no colapsa y refleja estados de error manejados

  Scenario: Checklist demo registra evidencia ejecutable
    Given existen comandos de quality gate y artefactos visuales
    When se consolida el checklist de release
    Then cada punto queda marcado con resultado, evidencia y bloqueo si aplica
