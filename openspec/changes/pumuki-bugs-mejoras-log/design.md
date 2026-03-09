## Context

El repo usa hooks gestionados por Pumuki que bloquean commits cuando faltan
precondiciones de SDD/evidence/skills. Sin un registro central, los mismos
errores se repiten y se pierde tiempo de diagnostico.

## Goals / Non-Goals

**Goals:**
- Consolidar bugs/mejoras de Pumuki en un unico documento operativo.
- Estandarizar evidencia minima para cada incidencia.
- Hacer obligatorio el registro en cada iteracion.

**Non-Goals:**
- No modifica logica interna del paquete Pumuki.
- No redefine politicas de gate del framework.

## Decisions

- Crear `docs/BUGS_Y_MEJORAS_PUMUKI.md` como fuente principal.
- Mantener `docs/technical/08-validation/refactor/pumuki-integration-feedback.md`
  como archivo canonico compatible con validadores SDD.
- Exigir actualizacion por iteracion via regla explicita en `AGENTS.md`.

## Risks / Trade-offs

- [Riesgo] Sobrecarga documental si no se curan entradas duplicadas.
  -> Mitigacion: plantilla fija + estado por entrada + criterio de cierre.
- [Riesgo] Ruido por hallazgos sin evidencia.
  -> Mitigacion: campos obligatorios (`Evidencia`, `Impacto`, `Propuesta`).
