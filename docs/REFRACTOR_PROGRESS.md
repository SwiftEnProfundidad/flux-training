# Seguimiento de Ejecucion por Fases

## Leyenda
- ✅ Hecho
- 🚧 En construccion (maximo 1)
- ⏳ Pendiente
- ⛔ Bloqueado

## Reglas operativas (obligatorias)
- Solo puede existir **1 task** en estado `🚧`.
- Al terminar una task: cambiarla a `✅` y mover la siguiente a `🚧`.
- Si una task no puede avanzar por dependencia o decision, marcar `⛔` y documentar bloqueo.
- Este documento es la fuente de verdad del estado de ejecucion.

## Fase 0 - Gobierno y arranque
| ID | Task | Estado | Notas |
|---|---|---|---|
| F0-T1 | Definir reglas operativas en `AGENTS.md` | ✅ | Completado |
| F0-T2 | Crear tablero de seguimiento por fases/tasks | ✅ | Este documento |
| F0-T3 | Validar alcance y backlog base contra plan aprobado | ✅ | Validado contra plan de producto iOS+web aprobado |

## Fase 1 - Foundation (Monorepo + contratos)
| ID | Task | Estado | Notas |
|---|---|---|---|
| F1-T1 | Estructura base (`apps`, `packages`, `docs`) | ✅ | Estructura base creada y operativa |
| F1-T2 | Contratos compartidos (`packages/contracts`) | ✅ | Schemas + tipos + tests implementados |
| F1-T3 | Configuracion workspace y comandos comunes | ✅ | pnpm workspace + scripts build/test/check listos |

## Fase 2 - Producto core (iOS + web + backend)
| ID | Task | Estado | Notas |
|---|---|---|---|
| F2-T1 | Autenticacion base (Apple + email fallback) | ✅ | Contratos, backend session, cliente web e iOS con tests en verde |
| F2-T2 | Perfil + onboarding + PAR-Q+ | ✅ | Onboarding completo perfil+PAR-Q+ en backend/web/iOS con tests en verde |
| F2-T3 | Entrenamiento: plan + sesion + registro | ✅ | Flujo end-to-end con UI web, endpoints y capa iOS en verde |
| F2-T4 | Nutricion: calorias + macros | ✅ | Flujo nutricion (backend/web/iOS) implementado y validado con tests en verde |
| F2-T5 | Progreso: metricas e historial | ✅ | Resumen agregado (entreno+nutricion) disponible en backend/web/iOS con tests en verde |

## Fase 3 - Resiliencia y calidad
| ID | Task | Estado | Notas |
|---|---|---|---|
| F3-T1 | Offline core + cola de sincronizacion | ✅ | Cola offline y sincronizacion implementada en web+iOS+backend con tests en verde |
| F3-T2 | Analitica y crash reporting | ✅ | Telemetria de eventos y crash reporting end-to-end en backend/web/iOS con tests en verde |
| F3-T3 | Suite de tests criticos y regresion | ✅ | Suite critica BDD/TDD agregada en backend/web/iOS y validada en verde (`pnpm check`, `pnpm test`, `pnpm test:critical`, `swift test`) |

## Fase 4 - Release readiness
| ID | Task | Estado | Notas |
|---|---|---|---|
| F4-T1 | Beta cerrada y estabilizacion | ✅ | Gate de version minima cliente + manejo upgrade requerido + regresion completa en verde |
| F4-T2 | Hardening legal (privacidad/consentimiento/borrado) | ✅ | Consentimiento legal + solicitud de borrado implementados en backend/web con contratos y tests en verde |
| F4-T3 | Checklist de release v1 | ✅ | Checklist v1 documentado + comando `pnpm release:check` validado en verde |

## Fase 5 - Post-release
| ID | Task | Estado | Notas |
|---|---|---|---|
| F5-T1 | Roadmap de v1.1 y mejoras de UX | ✅ | Roadmap v1.1 documentado con prioridades, KPI y riesgos |
| F5-T2 | Implementacion UX moderna base (web+iOS) | ✅ | Hero de readiness, layout moderno web, base UX iOS con Experience Hub y tests verdes |
| F5-T3 | Integracion de videos de ejercicios | ✅ | Catalogo de videos en contratos/backend/web/iOS integrado con tests y flujo critico en verde |
| F5-T4 | Recomendaciones IA y ajuste de retencion | ✅ | Motor de recomendaciones IA en contratos/backend/web/iOS y coverage en suites criticas |

## Fase 6 - Continuidad operativa
| ID | Task | Estado | Notas |
|---|---|---|---|
| F6-T1 | QA visual end-to-end + checklist de demo funcional | ✅ | QA visual rerun con runtime local activo: auth/videos/recommendations en loaded + evidencia Playwright |
| F6-T2 | Runtime local de demo (API + host iOS opcional) | ✅ | Servidor local `/api` operativo + host app iOS generado/build+run en simulador |
| F6-T3 | Rediseno UI/UX profesional + base bilingue ES/EN (web+iOS) | ✅ | Prompt Pencil MCP + rediseno visual en web/iOS + capa i18n con tests en verde |
| F6-T4 | Hardening de demo local (assets/CDN y polish final) | 🚧 | Task activa para eliminar errores de assets remotos y cerrar continuidad sin warnings visibles. Prompt maestro de flujo/pantallas alineado a `FLUX_TRACKING.md` aplicado para continuidad de diseño. 2026-02-28: auditoría enterprise completa y arranque formal del plan de refactor transversal (split paralelo por dominios + kickoff ejecutivo). Inicio de cambios reales Wave 1: hardening HTTP backend demo (`method_not_allowed` + propagación de errores de dominio) y nuevas pruebas de regresión en presentation. |

## Actualizacion de estabilidad enterprise (2026-02-28)
- Auditoria transversal Lead Designer ejecutada sobre iOS/web/backend/contratos/docs.
- Hallazgo macro: el producto esta validado como **foundation/demo-ready**, pero no como **enterprise-ready**.
- Brechas principales detectadas: seguridad y compliance operativa, gobernanza de arquitectura entre plataformas, observabilidad/SLOs de produccion, y UX multi-rol a escala.
- Siguiente foco recomendado: abrir un programa transversal de cierre enterprise con backlog priorizado por severidad y owners por dominio.
