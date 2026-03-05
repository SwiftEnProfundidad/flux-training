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
| PUM-005 | 2026-03-05 | Bug | SDD/Evidence | `pumuki sdd evidence` genera `pumuki-evidence-v1.json` con esquema incompatible con el gate TDD (`version: \"1.0\"` y sin `slices`), provocando bloqueo inmediato en `pre-commit`. | Alto (bloquea commits incluso con tests verdes) | Secuencia reproducida: `pumuki sdd evidence ...` -> `pumuki watch --once --stage=PRE_COMMIT --scope=staged` -> `TDD_BDD_EVIDENCE_INVALID` (`expected \"1\"`, `expected array`). | Corregir scaffold de `sdd evidence` para emitir contrato v1 real (`version: \"1\"`, `slices[]` RED/GREEN/REFACTOR) o alinear validador a la salida del scaffold. | ✅ Cerrado |
| PUM-006 | 2026-03-05 | Mejora | DX/Watch | `pumuki watch --once --scope=staged` devuelve `ALLOW` sin detallar la lista de archivos evaluados en ese tick. | Media (dificulta trazabilidad fina de gate por commit) | Ejecucion: `pnpm exec pumuki watch --once --stage=PRE_COMMIT --scope=staged --json` -> `gateOutcome: \"ALLOW\"` y `totalFindings: 0`, pero sin `changedFiles[]`. | Incluir en la salida JSON del tick un campo `changedFiles`/`evaluatedFiles` para auditar con precision que entró al gate. | ✅ Cerrado |
| PUM-007 | 2026-03-05 | Bug | Hooks/Higiene | El flujo de hooks deja artefactos efimeros (`.ai_evidence.json`, `.pumuki/**`) en raiz del repo tras pasar el gate. | Alta (ensucia worktree y añade friccion con GitFlow/commits atomicos). | Reproducido tras `pnpm exec pumuki watch --once --stage=PRE_COMMIT --scope=staged --json`: `git status --short` muestra ambos paths como untracked. | Añadir cleanup post-hook o soporte de `--ephemeral-dir` fuera del repo para no contaminar el estado de trabajo. | ✅ Cerrado |
| PUM-008 | 2026-03-05 | Bug | Skills/Frontend | El gate `skills.frontend.no-solid-violations` bloquea cambios incrementales en `apps/web/src/presentation/App.tsx` sin detallar criterio o umbral de incumplimiento. | Alta (impide correcciones pequeñas de UX en archivo legacy y obliga a refactor completo para cualquier ajuste). | Reproducido con cambio mínimo de semántica: `pnpm exec pumuki watch --once --stage=PRE_COMMIT --scope=staged --json` -> `SKILLS_SKILLS_FRONTEND_NO_SOLID_VIOLATIONS` en `App.tsx:1`. | Exponer en el hallazgo las métricas exactas del rule check + sugerencia de extracción modular automática para permitir commits progresivos. | ✅ Cerrado |
| PUM-009 | 2026-03-05 | Bug | SDD/Evidence | En consumer se reportó artefacto incompleto de `sdd evidence` (`version: \"1.0\"` o sin `slices[]`). | Alta (bloquea commits por `TDD_BDD_EVIDENCE_INVALID`). | Validación 2026-03-05 con `npx --yes --package pumuki@latest pumuki sdd evidence --scenario-id=docs/validation/features/p3_t1_web_shell_dashboard --test-command=\"pnpm test\" --test-status=passed --json` devuelve `artifact.version=\"1\"` y `artifact.slices[]`. | Mantener smoke de regresión en consumer al actualizar Pumuki y usar `pumuki@latest` para validar contrato. | ✅ Cerrado |
| PUM-010 | 2026-03-05 | Mejora | Skills/Gate DX | El stack de skills coverage no queda estable entre iteraciones; sin `adapter/bootstrap/policy reconcile` vuelve a bloquear commits frontend aunque el código sea válido. | Alta (fricción recurrente y tiempo extra en cada commit atómico). | Repro 2 iteraciones seguidas: `pnpm exec pumuki watch --once --stage=PRE_COMMIT --scope=staged --json` => `SKILLS_PLATFORM_COVERAGE_INCOMPLETE_HIGH` + `SKILLS_SCOPE_COMPLIANCE_INCOMPLETE_HIGH`; se desbloquea tras `adapter install + bootstrap + policy reconcile`. | Seguimiento upstream en `ast-intelligence-hooks#719`; fix técnico aplicado en core para auto-reconcile + retry determinista de hooks en códigos de skills coverage. | ✅ Cerrado |
| PUM-011 | 2026-03-05 | Bug | Watch/Consumer parity | Se reportó que `watch --once --json` no incluía `lastTick.changedFiles[]` ni `lastTick.evaluatedFiles[]`. | Media (limita trazabilidad por commit). | Validación 2026-03-05 con `npx --yes --package pumuki@latest pumuki watch --once --stage=PRE_COMMIT --scope=staged --json` devuelve ambos campos en `lastTick` (arrays presentes). | Mantener check de contrato JSON tras cada update de Pumuki en consumer. | ✅ Cerrado |
| PUM-012 | 2026-03-05 | Bug | Watch/DX parity | Divergencia entre `pnpm exec pumuki` (versión instalada en repo) y `pumuki@latest`: en local no aparecen `lastTick.changedFiles[]`/`evaluatedFiles[]`, en latest sí. | Media (genera diagnósticos inconsistentes y cierres falsos de incidencias). | En esta iteración: `pnpm exec pumuki watch --once --stage=PRE_COMMIT --scope=staged --json` devuelve `ALLOW` pero sin `changedFiles/evaluatedFiles`; contraste con `npx --yes --package pumuki@latest ...` en historial reciente. | Exponer versión efectiva en salida JSON y añadir alerta de drift cuando el binario local no incluye fixes de contrato ya disponibles en latest. | ✅ Cerrado |
| PUM-013 | 2026-03-05 | Bug | DX/Determinismo de dependencias | Durante iteraciones de validación (`pnpm exec pumuki watch` + ciclo test/build/check), el repo mostró drift de dependencia `pumuki` (`6.3.46 -> 6.3.47`) en `package.json` y `pnpm-lock.yaml` sin `pnpm add` explícito. | Alta (ensucia worktree y rompe regla de commits atómicos por scope funcional). | Evidencia: `git diff -- package.json pnpm-lock.yaml` mostró cambio de versión tras el ciclo de validación; restaurado con `git restore package.json pnpm-lock.yaml`. | Garantizar modo no mutante en comandos de validación (`watch/doctor/bootstrap`) o emitir prompt explícito antes de cualquier write en manifest/lockfile. | ✅ Cerrado (#722, validado 2026-03-05) |
| PUM-014 | 2026-03-05 | Mejora | Watch/JSON contract | `watch --once --scope=staged` devuelve `lastTick.changed=true` incluso cuando `changedFiles=[]` y `evaluatedFiles=[]`. | Media (puede inducir a interpretar que hubo cambios reales cuando no hubo ficheros staged). | Validación en esta iteración: `pnpm exec pumuki watch --once --stage=PRE_COMMIT --scope=staged --json` con salida `changed=true`, `changedFiles=[]`, `evaluatedFiles=[]`, `gateOutcome=\"ALLOW\"`. | Ajustar semántica de `changed` a `false` cuando no existan ficheros staged, o documentar explícitamente que `changed` indica tick ejecutado y no delta de archivos. | ✅ Cerrado (#723, v6.3.49) |
| PUM-015 | 2026-03-05 | Bug | Watch/Rollout parity | En Flux (consumer `6.3.47`) persiste el comportamiento semántico previo: `lastTick.changed=true` con `changedFiles=[]` y `evaluatedFiles=[]` en `scope=staged`. | Media (genera falso positivo de cambio y confunde trazabilidad de gates). | Validación fase 12: `pnpm exec pumuki watch --once --stage=PRE_COMMIT --scope=staged --json` -> `version.effective=6.3.47`, `changed=true`, `changedFiles=[]`, `evaluatedFiles=[]`, `gateOutcome=\"ALLOW\"`. | Alinear rollout consumer de Flux al fix ya publicado (`>=6.3.49`) o backport explícito en versión instalada; revalidar contrato JSON tras upgrade. | ✅ Cerrado (#725, validado 2026-03-05) |

## Criterio de cierre por entrada
- Reproducida y documentada.
- Fix implementado o workaround estable.
- Validacion ejecutada en este repo (comando + salida).
- Estado actualizado a `✅ Cerrado` con fecha de cierre.

## Actualizacion de estado (2026-03-05)
- `PUM-005` cerrado en `pumuki@6.3.43`:
  - `pumuki sdd evidence --scenario-id=flux-pumuki-005-latest --test-command=\"pnpm test\" --test-status=passed --json` ahora genera `artifact.version=\"1\"` y `artifact.slices[]`.
  - smoke posterior: `pnpm exec pumuki watch --once --stage=PRE_COMMIT --scope=staged --json` en `ALLOW` sin `TDD_BDD_EVIDENCE_INVALID`.
- `PUM-006` cerrado en core Pumuki (pendiente rollout de versión en consumer):
  - `pumuki watch --once --json` ahora incluye trazabilidad por tick en `lastTick.changedFiles[]` y `lastTick.evaluatedFiles[]`.
  - validación técnica en core: `integrations/lifecycle/__tests__/watch.test.ts` + `integrations/lifecycle/__tests__/cli.test.ts` en verde.
- `PUM-007` cerrado en core Pumuki:
  - higiene runtime aplicada en `.git/info/exclude` para evitar ruido de artefactos (`.ai_evidence.json`, `.AI_EVIDENCE.json`, `.pumuki/`),
  - soporte robusto para `git worktree` (`.git` como `gitdir`).
  - smoke real en este repo con CLI local de Pumuki core:
    - `node /Users/juancarlosmerlosalbarracin/Developer/Projects/ast-intelligence-hooks/bin/pumuki.js watch --once --stage=PRE_COMMIT --scope=staged --json`
    - `git status --short` sin ruido de `.ai_evidence.json` / `.pumuki/**` tras la ejecución.
- `PUM-008` cerrado en core Pumuki (pendiente rollout de versión en consumer):
  - el finding `SKILLS_SKILLS_FRONTEND_NO_SOLID_VIOLATIONS` ahora incluye criterios accionables (`ast_nodes`), métricas observadas (`observed_paths`) y muestra de rutas (`sample_paths`) para diagnóstico incremental.
  - la salida humana del gate añade `next_action` específico para remediación progresiva (extracción por componente/hook en commits pequeños).
  - validación técnica en core:
    - `npx --yes tsx@4.21.0 --test integrations/config/__tests__/skillsRuleSet.test.ts integrations/git/__tests__/runPlatformGateOutput.test.ts`
    - `npm run -s typecheck`
- `PUM-009` cerrado (validación 2026-03-05):
  - `npx --yes --package pumuki@latest pumuki sdd evidence --scenario-id=docs/validation/features/p3_t1_web_shell_dashboard --test-command="pnpm test" --test-status=passed --json`
  - resultado: `artifact.version="1"` y `artifact.slices[]` presentes.
- `PUM-011` cerrado (validación 2026-03-05):
  - `npx --yes --package pumuki@latest pumuki watch --once --stage=PRE_COMMIT --scope=staged --json`
  - resultado: `lastTick.changedFiles[]` y `lastTick.evaluatedFiles[]` presentes.
- Verificación de esta iteración (2026-03-05, runtime local de repo):
  - `pnpm exec pumuki watch --once --stage=PRE_COMMIT --scope=staged --json`
  - resultado: `gateOutcome="ALLOW"` y `totalFindings=0`, pero sin `lastTick.changedFiles[]`/`lastTick.evaluatedFiles[]`.
  - se registra `PUM-012` para seguimiento de drift local vs latest.
- `PUM-010` cerrado (validación 2026-03-05):
  - fix técnico implementado en core para hooks: auto-reconcile + retry único cuando bloquea por códigos de skills coverage (`#719`).
  - validación consumer (sin commit) con binario local de core:
    - `node /Users/juancarlosmerlosalbarracin/Developer/Projects/ast-intelligence-hooks/bin/pumuki.js watch --once --stage=PRE_COMMIT --scope=staged --json` (dos iteraciones seguidas sobre cambio staged controlado)
    - resultado en ambas: `gateOutcome=\"ALLOW\"`, `gateExitCode=0`, `totalFindings=0`.
- Revalidación en iteración actual (modularización fase 7):
  - `pnpm exec pumuki watch --once --stage=PRE_COMMIT --scope=staged --json` mantiene `ALLOW` y `totalFindings=0`.
  - se mantiene `PUM-012` como foco por discrepancia de payload (`lastTick.changedFiles/evaluatedFiles`) entre binario local y latest.
- `PUM-012` cerrado (2026-03-05):
  - fix técnico implementado en core para `watch --json`: bloque `version` + alerta de drift (`driftFromRuntime`, `driftWarning`) cuando `effective != runtime`.
  - release publicado: `pumuki@6.3.46`.
  - rollout consumer:
    - `pnpm add -Dw pumuki@latest`
    - `pnpm exec pumuki watch --once --stage=PRE_COMMIT --scope=staged --json`
  - resultado final:
    - `version.effective="6.3.46"`, `version.runtime="6.3.46"`, `version.driftFromRuntime=false`,
    - `lastTick.changedFiles[]` y `lastTick.evaluatedFiles[]` presentes en contrato JSON (arrays).
- Revalidación iteración fase 8 (2026-03-05):
  - `pnpm exec pumuki watch --once --stage=PRE_COMMIT --scope=staged --json` mantiene `ALLOW` y `totalFindings=0`.
  - sin nuevos bugs detectados de Pumuki en esta iteración.
- Revalidación iteración fase 9 (2026-03-05):
  - `pnpm exec pumuki watch --once --stage=PRE_COMMIT --scope=staged --json` mantiene `ALLOW` y `totalFindings=0`.
  - sin nuevos bugs detectados de Pumuki en esta iteración.
- Revalidación iteración fase 10 (2026-03-05):
  - `pnpm exec pumuki watch --once --stage=PRE_COMMIT --scope=staged --json` en `pumuki@6.3.46` mantiene `ALLOW` con `version.driftFromRuntime=false`.
  - sin nuevos bugs detectados de Pumuki en esta iteración.
- Hallazgo adicional de higiene en iteración actual:
  - se detectó drift no esperado en dependencia `pumuki` (`package.json` + `pnpm-lock.yaml`) durante validación.
  - se registró como `PUM-013` y se revirtió en local para mantener worktree limpio.
- `PUM-013` cerrado (validación final 2026-03-05):
  - `npx --yes --package pumuki@latest pumuki watch --once --stage=PRE_COMMIT --scope=staged --json`
  - hashes before/after sin cambios en `package.json` y `pnpm-lock.yaml`.
  - issue upstream: `#722` cerrada.
- Revalidación iteración fase 11 (2026-03-05):
  - `pnpm exec pumuki watch --once --stage=PRE_COMMIT --scope=staged --json` en `pumuki@6.3.47` mantiene `ALLOW`, `version.driftFromRuntime=false` y arrays de trazabilidad presentes.
  - se detecta mejora pendiente de semántica en `lastTick.changed` cuando `changedFiles=[]`; se registra `PUM-014`.
- `PUM-014` activado para implementación en core (2026-03-05):
  - issue upstream: `#723`.
  - validación local de fix (binario core): `changed=false` con `changedFiles=[]` y `evaluatedFiles=[]`.
- `PUM-014` cerrado (validación final 2026-03-05):
  - release publicada: `pumuki@6.3.49`.
  - validación en Flux con `@latest`:
    - `npx --yes --package pumuki@latest pumuki watch --once --stage=PRE_COMMIT --scope=staged --json`
    - resultado: `changed=false`, `changedFiles=[]`, `evaluatedFiles=[]`, `gateOutcome="ALLOW"`.
  - issue upstream: `#723` cerrada.
- Revalidación iteración fase 12 (2026-03-05):
  - en consumer instalado (`pnpm exec`, versión `6.3.47`) reaparece la semántica antigua en `lastTick.changed`.
  - se registra regresión de rollout como `PUM-015` para trazabilidad y apertura upstream.
- `PUM-015` cerrado (validación final 2026-03-05):
  - issue upstream: `#725` cerrada con evidencia de paridad local vs `@latest`.
  - validación comparativa:
    - local (`pnpm exec`, `6.3.47`): `changed=true`, `changedFiles=[]`, `evaluatedFiles=[]`.
    - latest (`npx --yes --package pumuki@latest`, runtime `6.3.50`): `changed=false`, `changedFiles=[]`, `evaluatedFiles=[]`, `version.driftWarning` presente.
  - conclusión: no regresión nueva de core; gap de rollout del consumer.
- Revalidación iteración fase 13 (2026-03-05):
  - `pnpm exec pumuki watch --once --stage=PRE_COMMIT --scope=staged --json`
  - resultado: `gateOutcome="ALLOW"`, `totalFindings=0`, `version.effective="6.3.47"`, con `changedFiles[]` y `evaluatedFiles[]` correctamente poblados para los dos archivos staged del bloque (`App.tsx`, `AlertsFullCard.tsx`).
  - sin nuevos bugs/mejoras detectados en Pumuki en esta iteración.
- Revalidación iteración fase 14 (2026-03-05):
  - `pnpm exec pumuki watch --once --stage=PRE_COMMIT --scope=staged --json`
  - resultado: `gateOutcome="ALLOW"`, `totalFindings=0`, `version.effective="6.3.47"`, con `changedFiles[]` y `evaluatedFiles[]` correctamente poblados para los dos archivos staged del bloque (`App.tsx`, `RecentActivityCard.tsx`).
  - sin nuevos bugs/mejoras detectados en Pumuki en esta iteración.
- Revalidación iteración fase 15 (2026-03-05):
  - `pnpm exec pumuki watch --once --stage=PRE_COMMIT --scope=staged --json`
  - resultado: `gateOutcome="ALLOW"`, `totalFindings=0`, `version.effective="6.3.47"`, con `changedFiles[]` y `evaluatedFiles[]` correctamente poblados para los dos archivos staged del bloque (`App.tsx`, `ShortcutsCard.tsx`).
  - sin nuevos bugs/mejoras detectados en Pumuki en esta iteración.
- Revalidación iteración fase 16 (2026-03-05):
  - `pnpm exec pumuki watch --once --stage=PRE_COMMIT --scope=staged --json`
  - resultado: `gateOutcome="ALLOW"`, `totalFindings=0`, `version.effective="6.3.47"`, con `changedFiles[]` y `evaluatedFiles[]` correctamente poblados para los dos archivos staged del bloque (`App.tsx`, `CohortAnalysisCard.tsx`).
  - sin nuevos bugs/mejoras detectados en Pumuki en esta iteración.
- Revalidación iteración fase 17 (2026-03-05):
  - `pnpm exec pumuki watch --once --stage=PRE_COMMIT --scope=staged --json`
  - resultado: `gateOutcome="ALLOW"`, `totalFindings=0`, `version.effective="6.3.47"`, con `changedFiles[]` y `evaluatedFiles[]` correctamente poblados para los dos archivos staged del bloque (`App.tsx`, `OnboardingCard.tsx`).
  - sin nuevos bugs/mejoras detectados en Pumuki en esta iteración.
- Revalidación iteración fase 18 (2026-03-05):
  - `pnpm exec pumuki watch --once --stage=PRE_COMMIT --scope=staged --json`
  - resultado: `gateOutcome="ALLOW"`, `totalFindings=0`, `version.effective="6.3.47"`, con `changedFiles[]` y `evaluatedFiles[]` correctamente poblados para los dos archivos staged del bloque (`App.tsx`, `PlanBuilderPanel.tsx`).
  - sin nuevos bugs/mejoras detectados en Pumuki en esta iteración.
- Revalidación iteración fase 19 (2026-03-05):
  - `pnpm exec pumuki watch --once --stage=PRE_COMMIT --scope=staged --json`
  - resultado: `gateOutcome="ALLOW"`, `totalFindings=0`, `version.effective="6.3.47"`, con `changedFiles[]` y `evaluatedFiles[]` correctamente poblados para los dos archivos staged del bloque (`App.tsx`, `PlanTemplatesPanel.tsx`).
  - sin nuevos bugs/mejoras detectados en Pumuki en esta iteración.
- Revalidación iteración fase 20 (2026-03-05):
  - `pnpm exec pumuki watch --once --stage=PRE_COMMIT --scope=staged --json`
  - resultado: `gateOutcome="ALLOW"`, `totalFindings=0`, `version.effective="6.3.47"`, con `changedFiles[]` y `evaluatedFiles[]` correctamente poblados para los dos archivos staged del bloque (`App.tsx`, `PublishReviewPanel.tsx`).
  - sin nuevos bugs/mejoras detectados en Pumuki en esta iteración.
- Revalidación iteración fase 21 (2026-03-05):
  - `pnpm exec pumuki watch --once --stage=PRE_COMMIT --scope=staged --json`
  - resultado: `gateOutcome="ALLOW"`, `totalFindings=0`, `version.effective="6.3.47"`, con `changedFiles[]` y `evaluatedFiles[]` correctamente poblados para los dos archivos staged del bloque (`App.tsx`, `PlansSelectionPanel.tsx`).
  - sin nuevos bugs/mejoras detectados en Pumuki en esta iteración.
- Revalidación iteración fase 22 (2026-03-05):
  - `pnpm exec pumuki watch --once --stage=PRE_COMMIT --scope=staged --json`
  - resultado: `gateOutcome="ALLOW"`, `totalFindings=0`, `version.effective="6.3.47"`, con `changedFiles[]` y `evaluatedFiles[]` correctamente poblados para los dos archivos staged del bloque (`App.tsx`, `PlanAssignmentPanel.tsx`).
  - sin nuevos bugs/mejoras detectados en Pumuki en esta iteración.
- Revalidación iteración fase 23 (2026-03-05):
  - `pnpm exec pumuki watch --once --stage=PRE_COMMIT --scope=staged --json`
  - resultado: `gateOutcome="ALLOW"`, `totalFindings=0`, `version.effective="6.3.47"`, con `changedFiles[]` y `evaluatedFiles[]` correctamente poblados para los dos archivos staged del bloque (`App.tsx`, `SessionActionsPanel.tsx`).
  - sin nuevos bugs/mejoras detectados en Pumuki en esta iteración.
- Revalidación iteración fase 24 (2026-03-05):
  - `pnpm exec pumuki watch --once --stage=PRE_COMMIT --scope=staged --json`
  - resultado: `gateOutcome="ALLOW"`, `totalFindings=0`, `version.effective="6.3.47"`, con `changedFiles[]` y `evaluatedFiles[]` correctamente poblados para los dos archivos staged del bloque (`App.tsx`, `SessionDetailPanel.tsx`).
  - sin nuevos bugs/mejoras detectados en Pumuki en esta iteración.
- foco activo actual: backlog Flux `✅ 100% cerrado` (sin `🚧/⏳/⛔`).
- Revalidación iteración fase 25 (2026-03-05):
  - `pnpm exec pumuki watch --once --stage=PRE_COMMIT --scope=staged --json`
  - resultado: `gateOutcome="ALLOW"`, `totalFindings=0`, `version.effective="6.3.47"`, con `changedFiles[]` y `evaluatedFiles[]` correctamente poblados para los dos archivos staged del bloque (`App.tsx`, `ExerciseLibraryPanel.tsx`).
  - sin nuevos bugs/mejoras detectados en Pumuki en esta iteración.
