# FLUX_IMPLEMENTATION_TRACKING_V3

## Leyenda
- ✅ Hecho
- 🚧 En construccion (maximo 1)
- ⏳ Pendiente
- ⛔ Bloqueado

## Reglas operativas
- Solo puede haber 1 task en `🚧`.
- Al cerrar una task: pasarla a `✅` y mover la siguiente a `🚧`.
- Si hay bloqueo tecnico o de decision: marcar `⛔` con causa y desbloqueo requerido.
- Este documento gobierna el ciclo V3 de implementacion real a codigo.

## Objetivo del ciclo V3
Implementar en codigo (iOS + Web + Backend + contratos) todo el alcance funcional del board canónico `flux.pen`, con paridad de comportamiento, estados enterprise y evidencia de calidad ejecutable.

## Fase P0 - Baseline de implementacion y control de alcance
| ID | Task | Subtasks | Estado | Criterio de aceptacion |
|---|---|---|---|---|
| V3-P0-T1 | Congelar inventario funcional codificable | V3-P0-T1.1 mapear seccion->pantallas->componentes por plataforma; V3-P0-T1.2 validar dependencias con backend/contracts; V3-P0-T1.3 registrar gaps de codigo vs board | ✅ | Inventario codificable firmado y sin ambiguedad |
| V3-P0-T2 | Definir matriz de ownership por modulo | V3-P0-T2.1 iOS ownership; V3-P0-T2.2 Web ownership; V3-P0-T2.3 Backend/contracts ownership | ✅ | Owner y criterios de done por modulo definidos |
| V3-P0-T3 | Definir gate V3 de calidad tecnica | V3-P0-T3.1 tests minimos por capa; V3-P0-T3.2 smoke E2E; V3-P0-T3.3 checklist de evidencias | ✅ | Gate V3 publicado y aplicable |

## Fase P1 - Implementacion iOS por dominios
| ID | Task | Subtasks | Estado | Dependencia | Criterio de aceptacion |
|---|---|---|---|---|---|
| V3-P1-T1 | Auth + onboarding + consent (iOS) | V3-P1-T1.1 pantallas/estados; V3-P1-T1.2 validaciones y recovery; V3-P1-T1.3 i18n/a11y | ✅ | V3-P0-T3 | Flujos de acceso iOS completos y testeados |
| V3-P1-T2 | Today + training + video (iOS) | V3-P1-T2.1 cockpit diario; V3-P1-T2.2 sesion activa; V3-P1-T2.3 video/fallback/offline | ✅ | V3-P1-T1 | Dominio diario iOS operativo |
| V3-P1-T3 | Nutrition + progress + AI + settings (iOS) | V3-P1-T3.1 nutricion/progreso; V3-P1-T3.2 recomendaciones IA; V3-P1-T3.3 settings/legal GDPR | ✅ | V3-P1-T2 | iOS completo por dominios core y legales |

## Fase P2 - Implementacion Web por dominios
| ID | Task | Subtasks | Estado | Dependencia | Criterio de aceptacion |
|---|---|---|---|---|---|
| V3-P2-T1 | Shell + acceso + dashboard web | V3-P2-T1.1 app shell y navegacion; V3-P2-T1.2 acceso por rol; V3-P2-T1.3 dashboard operativo | ✅ | V3-P0-T3 | Entrada web robusta por rol |
| V3-P2-T2 | Operaciones core web | V3-P2-T2.1 athletes/plans/sessions; V3-P2-T2.2 nutrition/progress ops; V3-P2-T2.3 estados enterprise | ✅ | V3-P2-T1 | Operacion core web completa |
| V3-P2-T3 | Admin + governance web | V3-P2-T3.1 users/roles/RBAC; V3-P2-T3.2 audit/compliance; V3-P2-T3.3 billing/support | 🚧 | V3-P2-T2 | Modulos enterprise web cerrados |

