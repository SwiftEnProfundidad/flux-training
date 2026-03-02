# FLUX Enterprise Remediation Tracking V1

## Leyenda
- ✅ Hecho
- 🚧 En construccion (maximo 1)
- ⏳ Pendiente
- ⛔ Bloqueado

## Reglas operativas
- Solo puede haber 1 task en `🚧`.
- Al cerrar una task: pasarla a `✅` y mover la siguiente a `🚧`.
- Si una task se frena por dependencia/decision: `⛔` con causa y desbloqueo requerido.
- Todo debe estar orientado a `flux.pen` con foco en boards de producto (iOS + Web), secciones, pantallas y flujo.
- Style guide obligatorio para nuevas pantallas: `mobile-03-darkbold_light`.

## Objetivo de este plan
- Reconstruir y endurecer el board para que sea defendible como producto enterprise.
- Cubrir todo el flujo iOS/Web con pantallas reales, estados y variantes operativas.
- Cerrar gaps de arquitectura de informacion, RBAC, operaciones masivas, auditabilidad, a11y e i18n.

## Fase P0 - Baseline y control de alcance
| ID | Task | Subtasks | Estado | Criterio de aceptacion |
|---|---|---|---|---|
| P0-T1 | Consolidar inventario forense completo del board actual | P0-T1.1 listar secciones/subsecciones; P0-T1.2 mapear todas las pantallas y variantes; P0-T1.3 detectar duplicados/huerfanas | ✅ | Inventario unificado con cobertura iOS/Web y gaps trazables |
| P0-T2 | Definir convencion canonica de estructura de board | P0-T2.1 top-level fijo (BOARD_IOS_APP, BOARD_WEB_APP); P0-T2.2 convencion naming IDs; P0-T2.3 layout grid base por seccion | ✅ | Estructura canonica definida y aprobada |
| P0-T3 | Crear matriz de backlog ejecutable | P0-T3.1 severidad; P0-T3.2 dependencia; P0-T3.3 mapping hallazgo->task | ✅ | Backlog priorizado para ejecucion sin ambiguedad |

## Fase P1 - Arquitectura de board y navegacion principal
| ID | Task | Subtasks | Estado | Criterio de aceptacion |
|---|---|---|---|---|
| P1-T1 | Limpiar board de ruido no-producto | P1-T1.1 eliminar bloques no funcionales; P1-T1.2 separar referencia vs producto; P1-T1.3 validar zero contaminacion | ✅ | Board solo contiene secciones/pantallas de producto |
| P1-T2 | Reestructurar IA por dominios funcionales | P1-T2.1 auth/access; P1-T2.2 core entrenamiento/nutricion/progreso; P1-T2.3 admin/ops | ✅ | Jerarquia clara y navegable por dominio |
| P1-T3 | Definir flujo global E2E por plataforma | P1-T3.1 entry points; P1-T3.2 bifurcaciones; P1-T3.3 salidas y loops de recuperacion | ✅ | Flujo completo sin cortes ni pantallas huerfanas |

## Fase P2 - iOS: secciones y pantallas de producto
| ID | Task | Subtasks | Estado | Criterio de aceptacion |
|---|---|---|---|---|
| P2-T1 | iOS Auth + Onboarding + Consent | P2-T1.1 login/email/otp/recovery/session-expired; P2-T1.2 perfil/goal/par-q; P2-T1.3 permisos/consent legal | ✅ | Flujo de alta/acceso iOS completo y conectado |
| P2-T2 | iOS Today + Training + Exercise Video | P2-T2.1 cockpit diario; P2-T2.2 plan/sesion en curso; P2-T2.3 detalle ejercicio + video + fallback | ✅ | Flujo operativo diario iOS sin gaps |
| P2-T3 | iOS Nutrition + Progress + AI Coach + Settings | P2-T3.1 registro nutricion; P2-T3.2 KPIs/historico; P2-T3.3 recomendaciones IA y ajustes | ✅ | iOS funcional por dominios core y configuracion |

