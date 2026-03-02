Feature: C3 T1 iOS Auth i18n hardening
  Como equipo de producto
  Quiero que la UI de autenticacion iOS no tenga textos hardcodeados
  Para mantener paridad ES/EN y consistencia de copy en runtime

  Scenario: Campos de auth usan LocalizedCopy
    Given la pantalla de autenticacion en ExperienceHubView
    When se renderizan los campos de email y password
    Then las etiquetas deben provenir de LocalizedCopy

  Scenario: Opciones de idioma usan LocalizedCopy
    Given el selector de idioma de ExperienceHubView
    When se muestran las opciones de idioma
    Then las etiquetas deben resolverse mediante claves de LocalizedCopy
