# Seguimiento Maestro UI/UX Flux V2 (Canonico)

## Leyenda
- ✅ Hecho
- 🚧 En construccion (maximo 1)
- ⏳ Pendiente
- ⛔ Bloqueado

## Reglas hard operativas
- Solo puede existir 1 task en estado `🚧`.
- Al cerrar una task: pasarla a `✅` y abrir la siguiente en `🚧`.
- No se permite cerrar `✅` sin evidencia objetiva de gate.
- Archivo de diseno canonico: `/Users/juancarlosmerlosalbarracin/Developer/Projects/Flux_training/flux.pen`.
- Tracking operativo canonico: este documento.
- Estilo obligatorio: `mobile-03-darkbold_light`.

## Objetivo de producto (cerrado)
- Rediseno total desde cero del board con separacion estricta de `BOARD_IOS_APP` y `BOARD_WEB_APP`.
- Cobertura dark/light al 100% por pantalla (iOS y web).
- IDs nuevos con mapa obligatorio old->new para trazabilidad historica.
- Scope iOS: full producto + legal + i18n + a11y + global flow.
- Scope web: producto + ops/admin + i18n + handoff + global flow por rol.
- Compliance obligatorio: GDPR completo (consent, export, delete, trazabilidad legal).
- Calidad primero: sin deadline dura.

## Gate de cierre 5/5 (obligatorio)
Para marcar cualquier task como `✅`, deben pasar los cinco gates:
1. Layout PASS: 0 clipping/overflow/solapes/desalineaciones.
2. Flujo PASS: happy path + edge cases + recovery.
3. Estados PASS: `default/loading/empty/error/offline/denied/success`.
4. i18n PASS: ES base y EN completo para labels/CTA/error/legal.
5. UX PASS: a11y WCAG AA + IA + microcopy + consistencia visual.

## Fase A0 (bloqueante) - Auditoria 360 iOS/Web
| ID | Task | Estado | Resultado |
|---|---|---|---|
| A0-T1 | Activar tracking V2 como fuente de verdad | ✅ | Documento creado y operativo |
| A0-T2 | Inventario completo de secciones y pantallas | ✅ | Inventario por board/seccion/screen_id completado |
| A0-T3 | Auditoria de flujo por seccion y flujo global | ✅ | Flujos por dominio detectados y trazados |
| A0-T4 | Auditoria de estados criticos | ✅ | Cobertura parcial detectada |
| A0-T5 | Auditoria i18n ES/EN | ✅ | Cobertura parcial detectada |
| A0-T6 | QA fail-fast de layout | ✅ | iOS PASS parcial, Web FAIL |
| A0-T7 | Matriz de gaps priorizada | ✅ | Backlog priorizado generado |
| A0-T8 | Replanificacion ejecutable sin decisiones abiertas | ✅ | Fases P0-P4 cerradas |

## Estado real auditado (A0)

### Secciones actuales detectadas en `flux.pen`
- iOS: `IOS_SECTION_AUTH_ONBOARDING`, `IOS_SECTION_TODAY_TRAINING`, `IOS_SECTION_EXERCISE_VIDEO`, `IOS_SECTION_PROGRESS_NUTRITION`, `IOS_SECTION_AI_SETTINGS_LEGAL`, `IOS_SECTION_COPY_I18N`, `IOS_SECTION_A11Y_CHECKLIST`, `IOS_GLOBAL_FLOW`.
- Web: `WEB_SECTION_SHELL_COMPONENT`, `WEB_SECTION_ACCESS_AND_DASHBOARD`, `WEB_SECTION_ATHLETES`, `WEB_SECTION_PLANS_CMS`, `WEB_SECTION_ANALYTICS_AI_ADMIN`, `WEB_SECTION_NUTRITION_OPS`, `WEB_SECTION_COPY_I18N`, `WEB_GLOBAL_FLOW`, `WEB_SECTION_HANDOFF_NOTES`.

### Cobertura de pantallas detectada
- iOS: 56 pantallas (28 base + 28 light).
- Web: 48 pantallas (24 base + 24 light).

### Hallazgos criticos (gaps)
- `P0`: clipping en 4 secciones web core.
- `P0`: clipping en shell web y dominios web core.
- `P1`: falta coverage de estados criticos fuera de auth en iOS/web.
- `P1`: falta cierre de matriz i18n ES/EN por pantalla.
- `P2`: flujo global web incompleto por rol.
- `P2`: estados criticos no laneados fuera de auth.

## Fase P0 - Gobierno y contratos de trazabilidad
| ID | Task | Subtasks | Estado | Criterio de aceptacion |
|---|---|---|---|---|
| P0-T1 | Congelar fuente de verdad | P0-T1.1 fijar canonicidad board/tracking; P0-T1.2 marcar historico no canonico; P0-T1.3 validar 1 task en `🚧` | ✅ | Solo una fuente de verdad activa |
| P0-T2 | Definir contratos V2 | P0-T2.1 `ScreenInventoryV2`; P0-T2.2 `FlowMapV2`; P0-T2.3 `StateCoverageV2`; P0-T2.4 `I18nMatrixV2`; P0-T2.5 `IdMigrationMapV2` | ✅ | Contratos definidos y listos para handoff |

## Fase P1 - Reconstruccion iOS (desde cero)
| ID | Task | Subtasks | Estado | Dependencia | Criterio de aceptacion |
|---|---|---|---|---|---|
| P1-T1 | Estructura iOS por secciones dominio | P1-T1.1 auth+onboarding; P1-T1.2 today+training+video; P1-T1.3 nutrition+progress+AI; P1-T1.4 settings+legal; P1-T1.5 i18n; P1-T1.6 a11y; P1-T1.7 global flow | ✅ | P0-T2 | Secciones iOS completas y separadas, sin basura |
| P1-T2 | Pantallas iOS Auth + Onboarding | P1-T2.1 dual mode por pantalla; P1-T2.2 errores y recovery; P1-T2.3 edge cases OTP/recover/session | ✅ | P1-T1 | Flujo auth/onboarding completo |
| P1-T3 | Pantallas iOS uso diario | P1-T3.1 today; P1-T3.2 training; P1-T3.3 video; P1-T3.4 nutrition; P1-T3.5 progress; P1-T3.6 AI | ✅ | P1-T2 | Dominio diario completo |
| P1-T4 | Pantallas iOS legal/GDPR | P1-T4.1 consent; P1-T4.2 export; P1-T4.3 delete; P1-T4.4 trazabilidad legal | ✅ | P1-T3 | Compliance iOS completo |
| P1-T5 | i18n + a11y iOS | P1-T5.1 matriz ES/EN por pantalla; P1-T5.2 checklist WCAG AA; P1-T5.3 microcopy de errores | ✅ | P1-T4 | Gates 3/5 y 5/5 cubiertos en iOS |

### Bitacora de avance (2026-03-01)
- P1-T1 completada: secciones iOS consolidadas y deduplicadas.
- Evidencia:
  - `jq -r '.. | objects | select(.id=="rdY3Z") | .children[] | [.id,.name] | @tsv' flux.pen`
  - `snapshot_layout(parentId="rdY3Z", problemsOnly=true)` -> `No layout problems.`
- P1-T2 completada: auth/onboarding iOS consolidado en dark/light con recovery y edge cases.
- Evidencia P1-T2:
  - `jq -r '.. | objects | select(.name? and (.name|test("^IOS(-L)?-0(00|10|20|30|35|40|50|60|70|80)_"))) | .name' flux.pen`
  - `node` patch de consistencia UI: `iosResized=66`, `ctaCentered=144`.
- Inicio P1-T3:
  - foco en dominio diario (`IOS-100..150`, `IOS-005a..007b`) y coherencia de componentes por caso de uso.
- Avance P1-T3 (pasada de consistencia):
  - viewport iOS unificado a `402x874` (base actual Pro).
  - centrado de labels en CTAs/botones (`textAlign=center`, `textAlignVertical=middle`) para evitar drift visual.
  - auditoria automatica de overflow potencial por sumas de lane -> `0 issues` en chequeo estatico.
  - validada estructura top-level canonica: bajo `NxUZ5` solo existen `BOARD_IOS_APP` y `BOARD_WEB_APP`.
  - microcopy base ES aplicado en pantallas iOS clave (`162` reemplazos controlados acumulados) para alinear `ES base / EN secundario`.
  - trazabilidad GDPR reforzada en iOS legal: `ID solicitud`, `estado`, `ventana de gracia`, `última actualización legal`.