## Fase P3 - Web: secciones y pantallas de producto
| ID | Task | Subtasks | Estado | Criterio de aceptacion |
|---|---|---|---|---|
| P3-T1 | Web shell y dashboard operativo | P3-T1.1 layout app shell; P3-T1.2 dashboard por rol; P3-T1.3 widgets conectados a acciones | ✅ | Entrada web clara por rol y objetivo |
| P3-T2 | Web operaciones core | P3-T2.1 gestion atletas; P3-T2.2 planes/sesiones; P3-T2.3 nutricion/progreso | ✅ | Operaciones core completas en web |
| P3-T3 | Web admin y governance | P3-T3.1 usuarios/roles; P3-T3.2 permisos; P3-T3.3 settings globales/modulares | ✅ | Flujos administrativos trazables y consistentes |

## Fase P4 - Enterprise operations (datos densos + control)
| ID | Task | Subtasks | Estado | Criterio de aceptacion |
|---|---|---|---|---|
| P4-T1 | Patrones de tabla enterprise | P4-T1.1 filtros avanzados/saved views; P4-T1.2 sorting/paginacion; P4-T1.3 detalle in-context | ✅ | Data tables reutilizables en modulos clave |
| P4-T2 | CRUD y bulk actions | P4-T2.1 create/edit/delete; P4-T2.2 validaciones; P4-T2.3 acciones masivas con confirmaciones | ✅ | CRUD + bulk completos sin ambiguedad |
| P4-T3 | Approval workflows y audit trail | P4-T3.1 estados draft/submitted/approved/rejected; P4-T3.2 timeline actor/motivo; P4-T3.3 export/logs | ✅ | Operacion auditable end-to-end |

## Fase P5 - Estados criticos, errores y resiliencia
| ID | Task | Subtasks | Estado | Criterio de aceptacion |
|---|---|---|---|---|
| P5-T1 | Cobertura 7 estados por seccion | P5-T1.1 default/loading/empty; P5-T1.2 error/offline/denied; P5-T1.3 success | ✅ | Todas las secciones iOS/Web cubiertas |
| P5-T2 | Error UX y recovery | P5-T2.1 errores tecnicos; P5-T2.2 validacion campos; P5-T2.3 CTAs de recuperacion | ✅ | Errores accionables y trazables |
| P5-T3 | Sesion y continuidad | P5-T3.1 timeout/refresh token; P5-T3.2 reintento sincronizacion; P5-T3.3 conflicto de datos | ✅ | Continuidad operativa sin perdida de trabajo |

## Fase P6 - Paridad iOS/Web + accesibilidad + localizacion
| ID | Task | Subtasks | Estado | Criterio de aceptacion |
|---|---|---|---|---|
| P6-T1 | Paridad funcional iOS/Web | P6-T1.1 matriz de pantallas; P6-T1.2 matriz de estados; P6-T1.3 matriz de acciones | ✅ | Paridad funcional cerrada por dominio |
| P6-T2 | A11y AA aplicada a pantallas reales | P6-T2.1 contraste; P6-T2.2 foco/orden; P6-T2.3 labels/semantica | ✅ | Cumplimiento AA verificable |
| P6-T3 | Localizacion ES/EN robusta | P6-T3.1 copy bilingue; P6-T3.2 expansion de texto; P6-T3.3 fallback y consistencia terminologica | ✅ | Sin truncados/roturas ES/EN |

## Fase P7 - Design system y handoff a codigo
| ID | Task | Subtasks | Estado | Criterio de aceptacion |
|---|---|---|---|---|
| P7-T1 | Componentizacion reusable | P7-T1.1 buttons/inputs/cards; P7-T1.2 tablas/filtros/modales; P7-T1.3 estados estandar | ✅ | Base de componentes reutilizable y mantenible |
| P7-T2 | Tokens y consistencia visual | P7-T2.1 spacing/type/color; P7-T2.2 dark/light; P7-T2.3 reglas por plataforma | ✅ | Coherencia transversal sin drift visual |
| P7-T3 | Handoff tecnico por seccion | P7-T3.1 spec por pantalla; P7-T3.2 interacciones; P7-T3.3 criterios QA de implementacion | ✅ | Secciones listas para codificar sin ambiguedad |

## Fase P8 - QA final y cierre enterprise
| ID | Task | Subtasks | Estado | Criterio de aceptacion |
|---|---|---|---|---|
| P8-T1 | QA visual/flujo completo | P8-T1.1 inspeccion layout; P8-T1.2 flujos E2E; P8-T1.3 edge cases | ✅ | QA sin clipping, sin huerfanas, sin roturas |
| P8-T2 | Checklist de completitud | P8-T2.1 pantallas faltantes=0; P8-T2.2 estados criticos=100%; P8-T2.3 evidencia trazable | ✅ | Cobertura total declarada y verificable |
| P8-T3 | Go/No-Go enterprise | P8-T3.1 riesgos residuales; P8-T3.2 plan mitigacion; P8-T3.3 cierre ejecutivo | ✅ | Dictamen final enterprise defendible |

