Feature: C3 T2 web microcopy and accessibility hardening
  Como equipo de producto
  Quiero endurecer labels y accesibilidad en formularios web
  Para mantener paridad ES/EN y mejorar navegación asistiva

  Scenario: Inputs y selects críticos exponen aria-label
    Given el dashboard web de Flux
    When se renderizan auth, onboarding, entrenamiento y nutrición
    Then los campos de entrada y selectores deben incluir aria-label localizable

  Scenario: Nuevas claves i18n para controles de formulario
    Given el diccionario i18n web
    When consulto claves de picker y selector de video
    Then deben existir traducciones en ES y EN validadas por tests
