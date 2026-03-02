# Documentation

## Structure
- `REFRACTOR_PROGRESS.md`: source of truth for execution status.
- `FLUX_ENTERPRISE_REMEDIATION_TRACKING_V1.md`: plan maestro enterprise (fases/tasks/leyenda) para cerrar gaps de board, pantallas y flujos iOS/Web.
- `FLUX_UIUX_EXECUTION_TRACKING_V2.md`: tracking operativo canonico del board Flux (fases, tasks, subtasks, gates 5/5 y dependencias).
- `FLUX_IMPLEMENTATION_TRACKING_V3.md`: ciclo de implementacion end-to-end a codigo (iOS/Web/Backend/contracts) con fases/tasks/subtasks.
- `FLUX_PRODUCTION_READINESS_TRACKING_V4.md`: ciclo de hardening productivo enterprise (security, compliance, SLO, performance, release governance).
- `FLUX_ROLLOUT_SCALE_TRACKING_V5.md`: ciclo de rollout controlado, adopcion y operacion a escala.
- `FLUX_UIUX_EXECUTION_TRACKING.md`: histórico de seguimiento previo (no canónico).
- `RELEASE_CHECKLIST_V1.md`: checklist operativo GO/NO-GO para la v1.
- `ROADMAP_V1_1.md`: plan de producto/técnico post-release.
- `PENCIL_UIUX_PROMPT.md`: prompt maestro para generar UI/UX profesional (web+iOS) con Pencil MCP.
- `validation/`: BDD features and validation evidence.

## Current QA
- Fase activa de continuidad: QA visual y checklist de demo.
- Estado de implementación post-board: `FLUX_UIUX_EXECUTION_TRACKING_V2.md` cerrado en `✅` hasta `C7-T3`.
- Estado de ejecución actual: `FLUX_IMPLEMENTATION_TRACKING_V3.md` con `V3-P2-T2` en `🚧` (bloque iOS `V3-P1` y `V3-P2-T1` cerrados).
- Estado fase enterprise: `FLUX_ENTERPRISE_REMEDIATION_TRACKING_V1.md` cerrado en `GO` con mitigaciones residuales completadas.
- Mitigaciones residuales post-cierre: `R1`, `R2` y `R3` cerradas en `✅`.
- Evidencia visual local (Playwright): `output/playwright/`.
- Evidencia iOS host simulador: `output/ios/`.
