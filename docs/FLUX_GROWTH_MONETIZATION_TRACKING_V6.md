# FLUX_GROWTH_MONETIZATION_TRACKING_V6

## Leyenda
- ✅ Hecho
- 🚧 En construccion (maximo 1)
- ⏳ Pendiente
- ⛔ Bloqueado

## Reglas operativas
- Solo puede haber 1 task en `🚧`.
- V6 inicia tras cierre formal de V5 (`V5-P3-T3` en `✅`).
- Cualquier cambio de alcance en monetizacion/compliance debe marcar `⛔` hasta decision.

## Objetivo del ciclo V6
Acelerar crecimiento sostenible y monetizacion freemium con retencion saludable, control de riesgo operativo y trazabilidad enterprise.

## Fase P0 - Fundacion de crecimiento
| ID | Task | Subtasks | Estado | Dependencia | Criterio de aceptacion |
|---|---|---|---|---|---|
| V6-P0-T1 | Definir north-star y guardrails de negocio | V6-P0-T1.1 north-star monetizacion; V6-P0-T1.2 guardrails UX/operacion; V6-P0-T1.3 baseline por segmento | ✅ | V5-P3-T3 | Marco de crecimiento medible |
| V6-P0-T2 | Instrumentacion de conversion freemium | V6-P0-T2.1 eventos paywall; V6-P0-T2.2 conversion funnel; V6-P0-T2.3 alertas de fuga | ✅ | V6-P0-T1 | Funnel de conversion observable |
| V6-P0-T3 | Modelo operativo Growth-Product-Support | V6-P0-T3.1 ownership semanal; V6-P0-T3.2 rituales; V6-P0-T3.3 decision log | ✅ | V6-P0-T2 | Cadencia operativa activa |

## Fase P1 - Monetizacion y pricing
| ID | Task | Subtasks | Estado | Dependencia | Criterio de aceptacion |
|---|---|---|---|---|---|
| V6-P1-T1 | Arquitectura de planes freemium/premium | V6-P1-T1.1 packaging; V6-P1-T1.2 limites por rol; V6-P1-T1.3 upgrade paths | ✅ | V6-P0-T2 | Planes consistentes y accionables |
| V6-P1-T2 | Paywall y upgrades contextuales | V6-P1-T2.1 triggers por valor; V6-P1-T2.2 copy ES/EN; V6-P1-T2.3 pruebas A/B | ✅ | V6-P1-T1 | Upgrade no intrusivo y trazable |
| V6-P1-T3 | Billing resiliente y recovery | V6-P1-T3.1 fallo de cobro; V6-P1-T3.2 grace period; V6-P1-T3.3 win-back | ✅ | V6-P1-T2 | Perdida de ingreso controlada |

## Fase P2 - Retencion y expansion
| ID | Task | Subtasks | Estado | Dependencia | Criterio de aceptacion |
|---|---|---|---|---|---|
| V6-P2-T1 | Loops de activacion semanal | V6-P2-T1.1 primer valor en 24h; V6-P2-T1.2 continuidad D7; V6-P2-T1.3 coaching nudges | ✅ | V6-P0-T2 | Activacion semanal en alza |
| V6-P2-T2 | CRM operativo multicanal | V6-P2-T2.1 in-app; V6-P2-T2.2 email/push; V6-P2-T2.3 segmentacion por riesgo | ✅ | V6-P2-T1 | Re-engagement automatizado |
| V6-P2-T3 | Prevencion de churn y win-back | V6-P2-T3.1 score de churn; V6-P2-T3.2 intervenciones; V6-P2-T3.3 medicion incremental | ✅ | V6-P2-T2 | Churn contenido por cohortes |

## Fase P3 - Cierre y gobierno V6
| ID | Task | Subtasks | Estado | Dependencia | Criterio de aceptacion |
|---|---|---|---|---|---|
| V6-P3-T1 | Consolidar resultados V6 | V6-P3-T1.1 impacto negocio; V6-P3-T1.2 impacto operacion; V6-P3-T1.3 riesgos residuales | ✅ | V6-P2-T3 | Resultado ejecutivo auditable |
| V6-P3-T2 | Definir backlog V7 | V6-P3-T2.1 priorizacion; V6-P3-T2.2 dependencias; V6-P3-T2.3 capacidad | ✅ | V6-P3-T1 | Backlog V7 listo |
| V6-P3-T3 | Cierre ejecutivo V6 | V6-P3-T3.1 reporte final; V6-P3-T3.2 decision continuidad; V6-P3-T3.3 handoff | ✅ | V6-P3-T2 | V6 cerrado formalmente |

