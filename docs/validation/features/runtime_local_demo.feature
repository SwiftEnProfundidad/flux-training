Feature: Runtime local para demo funcional
  Como equipo de producto
  Quiero un runtime local de API y un host iOS ejecutable
  Para demostrar el producto completo sin depender de infraestructura externa

  Scenario: API local responde rutas consumidas por web
    Given el servidor local de demo esta levantado
    When el dashboard web solicita videos y recomendaciones IA
    Then las respuestas de /api llegan en estado loaded y con datos

  Scenario: Host iOS ejecuta ExperienceHubView en simulador
    Given existe un proyecto iOS host ligado al modulo FluxTraining
    When se builda y lanza en simulador
    Then la app abre el hub principal sin crash
