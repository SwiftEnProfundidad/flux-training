# FLUX_ROLLOUT_SCALE_TRACKING_V5

## Leyenda
- ✅ Hecho
- 🚧 En construccion (maximo 1)
- ⏳ Pendiente
- ⛔ Bloqueado

## Reglas operativas
- Solo puede haber 1 task en `🚧`.
- Este ciclo inicia tras cierre de V4.
- Si una decision de negocio impacta alcance/fechas, marcar `⛔` hasta confirmacion.

## Objetivo del ciclo V5
Ejecutar rollout controlado, activar adopcion y consolidar operacion a escala con mejora continua y roadmap priorizado.

## Fase P0 - Rollout controlado
| ID | Task | Subtasks | Estado | Criterio de aceptacion |
|---|---|---|---|---|
| V5-P0-T1 | Estrategia de despliegue por oleadas | V5-P0-T1.1 cohortes; V5-P0-T1.2 ventanas de release; V5-P0-T1.3 criterios de avance | ✅ | Plan de rollout aprobado |
| V5-P0-T2 | Entornos y feature flags | V5-P0-T2.1 toggles por modulo; V5-P0-T2.2 gating por rol; V5-P0-T2.3 estrategia de rollback por flag | ✅ | Rollout reversible y seguro |
| V5-P0-T3 | Comunicacion de cambio | V5-P0-T3.1 notas release; V5-P0-T3.2 soporte interno; V5-P0-T3.3 mensajes in-app | ✅ | Cambio comunicado sin friccion |

## Fase P1 - Adopcion y valor de negocio
| ID | Task | Subtasks | Estado | Dependencia | Criterio de aceptacion |
|---|---|---|---|---|---|
| V5-P1-T1 | KPI framework de adopcion | V5-P1-T1.1 norte y guardrails; V5-P1-T1.2 eventos de negocio; V5-P1-T1.3 panel ejecutivo | ✅ | V5-P0-T3 | KPI accionables y visibles |
| V5-P1-T2 | Embudos y retencion | V5-P1-T2.1 funnel acceso->uso; V5-P1-T2.2 cohortes de retencion; V5-P1-T2.3 alertas de caida | ✅ | V5-P1-T1 | Decisiones de producto basadas en datos |
| V5-P1-T3 | Experimentacion controlada | V5-P1-T3.1 backlog de experimentos; V5-P1-T3.2 criterios estadisticos; V5-P1-T3.3 cierre de aprendizaje | 🚧 | V5-P1-T2 | Experimentos ejecutables y trazables |

## Fase P2 - Operacion y soporte a escala
| ID | Task | Subtasks | Estado | Dependencia | Criterio de aceptacion |
|---|---|---|---|---|---|
| V5-P2-T1 | Soporte enterprise y SLA | V5-P2-T1.1 catalogo de incidencias; V5-P2-T1.2 tiempos objetivo; V5-P2-T1.3 flujo de escalado | ⏳ | V5-P1-T1 | Soporte con SLA definido |
| V5-P2-T2 | Knowledge base y autoservicio | V5-P2-T2.1 ayuda por modulo; V5-P2-T2.2 FAQ; V5-P2-T2.3 runbooks usuario/admin | ⏳ | V5-P2-T1 | Reduccion de tickets repetitivos |
| V5-P2-T3 | Calidad continua post-release | V5-P2-T3.1 regression schedule; V5-P2-T3.2 deuda tecnica priorizada; V5-P2-T3.3 health review mensual | ⏳ | V5-P2-T2 | Operacion estable y mejora continua |

## Fase P3 - Roadmap siguiente ciclo
| ID | Task | Subtasks | Estado | Dependencia | Criterio de aceptacion |
|---|---|---|---|---|---|
| V5-P3-T1 | Consolidar aprendizaje V5 | V5-P3-T1.1 insights producto; V5-P3-T1.2 insights operacion; V5-P3-T1.3 riesgos residuales | ⏳ | V5-P2-T3 | Base objetiva para roadmap |
| V5-P3-T2 | Definir backlog V6 | V5-P3-T2.1 priorizacion impacto/esfuerzo; V5-P3-T2.2 dependencias; V5-P3-T2.3 capacidad | ⏳ | V5-P3-T1 | Backlog V6 listo |
| V5-P3-T3 | Cierre ejecutivo V5 | V5-P3-T3.1 reporte final; V5-P3-T3.2 decision de continuidad; V5-P3-T3.3 apertura V6 | ⏳ | V5-P3-T2 | Ciclo V5 formalmente cerrado |

