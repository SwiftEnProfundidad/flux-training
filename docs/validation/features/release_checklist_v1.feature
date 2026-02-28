Feature: Checklist de release v1 para beta cerrada
  Como responsable de release
  Quiero una verificacion reproducible de calidad, legal y operacion
  Para decidir GO o NO-GO antes de publicar la v1

  Scenario: Gate tecnico en verde
    Given el comando "pnpm release:check"
    When se ejecuta sobre la rama de release
    Then todos los checks y tests terminan en verde

  Scenario: Smoke legal y versionado completado
    Given una build web e iOS actual
    When se valida consentimiento legal, borrado y control de version minima
    Then el checklist de release marca cumplimiento

  Scenario: Decision final de publicacion
    Given el checklist tecnico y funcional completado
    When se revisan riesgos y plan de rollback
    Then se emite decision GO o NO-GO documentada