## Bitacora
- Inicio plan: se establece tracking maestro para arreglar/implementar todo el board con foco enterprise.
- Cierre `P0-T1`:
  - inventario forense generado desde `flux.pen` con jerarquía completa nodo->board->sección->subsección.
  - cobertura detectada: `121` pantallas (`66` iOS, `55` web), `0` IDs duplicados, `0` pantallas huérfanas, `0` pantallas mal ubicadas por plataforma.
  - variantes detectadas: `76` dark/base y `45` light.
  - gap de consistencia inicial detectado: `5` pantallas iOS en lane `LIGHT` con naming `dark_base`.
- Evidencia `P0-T1`:
  - `docs/validation/P0_T1_SCREEN_INVENTORY_V1.csv`
  - `docs/validation/P0_T1_SECTION_COVERAGE_V1.csv`
  - `docs/validation/P0_T1_INVENTORY_SUMMARY_V1.json`
  - `docs/validation/features/p0_t1_forensic_inventory.feature`
- Cierre `P0-T2`:
  - convención canónica validada para top-level, secciones y naming de pantallas.
  - validación final: `121` pantallas revisadas, `0` violaciones de naming, `0` violaciones de lane/variante, `0` layout violations.
- Evidencia `P0-T2`:
  - `docs/validation/P0_T2_CANONICAL_STRUCTURE_V1.json`
  - `docs/validation/P0_T2_NAMING_VIOLATIONS_V1.csv`
- Cierre `P0-T3`:
  - matriz ejecutable hallazgo->task completada con `24` ítems, severidad, dependencias y orden en `8` olas.
  - resumen de ejecución por olas definido con criterios de salida verificables (`W1..W8`).
- Evidencia `P0-T3`:
  - `docs/validation/P0_T3_EXECUTABLE_BACKLOG_V1.csv`
  - `docs/validation/P0_T3_EXECUTION_WAVES_V1.json`
  - `docs/validation/features/p0_t3_executable_backlog.feature`
- Cierre `P1-T1`:
  - limpieza destructiva aplicada en `flux.pen` eliminando `4` secciones de soporte no-producto.
  - verificación post-cleanup: `0` secciones de soporte residuales, top-level iOS/Web intacto.
- Evidencia `P1-T1`:
  - `docs/validation/P1_T1_NOISE_AUDIT_V1.csv`
  - `docs/validation/P1_T1_NOISE_SUMMARY_V1.json`
  - `docs/validation/P1_T1_CLEANUP_PLAN_V1.json`
  - `docs/validation/P1_T1_STRUCTURE_AFTER_CLEANUP_V1.csv`
  - `docs/validation/P1_T1_POST_CLEANUP_VALIDATION_V1.json`
  - `docs/validation/features/p1_t1_board_noise_cleanup.feature`
  - `docs/validation/features/p1_t1_cleanup_completion.feature`
- Cierre `P1-T2`:
  - IA iOS/web reestructurada por dominios funcionales con naming canónico `D1..D5` y `DX`.
  - orden de secciones normalizado por board (acceso -> core -> ops/admin -> flujo global).
  - verificación: `0` naming legacy `SECTION_` residual y orden esperado en ambos boards.
- Evidencia `P1-T2`:
  - `docs/validation/P1_T2_DOMAIN_IA_MAP_V1.csv`
  - `docs/validation/P1_T2_IA_VALIDATION_V1.json`
  - `docs/validation/features/p1_t2_domain_ia_restructure.feature`
- Cierre `P1-T3`:
  - flujo global E2E validado en ambas plataformas con ramas y puntos de decisión explícitos.
  - validación de conectividad: `0` pantallas huérfanas y presencia de tracks de decisión iOS/web.
- Evidencia `P1-T3`:
  - `docs/validation/P1_T3_FLOW_BRANCHES_V1.csv`
  - `docs/validation/P1_T3_E2E_FLOW_VALIDATION_V1.json`
  - `docs/validation/features/p1_t3_global_flow_e2e.feature`