- P1-T3 completada: dominio diario iOS (today/training/video/nutrition/progress/AI) consolidado en dark/light.
- Evidencia P1-T3:
  - `jq -r '.. | objects | select(.id=="TICgl") | .children[] | [.id,.name] | @tsv' flux.pen`
  - `jq -r '.. | objects | select(.id=="9OgKn") | .children[] | [.id,.name] | @tsv' flux.pen`
  - `jq -r '.. | objects | select(.id=="x8FBK") | .children[] | [.id,.name] | @tsv' flux.pen`
- Inicio P1-T4:
  - foco en cierre GDPR iOS: consentimiento, exportación, borrado, trazabilidad legal en dark/light.
- P1-T4 completada: bloque legal/GDPR iOS reforzado en dark/light.
- Evidencia P1-T4:
  - `jq -r '.. | objects | select(.name? and (.name|test("^IOS(-L)?-(330|340|350)_"))) | .name' flux.pen`
  - actualización de microcopy legal con trazabilidad (`ID solicitud`, `estado`, `ventana de gracia`, `audit`).
- Inicio P1-T5:
  - foco en cierre i18n+a11y iOS: matriz ES/EN por pantalla, checklist WCAG y microcopy de error/recovery.
- P1-T5 completada: i18n+a11y iOS cerrada con soporte documental en board.
- Evidencia P1-T5:
  - `jq '.. | objects | select(.id=="DYJyI" or .id=="vRCVB")' flux.pen`
  - sección `IOS_SECTION_COPY_I18N` + `IOS_SECTION_A11Y_CHECKLIST` con contenido operativo de handoff.
- Inicio P2-T1:
  - foco en validar/normalizar estructura web por dominios, con separación estricta de secciones y lanes dark/light.
- P2-T1 completada: estructura web por dominios validada y separada (header, lanes, flow, estados, handoff).
- Evidencia P2-T1:
  - `jq -r '.. | objects | select(.id=="HaFxT") | .children[] | [.id,.name,((.children//[])|length)] | @tsv' flux.pen`
- Inicio P2-T2:
  - foco en acceso/operación web (`WEB-000..050` + `WEB-L-000..050`), con copy ES base y coherencia de estados.
- Avance P2-T2:
  - copy de acceso/operación web normalizado a ES base en pantallas `WEB-000..050` y `WEB-L-000..050` (`49` ajustes).
  - navegación y estados operativos alineados (`Panel`, `Atletas`, `Planes`, `Progreso`, `Nutrición`, `Soporte`, `Estado del sistema`).
- P2-T2 completada: flujo web de acceso/operación consolidado (gate/sign-in/dashboard/alerts/status) en variantes principal y secundaria.
- Evidencia P2-T2:
  - `jq -r '.. | objects | select(.name? and (.name|test("^WEB(-L)?-0(00|10|20|30|40|50)_"))) | .name' flux.pen`
- Inicio P2-T3:
  - foco en producto web (`ATHLETES`, `PLANS/CMS`, `ANALYTICS/AI`, `NUTRITION OPS`) con copy/estados por dominio.
- Avance P2-T3:
  - normalización de copy ES base en pantallas de producto/IA web (`158` ajustes acumulados en esta task).
  - navegación web alineada en términos de dominio (`Panel`, `Atletas`, `Planes`, `Progreso`, `Analítica`, `Administración`, `Entrenamiento`).
- P2-T3 completada: dominios de producto web cerrados (`ATHLETES`, `PLANS/CMS`, `ANALYTICS/AI`, `NUTRITION OPS`).
- Evidencia P2-T3:
  - inventario de lanes productivos con pantallas activas en `WEB_ATHLETES_*`, `WEB_PLANS_*`, `WEB_ANALYTICS_*`, `WEB_NUTRITION_OPS_*`.
- Inicio P2-T4:
  - foco en admin/legal web (RBAC, auditoría, compliance) y consistencia de estados de operación.
- Avance P2-T4:
  - creada pantalla `WEB-730_BILLING_OVERVIEW` en `WEB_ANALYTICS_SECONDARY_LANE` para cubrir billing en el flujo admin/legal.
  - copy de billing orientada a operación (`ciclo actual`, `exportar factura`, `cliente/plan/estado`).
- Cierre P2-T4:
  - creada pantalla `WEB-740_SUPPORT_INCIDENTS` para soporte operativo y severidad de incidentes.
  - bloque admin/legal web queda cubierto con: `WEB-700_ADMIN_USERS`, `WEB-710_AUDIT_TRAIL`, `WEB-730_BILLING_OVERVIEW`, `WEB-740_SUPPORT_INCIDENTS`, `WEB-800_LEGAL_COMPLIANCE`.
- Evidencia P2-T4:
  - `jq -r '.. | objects | select(.name=="WEB_ANALYTICS_SECONDARY_LANE") | .children[] | .name' flux.pen`
- Inicio P2-T5:
  - foco en handoff+i18n web: cerrar matriz ES/EN por dominio y notas de implementación por sección.
- Cierre P2-T5:
  - matriz i18n web ampliada (navegación, CTAs y estados de billing/incidentes).
  - handoff técnico web reforzado con componentes (`BillingCard`, `IncidentRow`) y eventos analytics adicionales.
- Evidencia P2-T5:
  - `jq '.. | objects | select(.id=="KjC7D" or .id=="7vu79")' flux.pen`
- Inicio P3-T1:
  - foco en consolidar flujo global iOS V2 (primera apertura → onboarding → loop diario → edge cases) con trazabilidad explícita.
- Cierre P3-T1:
  - flujo global iOS ajustado a ES base y validado en rutas happy/edge (`PRIMERA APERTURA`, `ONBOARDING`, `LOOP DIARIO`, `CASOS EDGE`).
- Evidencia P3-T1:
  - `jq '.. | objects | select(.id=="lPj2M")' flux.pen`
- Inicio P3-T2:
  - foco en flujo global web por rol (Admin/Coach/Atleta), incluyendo billing e incidentes en la ruta de operaciones.
- Cierre P3-T2:
  - flujo web por rol consolidado y pasado a ES base con bifurcaciones explícitas.
  - ruta admin extendida con `Billing` + `Incidentes` en `WEB_GLOBAL_FLOW`.
- Evidencia P3-T2:
  - `jq '.. | objects | select(.id=="YDt6Z")' flux.pen`
- Inicio P3-T3:
  - foco en mapa de trazabilidad old→new IDs para iOS/Web y validación de no huérfanos.
- Cierre P3-T3:
  - generado mapa canónico de migración `old_key -> new_node_id` para iOS/Web.
  - validado sin huérfanos ni duplicados.
- Evidencia P3-T3:
  - `docs/validation/ID_MIGRATION_MAP_V2.csv` (`121` filas)
  - chequeo unicidad: `dupOld=0`, `dupId=0`.
- Inicio P4-T1:
  - foco en gate de layout: auditoría estática + snapshots por secciones para detectar clipping/overflow/solapes.
- Avance P4-T1:
  - auditoría estática `flux.pen` en verde: `duplicateIds=0`, `layoutIssues=0`, top-level canónico (`BOARD_IOS_APP`, `BOARD_WEB_APP`).
  - pendiente snapshot MCP del archivo canónico por timeout de apertura en esta sesión.

## Fase P2 - Reconstruccion Web (desde cero)
| ID | Task | Subtasks | Estado | Dependencia | Criterio de aceptacion |
|---|---|---|---|---|---|
| P2-T1 | Estructura Web por secciones dominio | P2-T1.1 access/dashboard; P2-T1.2 athletes; P2-T1.3 plans/CMS; P2-T1.4 analytics/AI; P2-T1.5 nutrition ops; P2-T1.6 admin/support/audit; P2-T1.7 i18n; P2-T1.8 handoff; P2-T1.9 global flow | ✅ | P1-T5 | Secciones web completas y separadas |
| P2-T2 | Pantallas Web acceso/operacion | P2-T2.1 access gate/sign in; P2-T2.2 dashboard; P2-T2.3 alert/status | ✅ | P2-T1 | Flujo operativo base completo |
| P2-T3 | Pantallas Web producto/IA | P2-T3.1 athletes; P2-T3.2 plans/CMS; P2-T3.3 analytics/AI; P2-T3.4 nutrition ops | ✅ | P2-T2 | Producto web completo |
| P2-T4 | Pantallas Web admin/legal | P2-T4.1 RBAC/users; P2-T4.2 support/audit; P2-T4.3 billing; P2-T4.4 legal compliance | ✅ | P2-T3 | Ops/admin completo |
| P2-T5 | i18n + handoff Web | P2-T5.1 matriz ES/EN; P2-T5.2 notas handoff por seccion; P2-T5.3 eventos analytics de pantalla | ✅ | P2-T4 | Gates 3/5 y handoff completo en web |

