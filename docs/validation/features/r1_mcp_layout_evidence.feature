Feature: R1 Evidencia MCP de layout
  Como equipo de QA
  Quiero evidencia directa desde Pencil MCP
  Para cerrar el riesgo de verificación externa del editor

  Scenario: Sesión de editor requerida
    Given el archivo flux.pen
    When intento leer estado/layout por MCP sin editor activo
    Then el resultado debe marcarse BLOCKED con causa explícita

  Scenario: Cierre de riesgo con evidencia MCP
    Given una sesión de editor MCP activa
    When ejecuto batch_get y snapshot_layout sobre flux.pen
    Then debo obtener top-level canónico y "No layout problems" en iOS/web