- Cierre `P2-T1`:
  - completitud de Auth+Onboarding+Consent iOS validada en lanes dark/light con estados de recuperación y estados críticos.
  - alineación de naming aplicada en light lane (`IOS-L-030_ONBOARDING_STEP1`) para paridad con base lane.
- Evidencia `P2-T1`:
  - `docs/validation/P2_T1_IOS_AUTH_ONBOARDING_CONSENT_COVERAGE_V1.csv`
  - `docs/validation/P2_T1_IOS_AUTH_ONBOARDING_CONSENT_VALIDATION_V1.json`
  - `docs/validation/features/p2_t1_ios_auth_onboarding_consent.feature`
- Cierre `P2-T2`:
  - cobertura completa validada para Today/Plan/Sesión/Video/Resumen en dark/light iOS.
  - flujo de ejercicio-video + fallback consolidado con naming alineado en light lane.
- Evidencia `P2-T2`:
  - `docs/validation/P2_T2_IOS_TRAINING_VIDEO_COVERAGE_V1.csv`
  - `docs/validation/P2_T2_IOS_TRAINING_VIDEO_VALIDATION_V1.json`
  - `docs/validation/features/p2_t2_ios_training_video.feature`
- Cierre `P2-T3`:
  - cobertura completa validada para dominios iOS de nutrición/progreso, IA coach y settings/legal (dark/light).
  - flujos de nutrición y settings conectados con trazabilidad de legal/privacy/export/delete.
- Evidencia `P2-T3`:
  - `docs/validation/P2_T3_IOS_NUTRITION_PROGRESS_AI_SETTINGS_COVERAGE_V1.csv`
  - `docs/validation/P2_T3_IOS_NUTRITION_PROGRESS_AI_SETTINGS_VALIDATION_V1.json`
  - `docs/validation/features/p2_t3_ios_nutrition_progress_ai_settings.feature`
- Cierre `P3-T1`:
  - shell web consolidado con navegación lateral y área principal operativa.
  - cobertura completa de acceso/dashboard (main/secondary) con estados críticos y flujo conectado.
- Evidencia `P3-T1`:
  - `docs/validation/P3_T1_WEB_SHELL_DASHBOARD_COVERAGE_V1.csv`
  - `docs/validation/P3_T1_WEB_SHELL_DASHBOARD_VALIDATION_V1.json`
  - `docs/validation/features/p3_t1_web_shell_dashboard.feature`
- Cierre `P3-T2`:
  - operaciones core web validadas en tres dominios: athletes ops, plan/session CMS y nutrition/progress ops.
  - corrección de naming aplicada para consistencia cross-lane y claridad de flujo (`WEB-L-110_ATHLETE_FILTERS`, `flow_title/flow_desc/flow_states` en nutrition ops).
- Evidencia `P3-T2`:
  - `docs/validation/P3_T2_WEB_CORE_OPERATIONS_COVERAGE_V1.csv`
  - `docs/validation/P3_T2_WEB_CORE_OPERATIONS_VALIDATION_V1.json`
  - `docs/validation/features/p3_t2_web_core_operations.feature`
- Cierre `P3-T3`:
  - módulo web de governance ampliado con pantallas explícitas de `roles`, `permission matrix`, `global settings` y `module settings`.
  - flujo de governance actualizado para incluir control RBAC y estado `denied` en la narrativa operativa.
- Evidencia `P3-T3`:
  - `docs/validation/P3_T3_WEB_ADMIN_GOVERNANCE_COVERAGE_V1.csv`
  - `docs/validation/P3_T3_WEB_ADMIN_GOVERNANCE_VALIDATION_V1.json`
  - `docs/validation/features/p3_t3_web_admin_governance.feature`
- Cierre `P4-T1`:
  - patrones de tabla enterprise incorporados en módulos web clave (`athletes`, `plans`, `nutrition`) con 9 pantallas explícitas.
  - cobertura verificada de filtros/vistas guardadas, sorting/paginación y detalle in-context.
- Evidencia `P4-T1`:
  - `docs/validation/P4_T1_ENTERPRISE_TABLE_PATTERNS_COVERAGE_V1.csv`
  - `docs/validation/P4_T1_ENTERPRISE_TABLE_PATTERNS_VALIDATION_V1.json`
  - `docs/validation/features/p4_t1_enterprise_table_patterns.feature`
