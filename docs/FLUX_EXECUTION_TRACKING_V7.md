# FLUX_EXECUTION_TRACKING_V7

## Leyenda
- ✅ Hecho
- 🚧 En construccion (maximo 1)
- ⏳ Pendiente
- ⛔ Bloqueado

## Reglas operativas
- Solo puede haber 1 task en `🚧`.
- V7 inicia tras cierre formal de V6 (`V6-P3-T3` en `✅`).
- Cualquier cambio de alcance en crecimiento/monetizacion/operacion marca `⛔` hasta decision.

## Objetivo del ciclo V7
Ejecutar el backlog priorizado de V7 para profundizar retencion por cohortes, endurecer billing recovery por proveedor y consolidar gobernanza de datos/soporte a escala.

## Fase P0 - Arranque y baseline V7
| ID | Task | Subtasks | Estado | Dependencia | Criterio de aceptacion |
|---|---|---|---|---|---|
| V7-P0-T1 | Kickoff ejecutivo V7 y baseline | V7-P0-T1.1 baseline KPI; V7-P0-T1.2 owners confirmados; V7-P0-T1.3 calendario de olas | ✅ | V6-P3-T3 | Arranque formal V7 validado |
| V7-P0-T2 | Congelar contrato de tracking V7 | V7-P0-T2.1 schema eventos; V7-P0-T2.2 diccionario metricas; V7-P0-T2.3 reglas QA tracking | ✅ | V7-P0-T1 | Data contract estable |
| V7-P0-T3 | Readiness de fallback por proveedor | V7-P0-T3.1 paths por proveedor; V7-P0-T3.2 alertas; V7-P0-T3.3 runbook tecnico | ✅ | V7-P0-T2 | Billing resiliente listo |

## Fase P1 - Growth y retencion por cohortes
| ID | Task | Subtasks | Estado | Dependencia | Criterio de aceptacion |
|---|---|---|---|---|---|
| V7-P1-T1 | Tunear paywall por cohortes | V7-P1-T1.1 cohort matrix; V7-P1-T1.2 triggers por friccion; V7-P1-T1.3 guardrails de fatiga | ✅ | V7-P0-T2 | Conversion por cohorte en mejora |
| V7-P1-T2 | Experimentacion de hipotesis de retencion | V7-P1-T2.1 hipotesis por rol; V7-P1-T2.2 setup A/B; V7-P1-T2.3 cierre learnings | ✅ | V7-P1-T1 | Retencion D7/D30 optimizada |
| V7-P1-T3 | Remediacion de fricciones de conversion | V7-P1-T3.1 checkout friction; V7-P1-T3.2 auth friction; V7-P1-T3.3 fallback UX | 🚧 | V7-P1-T2 | Dropoff critico reducido |

## Fase P2 - Operacion y fiabilidad
| ID | Task | Subtasks | Estado | Dependencia | Criterio de aceptacion |
|---|---|---|---|---|---|
| V7-P2-T1 | Hardening billing por proveedor | V7-P2-T1.1 retries inteligentes; V7-P2-T1.2 rutas fallback; V7-P2-T1.3 monitoreo por proveedor | ⏳ | V7-P0-T3 | Variabilidad de recovery controlada |
| V7-P2-T2 | Paridad de runbooks en churn scenarios | V7-P2-T2.1 top scenarios; V7-P2-T2.2 acciones por rol; V7-P2-T2.3 auditoria SLA | ⏳ | V7-P2-T1 | Soporte consistente y trazable |
| V7-P2-T3 | Governance operativo semanal | V7-P2-T3.1 tablero de decisiones; V7-P2-T3.2 revision riesgos; V7-P2-T3.3 cierre semanal | ⏳ | V7-P2-T2 | Cadencia estable de ejecucion |

## Fase P3 - Cierre y continuidad
| ID | Task | Subtasks | Estado | Dependencia | Criterio de aceptacion |
|---|---|---|---|---|---|
| V7-P3-T1 | Consolidar resultados V7 | V7-P3-T1.1 impacto negocio; V7-P3-T1.2 impacto operativo; V7-P3-T1.3 riesgos residuales | ⏳ | V7-P2-T3 | Resultado V7 consolidado |
| V7-P3-T2 | Definir backlog V8 | V7-P3-T2.1 priorizacion; V7-P3-T2.2 dependencias; V7-P3-T2.3 capacidad | ⏳ | V7-P3-T1 | Backlog V8 listo |
| V7-P3-T3 | Cierre ejecutivo V7 | V7-P3-T3.1 reporte final; V7-P3-T3.2 decision continuidad; V7-P3-T3.3 handoff | ⏳ | V7-P3-T2 | V7 cerrado formalmente |

## Bitacora V7 (2026-03-03)
- Inicio V7-P0-T1:
  - V7 activado tras cierre formal de V6 (`V6-P3-T3` en `✅`).
  - foco inicial: baseline KPI, confirmacion de owners y secuencia por olas.
  - evidencia de entrada: `docs/validation/V6_P3_T3_V6_EXECUTIVE_CLOSURE.json`.
- Cierre V7-P0-T1:
  - baseline KPI fijado para conversion, reactivacion, revenue retenido y carga de soporte.
  - owners cross-domain confirmados para `product`, `growth`, `billing`, `data`, `support`.
  - calendario de ejecucion por olas validado con reservas de incidentes/deuda.
  - evidencia publicada: `docs/validation/V7_P0_T1_V7_KICKOFF_BASELINE.json`.
- Cierre V7-P0-T2:
  - contrato de tracking V7 congelado con `event schema`, diccionario de metricas y reglas QA trazables.
  - taxonomia establecida para eventos de conversion, retencion, monetizacion y soporte.
  - reglas de calidad definidas para consistencia de nombres, cardinalidad y ownership por evento.
  - evidencia publicada: `docs/validation/V7_P0_T2_TRACKING_CONTRACT_FREEZE.json`.
- Cierre V7-P0-T3:
  - readiness de fallback por proveedor consolidada para `stripe`, `apple_iap` y `google_play`.
  - definidos paths primario/secundario por proveedor con criterio de degradacion y recuperación.
  - alertas de operación y runbook técnico acordados para incidentes de cobro/reintento.
  - evidencia publicada: `docs/validation/V7_P0_T3_PROVIDER_FALLBACK_READINESS.json`.
- Cierre V7-P1-T1:
  - paywall ajustado por cohortes con matriz de segmentos, disparadores contextuales y límite de fatiga.
  - definidas estrategias diferenciadas para `new_trial`, `at_risk_churn`, `returning_user` y `high_intent_upgrade`.
  - activados guardrails de presión comercial para proteger retención y reducir rechazo de upgrade.
  - evidencia publicada: `docs/validation/V7_P1_T1_COHORT_PAYWALL_TUNING.json`.
- Cierre V7-P1-T2:
  - hipótesis de retención estructuradas por rol (`athlete`, `coach`, `admin`) con diseño de experimento y guardrails.
  - setup A/B definido con segmentos, exposición, métrica primaria y criterio de significancia para D7/D30.
  - loop de cierre de aprendizaje fijado para promoción, iteración o rollback por experimento.
  - evidencia publicada: `docs/validation/V7_P1_T2_RETENTION_HYPOTHESIS_EXPERIMENTATION.json`.
- Siguiente task activa:
  - `V7-P1-T3` (Remediacion de fricciones de conversion) en `🚧`.