## Bitacora V6 (2026-03-03)
- Inicio V6-P0-T1:
  - ciclo V6 activado tras cierre formal de V5 (`V5-P3-T3` en `✅`).
  - objetivo inmediato: definir north-star de crecimiento y guardrails operativos de monetizacion freemium.
  - evidencia de entrada: `docs/validation/V5_P3_T3_V5_EXECUTIVE_CLOSURE.json`.
- Cierre V6-P0-T1:
  - north-star de negocio definido como `weekly_paying_active_athletes` con segmentacion por canal y cohorte.
  - guardrails definidos para proteger UX/operacion durante experimentacion de monetizacion (`crash-free`, `support_p1`, `refund_rate`).
  - baseline por segmento definido (`new`, `returning`, `coach-led`, `self-serve`) para medir lift incremental.
  - evidencia publicada: `docs/validation/V6_P0_T1_GROWTH_NORTH_STAR.json`.
- Siguiente task activa:
  - `V6-P0-T2` (Instrumentacion de conversion freemium) en `🚧`.
- Cierre V6-P0-T2:
  - taxonomía de eventos de conversión freemium definida para web+iOS (`paywall_view`, `upgrade_cta_click`, `checkout_start`, `checkout_success`, `checkout_failed`, `downgrade`).
  - funnel de conversión formalizado con etapas instrumentadas y desagregación por rol/canal/plataforma.
  - alertas de fuga configuradas con umbrales de caída por etapa y ownership de respuesta.
  - evidencia publicada: `docs/validation/V6_P0_T2_CONVERSION_INSTRUMENTATION.json`.
- Siguiente task activa:
  - `V6-P0-T3` (Modelo operativo Growth-Product-Support) en `🚧`.
- Cierre V6-P0-T3:
  - modelo operativo Growth-Product-Support definido con ownership semanal (`growth`, `product`, `engineering`, `support`, `analytics`) y métricas por rol.
  - rituales de ejecución definidos (daily triage, weekly growth review, biweekly experiment council, monthly executive check).
  - decision log formalizado con plantilla única (`context`, `decision`, `impact`, `owner`, `rollback`) y trazabilidad a backlog.
  - evidencia publicada: `docs/validation/V6_P0_T3_GROWTH_OPERATING_MODEL.json`.
- Siguiente task activa:
  - `V6-P1-T1` (Arquitectura de planes freemium/premium) en `🚧`.
- Cierre V6-P1-T1:
  - arquitectura de planes definida con 3 tiers (`free`, `pro`, `enterprise-coach`) y capacidades claramente delimitadas por dominio.
  - límites por rol formalizados (`athlete`, `coach`, `admin`, `ops`) con reglas explícitas de visibilidad y bloqueo de acciones premium.
  - rutas de upgrade definidas por contexto de valor (training insights, nutrition AI, reporting export) con fallback y trazabilidad de conversión.
  - evidencia publicada: `docs/validation/V6_P1_T1_FREEMIUM_PREMIUM_ARCHITECTURE.json`.
- Siguiente task activa:
  - `V6-P1-T2` (Paywall y upgrades contextuales) en `🚧`.
- Cierre V6-P1-T2:
  - triggers de paywall definidos por momento de valor (`advanced_ai`, `full_video_catalog`, `team_workspace`, `audit_export`) con limitación de frecuencia.
  - microcopy bilingüe ES/EN normalizada para upgrade in-context con énfasis en valor y transparencia de límites del plan actual.
  - diseño experimental A/B definido con hipótesis, métricas primarias (`upgrade_rate`, `checkout_start_rate`) y guardrails (`bounce`, `support_ticket_spike`).
  - evidencia publicada: `docs/validation/V6_P1_T2_CONTEXTUAL_PAYWALL_UPGRADES.json`.
- Siguiente task activa:
  - `V6-P1-T3` (Billing resiliente y recovery) en `🚧`.