- Cierre `P4-T2`:
  - cobertura CRUD y bulk actions incorporada de forma explícita en módulos `athletes`, `plans` y `nutrition` de web.
  - confirmaciones de borrado y acciones masivas ya representadas como pantallas dedicadas para handoff de implementación.
- Evidencia `P4-T2`:
  - `docs/validation/P4_T2_CRUD_BULK_ACTIONS_COVERAGE_V1.csv`
  - `docs/validation/P4_T2_CRUD_BULK_ACTIONS_VALIDATION_V1.json`
  - `docs/validation/features/p4_t2_crud_bulk_actions.feature`
- Cierre `P4-T3`:
  - workflow de aprobaciones incorporado con cola, detalle y decisión en governance web.
  - audit trail reforzado con timeline y export logs, y narrativa de estados `draft/submitted/approved/rejected`.
- Evidencia `P4-T3`:
  - `docs/validation/P4_T3_APPROVAL_AUDIT_COVERAGE_V1.csv`
  - `docs/validation/P4_T3_APPROVAL_AUDIT_VALIDATION_V1.json`
  - `docs/validation/features/p4_t3_approval_audit.feature`
- Cierre `P5-T1`:
  - cobertura de 7 estados normalizada en todas las secciones objetivo de producto (`10/10`).
  - autofix aplicado para secciones sin bloque de estados y para secciones con estados incompletos.
- Evidencia `P5-T1`:
  - `docs/validation/P5_T1_STATE_AUTOFIX_LOG_V1.json`
  - `docs/validation/P5_T1_STATE_COVERAGE_V1.csv`
  - `docs/validation/P5_T1_STATE_VALIDATION_V1.json`
  - `docs/validation/features/p5_t1_state_coverage.feature`
- Cierre `P5-T2`:
  - microcopy de error UX y CTAs de recovery normalizados para `state_error`, `state_offline` y `state_denied` en todas las secciones de producto.
  - cobertura semántica validada para errores técnicos, validación de campos y acciones de recuperación.
- Evidencia `P5-T2`:
  - `docs/validation/P5_T2_ERROR_RECOVERY_AUTOFIX_LOG_V1.json`
  - `docs/validation/P5_T2_ERROR_RECOVERY_COVERAGE_V1.csv`
  - `docs/validation/P5_T2_ERROR_RECOVERY_VALIDATION_V1.json`
  - `docs/validation/features/p5_t2_error_recovery.feature`
- Cierre `P5-T3`:
  - continuidad reforzada con cobertura explícita de `session timeout`, `refresh token`, `retry sync` y `data conflict` en iOS/web.
  - se añaden pantallas web de timeout de sesión para paridad con iOS (`WEB-055_SESSION_TIMEOUT`, `WEB-L-055_SESSION_TIMEOUT`).
- Evidencia `P5-T3`:
  - `docs/validation/P5_T3_SESSION_CONTINUITY_AUTOFIX_LOG_V1.json`
  - `docs/validation/P5_T3_SESSION_CONTINUITY_COVERAGE_V1.csv`
  - `docs/validation/P5_T3_SESSION_CONTINUITY_VALIDATION_V1.json`
  - `docs/validation/features/p5_t3_session_continuity.feature`
- Cierre `P6-T1`:
  - matriz de paridad funcional iOS/web consolidada por dominio (`access`, `training`, `nutrition_progress`, `governance_settings`).
  - paridad validada en pantallas, cobertura de estados y acciones compartidas por dominio (`overallPass=true`).
- Evidencia `P6-T1`:
  - `docs/validation/P6_T1_IOS_WEB_PARITY_MATRIX_V1.csv`
  - `docs/validation/P6_T1_IOS_WEB_PARITY_DETAILS_V1.json`
  - `docs/validation/features/p6_t1_ios_web_functional_parity.feature`
- Cierre `P6-T2`:
  - auditoría AA aplicada a `150` pantallas iOS/web con cobertura completa (`screensPassing=150`, `screensFailing=0`, `overallPass=true`).
  - deduplicación de nombres de controles por pantalla para foco determinista y semántica consistente en web.
  - criterio de semántica endurecido: control válido con copy visible o `control name` semántico no genérico.
