Feature: R3 Hardening semántico legal/privacy
  Como equipo de compliance y UX
  Quiero controles legales con naming semántico explícito
  Para mejorar trazabilidad de implementación y accesibilidad

  Scenario: Renombrado semántico legal
    Given las pantallas legales de iOS D5 y Web D5
    When aplico hardening de naming
    Then no deben quedar controles auto_ctrl en esos flujos objetivo

  Scenario: Revalidación cruzada
    Given la validación posterior a R3
    Then A11y P6-T2 y handoff P7-T3 deben permanecer en PASS