- Cierre V6-P1-T3:
  - estrategia de fallos de cobro definida con clasificación (`soft_decline`, `hard_decline`, `processor_error`) y acciones de recuperación por tipo.
  - política de `grace period` definida por plan/tier con degradación progresiva de capacidades y avisos bilingües trazables.
  - flujo de win-back definido para cancelaciones involuntarias y churn reciente con ofertas contextuales y medición incremental.
  - evidencia publicada: `docs/validation/V6_P1_T3_BILLING_RECOVERY_RESILIENCE.json`.
- Siguiente task activa:
  - `V6-P2-T1` (Loops de activacion semanal) en `🚧`.
- Cierre V6-P2-T1:
  - loop de activación de 24h definido (`sign-in -> onboarding completion -> first plan -> first session`) con ownership por etapa.
  - estrategia de continuidad D7 definida con checkpoints (`day1`, `day3`, `day5`, `day7`) y nudges de recuperación temprana.
  - coaching nudges definidos por contexto de riesgo (`drop in adherence`, `missed nutrition logs`, `session skip`) con reglas de frecuencia.
  - evidencia publicada: `docs/validation/V6_P2_T1_WEEKLY_ACTIVATION_LOOPS.json`.
- Siguiente task activa:
  - `V6-P2-T2` (CRM operativo multicanal) en `🚧`.
- Cierre V6-P2-T2:
  - CRM operativo definido con orquestación multicanal (`in-app`, `push`, `email`) y política de prioridad por contexto de urgencia.
  - journeys de re-engagement definidos por segmento de riesgo (`at_risk_new`, `stalled_returning`, `coach_led_inactive`) con timing por ventana.
  - reglas de segmentación definidas por señales de comportamiento (`inactive_days`, `adherence_drop`, `billing_risk`) con ownership de monitoreo.
  - evidencia publicada: `docs/validation/V6_P2_T2_MULTICHANNEL_CRM_OPERATIONS.json`.
- Siguiente task activa:
  - `V6-P2-T3` (Prevencion de churn y win-back) en `🚧`.
- Cierre V6-P2-T3:
  - score de churn definido con señales combinadas (`inactive_days`, `adherence_decline`, `billing_risk`, `negative_support_signal`) y umbrales de riesgo.
  - playbooks de intervención definidos por tier de riesgo (`low`, `medium`, `high`) con canal, frecuencia y owner operativo.
  - medición incremental definida para win-back (`reactivation_30d_lift`, `net_revenue_retained`, `intervention_cost`) con grupo de control.
  - evidencia publicada: `docs/validation/V6_P2_T3_CHURN_PREVENTION_WINBACK.json`.
- Siguiente task activa:
  - `V6-P3-T1` (Consolidar resultados V6) en `🚧`.
- Cierre V6-P3-T1:
  - impacto de negocio V6 consolidado con evolución de conversión freemium, reactivación D30 y retención neta de ingresos.
  - impacto operativo consolidado con métricas de soporte, estabilidad de flujos de billing recovery y efectividad CRM multicanal.
  - riesgos residuales consolidados y priorizados con mitigación, owner y fecha objetivo para arranque de V7.
  - evidencia publicada: `docs/validation/V6_P3_T1_V6_RESULTS_CONSOLIDATION.json`.
- Siguiente task activa:
  - `V6-P3-T2` (Definir backlog V7) en `🚧`.
- Cierre V6-P3-T2:
  - backlog V7 definido con priorización impacto/esfuerzo/riesgo y secuenciación por olas operativas.
  - dependencias cross-domain identificadas (`product`, `growth`, `billing`, `data`, `support`) con owner y criterio de entrada.
  - capacidad V7 planificada por ola con reserva explícita para incidentes y deuda técnica.
  - evidencia publicada: `docs/validation/V6_P3_T2_V7_BACKLOG_DEFINITION.json`.
- Siguiente task activa:
  - `V6-P3-T3` (Cierre ejecutivo V6) en `🚧`.
- Cierre V6-P3-T3:
  - reporte ejecutivo V6 consolidado con resultados de crecimiento, monetización y retención.
  - decisión de continuidad formalizada con criterios de cierre cumplidos y riesgos residuales controlados.
  - handoff a V7 preparado con backlog priorizado, dependencias críticas y capacidad base validada.
  - evidencia publicada: `docs/validation/V6_P3_T3_V6_EXECUTIVE_CLOSURE.json`.
- Estado de ciclo:
  - V6 cerrado en `✅` sin tasks pendientes.
