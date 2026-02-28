Feature: Integracion de videos de ejercicios
  Como usuario que entrena en casa
  Quiero ver videos cortos por ejercicio
  Para ejecutar la tecnica correcta y reducir errores

  Scenario: Catalogo de videos disponible por ejercicio
    Given un usuario autenticado con plan activo
    When solicita el catalogo de videos de ejercicios
    Then recibe una lista con video URL, miniatura y nivel de dificultad

  Scenario: Web muestra videos dentro del flujo de entrenamiento
    Given la pantalla de training esta cargada en web
    When el usuario abre la seccion de videos
    Then puede reproducir un video y abrir la guia del ejercicio

  Scenario: iOS expone videos recomendados en el hub de entrenamiento
    Given el hub iOS tiene sesiones y plan seleccionados
    When el usuario revisa los recursos del ejercicio
    Then ve una lista de videos filtrada por exerciseID