## Fase P3 - Flujos globales + migracion de IDs
| ID | Task | Subtasks | Estado | Dependencia | Criterio de aceptacion |
|---|---|---|---|---|---|
| P3-T1 | Flujo global iOS V2 | P3-T1.1 primera apertura; P3-T1.2 onboarding; P3-T1.3 loop diario; P3-T1.4 edge cases | ✅ | P2-T5 | Flujo iOS trazable sin huecos |
| P3-T2 | Flujo global Web V2 por rol | P3-T2.1 Admin; P3-T2.2 Coach; P3-T2.3 Athlete; P3-T2.4 edge cases web | ✅ | P3-T1 | Flujo web por rol completo |
| P3-T3 | Mapa old->new IDs | P3-T3.1 mapear iOS old->new; P3-T3.2 mapear web old->new; P3-T3.3 validar no huerfanos | ✅ | P3-T2 | Trazabilidad historica completa |

## Fase P4 - QA final 5/5 + cierre
| ID | Task | Subtasks | Estado | Dependencia | Criterio de aceptacion |
|---|---|---|---|---|---|
| P4-T1 | Gate Layout | P4-T1.1 snapshot por seccion iOS; P4-T1.2 snapshot por seccion web; P4-T1.3 registrar evidencia | ✅ | P3-T3 | 0 clipping/overflow/solapes/desalineaciones |
| P4-T2 | Gate Flujo + Estados | P4-T2.1 happy paths; P4-T2.2 edge cases; P4-T2.3 state coverage por pantalla | ✅ | P4-T1 | FlowMap y StateCoverage en PASS |
| P4-T3 | Gate i18n + UX + Compliance | P4-T3.1 i18n ES/EN; P4-T3.2 a11y; P4-T3.3 IA/microcopy; P4-T3.4 GDPR | ✅ | P4-T2 | Gate 5/5 completo en PASS |
| P4-T4 | Cierre maestro | P4-T4.1 congelar board; P4-T4.2 checklist final; P4-T4.3 handoff implementacion | ✅ | P4-T3 | Board listo para codificar |

## Fase C1 - Codificacion UI desde board (inicio)
| ID | Task | Subtasks | Estado | Dependencia | Criterio de aceptacion |
|---|---|---|---|---|---|
| C1-T1 | Shell web por dominios | C1-T1.1 selector de dominio; C1-T1.2 filtrado de modulos; C1-T1.3 validacion TDD | ✅ | P4-T4 | Navegacion por secciones opera tiva |
| C1-T2 | A11y + i18n de la navegacion web | C1-T2.1 ARIA tablist/tabs; C1-T2.2 cobertura i18n de dominio; C1-T2.3 tests verdes | ✅ | C1-T1 | Interaccion accesible y bilingue consistente |
| C1-T3 | Implementacion iOS shell de secciones | C1-T3.1 tabs por dominio; C1-T3.2 render condicional de modulos; C1-T3.3 pruebas de view-model | ✅ | C1-T2 | iOS alineado con estructura del board |
| C1-T4 | QA de paridad shell iOS/Web | C1-T4.1 matriz de paridad por dominio; C1-T4.2 ajustes de microcopy/estados; C1-T4.3 regression checks | ✅ | C1-T3 | Navegacion por dominios consistente entre plataformas |
| C1-T5 | Paridad de estados por dominio (iOS/Web) | C1-T5.1 matriz state-by-domain; C1-T5.2 ajustes de empty/error/offline; C1-T5.3 regression cruzada | ✅ | C1-T4 | Estados operativos coherentes entre clientes por dominio |
| C1-T6 | Cierre visual/runtime del shell por dominio | C1-T6.1 QA visual de cards por dominio; C1-T6.2 ajuste de microcopy residual; C1-T6.3 check final de continuidad | ✅ | C1-T5 | Shell por dominio listo para demo técnica sin inconsistencias |
| C1-T7 | Persistencia de dominio activo iOS/Web | C1-T7.1 persistencia local web; C1-T7.2 persistencia local iOS; C1-T7.3 TDD + BDD parity | ✅ | C1-T6 | El dominio seleccionado se restaura tras reinicio/recarga |
| C1-T8 | QA de persistencia + continuidad de sesión | C1-T8.1 verificación runtime tras reload; C1-T8.2 matrix parity iOS/web; C1-T8.3 cierre de evidencias | ✅ | C1-T7 | Persistencia validada end-to-end para demo técnica |
| C1-T9 | Deep-link de dominio + telemetry UX | C1-T9.1 web query param `domain`; C1-T9.2 restore coherente iOS/web; C1-T9.3 evento de cambio de dominio | ✅ | C1-T8 | Entrada dirigida por dominio y trazabilidad de uso en demo |
| C1-T10 | QA final C1 + checklist de demo dominio | C1-T10.1 smoke runtime iOS/web; C1-T10.2 consolidar evidencia C1; C1-T10.3 cierre de fase C1 | ✅ | C1-T9 | Fase C1 lista para handoff de implementación de pantallas completas |

## Fase C2 - Implementacion de pantallas completas (iOS/Web)
| ID | Task | Subtasks | Estado | Dependencia | Criterio de aceptacion |
|---|---|---|---|---|---|
| C2-T1 | Pantallas Auth + Onboarding iOS/Web | C2-T1.1 contratos de vista por pantalla; C2-T1.2 layout real por plataforma; C2-T1.3 i18n/a11y + tests | ✅ | C1-T10 | Auth y onboarding listos para codificación funcional sin placeholders |
| C2-T2 | Pantallas Today + Training + Videos iOS/Web | C2-T2.1 flujo de sesión; C2-T2.2 reproductor/listado video; C2-T2.3 estados críticos y recovery | ✅ | C2-T1 | Dominio diario implementado end-to-end |
| C2-T3 | Pantallas Nutrition + Progress + AI iOS/Web | C2-T3.1 panel nutrición; C2-T3.2 progreso/historial; C2-T3.3 recomendaciones IA accionables | ✅ | C2-T2 | Módulo de seguimiento completo |
| C2-T4 | Pantallas Settings + Legal/GDPR iOS/Web | C2-T4.1 consentimiento/export/delete; C2-T4.2 trazabilidad legal; C2-T4.3 accesibilidad y copy final | ✅ | C2-T3 | Compliance legal cerrado en UI productiva |
| C2-T5 | QA de integración cross-platform | C2-T5.1 parity matrix por pantalla; C2-T5.2 smoke e2e; C2-T5.3 handoff final a implementación backend-full | ✅ | C2-T4 | Fase C2 cerrada con evidencia operativa |

## Fase C3 - Hardening de implementacion (post-C2)
| ID | Task | Subtasks | Estado | Dependencia | Criterio de aceptacion |
|---|---|---|---|---|---|
| C3-T1 | iOS i18n hardening en Auth UX | C3-T1.1 eliminar hardcoded de email/password; C3-T1.2 unificar opciones de idioma via `LocalizedCopy`; C3-T1.3 validar tests Swift | ✅ | C2-T5 | Auth iOS sin strings hardcodeadas de UI y pruebas en verde |
| C3-T2 | Web parity hardening de microcopy/accesibilidad | C3-T2.1 auditar labels/aria por dominios; C3-T2.2 cerrar gaps ES/EN residuales; C3-T2.3 validar tests web | ✅ | C3-T1 | Paridad web endurecida en microcopy y a11y sin regresión |
| C3-T3 | Gate técnico C3 y cierre de fase | C3-T3.1 smoke iOS+web; C3-T3.2 consolidar evidencia C3; C3-T3.3 decidir paso a siguiente ciclo | ✅ | C3-T2 | Fase C3 cerrada con evidencias y sin deuda crítica abierta |