- Evidencia `P6-T2`:
  - `docs/validation/P6_T2_A11Y_AA_SCREEN_AUDIT_V1.csv`
  - `docs/validation/P6_T2_A11Y_AA_VALIDATION_V1.json`
  - `docs/validation/P6_T2_A11Y_SEMANTIC_AUTONAME_LOG_V1.json`
  - `docs/validation/P6_T2_A11Y_CONTRAST_AUTOFIX_LOG_V1.json`
  - `docs/validation/P6_T2_A11Y_DUPLICATE_CONTROL_RENAME_LOG_V1.json`
  - `docs/validation/features/p6_t2_a11y_aa.feature`
- Cierre `P6-T3`:
  - normalización i18n aplicada en todas las secciones de dominio (`19/19`) con `lang_hint` + `fallback i18n`.
  - cobertura ES/EN consolidada por sección y sin riesgos de truncado detectados por la heurística activa.
  - ajuste puntual de ancho en `WEB_DX_GLOBAL_FLOW` para eliminar riesgo de truncado en `continuity_notes`.
- Evidencia `P6-T3`:
  - `docs/validation/P6_T3_I18N_ES_EN_COVERAGE_V1.csv`
  - `docs/validation/P6_T3_I18N_ES_EN_VALIDATION_V1.json`
  - `docs/validation/P6_T3_I18N_AUTOFIX_LOG_V1.json`
  - `docs/validation/features/p6_t3_localization_es_en.feature`
- Cierre `P7-T1`:
  - base reusable creada sin contaminar secciones de producto: `14` componentes fuente marcados como `reusable=true` en nodos reales.
  - cobertura de categorías enterprise cerrada: `button`, `input`, `filter`, `table_action`, `state_action`, `card` (y `banner_action` adicional).
  - targets de componentización completados (`missingTargetNodes=0`, `overallPass=true`).
- Evidencia `P7-T1`:
  - `docs/validation/P7_T1_COMPONENT_INVENTORY_V1.csv`
  - `docs/validation/P7_T1_COMPONENT_VALIDATION_V1.json`
  - `docs/validation/features/p7_t1_componentization_reusable.feature`
- Cierre `P7-T2`:
  - token set consolidado desde board real (`color`, `typography`, `spacing`) con style guide `mobile-03-darkbold_light`.
  - consistencia dark/light validada por sección con exenciones explícitas para `CRITICAL_STATES`, `GLOBAL_FLOW` y `WEB_D0_SHELL_NAV`.
  - validación global en verde (`overallPass=true`) con checks de paleta, familias tipográficas y escala de spacing.
- Evidencia `P7-T2`:
  - `docs/validation/P7_T2_TOKEN_SET_V1.json`
  - `docs/validation/P7_T2_TOKEN_AUDIT_V1.csv`
  - `docs/validation/P7_T2_TOKEN_VALIDATION_V1.json`
  - `docs/validation/features/p7_t2_tokens_consistency.feature`
- Cierre `P7-T3`:
  - handoff técnico generado para `150` pantallas con especificación por pantalla/sección y matriz de interacciones.
  - cobertura de interacciones documentada (`654` triggers), incluyendo pantallas `view-only` sin acción primaria.
  - checklist QA de implementación consolidado con requisitos de estados críticos + i18n + a11y (`overallPass=true`).
- Evidencia `P7-T3`:
  - `docs/validation/P7_T3_HANDOFF_SCREEN_SPECS_V1.csv`
  - `docs/validation/P7_T3_HANDOFF_INTERACTIONS_V1.csv`
  - `docs/validation/P7_T3_HANDOFF_QA_CHECKLIST_V1.json`
  - `docs/validation/features/p7_t3_handoff_by_section.feature`
- Cierre `P8-T1`:
  - QA visual/flujo ejecutado en `150` pantallas y `19` secciones sin incidencias críticas/altas/medias.
  - verificación de estructura top-level validada (`BOARD_IOS_APP` + `BOARD_WEB_APP` presentes).
  - sin pantallas huérfanas y sin overflows numéricos detectados en geometrías verificables (`overallPass=true`).
- Evidencia `P8-T1`:
  - `docs/validation/P8_T1_VISUAL_FLOW_QA_V1.csv`
  - `docs/validation/P8_T1_VISUAL_FLOW_QA_V1.json`
  - `docs/validation/features/p8_t1_visual_flow_qa.feature`