## Fase P3 - Backend y contratos
| ID | Task | Subtasks | Estado | Dependencia | Criterio de aceptacion |
|---|---|---|---|---|---|
| V3-P3-T1 | Alineacion contracts<->backend | V3-P3-T1.1 versionado de contratos; V3-P3-T1.2 compatibilidad de payloads; V3-P3-T1.3 tests de contrato | ⏳ | V3-P0-T3 | Contratos coherentes y estables |
| V3-P3-T2 | Endpoints funcionales por dominio | V3-P3-T2.1 auth/onboarding; V3-P3-T2.2 training/nutrition/progress; V3-P3-T2.3 legal/admin/audit | ⏳ | V3-P3-T1 | Backend cubre flujos del board |
| V3-P3-T3 | Resiliencia backend operativa | V3-P3-T3.1 errores estandarizados; V3-P3-T3.2 trazabilidad; V3-P3-T3.3 politicas de retry/idempotencia | ⏳ | V3-P3-T2 | Backend listo para carga operativa |

## Fase P4 - Integracion cruzada y QA
| ID | Task | Subtasks | Estado | Dependencia | Criterio de aceptacion |
|---|---|---|---|---|---|
| V3-P4-T1 | Paridad iOS/Web funcional | V3-P4-T1.1 matriz de paridad; V3-P4-T1.2 ajustes de comportamiento; V3-P4-T1.3 smoke cross-platform | ⏳ | V3-P1-T3, V3-P2-T3 | Paridad cerrada por dominio |
| V3-P4-T2 | E2E de flujos criticos | V3-P4-T2.1 happy paths; V3-P4-T2.2 edge cases; V3-P4-T2.3 recovery paths | ⏳ | V3-P4-T1 | Flujos criticos sin roturas |
| V3-P4-T3 | Gate de calidad V3 | V3-P4-T3.1 `pnpm -r test`; V3-P4-T3.2 `swift test`; V3-P4-T3.3 evidencia docs/validation | ⏳ | V3-P4-T2 | Gate V3 en PASS |

## Fase P5 - Cierre V3 y traspaso a V4
| ID | Task | Subtasks | Estado | Dependencia | Criterio de aceptacion |
|---|---|---|---|---|---|
| V3-P5-T1 | Checklist de cierre de implementacion | V3-P5-T1.1 cobertura por modulo; V3-P5-T1.2 deuda explicita; V3-P5-T1.3 riesgos abiertos | ⏳ | V3-P4-T3 | Cierre V3 completo y auditable |
| V3-P5-T2 | Congelar baseline release candidate | V3-P5-T2.1 snapshot tecnico; V3-P5-T2.2 snapshot funcional; V3-P5-T2.3 docs actualizadas | ⏳ | V3-P5-T1 | RC estable para hardening |
| V3-P5-T3 | Abrir ciclo V4 formalmente | V3-P5-T3.1 handoff de riesgos; V3-P5-T3.2 task activa V4; V3-P5-T3.3 cierre ejecutivo V3 | ⏳ | V3-P5-T2 | Transicion controlada a production readiness |

## Bitacora V3 (2026-03-02)
- Inicio V3-P0-T1:
  - arranque de baseline V3 con foco en inventario codificable y trazabilidad de dependencias reales.
- Cierre V3-P0-T1:
  - inventario de implementación generado en `docs/validation/V3_P0_T1_IMPLEMENTATION_INVENTORY.csv`.
  - matriz capability->contract->route->consumer generada en `docs/validation/V3_P0_T1_DEPENDENCY_MATRIX.csv`.
  - registro de gaps generado en `docs/validation/V3_P0_T1_GAP_REGISTER.json`.
  - BDD de baseline V3 agregado en `docs/validation/features/v3_p0_t1_implementation_inventory.feature`.
  - cobertura board anclada a IDs canónicos:
    - iOS: `VRMek=20`, `TICgl=12`, `9OgKn=10`, `x8FBK=12`, `201eP=12` pantallas.
    - web: `AUNCE=12`, `9fpUM=12`, `sN8uH=14`, `TttWF=12`, `x63xh=18` pantallas.
- Inicio V3-P0-T2:
  - foco en ownership por módulo y criterios de done por capa (`iOS/Web/Backend/contracts`) para ejecución paralela controlada.
- Cierre V3-P0-T2:
  - matriz de ownership por módulo creada en `docs/validation/V3_P0_T2_OWNERSHIP_MATRIX.csv`.
  - definición de done por capa y criterios de aceptación registrada en `docs/validation/V3_P0_T2_DONE_CRITERIA.json`.
  - BDD de ownership/governance agregado en `docs/validation/features/v3_p0_t2_ownership_matrix.feature`.
  - ownership cerrado sobre `12` módulos operativos (`M01..M12`) con owners por capa.