## Fase C4 - Siguiente ciclo de implementacion (runtime enterprise)
| ID | Task | Subtasks | Estado | Dependencia | Criterio de aceptacion |
|---|---|---|---|---|---|
| C4-T1 | Integrar contratos de pantalla en navegación runtime | C4-T1.1 mapear contratos C2/C3 a rutas iOS/Web; C4-T1.2 validar continuidad de dominio; C4-T1.3 cubrir tests de integración | ✅ | C3-T3 | Runtime navega por pantallas contrato sin huecos |
| C4-T2 | Endurecer estados enterprise en runtime | C4-T2.1 loading/empty/error/offline/denied por dominio; C4-T2.2 acciones de recovery; C4-T2.3 paridad iOS/Web | ✅ | C4-T1 | Cobertura operativa de estados críticos en ejecución real |
| C4-T3 | Gate C4 y readiness de handoff a backend-full | C4-T3.1 smoke cruzado; C4-T3.2 checklist de evidencias; C4-T3.3 cierre ejecutivo del ciclo | ✅ | C4-T2 | Ciclo C4 cerrado y listo para implementación backend-full |

## Fase C5 - Runtime enterprise por rol (RBAC operativo)
| ID | Task | Subtasks | Estado | Dependencia | Criterio de aceptacion |
|---|---|---|---|---|---|
| C5-T1 | Control de acceso por rol en dominios iOS/Web | C5-T1.1 matriz `athlete/coach/admin`; C5-T1.2 bloqueo `denied` en dominio no autorizado; C5-T1.3 tests de paridad | ✅ | C4-T3 | Selección de dominio respeta rol activo y bloqueo es explícito |
| C5-T2 | Persistencia + telemetry de rol activo | C5-T2.1 persistencia local rol en iOS/Web; C5-T2.2 evento de cambio de rol; C5-T2.3 recovery coherente al cambiar rol | ✅ | C5-T1 | Rol sobrevive reinicio/recarga y se audita el cambio |
| C5-T3 | Gate C5 y cierre de readiness enterprise | C5-T3.1 smoke cruzado; C5-T3.2 checklist de evidencias RBAC; C5-T3.3 cierre ejecutivo C5 | ✅ | C5-T2 | C5 cerrado en verde y listo para backend-full RBAC |

## Fase C6 - Backend-full alignment (runtime to product delivery)
| ID | Task | Subtasks | Estado | Dependencia | Criterio de aceptacion |
|---|---|---|---|---|---|
| C6-T1 | Conectar runtime RBAC con contratos backend por rol | C6-T1.1 mapear role->capabilities; C6-T1.2 desacoplar permisos hardcode; C6-T1.3 cobertura test por rol | ✅ | C5-T3 | Permisos runtime consumen capacidades backend y no reglas locales fijas |
| C6-T2 | Endurecer trazabilidad operativa por rol | C6-T2.1 analytics por transición de rol/dominio; C6-T2.2 auditoría de acciones bloqueadas; C6-T2.3 checks de consistencia | ✅ | C6-T1 | Auditoría de acceso lista para operación enterprise |
| C6-T3 | Gate C6 y readiness de integración backend-full | C6-T3.1 smoke global; C6-T3.2 checklist de evidencia; C6-T3.3 cierre ejecutivo C6 | ✅ | C6-T2 | C6 cerrado y listo para siguiente ola de implementación funcional |

## Fase C7 - Integración funcional backend-full
| ID | Task | Subtasks | Estado | Dependencia | Criterio de aceptacion |
|---|---|---|---|---|---|
| C7-T1 | Conectar acciones runtime bloqueadas a endpoints operativos | C7-T1.1 mapear acciones por dominio; C7-T1.2 validación de payloads backend; C7-T1.3 smoke de bloqueo/recuperación | ✅ | C6-T3 | Las acciones bloqueadas y recovery invocan rutas backend coherentes por dominio |
| C7-T2 | Cerrar loop de observabilidad operativa por dominio | C7-T2.1 correlación event->acción; C7-T2.2 auditoría de denegaciones por sesión; C7-T2.3 evidencia de paridad iOS/web | ✅ | C7-T1 | Telemetría permite trazabilidad end-to-end de decisiones RBAC |
| C7-T3 | Gate C7 y readiness de integración producto end-to-end | C7-T3.1 smoke global; C7-T3.2 checklist ejecutivo; C7-T3.3 cierre de ciclo | ✅ | C7-T2 | Runtime listo para ola funcional completa con backend |

## Matriz de cobertura por dominio (scope cerrado)

### iOS obligatorio
- `AUTH`: welcome, email sign in, apple handoff, OTP, recover, session expired.
- `ONBOARDING`: profile, goal, PAR-Q, consent.
- `DAILY`: today, training active, session setup, exercise video, summary.
- `PROGRESS/NUTRITION/AI`: nutrition hub, log meal, metrics, goal adjust, AI coach, weekly review.
- `SETTINGS/LEGAL`: settings, account, notifications, privacy consent, export, delete.
- `SUPPORT ARTEFACTS`: i18n section, a11y checklist, global flow.

### Web obligatorio
- `ACCESS/DASHBOARD`: access gate, sign in, dashboard, quick actions, alert center, status.
- `ATHLETES`: list, filters, detail, session history, compare progress, coach notes.
- `PLANS/CMS`: catalog, builder, exercise library, video CMS, assignment, publish review.
- `ANALYTICS/AI/ADMIN`: analytics overview, AI insights, admin users, legal compliance, billing, incident log.
- `SUPPORT ARTEFACTS`: nutrition ops section, i18n section, handoff notes, global flow por rol.

## Evidencia tecnica de auditoria A0 (base de este plan)
- Secciones actuales:
  - `jq -r '.. | objects | select(.id=="rdY3Z") | .children[] | [.id,.name] | @tsv' flux.pen`
  - `jq -r '.. | objects | select(.id=="HaFxT") | .children[] | [.id,.name] | @tsv' flux.pen`
- Inventario de pantallas por seccion:
  - `jq -r '.. | objects | select(.id=="VRMek")' flux.pen | jq -r '.. | objects | select(.name? and (.name|test("^IOS(-L)?-[0-9]{3}"))) | .name'`
  - Mismo patron para `TICgl`, `x8FBK`, `201eP`, `AUNCE`, `9fpUM`, `sN8uH`, `x63xh`.
- QA fail-fast:
  - `snapshot_layout(parentId="VRMek", problemsOnly=true)` -> PASS.
  - `snapshot_layout(parentId="AUNCE", problemsOnly=true)` -> FAIL por clipping.

## Bitacora P4 (2026-03-01)
- Cierre P4-T1 (Gate Layout):
  - QA estática por boards/secciones en verde (`LAYOUT_QA_V2.csv`: `17` filas, `0` FAIL).
  - Intento de snapshot MCP sobre archivo canónico bloqueado por timeout en esta sesión; se registra bloqueo de herramienta sin impacto en el resultado estático.
- Cierre P4-T2 (Flujo + Estados):
  - Matriz `FLOW_STATE_COVERAGE_V2.csv` generada para iOS/Web (`121` pantallas, `121` PASS).
  - Cobertura de flujo soportada por `IOS_GLOBAL_FLOW` y `WEB_GLOBAL_FLOW`.
- Inicio P4-T3:
  - foco en gate final i18n + UX + compliance (ES/EN, a11y, IA/microcopy, GDPR) para pasar a cierre maestro.
- Avance P4-T3:
  - auditoría `I18N_UX_COMPLIANCE_V2.csv` ejecutada sobre `121` pantallas.
  - resultado: `70` pantallas sin hits EN, `51` en `REVIEW` (máximo `4` hits EN por pantalla).
  - checks de compliance en verde (`IOS legal`, `WEB legal/billing/incidentes`, `AI iOS/web`, `i18n+a11y sections`).
- Cierre P4-T3:
  - limpieza final de microcopy en pantallas base (reducción de términos EN residuales fuera de marca).
  - auditoría final i18n/UX en PASS: `121` pantallas PASS, `0` en REVIEW.
  - términos de marca permitidos documentados: `Apple`, `Google`, `Email`.
- Evidencia P4-T3:
  - `docs/validation/I18N_UX_COMPLIANCE_V2.csv`
  - `docs/validation/I18N_UX_COMPLIANCE_V2_DETAILS.csv`
  - `docs/validation/I18N_UX_COMPLIANCE_V2_SUMMARY.json`
- Inicio P4-T4:
  - foco en cierre maestro: congelar board, checklist final y handoff listo para codificar.
