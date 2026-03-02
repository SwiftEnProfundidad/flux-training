# Release Checklist V1

## 1) Gate tecnico obligatorio
- Ejecutar `pnpm release:check`.
- Resultado esperado: `check`, `test`, `test:critical` y `swift test` en verde.
- Si falla cualquier paso: `NO-GO`.

## 2) Smoke funcional minimo
- Web (`http://localhost:5173`):
  - Onboarding + PAR-Q+ guarda correctamente.
  - Flujo training/nutrition/progress responde sin errores.
  - Aviso de `upgrade_required` aparece si backend devuelve `client_update_required`.
  - Consentimiento legal y solicitud de borrado quedan en estado correcto.
- iOS:
  - Flujo principal carga sin crash.
  - Offline queue sincroniza cuando vuelve conectividad.

## 3) Legal y compliance
- Verificar consentimiento obligatorio:
  - Privacidad aceptada.
  - Terminos aceptados.
  - Disclaimer medico aceptado.
- Verificar que la solicitud de borrado queda registrada con estado `pending`.

## 4) Operacion y riesgo
- Variables minimas:
  - Web: `VITE_APP_VERSION`.
  - Backend: `MIN_WEB_CLIENT_VERSION`, `MIN_IOS_CLIENT_VERSION`.
- Confirmar plan de rollback:
  - Subir version minima para bloquear cliente problematica.
  - Mantener trazas de crash/eventos para diagnostico inmediato.

## 5) Decision
- `GO`: todos los puntos anteriores en verde y sin bloqueos abiertos.
- `NO-GO`: cualquier fallo tecnico, legal o funcional.

## 6) Ejecucion QA F6-T1 (2026-02-26)
| Check | Resultado | Evidencia |
|---|---|---|
| Gate tecnico `pnpm release:check` equivalente (`pnpm check`, `pnpm test`, `pnpm test:critical`, `swift test`) | ✅ PASS | comandos ejecutados en esta iteracion, todo en verde |
| Baseline visual web moderna (hero + modulos) | ✅ PASS | `output/playwright/f6-t1-home.png` |
| Modulos nuevos visibles (Exercise videos + AI recommendations) | ✅ PASS | `output/playwright/f6-t1-home.png` |
| Degradacion controlada sin runtime API local (`Videos: error`, `Recommendations: error`, `Auth: auth error`) | ✅ PASS | `output/playwright/f6-t1-recommendations-click.png`, `output/playwright/f6-t1-auth-error-state.png` |
| Demo funcional web completa con respuestas reales `/api` locales | ⛔ BLOCKED | no existe runtime HTTP backend local en este repo (sin `firebase.json`/emulador) |
| Demo visual iOS en simulador | ⛔ BLOCKED | no hay `*.xcodeproj`/`*.xcworkspace` para lanzar app; el modulo iOS actual es Swift Package |
| Smoke iOS por suite critica y completa | ✅ PASS | `swift test --filter CriticalRegressionFlowTests` y `swift test` |

## 7) Ejecucion runtime local F6-T2 (2026-02-26)
| Check | Resultado | Evidencia |
|---|---|---|
| Runtime backend local `/api` operativo | ✅ PASS | `pnpm demo:backend` + test `apps/backend/src/presentation/demo-http-server.spec.ts` |
| Dashboard web con auth/videos/recommendations en estado loaded | ✅ PASS | `output/playwright/f6-t2-loaded-state.png` |
| Host iOS generado y buildable en simulador | ✅ PASS | `apps/ios-host/FluxTrainingHost.xcodeproj` + `xcodebuild ... build` en iPhone 16e simulator |
| Host iOS instalado/lanzado y screenshot capturado | ✅ PASS | `output/ios/f6-t2-ios-host.png` |

## 8) Ejecucion UI/UX + i18n F6-T3 (2026-02-26)
| Check | Resultado | Evidencia |
|---|---|---|
| Prompt profesional para Pencil MCP documentado | ✅ PASS | `docs/PENCIL_UIUX_PROMPT.md` |
| i18n web ES/EN con test dedicado | ✅ PASS | `apps/web/src/presentation/i18n.ts` + `apps/web/src/presentation/i18n.spec.ts` |
| i18n iOS ES/EN con test dedicado | ✅ PASS | `apps/ios/Sources/Presentation/LocalizedCopy.swift` + `apps/ios/Tests/FluxTrainingTests/LocalizedCopyTests.swift` |
| Rediseño visual web aplicado | ✅ PASS | `apps/web/src/presentation/app.css` + `apps/web/src/presentation/App.tsx` |
| Rediseño visual iOS aplicado | ✅ PASS | `apps/ios/Sources/Presentation/ExperienceHubView.swift` + `apps/ios/Sources/Presentation/TrainingFlowView.swift` |

## 9) Ejecucion Gate Enterprise V4-P3-T1 (2026-03-02)
| Checklist | Resultado | Evidencia |
|---|---|---|
| Tecnico: `pnpm release:check` (check + test + test:critical + swift test) | ✅ PASS | comando ejecutado en verde; evidencia consolidada en `docs/validation/V4_P3_T1_RELEASE_GATE_ENTERPRISE.json` |
| Legal: cadena de compliance (consent + access control + GDPR export/delete) | ✅ PASS | `docs/validation/V4_P0_T2_COMPLIANCE_LEGAL_DATA.json`, `docs/validation/V4_P0_T3_ENTERPRISE_ACCESS_CONTROL.json` |
| Operacion: observabilidad + runbooks + audit trail + carga/degradacion | ✅ PASS | `docs/validation/V4_P1_T1_UNIFIED_TELEMETRY.json`, `docs/validation/V4_P1_T2_ALERTING_RUNBOOKS.json`, `docs/validation/V4_P1_T3_LOGGING_AUDIT_TRAIL.json`, `docs/validation/V4_P2_T3_LOAD_DEGRADATION.json` |
| Bloqueos de gate resueltos (contrato `ObservabilityGateway` en suites web) | ✅ PASS | `apps/web/src/application/happy-path-e2e-suite.spec.ts`, `apps/web/src/application/critical-regression-suite.spec.ts`, `apps/web/src/application/edge-case-e2e-suite.spec.ts`, `apps/web/src/application/recovery-path-e2e-suite.spec.ts` |