- Inicio V3-P0-T3:
  - foco en gate técnico de ejecución V3 (tests mínimos por capa, smoke E2E y checklist de evidencias).
- Cierre V3-P0-T3:
  - matriz de gate mínimo por capa registrada en `docs/validation/V3_P0_T3_MIN_TEST_MATRIX.csv`.
  - consolidado de evidencias del gate técnico en `docs/validation/V3_P0_T3_QUALITY_GATE.json`.
  - ejecución de calidad en verde:
    - `pnpm -r test` (`contracts 20/20`, `backend 40/40`, `web 55/55`).
    - `cd apps/ios && swift test` (`63` tests en verde).
    - `pnpm test:critical` (suite crítica cross-layer en verde).
  - feature BDD de gate V3 publicado en `docs/validation/features/v3_p0_t3_quality_gate.feature`.
- Inicio V3-P1-T1:
  - foco en implementar en código el dominio iOS de acceso (`auth + onboarding + consent`) con cobertura de estados enterprise, i18n ES/EN y a11y.
- Cierre V3-P1-T1:
  - `auth`: validación de credenciales y recovery explícito (`email/sms`) implementados en `AuthViewModel`.
  - `onboarding`: validación de perfil + gate de consentimiento implementados en `OnboardingViewModel`.
  - `consent`: flujo legal operativo en `ExperienceHubView` con estados `saved/exported/deletion_requested`.
  - i18n ES/EN reforzada en `LocalizedCopy` y cobertura de estatus enterprise (`validation_error`, `consent_required`, recovery).
  - accesibilidad aplicada con `accessibilityIdentifier` en controles clave de auth/onboarding/legal.
  - evidencias publicadas:
    - `docs/validation/V3_P1_T1_IOS_AUTH_ONBOARDING_CONSENT_COVERAGE.csv`
    - `docs/validation/V3_P1_T1_IOS_AUTH_ONBOARDING_CONSENT_GATE.json`
    - `docs/validation/features/v3_p1_t1_ios_auth_onboarding_consent.feature`
  - verificación técnica: `cd apps/ios && swift test` en PASS (`68` tests, `0` fallos).
- Inicio V3-P1-T2:
  - foco en dominio diario iOS (`today + training + video`) incluyendo estados de sesión activa, fallback de video y continuidad offline.
- Cierre V3-P1-T2:
  - cockpit diario implementado en `TrainingFlowView` con refresh explícito, métricas de planes/sesiones y estados de runtime.
  - `TrainingFlowViewModel` reforzado con `refreshDashboard`, `sessionStatus`, `todaySessionsCount` y `screenContract`.
  - paths de video robustecidos con fallback locale (`fallback_loaded`) y manejo offline (`offline`) para continuidad operativa.
  - i18n ES/EN extendida para dominio daily/training/video y estados nuevos (`session_active`, `fallback_loaded`).
  - evidencias publicadas:
    - `docs/validation/V3_P1_T2_IOS_TODAY_TRAINING_VIDEO_COVERAGE.csv`
    - `docs/validation/V3_P1_T2_IOS_TODAY_TRAINING_VIDEO_GATE.json`
    - `docs/validation/features/v3_p1_t2_ios_today_training_video.feature`
  - verificación técnica: `cd apps/ios && swift test` en PASS (`73` tests, `0` fallos).
- Inicio V3-P1-T3:
  - foco en dominio iOS `nutrition + progress + AI + settings` para cerrar el bloque P1 completo.
- Cierre V3-P1-T3:
  - `nutrition`: estado runtime reforzado (`loading`, `empty`, `validation_error`, `saved`, `loaded`) con mapeo tipado en `NutritionProgressAIScreenStatus`.
  - `progress`: refresco con validación de `userID`, estado `empty` para dataset vacío y i18n/a11y de módulo en `ProgressSummaryView`.
  - `ai`: contrato de recomendaciones endurecido con estado determinista (`loading`, `empty`, `loaded`, `validation_error`) y mapeo de prioridad bilingüe.
  - `settings/legal`: acciones GDPR con gate explícito de consentimiento (`consent_required`) y mapeo tipado en `SettingsLegalScreenStatus`.
  - evidencias publicadas:
    - `docs/validation/V3_P1_T3_IOS_NUTRITION_PROGRESS_AI_SETTINGS_COVERAGE.csv`
    - `docs/validation/V3_P1_T3_IOS_NUTRITION_PROGRESS_AI_SETTINGS_GATE.json`
    - `docs/validation/features/v3_p1_t3_ios_nutrition_progress_ai_settings.feature`
  - verificación técnica: `cd apps/ios && swift test` en PASS (`79` tests, `0` fallos).
