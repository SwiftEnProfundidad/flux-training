# SEGUIMIENTO MASTER — Flux Training

## Leyenda
- ✅ Hecho
- 🚧 En construccion (maximo 1)
- ⏳ Pendiente
- ⛔ Bloqueado

## Estado global
- Se mantiene un unico plan activo y detallado para llevar el producto a estado operativo real.
- Objetivo actual: MVP web+iOS usable end-to-end, sin fallback demo, con paridad funcional contra `flux.pen`.
- El plan activo esta en formato pantalla a pantalla (121 subtasks trazables).

## Trazabilidad consolidada (resumen humano)
- Se detectaron cierres de tareas que no representan funcionamiento real en producto.
- El ciclo actual revalida todo con criterio funcional estricto (evidencia runtime obligatoria).
- Reapertura formal de cierres no validados: `docs/validation/MVP_T1_2_REOPENED_CLOSURES_V1.csv`.
- Priorizacion ejecutable por olas: `docs/validation/MVP_T1_3_EXECUTION_PRIORITY_V1.csv`.
- `IOS-300_SETTINGS_HOME` ya esta operativo con ruta navegable, persistencia durable por usuario y test funcional verde.
- `IOS-310_ACCOUNT_PROFILE` ya esta operativo con ruta de ajustes, guardado de perfil por usuario y test funcional verde.
- `IOS-320_NOTIFICATIONS` ya esta operativo con ruta dedicada, persistencia durable por usuario y test funcional verde.
- `IOS-330_PRIVACY_CONSENT` ya esta operativo con ruta dedicada, persistencia legal por usuario y acciones de consentimiento/export/deletion validadas por test.
- `IOS-340_EXPORT_DATA` ya esta operativo con ruta dedicada y export real de snapshot JSON por usuario con evidencia de test funcional.
- `IOS-350_DELETE_ACCOUNT` ya esta operativo con ruta dedicada, verificacion de consentimiento legal y solicitud de borrado persistida por usuario.
- `IOS-L-300_SETTINGS_HOME` ya esta operativo como variante light con ruta y pantalla propias (`settings.route.homeLight`, `settings.home.light.screen`).
- `IOS-L-310_ACCOUNT_PROFILE` ya esta operativo como variante light con ruta/pantalla propias (`settings.route.accountProfileLight`, `account.profile.light.screen`) y persistencia real por usuario.
- `IOS-L-320_NOTIFICATIONS` ya esta operativo como variante light con ruta/pantalla propias (`settings.route.notificationsLight`, `notifications.light.screen`) y persistencia real por usuario.
- `IOS-L-330_PRIVACY_CONSENT` ya esta operativo como variante light con ruta/pantalla propias (`settings.route.privacyConsentLight`, `privacy.light.screen`) y persistencia legal por usuario.
- `IOS-L-340_EXPORT_DATA` ya esta operativo como variante light con ruta/pantalla propias (`settings.route.exportDataLight`, `export.light.screen`) y export real de snapshot por usuario.
- `IOS-L-350_DELETE_ACCOUNT` ya esta operativo como variante light con ruta/pantalla propias (`settings.route.deleteAccountLight`, `delete.light.screen`) y solicitud de borrado persistida por usuario.
- `IOS-000_WELCOME` ya esta operativo con ruta/pantalla dedicadas (`auth.route.welcome`, `auth.welcome.screen`) y accion principal de inicio de sesion Apple conectada a `AuthViewModel`.
- `IOS-010_EMAIL_LOGIN` ya esta operativo con ruta/pantalla dedicadas (`auth.route.emailLogin`, `auth.emailLogin.screen`), inicio de sesion por email y recuperacion por email/SMS.
- `IOS-020_APPLE_HANDOFF` ya esta operativo con ruta/pantalla dedicadas (`auth.route.appleHandoff`, `auth.appleHandoff.screen`) y accion de continuacion Apple conectada a `AuthViewModel`.
- `IOS-030_ONBOARDING_STEP1` ya esta operativo con ruta/pantalla dedicadas (`onboarding.route.step1`, `onboarding.step1.screen`) y validacion de perfil base desde `OnboardingViewModel`.
- `IOS-035_GOAL_SETUP` ya esta operativo con ruta/pantalla dedicadas (`onboarding.route.goalSetup`, `onboarding.goalSetup.screen`) y accion de guardado de objetivo/compromiso semanal desde `OnboardingViewModel`.
- `IOS-040_PARQ` ya esta operativo con ruta/pantalla dedicadas (`onboarding.route.parQ`, `onboarding.parQ.screen`) y guardado de respuestas PAR-Q en `OnboardingViewModel.parQResponses`.
- `IOS-050_CONSENT` ya esta operativo con ruta/pantalla dedicadas (`onboarding.route.consent`, `onboarding.consent.screen`) y validacion de consentimiento completo en `OnboardingViewModel`.
- `IOS-060_OTP_VERIFY` ya esta operativo con ruta/pantalla dedicadas (`auth.route.otpVerify`, `auth.otpVerify.screen`) y validacion de OTP/reenvio desde `AuthViewModel`.
- `IOS-070_RECOVER_ACCOUNT` ya esta operativo con ruta/pantalla dedicadas (`auth.route.recoverAccount`, `auth.recoverAccount.screen`) y recuperacion por email/SMS con escalado a soporte desde `AuthViewModel`.
- `IOS-080_SESSION_EXPIRED` ya esta operativo con ruta/pantalla dedicadas (`auth.route.sessionExpired`, `auth.sessionExpired.screen`) y salida segura a login/offline con limpieza de sesion desde `AuthViewModel`.
- `IOS-L-000_WELCOME` ya esta operativo como variante light con ruta/pantalla propias (`auth.route.welcomeLight`, `auth.welcome.light.screen`) y accion principal Apple sobre `AuthViewModel`.
- `IOS-L-010_EMAIL_LOGIN` ya esta operativo como variante light con ruta/pantalla propias (`auth.route.emailLoginLight`, `auth.emailLogin.light.screen`) y accion principal email + recuperacion email/SMS sobre `AuthViewModel`.
- `IOS-L-020_APPLE_HANDOFF` ya esta operativo como variante light con ruta/pantalla propias (`auth.route.appleHandoffLight`, `auth.appleHandoff.light.screen`) y continuacion Apple sobre `AuthViewModel`.
- `IOS-L-030_ONBOARDING` ya esta operativo como variante light con ruta/pantalla propias (`onboarding.route.step1Light`, `onboarding.step1.light.screen`) y guardado de perfil base sobre `OnboardingViewModel`.
- `IOS-L-035_GOAL_SETUP` ya esta operativo como variante light con ruta/pantalla propias (`onboarding.route.goalSetupLight`, `onboarding.goalSetup.light.screen`) y guardado de objetivo/compromiso semanal sobre `OnboardingViewModel`.
- `IOS-L-040_PARQ` ya esta operativo como variante light con ruta/pantalla propias (`onboarding.route.parQLight`, `onboarding.parQ.light.screen`) y guardado de respuestas PAR-Q sobre `OnboardingViewModel`.
- `IOS-L-050_CONSENT` ya esta operativo como variante light con ruta/pantalla propias (`onboarding.route.consentLight`, `onboarding.consent.light.screen`) y validacion de consentimiento completo sobre `OnboardingViewModel`.
- `IOS-L-060_OTP_VERIFY` ya esta operativo como variante light con ruta/pantalla propias (`auth.route.otpVerifyLight`, `auth.otpVerify.light.screen`) y validacion/reenvio de OTP sobre `AuthViewModel`.
- `IOS-L-070_RECOVER_ACCOUNT` ya esta operativo como variante light con ruta/pantalla propias (`auth.route.recoverAccountLight`, `auth.recoverAccount.light.screen`) y recuperacion por email/SMS con soporte sobre `AuthViewModel`.
- `IOS-L-080_SESSION_EXPIRED` ya esta operativo como variante light con ruta/pantalla propias (`auth.route.sessionExpiredLight`, `auth.sessionExpired.light.screen`) y salida segura a login/offline con limpieza de sesion sobre `AuthViewModel`.
- `IOS-005a_InWorkout_Setup` ya esta operativo con ruta/pantalla dedicadas (`training.route.inWorkoutSetup`, `training.inWorkoutSetup.screen`) y accion real de preparacion de sesion conectada a planes/sesiones/videos con estados `loading|empty|error|saved|denied|offline`.
- `IOS-005b_RPE_Rating` ya esta operativo con ruta/pantalla dedicadas (`training.route.rpeRating`, `training.rpeRating.screen`) y accion real de guardado de RPE conectada a planes/sesiones con estados `loading|empty|error|saved|denied|offline`.
- `IOS-006_Substitution` ya esta operativo con ruta/pantalla dedicadas (`training.route.substitution`, `training.substitution.screen`) y accion real de sustitucion conectada a planes/sesiones/videos con estados `loading|empty|error|saved|denied|offline`.
- `IOS-007a_ExerciseLibrary` ya esta operativo con ruta/pantalla dedicadas (`training.route.exerciseLibrary`, `training.exerciseLibrary.screen`) y carga real de biblioteca de videos por ejercicio/idioma con estados `loading|empty|error|loaded|denied|offline`.
- `IOS-007b_VideoPlayer` ya esta operativo con ruta/pantalla dedicadas (`training.route.videoPlayer`, `training.videoPlayer.screen`) y accion real de carga/reproduccion de video seleccionado con estados `loading|empty|error|success|denied|offline`.
- `IOS-L-005a_InWorkout` ya esta operativo como variante light con ruta/pantalla propias (`training.route.inWorkoutSetupLight`, `training.inWorkoutSetup.light.screen`) y accion real de preparacion de sesion conectada a planes/sesiones/videos con estados `loading|empty|error|saved|denied|offline`.
- `IOS-L-005b_RPE` ya esta operativo como variante light con ruta/pantalla propias (`training.route.rpeRatingLight`, `training.rpeRating.light.screen`) y accion real de guardado de RPE conectada a planes/sesiones con estados `loading|empty|error|saved|denied|offline`.
- `IOS-L-006_Substitution` ya esta operativo como variante light con ruta/pantalla propias (`training.route.substitutionLight`, `training.substitution.light.screen`) y accion real de sustitucion conectada a planes/sesiones/videos con estados `loading|empty|error|saved|denied|offline`.
- `IOS-L-007a_Library` ya esta operativo como variante light con ruta/pantalla propias (`training.route.exerciseLibraryLight`, `training.exerciseLibrary.light.screen`) y carga real de biblioteca de videos por ejercicio/idioma con estados `loading|empty|error|loaded|denied|offline`.
- `IOS-L-007b_VideoPlayer` ya esta operativo como variante light con ruta/pantalla propias (`training.route.videoPlayerLight`, `training.videoPlayer.light.screen`) y accion real de carga/reproduccion de video seleccionado con estados `loading|empty|error|success|denied|offline`.
- `IOS-200_NUTRITION_HUB` ya esta operativo con ruta/pantalla dedicadas (`nutrition.route.hub`, `nutrition.hub.screen`) y acciones reales de guardado/carga nutricional conectadas a repositorio con estados `loading|empty|error|saved|loaded|denied|offline`.
- `IOS-210_LOG_MEAL` ya esta operativo con ruta/pantalla dedicadas (`nutrition.route.logMeal`, `nutrition.logMeal.screen`) y accion real de guardado nutricional con estados `loading|error|saved|validation_error|denied|offline`.
- `IOS-220_PROGRESS_METRICS` ya esta operativo con ruta/pantalla dedicadas (`progress.route.metrics`, `progress.metrics.screen`) y carga real de metricas de progreso con estados `loading|empty|error|loaded|validation_error|denied|offline`.
- `IOS-230_GOAL_ADJUST` ya esta operativo con ruta/pantalla dedicadas (`progress.route.goalAdjust`, `progress.goalAdjust.screen`) y ajuste real de objetivo/compromiso semanal con estados `loading|validation_error|success|denied|offline`.
- `IOS-240_AI_COACH` ya esta operativo con ruta/pantalla dedicadas (`progress.route.aiCoach`, `progress.aiCoach.screen`) y recomendaciones IA dinamicas por objetivo/adherencia/cola con estados `loading|empty|error|loaded|validation_error|denied|offline`.
- `IOS-250_WEEKLY_REVIEW` ya esta operativo con ruta/pantalla dedicadas (`progress.route.weeklyReview`, `progress.weeklyReview.screen`) y refresco paralelo real de progreso+entreno+nutricion con estados `loading|empty|error|loaded|validation_error|denied|offline`.
- `IOS-L-200_NUTRITION_HUB` ya esta operativo como variante light con ruta/pantalla propias (`nutrition.route.hubLight`, `nutrition.hub.light.screen`) y acciones reales de guardado/carga nutricional con estados `loading|empty|error|saved|loaded|denied|offline`.
- `IOS-L-210_LOG_MEAL` ya esta operativo como variante light con ruta/pantalla propias (`nutrition.route.logMealLight`, `nutrition.logMeal.light.screen`) y accion real de guardado nutricional con estados `loading|error|saved|validation_error|denied|offline`.
- `IOS-L-220_PROGRESS_METRICS` ya esta operativo como variante light con ruta/pantalla propias (`progress.route.metricsLight`, `progress.metrics.light.screen`) y carga real de metricas de progreso con estados `loading|empty|error|loaded|validation_error|denied|offline`.
- `IOS-L-230_GOAL_ADJUST` ya esta operativo como variante light con ruta/pantalla propias (`progress.route.goalAdjustLight`, `progress.goalAdjust.light.screen`) y ajuste real de objetivo/compromiso semanal con estados `loading|validation_error|success|denied|offline`.
- `IOS-L-240_AI_COACH` ya esta operativo como variante light con ruta/pantalla propias (`progress.route.aiCoachLight`, `progress.aiCoach.light.screen`) y carga real de recomendaciones IA con estados `loading|empty|error|loaded|denied|offline`.

## Decisiones activas
- Backend productivo: Firebase Functions + Firestore.
- Auth real: Apple + email/password.
- Idioma base: ES, secundario: EN.
- Alcance de salida: 121 pantallas funcionales (66 iOS + 55 Web).

## Ciclo activo (producto real)
Plan activo: `docs/PLAN_MVP_OPERATIVO_WEB_IOS.md`

| Fase | Task | Estado |
|---|---|---|
| Fase 1 | Inventario canonico 121/121 + cobertura base | ✅ |
| Fase 1 | Reabrir cierres no validados en runtime | ✅ |
| Fase 1 | Priorizacion por impacto de usuario | ✅ |
| Fase 2 | Auth real de sesion (email/password + Apple) | ✅ |
| Fase 2 | RBAC por endpoint y dominio | ✅ |
| Fase 2 | Persistencia real (Firestore) sin in-memory | ✅ |
| Fase 2 | Errores observables (codigos + correlationId) | ✅ |
| Fase 3 | iOS pantalla a pantalla (Settings + Auth + Training + Nutrition en curso) | 🚧 |

## Regla de operacion
- Solo una task en `🚧`.
- Al cerrar task: marcar `✅` y mover la siguiente a `🚧`.
