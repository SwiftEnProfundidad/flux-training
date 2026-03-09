# Validación vigente — Flux Training

## Objetivo
- Mantener solo la validación actual y útil del producto.
- Evitar histórico ruidoso de CSV/JSON generados por ciclos antiguos.

## Qué se conserva

### Fundamentos
- `features/foundation_workspace.feature`
- `features/contracts.feature`

### Flujos de producto vigentes
- `features/authentication.feature`
- `features/onboarding_parq.feature`
- `features/training_plan.feature`
- `features/workout_session.feature`
- `features/exercise_videos_integration.feature`
- `features/nutrition_logs.feature`
- `features/progress_metrics.feature`
- `features/ai_recommendations_retention.feature`
- `features/offline_sync_queue.feature`
- `features/analytics_crash_reporting.feature`
- `features/legal_hardening.feature`
- `features/runtime_local_demo.feature`

### Calidad transversal
- `features/ios_domain_shell_navigation.feature`
- `features/web_domain_navigation.feature`
- `features/cross_platform_domain_state_parity.feature`
- `features/p6_t2_a11y_aa.feature`
- `features/p6_t3_localization_es_en.feature`
- `features/critical_regression_suite.feature`
- `features/qa_visual_demo_checklist.feature`
- `features/release_checklist_v1.feature`

### Compatibilidad Pumuki
- `features/p3_t1_web_shell_dashboard.feature`

## Qué no se conserva
- Reportes generados `.json` y `.csv` de ciclos anteriores.
- Features históricas por ola/ciclo (`P0-P8`, `V3-V8`, `R*`, `C*`) que ya no son fuente de verdad del estado actual.

## Regla operativa
- Si una validación es generada y puede regenerarse, no se versiona salvo que sea el artefacto oficial del release vigente.
- Si aparece una nueva suite vigente, se añade aquí antes de considerarla documentación canónica.