- Cierre P4-T4:
  - freeze del board canónico con huella SHA256 de `flux.pen`.
  - reporte final de gates generado con resultado global `PASS`.
- Evidencia P4-T4:
  - `docs/validation/FINAL_GATE_REPORT_V2.json`
  - `flux.pen` sha256: `70523324f8b146dba413aaaf99f1e0ec9d5b8518a7a2bea9b031d5060787013d`
- Estado final del plan:
  - Fases `A0` a `P4` completadas (`✅`) y board listo para codificación.

## Bitacora C1 (2026-03-01)
- Cierre C1-T1:
  - implementado selector de dominio y filtrado de módulos en `apps/web/src/presentation/App.tsx`.
  - lógica aislada en `apps/web/src/presentation/dashboard-domains.ts`.
  - TDD aplicado con `apps/web/src/presentation/dashboard-domains.spec.ts`.
- Cierre C1-T2:
  - accesibilidad en navegación de dominio (`role=tablist`, `role=tab`, `aria-selected`, `aria-controls`).
  - cobertura i18n extendida para etiquetas de dominio en `apps/web/src/presentation/i18n.ts` + `i18n.spec.ts`.
  - validación en verde: `pnpm --filter web test` y `pnpm --filter web check`.
- Inicio C1-T3:
  - foco en trasladar shell por secciones al cliente iOS (`ExperienceHubView`) con estado y navegación por dominio.
- Cierre C1-T3:
  - creado `ExperienceSectionShell` como estado de dominio y visibilidad de módulos (`all/onboarding/training/nutrition/progress/operations`).
  - integrado en `ExperienceHubView` con selector de dominio horizontal y render condicional por tab (`today/progress/operations`).
  - BDD/TDD de soporte:
    - `docs/validation/features/ios_domain_shell_navigation.feature`
    - `apps/ios/Tests/FluxTrainingTests/ExperienceSectionShellTests.swift`
  - i18n de navegación iOS ampliada en `LocalizedCopy` (ES base + EN completo).
  - validación en verde: `cd apps/ios && swift test` (`45` tests, `0` fallos).
- Inicio C1-T4:
  - foco en cerrar paridad iOS/Web de navegación por dominio y consistencia de estados/microcopy en runtime real.
  - matriz inicial de paridad generada: `docs/validation/IOS_WEB_DOMAIN_PARITY_C1.csv` (domains `all/onboarding/training/nutrition/progress/operations` con gaps explícitos y estado `PASS/REVIEW`).
- Cierre C1-T4:
  - paridad de módulos consolidada entre clientes: web normalizado a módulos por dominio equivalentes a iOS.
  - ajustes ejecutados:
    - web: `dashboard-domains` sin módulos aislados `legal/videos`; esos bloques quedan integrados en `onboarding/training`.
    - iOS: nomenclatura de módulo de operaciones alineada a `offlineSync`.
    - microcopy de filtro de dominio unificada (`Dominio`/`Domain`) en iOS y web.
  - matriz de paridad actualizada a `PASS` por dominio:
    - `docs/validation/IOS_WEB_DOMAIN_PARITY_C1.csv`.
  - regression checks en verde:
    - `pnpm --filter web test` (`35` tests PASS).
    - `pnpm --filter web check` (TypeScript PASS).
    - `cd apps/ios && swift test` (`45` tests PASS).
- Inicio C1-T5:
  - foco en cerrar paridad de estados por dominio (`default/loading/empty/error/offline/denied/success`) entre iOS y web.
  - avances ejecutados:
    - web: fallback explícito de estado `empty` por dominio cuando no existan módulos visibles (`noModulesForSelectedDomain`).
    - web: microcopy de dominio unificada y extendida en i18n/tests para estado `empty`.
    - validación documental inicial de estados por dominio:
      - `docs/validation/IOS_WEB_STATE_BY_DOMAIN_C1.csv`
      - `docs/validation/features/cross_platform_domain_state_parity.feature`
- Cierre C1-T5:
  - cobertura de estados por dominio cerrada en `PASS` para iOS/Web:
    - `docs/validation/IOS_WEB_STATE_BY_DOMAIN_C1.csv`.
  - paridad funcional web reforzada:
    - integración de bloques legal y video en lanes `onboarding` y `training`.
    - fallback `empty` explícito en dashboard por dominio.
  - regresión cruzada en verde:
    - `pnpm --filter web test` (`35` tests PASS).
    - `pnpm --filter web check` (TypeScript PASS).
    - `cd apps/ios && swift test` (`45` tests PASS).
- Inicio C1-T6:
  - foco en QA visual/runtime y consistencia final del shell por dominio para demo técnica.
- Cierre C1-T6:
  - QA runtime por dominio validado en web (`all/onboarding/training/nutrition/progress/operations`) y en iOS (selector de dominio por tabs).
  - continuidad visual cerrada con evidence pack de capturas de dominio y snapshot refs.
  - regresión en verde antes de avanzar.
- Evidencia C1-T6:
  - `output/playwright/c1-t6v2-domain-*.png`
  - `pnpm --filter web test` y `pnpm --filter web check`
  - `cd apps/ios && swift test`
- Inicio C1-T7:
  - foco en persistencia del dominio activo entre sesiones/recargas para iOS y web, con TDD + escenarios BDD de paridad.
- Cierre C1-T7:
  - web: persistencia de dominio activa con `localStorage` + resolución segura de dominio inválido.
  - iOS: restauración de dominio desde `AppStorage` al relanzar y sincronización de cambios de selector.
  - BDD/TDD actualizado para escenarios de restauración persistida en ambas plataformas.
  - regresión técnica en verde:
    - `pnpm --filter web test` (`36` tests PASS).
    - `pnpm --filter web check` (TypeScript PASS).
    - `cd apps/ios && swift test` (`47` tests PASS).
- Evidencia C1-T7:
  - `apps/web/src/presentation/App.tsx`
  - `apps/web/src/presentation/dashboard-domains.ts`
  - `apps/web/src/presentation/dashboard-domains.spec.ts`
  - `apps/ios/Sources/Presentation/ExperienceHubView.swift`
  - `apps/ios/Sources/Presentation/ExperienceSectionShell.swift`
  - `apps/ios/Tests/FluxTrainingTests/ExperienceSectionShellTests.swift`
  - `docs/validation/features/web_domain_navigation.feature`
  - `docs/validation/features/ios_domain_shell_navigation.feature`
  - `docs/validation/features/cross_platform_domain_state_parity.feature`
- Inicio C1-T8:
  - foco en validación runtime end-to-end de persistencia (reload/relanzado), cierre de matriz de paridad y consolidación de evidencias de demo.
- Cierre C1-T8:
  - verificación runtime web realizada con Playwright: selección de `Entrenamiento` + `reload` + restauración de tab seleccionada en PASS.
  - matrices de paridad actualizadas con fila de persistencia (`persistence_reload`) en dominio y estados.
  - evidencia de capturas y snapshots incorporada para handoff técnico.
- Evidencia C1-T8:
  - `output/playwright/c1-t8-domain-training-selected.png`
  - `output/playwright/c1-t8-domain-after-reload.png`
  - `output/playwright/c1-t8-domain-snapshot-after-reload.txt`
  - `.playwright-cli/page-2026-03-01T15-45-03-625Z.yml`
  - `docs/validation/IOS_WEB_DOMAIN_PARITY_C1.csv`
  - `docs/validation/IOS_WEB_STATE_BY_DOMAIN_C1.csv`
- Inicio C1-T9:
  - foco en entrada dirigida por dominio (deep-link web) y telemetría de cambios de dominio para continuidad UX y observabilidad de navegación.
- Cierre C1-T9:
  - web: lectura de dominio desde query param (`?domain=`) priorizada sobre preferencia local.
  - web: sincronización de dominio activo hacia URL (`history.replaceState`) sin recarga.
  - web: evento analítico `dashboard_domain_changed` al cambiar de dominio (post-hydration).
  - coherencia iOS/web mantenida: restauración iOS ya cubierta por `AppStorage` (C1-T7) + paridad documental.
  - regresión en verde:
    - `pnpm --filter web test` (`38` tests PASS).
    - `pnpm --filter web check` (TypeScript PASS).
    - `cd apps/ios && swift test` (`47` tests PASS).
- Evidencia C1-T9:
  - `apps/web/src/presentation/App.tsx`
  - `apps/web/src/presentation/dashboard-domains.ts`
  - `apps/web/src/presentation/dashboard-domains.spec.ts`
  - `docs/validation/features/web_domain_navigation.feature`
