Feature: UX moderna base para web e iOS
  Como usuario diario de entrenamiento
  Quiero una interfaz moderna y clara
  Para completar onboarding y sesiones con menos friccion

  Scenario: Dashboard web con jerarquia visual
    Given la aplicacion web inicia en el panel principal
    When se renderiza la pantalla inicial
    Then se muestra un hero con resumen de estado y secciones funcionales en tarjetas

  Scenario: Base UX iOS con navegacion por pestañas
    Given la aplicacion iOS carga el hub principal
    When el usuario navega por pestañas
    Then puede acceder a entrenamiento, progreso y operacion sin perder contexto

  Scenario: Indicador de preparacion del flujo
    Given los estados de autenticacion, onboarding y sincronizacion
    When se calcula el readiness score
    Then se obtiene un indicador numerico y etiqueta accionable
