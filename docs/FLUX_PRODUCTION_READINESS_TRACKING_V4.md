# FLUX_PRODUCTION_READINESS_TRACKING_V4

## Leyenda
- ✅ Hecho
- 🚧 En construccion (maximo 1)
- ⏳ Pendiente
- ⛔ Bloqueado

## Reglas operativas
- Solo puede haber 1 task en `🚧`.
- Este ciclo arranca cuando V3 se cierre en `✅`.
- Cualquier bloqueo de seguridad/compliance se marca `⛔` con decision requerida.

## Objetivo del ciclo V4
Endurecer el producto para entorno productivo enterprise: seguridad, compliance, observabilidad, rendimiento y operacion estable.

## Fase P0 - Security + compliance base
| ID | Task | Subtasks | Estado | Criterio de aceptacion |
|---|---|---|---|---|
| V4-P0-T1 | Hardening de autenticacion/sesion | V4-P0-T1.1 politicas de sesion; V4-P0-T1.2 rotacion/expiracion; V4-P0-T1.3 pruebas de abuso | ✅ | Sesion endurecida y trazable |
| V4-P0-T2 | Compliance legal y datos | V4-P0-T2.1 consent/auditoria; V4-P0-T2.2 export/delete; V4-P0-T2.3 retention policy | ✅ | Flujos GDPR y retencion auditables |
| V4-P0-T3 | Control de acceso enterprise | V4-P0-T3.1 RBAC por recurso; V4-P0-T3.2 permisos condicionales; V4-P0-T3.3 auditoria de denegaciones | ✅ | Permisos consistentes y verificables |

## Fase P1 - Observabilidad y operacion
| ID | Task | Subtasks | Estado | Dependencia | Criterio de aceptacion |
|---|---|---|---|---|---|
| V4-P1-T1 | Telemetria unificada iOS/Web/Backend | V4-P1-T1.1 eventos canonicos; V4-P1-T1.2 correlacion cross-layer; V4-P1-T1.3 dashboard operativo | ✅ | V4-P0-T3 | Trazabilidad end-to-end estable |
| V4-P1-T2 | Alerting y runbooks | V4-P1-T2.1 alertas por SLO; V4-P1-T2.2 playbooks; V4-P1-T2.3 ownership on-call | 🚧 | V4-P1-T1 | Incidentes operables sin ambiguedad |
| V4-P1-T3 | Logging/audit trail completo | V4-P1-T3.1 logs estructurados; V4-P1-T3.2 activity log; V4-P1-T3.3 export forense | ⏳ | V4-P1-T2 | Auditoria enterprise lista |

## Fase P2 - Performance y escalabilidad
| ID | Task | Subtasks | Estado | Dependencia | Criterio de aceptacion |
|---|---|---|---|---|---|
| V4-P2-T1 | Performance de frontend (iOS/Web) | V4-P2-T1.1 tiempos de carga; V4-P2-T1.2 listas densas/tablas; V4-P2-T1.3 optimizacion render | ⏳ | V4-P1-T1 | UX estable bajo carga realista |
| V4-P2-T2 | Performance backend/API | V4-P2-T2.1 perfiles por endpoint; V4-P2-T2.2 caching/colas; V4-P2-T2.3 tuning DB | ⏳ | V4-P2-T1 | API dentro de SLO acordado |
| V4-P2-T3 | Pruebas de carga y degradacion | V4-P2-T3.1 carga base; V4-P2-T3.2 stress; V4-P2-T3.3 criterios de degradacion controlada | ⏳ | V4-P2-T2 | Comportamiento predecible en picos |

## Fase P3 - Release governance
| ID | Task | Subtasks | Estado | Dependencia | Criterio de aceptacion |
|---|---|---|---|---|---|
| V4-P3-T1 | Gate de release enterprise | V4-P3-T1.1 checklist tecnico; V4-P3-T1.2 checklist legal; V4-P3-T1.3 checklist operacion | ⏳ | V4-P2-T3 | Go/No-Go auditable |
| V4-P3-T2 | Plan de rollback y continuidad | V4-P3-T2.1 rollback por capa; V4-P3-T2.2 backup/restore; V4-P3-T2.3 simulacro | ⏳ | V4-P3-T1 | Recuperacion validada |
| V4-P3-T3 | Cierre V4 y handoff a V5 | V4-P3-T3.1 reporte residual; V4-P3-T3.2 aprobacion release board; V4-P3-T3.3 apertura V5 | ⏳ | V4-P3-T2 | V4 cerrado para rollout controlado |

## Bitacora V4 (2026-03-02)
- Inicio V4-P0-T1:
  - ciclo V4 activado desde `V3-P5-T3` con handoff formal en `docs/validation/V3_P5_T3_V4_HANDOFF.json`.
  - foco inicial: hardening de autenticación/sesión para preparar entorno productivo enterprise.
- Cierre V4-P0-T1:
  - contrato de sesion endurecido con `sessionId`, `issuedAt`, `rotationRequiredAt`, `absoluteExpiresAt` y `sessionPolicy`.
  - backend con guardas anti-abuso (token vacío/oversized) y política temporal determinista.
  - alineación web+iOS del modelo de sesión y pruebas específicas en verde.
  - evidencia publicada: `docs/validation/V4_P0_T1_AUTH_SESSION_HARDENING.json`.
  - regresión global validada en verde (`pnpm -r test` y `cd apps/ios && swift test`).
- Siguiente task activa:
  - `V4-P0-T2` (Compliance legal y datos) en `🚧`.
- Cierre V4-P0-T2:
  - contratos expandidos para consentimiento legal versionado, metadata de borrado/export y política de retención.
  - backend endurecido con auditoría de consentimiento, endpoint de export y endpoint de políticas de retención.
  - web alineada al nuevo contrato legal con acciones de export/delete tipadas y validadas.
  - evidencia publicada: `docs/validation/V4_P0_T2_COMPLIANCE_LEGAL_DATA.json`.
  - regresión global validada en verde (`pnpm -r build`, `pnpm -r test`, `cd apps/ios && swift test`).
- Siguiente task activa:
  - `V4-P0-T3` (Control de acceso enterprise) en `🚧`.
- Cierre V4-P0-T3:
  - contrato RBAC ampliado a permisos por dominio/acción con condiciones de ownership y consentimiento médico.
  - backend con evaluación formal de decisiones de acceso y endpoints de auditoría de denegaciones.
  - web alineada con evaluación de acceso y registro de denegaciones en acciones bloqueadas.
  - evidencia publicada: `docs/validation/V4_P0_T3_ENTERPRISE_ACCESS_CONTROL.json`.
  - regresión global validada en verde (`pnpm -r build`, `pnpm -r test`, `cd apps/ios && swift test`).
- Siguiente task activa:
  - `V4-P1-T1` (Telemetría unificada iOS/Web/Backend) en `🚧`.
- Cierre V4-P1-T1:
  - contratos ampliados con taxonomía canónica de eventos y schema de resumen operativo de observabilidad.
  - backend alineado con normalización de telemetría, correlación cross-layer y endpoint de resumen agregado.
  - web e iOS alineados al modelo canónico con consumo de resumen operativo y regresión funcional en verde.
  - evidencia publicada: `docs/validation/V4_P1_T1_UNIFIED_TELEMETRY.json`.
  - regresión global validada en verde (`pnpm -r build`, `pnpm -r test`, `cd apps/ios && swift test`).
- Siguiente task activa:
  - `V4-P1-T2` (Alerting y runbooks) en `🚧`.