- Inicio V3-P2-T1:
  - foco en shell web, acceso por rol y dashboard operativo para abrir bloque de implementación web.
- Cierre V3-P2-T1:
  - shell y navegación endurecidos con persistencia/restauración segura de dominio (`URL + localStorage + popstate`) en `apps/web/src/presentation/App.tsx`.
  - control de acceso por rol desacoplado y determinista con `resolveDomainAccessDecision` (`allowed/pending/denied/error`) en `apps/web/src/presentation/role-domain-access.ts`.
  - estados enterprise reforzados en dashboard (`loading`, `validation_error`, `consent_required`, `empty`, `recovery_sent_email`, `recovery_sent_sms`) con i18n ES/EN.
  - evidencias publicadas:
    - `docs/validation/V3_P2_T1_WEB_SHELL_ACCESS_DASHBOARD_COVERAGE.csv`
    - `docs/validation/V3_P2_T1_WEB_SHELL_ACCESS_DASHBOARD_GATE.json`
    - `docs/validation/features/v3_p2_t1_web_shell_access_dashboard.feature`
  - verificación técnica:
    - `pnpm --filter @flux/web check` en PASS.
    - `pnpm --filter @flux/web test` en PASS (`26` ficheros, `59` tests, `0` fallos).
- Inicio V3-P2-T2:
  - foco en operaciones core web (athletes/plans/sessions + nutrition/progress ops) y cierre de estados enterprise por módulo.
- Cierre V3-P2-T2:
  - `V3-P2-T2.1`: operations hub implementado en web con roster de atletas derivado de planes/sesiones/nutrición, búsqueda, ordenación, selección y acción masiva.
  - `V3-P2-T2.2`: operaciones `nutrition/progress` reforzadas con filtros y ordenación operativa; historial con métrica derivada `effortScore` y contadores de resultados filtrados.
  - `V3-P2-T2.3`: motor unificado de estados enterprise por módulo (`deriveModuleRuntimeStatus`) aplicado a operaciones, nutrición y progreso con prioridad de estados por dominio (`offline/denied/error`) y validación de filtros.
  - evidencias publicadas:
    - `docs/validation/V3_P2_T2_WEB_CORE_OPERATIONS_COVERAGE.csv`
    - `docs/validation/V3_P2_T2_WEB_CORE_OPERATIONS_GATE.json`
    - `docs/validation/features/v3_p2_t2_web_core_operations.feature`
  - verificación técnica:
    - `pnpm --filter @flux/web check` en PASS.
    - `pnpm --filter @flux/web test` en PASS (`29` ficheros, `68` tests, `0` fallos).
- Inicio V3-P2-T3:
  - foco en módulos web de administración/gobernanza (`users/roles/RBAC`, `audit/compliance`, `billing/support`) para cierre enterprise del bloque P2.
- Avance V3-P2-T3 (en curso):
  - subtask `V3-P2-T3.1` iniciada con módulo `adminGovernance` en web: gestión de usuarios operativos, asignación de roles en lote y carga de cobertura RBAC por rol.
  - `adminGovernance` integra control por permiso de operador (acciones de cambio de rol solo para `admin`) con trazabilidad vía analítica (`governance_bulk_role_assignment_saved` / acción bloqueada).
  - estados enterprise unificados sobre governance (`loaded/empty/validation_error/denied/offline/error`) mediante `deriveModuleRuntimeStatus`.
  - cobertura técnica añadida:
    - `apps/web/src/presentation/admin-governance.spec.ts`
    - actualización de `apps/web/src/presentation/dashboard-domains.spec.ts`
    - actualización de `apps/web/src/presentation/i18n.spec.ts`
  - validación parcial en PASS:
    - `pnpm --filter @flux/web check`
    - `pnpm --filter @flux/web test` (`30` ficheros, `72` tests, `0` fallos).
