Feature: UI/UX profesional y bilingue en web e iOS
  Como usuario de Flux Training
  Quiero una experiencia visual premium y consistente
  Para usar la app en espanol o ingles sin friccion

  Scenario: Web dashboard soporta cambio de idioma ES/EN
    Given la app web esta cargada en modo local
    When cambio el idioma entre ES y EN desde el selector de idioma
    Then los titulos y acciones clave de la UI se traducen correctamente

  Scenario: iOS Experience Hub permite idioma ES/EN
    Given la app iOS se ejecuta en simulador
    When cambio el idioma desde el control de idioma en el hero
    Then las secciones principales y estados se muestran en el idioma seleccionado

  Scenario: Direccion visual premium aplicada en ambas plataformas
    Given existe una guia de estilo definida para Pencil MCP
    When se renderizan las pantallas principales de web e iOS
    Then ambas comparten jerarquia visual, contraste y lenguaje de marca coherente
