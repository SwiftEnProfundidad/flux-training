Feature: R2 Normalización de outliers de color
  Como equipo de diseño
  Quiero reducir colores de bajo uso no semánticos
  Para mejorar coherencia visual sin romper estados críticos

  Scenario: Normalización de outliers
    Given el registro de outliers previo
    When aplico mapeo controlado a paleta core
    Then la cantidad de outliers debe reducirse significativamente

  Scenario: Revalidación de token consistency
    Given P7_T2_TOKEN_VALIDATION_V1.json
    Then overallPass debe ser true tras la normalización