## Bitacora V5 (2026-03-02)
- Inicio V5-P0-T1:
  - ciclo V5 activado tras cierre formal de V4 (`V4-P3-T3` en `✅`).
  - objetivo inmediato: estrategia de despliegue por oleadas con cohortes, ventanas de release y criterios de avance.
  - evidencia de handoff: `docs/validation/V4_P3_T3_V5_HANDOFF.json`.
- Cierre V5-P0-T1:
  - cohortes de rollout definidas por criticidad de rol (internal/admin, coaches enterprise, atletas activos, long-tail) con ownership operativo.
  - ventanas de release definidas con freeze de fin de semana y checkpoints de salud por ola.
  - criterios de avance/rollback definidos por SLO (crash, error rate, denied spike, sync backlog, tickets P1).
  - evidencia publicada: `docs/validation/V5_P0_T1_ROLLOUT_WAVE_STRATEGY.json`.
- Siguiente task activa:
  - `V5-P0-T2` (Entornos y feature flags) en `🚧`.
- Cierre V5-P0-T2:
  - matriz de entornos definida (`dev`, `staging`, `prod`) con propietarios, data policy y guardrails operativos por entorno.
  - catálogo de feature flags por módulo (`auth`, `training`, `nutrition`, `ai`, `observability`) con estrategia de gating por rol.
  - estrategia de rollback por flag definida con `kill-switch` inmediato, validación post-toggle y trazabilidad de cambios.
  - evidencia publicada: `docs/validation/V5_P0_T2_ENV_FLAGS_STRATEGY.json`.
- Siguiente task activa:
  - `V5-P0-T3` (Comunicacion de cambio) en `🚧`.
- Cierre V5-P0-T3:
  - plan de comunicación cross-funcional definido para release notes externas, briefing de soporte interno y mensajes in-app.
  - matriz de audiencia/canal/frecuencia definida para admin/coaches/athletes con fallback de escalado a soporte.
  - checklist de calidad de comunicación definido con criterios de claridad, consistencia legal y trazabilidad de cambios.
  - evidencia publicada: `docs/validation/V5_P0_T3_CHANGE_COMMUNICATION.json`.
- Siguiente task activa:
  - `V5-P1-T1` (KPI framework de adopcion) en `🚧`.
- Cierre V5-P1-T1:
  - north-star KPI definido como `weekly_active_athletes_with_completed_plan` con guardrails de estabilidad (crash-free, error-rate, soporte P1).
  - taxonomía de eventos de negocio definida para onboarding, adherencia de entrenamiento, nutrición y recurrencia semanal.
  - panel ejecutivo definido con vistas de adopción (activation, engagement, retention, reliability) y thresholds de alerta.
  - evidencia publicada: `docs/validation/V5_P1_T1_ADOPTION_KPI_FRAMEWORK.json`.
- Siguiente task activa:
  - `V5-P1-T2` (Embudos y retencion) en `🚧`.
- Cierre V5-P1-T2:
  - funnel canónico definido (`visit -> sign-in -> onboarding -> first plan -> first session -> week-1 retention`) con criterios de drop-off por etapa.
  - cohortes de retención definidas (`D1`, `D7`, `D14`, `D30`) segmentadas por rol/canal de adquisición y plan activo.
  - alertas automáticas de caída definidas para degradación de conversión y retención con ownership de respuesta.
  - evidencia publicada: `docs/validation/V5_P1_T2_FUNNELS_RETENTION.json`.
- Siguiente task activa:
  - `V5-P1-T3` (Experimentacion controlada) en `🚧`.