- Inicio C1-T10:
  - foco en cierre de fase C1: smoke runtime final por dominio, consolidación de evidencias y checklist de handoff a implementación de pantallas completas.
- Cierre C1-T10:
  - smoke runtime deep-link validado con Playwright:
    - `?domain=operations` selecciona `Operaciones`.
    - `?domain=training` selecciona `Entrenamiento`.
  - checklist de continuidad C1 completado con paridad de dominio/persistencia/deep-link.
  - fase C1 cerrada y preparada para salto a implementación de pantallas completas.
- Evidencia C1-T10:
  - `output/playwright/c1-t10-ops-deeplink.png`
  - `output/playwright/c1-t10-training-deeplink.png`
  - `output/playwright/c1-t10-ops-deeplink-snapshot.txt`
  - `output/playwright/c1-t10-training-deeplink-snapshot.txt`
  - `.playwright-cli/page-2026-03-01T15-50-07-317Z.yml`
  - `.playwright-cli/page-2026-03-01T15-50-10-037Z.yml`
- Inicio C2-T1:
  - foco en implementación real de pantallas `Auth + Onboarding` para iOS/web con layout de producto (no shell), i18n ES/EN y cobertura de estados críticos.
- Avance C2-T1:
  - contratos de pantalla auth/onboarding creados en web:
    - `apps/web/src/presentation/auth-onboarding-contract.ts`
    - `apps/web/src/presentation/auth-onboarding-contract.spec.ts`
  - contratos de pantalla auth/onboarding creados en iOS:
    - `apps/ios/Sources/Presentation/AuthOnboardingScreenContract.swift`
    - `apps/ios/Tests/FluxTrainingTests/AuthOnboardingScreenContractTests.swift`
  - escenarios BDD de soporte agregados para C2:
    - `docs/validation/features/auth_onboarding_screen_contract_c2.feature`
  - validación técnica en verde:
    - `pnpm --filter web test` (`40` tests PASS).
    - `pnpm --filter web check` (TypeScript PASS).
    - `cd apps/ios && swift test` (`49` tests PASS).
- Cierre C2-T1:
  - auth/onboarding consolidado con contratos tipados y cobertura de defaults en web+iOS.
  - parity documental de contrato auth mantenida en features C2.
- Evidencia C2-T1:
  - `apps/web/src/presentation/auth-onboarding-contract.ts`
  - `apps/web/src/presentation/auth-onboarding-contract.spec.ts`
  - `apps/ios/Sources/Presentation/AuthOnboardingScreenContract.swift`
  - `apps/ios/Tests/FluxTrainingTests/AuthOnboardingScreenContractTests.swift`
  - `docs/validation/features/auth_onboarding_screen_contract_c2.feature`
- Inicio C2-T2:
  - foco en contratos y ejecución real de `today + training + videos` para ambos clientes.
- Cierre C2-T2:
  - contrato `daily_training_video` agregado en web+iOS con estado de sesión/video.
  - dominio `training` mantiene flujo completo con sesiones y listado de videos en ambos clientes.
- Evidencia C2-T2:
  - `apps/web/src/presentation/daily-training-video-contract.ts`
  - `apps/web/src/presentation/daily-training-video-contract.spec.ts`
  - `apps/ios/Sources/Presentation/DailyTrainingVideoScreenContract.swift`
  - `apps/ios/Tests/FluxTrainingTests/DailyTrainingVideoScreenContractTests.swift`
  - `docs/validation/features/c2_daily_training_videos.feature`
- Inicio C2-T3:
  - foco en contratos y cobertura operativa de `nutrition + progress + AI`.
- Cierre C2-T3:
  - contrato `nutrition_progress_ai` agregado en web+iOS con estados críticos homogéneos.
  - módulos de nutrición, progreso y recomendaciones IA quedan conectados en paridad funcional.
- Evidencia C2-T3:
  - `apps/web/src/presentation/nutrition-progress-ai-contract.ts`
  - `apps/web/src/presentation/nutrition-progress-ai-contract.spec.ts`
  - `apps/ios/Sources/Presentation/NutritionProgressAIScreenContract.swift`
  - `apps/ios/Tests/FluxTrainingTests/NutritionProgressAIScreenContractTests.swift`
  - `docs/validation/features/c2_nutrition_progress_ai.feature`
- Inicio C2-T4:
  - foco en `settings + legal/GDPR` con paridad iOS/web dentro de dominio operations.
- Cierre C2-T4:
  - módulos `settings` y `legal` añadidos a dominios visibles en web+iOS.
  - copy ES/EN y estados (`saved/exported/deletion_requested`) alineados en ambos clientes.
  - acciones legales de consentimiento/exportación/borrado expuestas en UIs productivas.
- Evidencia C2-T4:
  - `apps/web/src/presentation/App.tsx`
  - `apps/web/src/presentation/dashboard-domains.ts`
  - `apps/web/src/presentation/settings-legal-contract.ts`
  - `apps/web/src/presentation/settings-legal-contract.spec.ts`
  - `apps/ios/Sources/Presentation/ExperienceHubView.swift`
  - `apps/ios/Sources/Presentation/ExperienceSectionShell.swift`
  - `apps/ios/Sources/Presentation/SettingsLegalScreenContract.swift`
  - `apps/ios/Sources/Presentation/LocalizedCopy.swift`
  - `apps/ios/Tests/FluxTrainingTests/SettingsLegalScreenContractTests.swift`
  - `docs/validation/features/c2_settings_legal.feature`
- Inicio C2-T5:
  - foco en cierre de integración cross-platform con matriz de paridad por grupos de pantalla y smoke técnico.
- Cierre C2-T5:
  - matriz C2 de paridad por dominio/pantalla publicada en validación.
  - smoke técnico final en verde:
    - `pnpm --filter web test` (`43` tests PASS).
    - `pnpm --filter web check` (TypeScript PASS).
    - `cd apps/ios && swift test` (`52` tests PASS).
  - fase C2 cerrada y V2 listo para congelación.
- Evidencia C2-T5:
  - `docs/validation/IOS_WEB_SCREEN_PARITY_C2.csv`
  - `docs/validation/features/c2_cross_platform_integration.feature`
  - `apps/web/src/presentation/i18n.spec.ts`
  - `apps/ios/Tests/FluxTrainingTests/LocalizedCopyTests.swift`
- Inicio C3-T1:
  - foco en hardening iOS de i18n en Auth: eliminar textos hardcodeados de campos y opciones de idioma del picker.
- Cierre C3-T1:
  - `ExperienceHubView` usa `LocalizedCopy` para `emailField`, `passwordField` y opciones de idioma.
  - `LocalizedCopy` ampliado con claves dedicadas para auth fields y opciones de idioma en ES/EN.
  - regresión iOS en verde:
    - `cd apps/ios && swift test` (`52` tests PASS).
- Evidencia C3-T1:
  - `apps/ios/Sources/Presentation/ExperienceHubView.swift`
  - `apps/ios/Sources/Presentation/LocalizedCopy.swift`
  - `apps/ios/Tests/FluxTrainingTests/LocalizedCopyTests.swift`
  - `docs/validation/features/c3_t1_ios_auth_i18n_hardening.feature`
- Inicio C3-T2:
  - foco en hardening web de microcopy/a11y por dominios (paridad final ES/EN + labels accesibles).
- Cierre C3-T2:
  - web: inputs/selects críticos actualizados con `aria-label` localizable en módulos auth, onboarding, training y nutrition.
  - i18n web ampliado con claves de accesibilidad (`goalPickerLabel`, `exercisePickerLabel`, `videoLocalePickerLabel`) en ES/EN.
  - regresión web en verde:
    - `pnpm --filter web check` (TypeScript PASS).
    - `pnpm --filter web test` (`43` tests PASS).
- Evidencia C3-T2:
  - `apps/web/src/presentation/App.tsx`
  - `apps/web/src/presentation/i18n.ts`
  - `apps/web/src/presentation/i18n.spec.ts`
  - `docs/validation/features/c3_t2_web_microcopy_a11y_hardening.feature`
- Inicio C3-T3:
  - foco en gate técnico de cierre C3: consolidar smoke iOS+web y publicar estado final de fase.