- Cierre `P8-T2`:
  - checklist de completitud consolidado con 7 checks y cobertura trazable contra baseline de pantallas.
  - paridad, estados críticos, a11y, i18n y QA visual enlazados como evidencia de cierre integral.
  - validación final de completitud en verde (`overallPass=true`, `fails=0`).
- Evidencia `P8-T2`:
  - `docs/validation/P8_T2_COMPLETENESS_CHECKLIST_V1.csv`
  - `docs/validation/P8_T2_COMPLETENESS_VALIDATION_V1.json`
  - `docs/validation/features/p8_t2_completeness_checklist.feature`
- Cierre `P8-T3`:
  - dictamen final actualizado a `GO` con todos los gates funcionales y evidencia MCP en `PASS`.
  - registro de riesgos residuales actualizado sin riesgos abiertos (`R1/R2/R3` cerradas).
  - cierre ejecutivo del plan V1 completado con evidencia trazable y base enterprise estabilizada.
- Evidencia `P8-T3`:
  - `docs/validation/P8_T3_GO_NO_GO_REPORT_V1.json`
  - `docs/validation/P8_T3_RESIDUAL_RISK_REGISTER_V1.csv`
  - `docs/validation/features/p8_t3_go_no_go_enterprise.feature`
- Task activa actual: `Ninguna (plan V1 cerrado)`.
- Siguiente task: definición y ejecución del siguiente ciclo (V2/código).

## Post-cierre - Mitigaciones residuales (cerradas)
| ID | Task | Subtasks | Estado | Criterio de aceptacion |
|---|---|---|---|---|
| R1 | Evidencia MCP Pencil de layout | R1.1 abrir `flux.pen` en editor activo; R1.2 ejecutar snapshot/layout; R1.3 adjuntar evidencia objetiva | ✅ | Evidencia MCP adjunta y verificable |
| R2 | Normalizacion de outliers de color | R2.1 reducir paleta de bajo uso; R2.2 conservar semántica de estados; R2.3 revalidar token consistency | ✅ | Outliers reducidos sin romper consistencia |
| R3 | Refinado semantico legal/privacy | R3.1 mejorar naming semántico de controles; R3.2 endurecer copy legal; R3.3 revalidar handoff/a11y | ✅ | Flujos legales con semántica y copy robustas |

- Cierre `R1`:
  - MCP operativo validado con sesión activa y evidencia en archivo canónico `flux.pen`.
  - `open_document` directo a `flux.pen` mantuvo timeout, pero con sesión MCP activa en `.pen` de respaldo se ejecutó validación por `filePath` absoluto sobre el archivo canónico.
  - `batch_get` confirma top-level canónico (`BOARD_IOS_APP` + `BOARD_WEB_APP`).
  - `snapshot_layout` en `rdY3Z` (iOS) y `HaFxT` (web): `No layout problems.`
  - evidencia actualizada: `overallPass=true`, `21` intentos históricos + cierre exitoso en `2026-03-01T22:20:08Z`.
- Cierre `R2`:
  - normalización controlada aplicada sobre outliers no semánticos (`32` colores mapeados, `48` reemplazos).
  - reducción de outliers de bajo uso: `44 -> 12`.
  - revalidación de tokens en verde (`P7_T2 overallPass=true`).
- Evidencia `R2`:
  - `docs/validation/R2_COLOR_OUTLIER_NORMALIZATION_LOG_V1.json`
  - `docs/validation/R2_COLOR_OUTLIER_VALIDATION_V1.json`
  - `docs/validation/features/r2_color_outlier_normalization.feature`
- Cierre `R3`:
  - hardening semántico aplicado en legal/privacy iOS D5 + Web D5.
  - controles `auto_ctrl_*` en pantallas objetivo: `146 -> 0` (renombrados a `CMP_LEGAL_*`).
  - revalidación cruzada en verde: `P6-T2 A11y` y `P7-T3 handoff`.
- Evidencia `R3`:
  - `docs/validation/R3_LEGAL_SEMANTIC_HARDENING_V1.json`
  - `docs/validation/R3_LEGAL_SEMANTIC_VALIDATION_V1.json`
  - `docs/validation/features/r3_legal_semantic_hardening.feature`
- Task activa actual: `Ninguna (mitigaciones residuales cerradas)`.
- Siguiente task: avanzar con el siguiente ciclo de plan (V2/código) con base enterprise ya validada.
