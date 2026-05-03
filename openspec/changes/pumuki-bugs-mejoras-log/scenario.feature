Feature: Pumuki integration feedback log
  Como equipo de producto enterprise
  Quiero registrar los bugs y mejoras de Pumuki con evidencia accionable
  Para mantener trazabilidad entre incidencias reales del consumer y correcciones del framework

  Scenario: Canonical log file is present
    Given the repository documentation is reviewed
    When Pumuki integration feedback is inspected
    Then "docs/BUGS_Y_MEJORAS_PUMUKI.md" exists and is readable

  Scenario: New issue is recorded with actionable evidence
    Given a Pumuki blocker or improvement is detected during an iteration
    When a new issue entry is added to the canonical log
    Then the entry includes "Sintoma", "Impacto", "Evidencia", "Propuesta", and "Estado"

  Scenario: Workflow enforces issue logging before closure
    Given a Pumuki-related gate or hook issue appears during an iteration
    When the task is prepared for closure
    Then the canonical Pumuki log is updated before the iteration is closed