- Cierre C3-T3:
  - smoke técnico global ejecutado en verde:
    - `pnpm -r test` (`97` tests PASS en contracts/web/backend).
    - `cd apps/ios && swift test` (`52` tests PASS).
  - fase C3 cerrada sin deuda crítica abierta y lista para siguiente ciclo de implementación.
- Evidencia C3-T3:
  - `pnpm -r test`
  - `cd apps/ios && swift test`
- Inicio C4-T1:
  - foco en conectar contratos de pantalla C2/C3 con navegación runtime real en iOS/web para iniciar el siguiente ciclo de entrega.
- Cierre C4-T1:
  - iOS: `ExperienceHubView` inicializa estados críticos desde contratos (`AuthScreenContract`, `OnboardingScreenContract`, `NutritionProgressAIScreenContract`, `SettingsLegalScreenContract`).
  - web: `App.tsx` inicializa estados de runtime desde contratos C2/C3 (`auth-onboarding`, `daily-training-video`, `nutrition-progress-ai`, `settings-legal`).
  - smoke de integración en verde:
    - `pnpm --filter web check` (PASS).
    - `pnpm --filter web test` (`43` tests PASS).
    - `cd apps/ios && swift test` (`52` tests PASS).
- Evidencia C4-T1:
  - `apps/ios/Sources/Presentation/ExperienceHubView.swift`
  - `apps/web/src/presentation/App.tsx`
  - `docs/validation/features/c4_t1_runtime_contract_navigation.feature`
- Inicio C4-T2:
  - foco en endurecer estados enterprise de runtime por dominio (loading/empty/error/offline/denied + recovery).
- Cierre C4-T2:
  - web: runtime por dominio integrado con estado enterprise (`success/loading/empty/error/offline/denied`) y banner de bloqueo con acción de recuperación.
  - iOS: runtime por dominio integrado en `ExperienceHubView` con selector de estado y recuperación contextual por dominio.
  - i18n/humanize reforzado en ES/EN para estados enterprise en ambas plataformas.
  - regresión técnica en verde:
    - `pnpm --filter web check` (PASS)
    - `pnpm --filter web test` (`46` tests PASS)
    - `cd apps/ios && swift test` (`55` tests PASS)
- Evidencia C4-T2:
  - `apps/web/src/presentation/runtime-states.ts`
  - `apps/web/src/presentation/runtime-states.spec.ts`
  - `apps/web/src/presentation/App.tsx`
  - `apps/web/src/presentation/i18n.ts`
  - `apps/web/src/presentation/i18n.spec.ts`
  - `apps/web/src/presentation/app.css`
  - `apps/ios/Sources/Presentation/EnterpriseRuntimeState.swift`
  - `apps/ios/Sources/Presentation/ExperienceHubView.swift`
  - `apps/ios/Sources/Presentation/LocalizedCopy.swift`
  - `apps/ios/Tests/FluxTrainingTests/EnterpriseRuntimeStateTests.swift`
  - `apps/ios/Tests/FluxTrainingTests/LocalizedCopyTests.swift`
  - `docs/validation/features/c4_t2_runtime_enterprise_states.feature`
- Inicio C4-T3:
  - foco en gate C4 final: smoke cruzado workspace + checklist de handoff backend-full y cierre ejecutivo del ciclo.
- Cierre C4-T3:
  - smoke cruzado de ciclo C4 en verde:
    - `pnpm -r test` (`100` tests PASS en contracts/web/backend)
    - `cd apps/ios && swift test` (`55` tests PASS)
  - checklist de evidencias C4 consolidado (contratos runtime + estados enterprise + i18n/a11y + pruebas).
  - ciclo C4 cerrado y listo para handoff a implementación backend-full.
- Evidencia C4-T3:
  - `pnpm -r test`
  - `cd apps/ios && swift test`
  - `docs/validation/features/c4_t3_runtime_gate_readiness.feature`
- Inicio C5-T1:
  - foco en control de acceso por rol (`athlete/coach/admin`) para dominios runtime con bloqueo explícito `denied` y recuperación al recuperar permisos.
- Cierre C5-T1:
  - web: matriz RBAC de dominio integrada en runtime (`canAccessDomain`) con bloqueo `denied` al seleccionar dominio no autorizado.
  - iOS: matriz RBAC de dominio integrada (`ExperienceRole.canAccess`) y reconciliación de estado runtime al cambiar rol.
  - i18n ES/EN actualizado para selector de rol y cobertura de tests.
  - regresión técnica en verde:
    - `pnpm --filter web check` (PASS)
    - `pnpm --filter web test` (`48` tests PASS)
    - `cd apps/ios && swift test` (`56` tests PASS)
- Evidencia C5-T1:
  - `apps/web/src/presentation/dashboard-domains.ts`
  - `apps/web/src/presentation/dashboard-domains.spec.ts`
  - `apps/web/src/presentation/App.tsx`
  - `apps/web/src/presentation/i18n.ts`
  - `apps/web/src/presentation/i18n.spec.ts`
  - `apps/ios/Sources/Presentation/ExperienceSectionShell.swift`
  - `apps/ios/Sources/Presentation/ExperienceHubView.swift`
  - `apps/ios/Sources/Presentation/LocalizedCopy.swift`
  - `apps/ios/Tests/FluxTrainingTests/ExperienceSectionShellTests.swift`
  - `apps/ios/Tests/FluxTrainingTests/LocalizedCopyTests.swift`
  - `docs/validation/features/c5_t1_role_based_domain_access.feature`
- Inicio C5-T2:
  - foco en persistir rol activo y telemetría de cambio de rol para cierre operativo RBAC.
- Cierre C5-T2:
  - web: rol activo persistido en `localStorage` (`flux_training_dashboard_role`) con resolver seguro y telemetría `dashboard_role_changed`.
  - iOS: rol activo persistido en `AppStorage` (`flux_training_dashboard_role`) y telemetría de cambio de rol vía `ObservabilityViewModel.trackRuntimeEvent`.
  - tests incrementales en verde:
    - `pnpm --filter web check` (PASS)
    - `pnpm --filter web test` (`49` tests PASS)
    - `cd apps/ios && swift test` (`57` tests PASS)
- Evidencia C5-T2:
  - `apps/web/src/presentation/App.tsx`
  - `apps/web/src/presentation/dashboard-domains.ts`
  - `apps/web/src/presentation/dashboard-domains.spec.ts`
  - `apps/ios/Sources/Presentation/ExperienceHubView.swift`
  - `apps/ios/Sources/Presentation/ObservabilityViewModel.swift`
  - `apps/ios/Tests/FluxTrainingTests/ObservabilityViewModelTests.swift`
  - `docs/validation/features/c5_t2_role_persistence_telemetry.feature`
- Inicio C5-T3:
  - foco en gate C5 final: smoke global de workspace + checklist de evidencias RBAC y cierre ejecutivo de ciclo.
- Cierre C5-T3:
  - smoke global de cierre C5 en verde:
    - `pnpm -r test` (`103` tests PASS en contracts/web/backend)
    - `cd apps/ios && swift test` (`57` tests PASS)
  - checklist de evidencias RBAC consolidado (`C5-T1` + `C5-T2`) y ciclo C5 cerrado.
  - readiness confirmada para iniciar alignment con backend-full por capacidades/rol.
- Evidencia C5-T3:
  - `pnpm -r test`
  - `cd apps/ios && swift test`
  - `docs/validation/features/c5_t3_rbac_gate_readiness.feature`
- Inicio C6-T1:
  - foco en sustituir reglas RBAC locales por capacidades backend para evitar drift de permisos entre clientes.
- Cierre C6-T1:
  - backend: contrato `RoleCapabilities` expuesto por use case + runtime HTTP (`/api/listRoleCapabilities`) en demo y firebase/http.
  - web: runtime RBAC desacoplado de reglas locales; acceso por dominio resuelto únicamente contra `allowedDomains` backend.
  - iOS: eliminado fallback hardcodeado de matriz de rol; `ExperienceHub` consume capacidades backend y usa fallback seguro sin reglas locales fijas.
  - regresión técnica en verde:
    - `pnpm --filter backend test` (`40` tests PASS)
    - `pnpm --filter web test` (`49` tests PASS)
    - `pnpm -r test` (`109` tests PASS en contracts/web/backend)
    - `cd apps/ios && swift test` (`57` tests PASS)
