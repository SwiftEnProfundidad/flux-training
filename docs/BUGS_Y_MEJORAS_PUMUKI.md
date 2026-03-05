# Bugs y Mejoras de Pumuki

Registro operativo para documentar fallos, fricciones y mejoras del framework `pumuki` detectadas en este repo enterprise.

## Leyenda
- ✅ Cerrado
- 🚧 En construccion (maximo 1)
- ⏳ Pendiente
- ⛔ Bloqueado

## Objetivo
- Acelerar feedback real hacia Pumuki con evidencia reproducible.
- Evitar perdida de tiempo en bloqueos repetidos de flujo (pre-commit, SDD, evidence, skills).
- Mantener trazabilidad tecnica de cada hallazgo hasta su cierre.

## Regla de uso (obligatoria por iteracion)
- Cada vez que Pumuki bloquee o degrade flujo, anadir una entrada nueva.
- Cada entrada debe incluir evidencia minima: comando, salida y contexto.
- No cerrar una entrada sin documentar la validacion del fix.

## Campos de registro
- `ID`
- `Fecha`
- `Tipo` (`Bug` o `Mejora`)
- `Area` (`SDD`, `Evidence`, `Hooks`, `Skills`, `DX`, etc.)
- `Sintoma`
- `Impacto`
- `Evidencia`
- `Propuesta`
- `Estado` (`✅ Cerrado`, `🚧 En construccion`, `⏳ Pendiente`, `⛔ Bloqueado`)

## Backlog actual

| ID | Fecha | Tipo | Area | Sintoma | Impacto | Evidencia | Propuesta | Estado |
|---|---|---|---|---|---|---|---|---|
| PUM-001 | 2026-03-05 | Bug | SDD/Hooks | `pre-commit` bloquea con `SDD_SESSION_MISSING` sin autoguiado efectivo para abrir sesion y continuar en el mismo flujo. | Alto (bloquea commits validos) | Hook: `SDD_SESSION_MISSING: Run pumuki sdd session --open --change=<id>` | Agregar comando asistido (`pumuki sdd session --open --change=auto`) y mensaje con ejemplo concreto + deteccion de change sugerido. | ✅ Cerrado |
| PUM-002 | 2026-03-05 | Bug | Evidence/Skills | `pre-commit` bloquea por `frontend-guidelines` y reglas `skills.frontend.*` no evaluadas aunque el cambio es menor de copy. | Alto (gate demasiado rigido para cambios low-risk) | Hook: `EVIDENCE_PLATFORM_SKILLS_BUNDLES_MISSING`, `EVIDENCE_CROSS_PLATFORM_CRITICAL_ENFORCEMENT_INCOMPLETE` | Introducir modo proporcional por riesgo (copy/docs) o auto-generacion de evidence minima en pre-commit. | ✅ Cerrado |
| PUM-003 | 2026-03-05 | Mejora | DX | Mensajes de bloqueo mezclan varias causas en una sola ejecucion sin ruta de resolucion ordenada. | Media (tiempo extra de diagnostico) | Salida combinada: SDD + skills + evidence | Entregar resumen jerarquico: 1) bloqueante primario, 2) comando exacto, 3) reintento recomendado. | ✅ Cerrado |
| PUM-004 | 2026-03-05 | Mejora | Hooks/Git | Error de atomicidad por `too many scopes` sin sugerencia de split automatico de staging. | Media (friccion en commits atomicos) | Hook: `GIT_ATOMICITY_TOO_MANY_SCOPES` | Agregar sugerencia accionable (`git reset` + archivos sugeridos por scope) o `pumuki commit --split`. | ✅ Cerrado |
| PUM-005 | 2026-03-05 | Bug | SDD/Evidence | `pumuki sdd evidence` genera `pumuki-evidence-v1.json` con esquema incompatible con el gate TDD (`version: \"1.0\"` y sin `slices`), provocando bloqueo inmediato en `pre-commit`. | Alto (bloquea commits incluso con tests verdes) | Secuencia reproducida: `pumuki sdd evidence ...` -> `pumuki watch --once --stage=PRE_COMMIT --scope=staged` -> `TDD_BDD_EVIDENCE_INVALID` (`expected \"1\"`, `expected array`). | Corregir scaffold de `sdd evidence` para emitir contrato v1 real (`version: \"1\"`, `slices[]` RED/GREEN/REFACTOR) o alinear validador a la salida del scaffold. | ⏳ Pendiente |
| PUM-006 | 2026-03-05 | Mejora | DX/Watch | `pumuki watch --once --scope=staged` devuelve `ALLOW` sin detallar la lista de archivos evaluados en ese tick. | Media (dificulta trazabilidad fina de gate por commit) | Ejecucion: `pnpm exec pumuki watch --once --stage=PRE_COMMIT --scope=staged --json` -> `gateOutcome: \"ALLOW\"` y `totalFindings: 0`, pero sin `changedFiles[]`. | Incluir en la salida JSON del tick un campo `changedFiles`/`evaluatedFiles` para auditar con precision que entró al gate. | ⏳ Pendiente |

## Criterio de cierre por entrada
- Reproducida y documentada.
- Fix implementado o workaround estable.
- Validacion ejecutada en este repo (comando + salida).
- Estado actualizado a `✅ Cerrado` con fecha de cierre.