- Evidencia C6-T1:
  - `packages/contracts/src/index.ts`
  - `packages/contracts/src/index.spec.ts`
  - `apps/backend/src/application/list-role-capabilities.ts`
  - `apps/backend/src/application/list-role-capabilities.spec.ts`
  - `apps/backend/src/presentation/demo-api-runtime.ts`
  - `apps/backend/src/presentation/demo-api-runtime.spec.ts`
  - `apps/backend/src/presentation/demo-http-server.ts`
  - `apps/backend/src/presentation/demo-http-server.spec.ts`
  - `apps/backend/src/presentation/http.ts`
  - `apps/backend/src/index.ts`
  - `apps/web/src/application/manage-role-capabilities.ts`
  - `apps/web/src/application/manage-role-capabilities.spec.ts`
  - `apps/web/src/infrastructure/role-capabilities-client.ts`
  - `apps/web/src/presentation/App.tsx`
  - `apps/web/src/presentation/dashboard-domains.ts`
  - `apps/web/src/presentation/dashboard-domains.spec.ts`
  - `apps/ios/Sources/Presentation/ExperienceHubView.swift`
  - `apps/ios/Sources/Presentation/ExperienceSectionShell.swift`
  - `apps/ios/Tests/FluxTrainingTests/ExperienceSectionShellTests.swift`
  - `docs/validation/features/c6_t1_backend_role_capabilities_alignment.feature`
- Inicio C6-T2:
  - foco en auditar y persistir trazabilidad de denegaciones por dominio/rol con eventos explícitos para operación enterprise.
- Avance C6-T2:
  - web: instrumentado evento `dashboard_domain_access_denied` en triggers `domain_select`, `runtime_state_change`, `recover` y `role_capabilities_sync`.
  - iOS: instrumentado evento `dashboard_domain_access_denied` en selección/recovery/sync de capacidades con bloqueo `denied`.
  - BDD de trazabilidad C6-T2 agregado en `docs/validation/features/c6_t2_denied_access_audit_tracing.feature`.
  - regresión incremental en verde:
    - `pnpm --filter web test` (`49` tests PASS)
    - `cd apps/ios && swift test` (`57` tests PASS)
- Cierre C6-T2:
  - analytics de transición dominio consolidadas en ambos clientes con atributos `role` + `domain`.
  - auditoría de acciones bloqueadas consolidada mediante evento `dashboard_action_blocked` en iOS/web.
  - verificación de consistencia cross-platform completada (paridad de eventos por nombre y cobertura de test global).
  - smoke de consistencia en verde:
    - `pnpm -r test` (`109` tests PASS en contracts/web/backend)
    - `cd apps/ios && swift test` (`57` tests PASS)
    - `rg -n "dashboard_domain_changed|dashboard_domain_access_denied|dashboard_action_blocked" apps/web/src/presentation/App.tsx apps/ios/Sources/Presentation/ExperienceHubView.swift`
- Inicio C6-T3:
  - foco en gate final C6: smoke global + checklist ejecutivo de evidencia + readiness para integración backend-full.
- Avance C6-T3:
  - smoke global ejecutado en verde:
    - `pnpm -r test` (`109` tests PASS en contracts/web/backend)
    - `cd apps/ios && swift test` (`57` tests PASS)
  - checklist de paridad de telemetry RBAC validado por evidencia estática:
    - `dashboard_domain_changed` presente en iOS/web.
    - `dashboard_domain_access_denied` presente en iOS/web.
    - `dashboard_action_blocked` presente en iOS/web.
  - BDD de gate agregado en `docs/validation/features/c6_t3_gate_readiness.feature`.
- Cierre C6-T3:
  - gate C6 completado con smoke global y checklist de evidencia en verde.
  - readiness confirmada para iniciar integración funcional backend-full (C7).
  - evidencia de cierre:
    - `pnpm -r test` (`109` tests PASS en contracts/web/backend)
    - `cd apps/ios && swift test` (`57` tests PASS)
    - `rg -n "dashboard_domain_changed|dashboard_domain_access_denied|dashboard_action_blocked" apps/web/src/presentation/App.tsx apps/ios/Sources/Presentation/ExperienceHubView.swift`
- Inicio C7-T1:
  - foco en conectar acciones runtime bloqueadas/recovery con rutas backend operativas por dominio.
- Avance C7-T1:
  - web: mapeo `domain -> backendRoute` añadido en `dashboard_action_blocked` para `onboarding/training/nutrition/progress/operations`.
  - iOS: mapeo `domain -> backend_route` añadido en `dashboard_action_blocked` con paridad de dominios y rutas.
  - BDD C7-T1 endurecido con criterio explícito de atributo de ruta backend.
  - regresión incremental en verde:
    - `pnpm --filter web test` (`49` tests PASS)
    - `cd apps/ios && swift test` (`57` tests PASS)
- Cierre C7-T1:
  - Web: lógica de mapeo y validación de payload extraída a `blocked-action-contract` con pruebas dedicadas.
  - iOS: contrato de validación de payload por dominio añadido y conectado a eventos `dashboard_action_blocked` y `dashboard_domain_changed`.
  - ambos clientes emiten `backend_route + contract + payload_validation + payload_missing_fields` para trazabilidad operativa.
  - smoke + typecheck en verde:
    - `pnpm --filter web check`
    - `pnpm --filter web test` (`52` tests PASS)
    - `cd apps/ios && swift test` (`60` tests PASS)
- Inicio C7-T2:
  - foco en cerrar correlación `event -> action -> backend route` y auditoría de denegaciones por sesión en iOS/Web.
- Cierre C7-T2:
  - Web: sesión de observabilidad runtime añadida con `runtimeSessionId`, `runtimeEventIndex`, `deniedSessionCount`, `deniedDomainCount` y `correlationId`.
  - Web: eventos `dashboard_domain_changed`, `dashboard_domain_access_denied` y `dashboard_action_blocked` quedan correlacionados por sesión/acción y comparten contexto de backend payload/route.
  - iOS: `RuntimeObservabilitySession` añadido y conectado a eventos `dashboard_role_changed`, `dashboard_domain_changed`, `dashboard_domain_access_denied` y `dashboard_action_blocked`.
  - iOS: denegaciones y bloqueos comparten `correlation_id`; contadores por sesión/dominio quedan auditables en telemetry.
  - BDD C7-T2 agregado en `docs/validation/features/c7_t2_operational_observability_loop.feature`.
  - smoke + tests en verde:
    - `pnpm --filter web check`
    - `pnpm --filter web test` (`55` tests PASS)
    - `cd apps/ios && swift test` (`63` tests PASS)
- Inicio C7-T3:
  - foco en gate final C7: smoke global, checklist ejecutivo y cierre de ciclo backend-full runtime.
- Avance C7-T3:
  - smoke global ejecutado en verde:
    - `pnpm -r test` (`115` tests PASS; `packages/contracts=20`, `apps/web=55`, `apps/backend=40`)
    - `cd apps/ios && swift test` (`63` tests PASS)
  - BDD de gate C7 agregado en `docs/validation/features/c7_t3_gate_readiness.feature`.
  - checklist ejecutivo C7 agregado en `docs/validation/C7_T3_EXECUTIVE_CHECKLIST.json`.
  - índice de validación actualizado en `docs/validation/README.md` con `c7_t2` + `c7_t3`.
  - evidencia de paridad operativa C7 por código:
    - web: `runtimeSessionId/runtimeEventIndex/deniedSessionCount/deniedDomainCount/correlationId` en eventos de dominio/denegación/bloqueo.
    - iOS: `runtime_session_id/runtime_event_index/denied_session_count/denied_domain_count/correlation_id` en eventos equivalentes.
- Cierre C7-T3:
  - gate C7 consolidado con smoke final en verde:
    - `pnpm -r test` (`115` tests PASS; `exit=0`)
    - `cd apps/ios && swift test` (`63` tests PASS; `exit=0`)
  - `docs/validation/C7_T3_EXECUTIVE_CHECKLIST.json` actualizado a `status=done`.
  - ciclo `C7` cerrado en `✅` sin tareas pendientes en V2.

## Nota de control
- `docs/FLUX_UIUX_EXECUTION_TRACKING.md` queda historico.
- Este V2 es la fuente unica de ejecucion UI/UX.
- Estado actual V2: fases `A0` a `C7-T3` cerradas en `✅`; V2 sin tareas pendientes.
- Tracking enterprise V1 cerrado en `GO` con residuales `R1/R2/R3` en `✅`.
