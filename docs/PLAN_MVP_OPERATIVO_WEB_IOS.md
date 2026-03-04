# PLAN ACTIVO — MVP OPERATIVO (PANTALLA A PANTALLA)

## Leyenda
- ✅ Hecho
- 🚧 En construccion (maximo 1)
- ⏳ Pendiente
- ⛔ Bloqueado

## Objetivo
Convertir el producto en MVP real 100% operativo end-to-end (Web+iOS), sin comportamientos mock, con backend real y paridad funcional contra `flux.pen`.

## Alcance canonico
- Total pantallas: **121**
- iOS: **66**
- Web: **55**

## Subtasks obligatorias por pantalla
1. Ruta/vista navegable.
2. Datos reales/API integrada (sin fallback demo).
3. Accion principal operativa.
4. Estados UI: loading/empty/error/success/denied/offline (si aplica).
5. Test funcional asociado.
6. Captura de evidencia.

## Fase 1 — Baseline real y reapertura de estado
| Task | Estado | Resultado esperado |
|---|---|---|
| F1-T1 Inventario canonico 121/121 + cobertura base | ✅ | Base unica de seguimiento pantalla a pantalla |
| F1-T2 Reabrir cierres no validados en runtime | ✅ | Estado real alineado con funcionamiento |
| F1-T3 Priorizacion por impacto de usuario | ✅ | Orden de ejecucion sin desviaciones |

## Fase 2 — Plataforma comun (backend + auth + contratos)
| Task | Estado | Resultado esperado |
|---|---|---|
| F2-T1 Auth real de sesion (email/password + Apple) | ✅ | Sesion valida para Web+iOS sin bypass |
| F2-T2 RBAC por endpoint y dominio | ✅ | Permisos consistentes por rol |
| F2-T3 Persistencia real (Firestore) sin in-memory | ✅ | Datos durables end-to-end |
| F2-T4 Errores observables (codigos + correlationId) | ✅ | Debug y soporte operativos |

## Fase 3 — iOS (pantalla a pantalla)

### Task 3.1 — iOS — Ajustes + Legal + Cuenta / IOS_SETTINGS_DARK_LANE
- Total pantallas en este bloque: **6**
| Subtask | Pantalla | ID | Estado | Ruta | API/Datos | Accion | Estados UI | Test | Captura |
|---|---|---|---|---|---|---|---|---|---|
| 3.1.1 | IOS-300_SETTINGS_HOME | `NYW4c` | ✅ | `operationsTab -> settings.route.home -> settings.home.screen` | `PersistentUserSettingsRepository` (UserDefaults durable por usuario) | Guardar ajustes (`settings.home.save`) | loading|empty|error|saved|denied|offline | ✅ `SettingsHomeViewModelTests` | ✅ ruta+pantalla instrumentadas (`settings.route.home`, `settings.home.screen`) |
| 3.1.2 | IOS-310_ACCOUNT_PROFILE | `p0VPd` | ✅ | `operationsTab -> settings.route.home -> settings.route.accountProfile -> account.profile.screen` | `PersistentUserProfileRepository` (UserDefaults durable por usuario) | Guardar perfil (`account.profile.save`) | loading|empty|error|saved|denied|offline | ✅ `AccountProfileViewModelTests` | ✅ ruta+pantalla instrumentadas (`settings.route.accountProfile`, `account.profile.screen`) |
| 3.1.3 | IOS-320_NOTIFICATIONS | `Gn4vx` | ✅ | `operationsTab -> settings.route.home -> settings.route.notifications -> notifications.screen` | `PersistentUserSettingsRepository` (UserDefaults durable por usuario) | Guardar notificaciones (`notifications.save`) | loading|empty|error|saved|denied|offline | ✅ `NotificationsViewModelTests` | ✅ ruta+pantalla instrumentadas (`settings.route.notifications`, `notifications.screen`) |
| 3.1.4 | IOS-330_PRIVACY_CONSENT | `kWob7` | ✅ | `operationsTab -> settings.route.home -> settings.route.privacyConsent -> privacy.screen` | `PersistentUserLegalConsentRepository` (UserDefaults durable por usuario) | Guardar consentimiento (`privacy.save`) | loading|empty|error|saved|consent_required|denied|offline | ✅ `PrivacyConsentViewModelTests` | ✅ ruta+pantalla instrumentadas (`settings.route.privacyConsent`, `privacy.screen`) |
| 3.1.5 | IOS-340_EXPORT_DATA | `ziKNA` | ✅ | `operationsTab -> settings.route.home -> settings.route.exportData -> export.screen` | `ExportUserDataUseCase` con repositorios persistentes (`PersistentUserProfileRepository`, `PersistentUserSettingsRepository`, `PersistentUserLegalConsentRepository`) | Exportar snapshot JSON (`export.action`) | loading|empty|error|exported|validation_error|denied|offline | ✅ `ExportDataViewModelTests` | ✅ ruta+pantalla instrumentadas (`settings.route.exportData`, `export.screen`) |
| 3.1.6 | IOS-350_DELETE_ACCOUNT | `jOlGb` | ✅ | `operationsTab -> settings.route.home -> settings.route.deleteAccount -> delete.screen` | `PersistentAccountDeletionRequestRepository` + verificacion legal con `PersistentUserLegalConsentRepository` | Solicitar borrado (`delete.request`) | loading|empty|error|deletion_requested|consent_required|validation_error|denied|offline | ✅ `DeleteAccountViewModelTests` | ✅ ruta+pantalla instrumentadas (`settings.route.deleteAccount`, `delete.screen`) |

### Task 3.2 — iOS — Ajustes + Legal + Cuenta / IOS_SETTINGS_LIGHT_LANE
- Total pantallas en este bloque: **6**
| Subtask | Pantalla | ID | Estado | Ruta | API/Datos | Accion | Estados UI | Test | Captura |
|---|---|---|---|---|---|---|---|---|---|
| 3.2.1 | IOS-L-300_SETTINGS_HOME | `71ReZ` | ✅ | `operationsTab -> settings.route.homeLight -> settings.home.light.screen` | `PersistentUserSettingsRepository` (UserDefaults durable por usuario) | Guardar ajustes (`settings.home.save`) | loading|empty|error|saved|denied|offline | ✅ `SettingsHomeViewModelTests` + `SettingsRouteContractTests` | ✅ ruta+pantalla instrumentadas (`settings.route.homeLight`, `settings.home.light.screen`) |
| 3.2.2 | IOS-L-310_ACCOUNT_PROFILE | `OEJ8u` | ✅ | `operationsTab -> settings.route.homeLight -> settings.route.accountProfileLight -> account.profile.light.screen` | `PersistentUserProfileRepository` (UserDefaults durable por usuario) | Guardar perfil (`account.profile.save`) | loading|empty|error|saved|denied|offline | ✅ `AccountProfileViewModelTests` + `SettingsRouteContractTests` | ✅ ruta+pantalla instrumentadas (`settings.route.accountProfileLight`, `account.profile.light.screen`) |
| 3.2.3 | IOS-L-320_NOTIFICATIONS | `grez9` | ✅ | `operationsTab -> settings.route.homeLight -> settings.route.notificationsLight -> notifications.light.screen` | `PersistentUserSettingsRepository` (UserDefaults durable por usuario) | Guardar notificaciones (`notifications.save`) | loading|empty|error|saved|denied|offline | ✅ `NotificationsViewModelTests` + `SettingsRouteContractTests` | ✅ ruta+pantalla instrumentadas (`settings.route.notificationsLight`, `notifications.light.screen`) |
| 3.2.4 | IOS-L-330_PRIVACY_CONSENT | `IwwYi` | ✅ | `operationsTab -> settings.route.homeLight -> settings.route.privacyConsentLight -> privacy.light.screen` | `PersistentUserLegalConsentRepository` (UserDefaults durable por usuario) | Guardar consentimiento (`privacy.save`) | loading|empty|error|saved|consent_required|denied|offline | ✅ `PrivacyConsentViewModelTests` + `SettingsRouteContractTests` | ✅ ruta+pantalla instrumentadas (`settings.route.privacyConsentLight`, `privacy.light.screen`) |
| 3.2.5 | IOS-L-340_EXPORT_DATA | `i9ChT` | ✅ | `operationsTab -> settings.route.homeLight -> settings.route.exportDataLight -> export.light.screen` | `ExportUserDataUseCase` con repositorios persistentes (`PersistentUserProfileRepository`, `PersistentUserSettingsRepository`, `PersistentUserLegalConsentRepository`) | Exportar snapshot JSON (`export.action`) | loading|empty|error|exported|validation_error|denied|offline | ✅ `ExportDataViewModelTests` + `SettingsRouteContractTests` | ✅ ruta+pantalla instrumentadas (`settings.route.exportDataLight`, `export.light.screen`) |
| 3.2.6 | IOS-L-350_DELETE_ACCOUNT | `Vl2lO` | ✅ | `operationsTab -> settings.route.homeLight -> settings.route.deleteAccountLight -> delete.light.screen` | `PersistentAccountDeletionRequestRepository` + verificacion legal con `PersistentUserLegalConsentRepository` | Solicitar borrado (`delete.request`) | loading|empty|error|deletion_requested|consent_required|validation_error|denied|offline | ✅ `DeleteAccountViewModelTests` + `SettingsRouteContractTests` | ✅ ruta+pantalla instrumentadas (`settings.route.deleteAccountLight`, `delete.light.screen`) |

### Task 3.3 — iOS — Auth + Onboarding + Consentimiento / IOS_AUTH_DARK_LANE
- Total pantallas en este bloque: **7**
| Subtask | Pantalla | ID | Estado | Ruta | API/Datos | Accion | Estados UI | Test | Captura |
|---|---|---|---|---|---|---|---|---|---|
| 3.3.1 | IOS-000_WELCOME | `S7IgQ` | ✅ | `todayTab -> auth.route.welcome -> auth.welcome.screen` | `CreateAuthSessionUseCase` via `AuthViewModel` (gateway real/demo según configuración) | Iniciar con Apple (`auth.welcome.signInApple`) | loading|idle|auth_error|offline|denied|signed_in | ✅ `AuthViewModelTests` + `AuthRouteContractTests` | ✅ ruta+pantalla instrumentadas (`auth.route.welcome`, `auth.welcome.screen`) |
| 3.3.2 | IOS-010_EMAIL_LOGIN | `VN60f` | ✅ | `todayTab -> auth.route.emailLogin -> auth.emailLogin.screen` | `CreateAuthSessionUseCase` via `AuthViewModel` (gateway real/demo según configuración) | Iniciar con email (`auth.emailLogin.signIn`) | loading|validation_error|auth_error|offline|denied|signed_in|recovery_sent_* | ✅ `AuthViewModelTests` + `AuthRouteContractTests` | ✅ ruta+pantalla instrumentadas (`auth.route.emailLogin`, `auth.emailLogin.screen`) |
| 3.3.3 | IOS-020_APPLE_HANDOFF | `cvgmi` | ✅ | `todayTab -> auth.route.appleHandoff -> auth.appleHandoff.screen` | `CreateAuthSessionUseCase` via `AuthViewModel` (gateway real/demo según configuración) | Continuar con Apple (`auth.appleHandoff.continue`) | loading|auth_error|offline|denied|signed_in | ✅ `AuthViewModelTests` + `AuthRouteContractTests` | ✅ ruta+pantalla instrumentadas (`auth.route.appleHandoff`, `auth.appleHandoff.screen`) |
| 3.3.4 | IOS-030_ONBOARDING_STEP1 | `CwA65` | ✅ | `todayTab -> onboarding.route.step1 -> onboarding.step1.screen` | `OnboardingViewModel` (estado local + validacion de perfil base) | Continuar (`onboarding.step1.continue`) | idle|validation_error|saved|denied|offline | ✅ `OnboardingViewModelTests` + `OnboardingRouteContractTests` | ✅ ruta+pantalla instrumentadas (`onboarding.route.step1`, `onboarding.step1.screen`) |
| 3.3.5 | IOS-035_GOAL_SETUP | `Etv92` | ✅ | `todayTab -> onboarding.route.goalSetup -> onboarding.goalSetup.screen` | `OnboardingViewModel` (estado local con validacion de objetivo, sesiones/semana y duracion de sesion) | Guardar objetivo (`onboarding.goalSetup.saveGoal`) | idle|validation_error|success|denied|offline | ✅ `OnboardingViewModelTests` + `OnboardingRouteContractTests` | ✅ ruta+pantalla instrumentadas (`onboarding.route.goalSetup`, `onboarding.goalSetup.screen`) |
| 3.3.6 | IOS-040_PARQ | `gELT9` | ✅ | `todayTab -> onboarding.route.parQ -> onboarding.parQ.screen` | `OnboardingViewModel` (captura respuestas PAR-Q y serializacion a `parQResponses`) | Guardar PAR-Q (`onboarding.parq.continue`) | loading|success|denied|offline | ✅ `OnboardingViewModelTests` + `OnboardingRouteContractTests` | ✅ ruta+pantalla instrumentadas (`onboarding.route.parQ`, `onboarding.parQ.screen`) |
| 3.3.7 | IOS-050_CONSENT | `7OVvP` | ✅ | `todayTab -> onboarding.route.consent -> onboarding.consent.screen` | `OnboardingViewModel` (captura checklist legal y validacion de consentimiento completo) | Aceptar y continuar (`onboarding.consent.acceptContinue`) | loading|success|consent_required|denied|offline | ✅ `OnboardingViewModelTests` + `OnboardingRouteContractTests` | ✅ ruta+pantalla instrumentadas (`onboarding.route.consent`, `onboarding.consent.screen`) |

### Task 3.4 — iOS — Auth + Onboarding + Consentimiento / IOS_AUTH_DARK_STATES_LANE
- Total pantallas en este bloque: **3**
| Subtask | Pantalla | ID | Estado | Ruta | API/Datos | Accion | Estados UI | Test | Captura |
|---|---|---|---|---|---|---|---|---|---|
| 3.4.1 | IOS-060_OTP_VERIFY | `z5fJs` | ✅ | `todayTab -> auth.route.otpVerify -> auth.otpVerify.screen` | `AuthViewModel` (validacion OTP de 6 digitos + reenvio) | Verificar codigo (`auth.otp.verify`) | loading|validation_error|success|denied|offline|recovery_sent_sms | ✅ `AuthViewModelTests` + `AuthRouteContractTests` | ✅ ruta+pantalla instrumentadas (`auth.route.otpVerify`, `auth.otpVerify.screen`) |
| 3.4.2 | IOS-070_RECOVER_ACCOUNT | `pM6WG` | ✅ | `todayTab -> auth.route.recoverAccount -> auth.recoverAccount.screen` | `AuthViewModel` (recuperacion por canal email/SMS + escalado a soporte) | Continuar recuperacion (`auth.recover.continue`) | loading|validation_error|recovery_sent_email|recovery_sent_sms|open|denied|offline | ✅ `AuthViewModelTests` + `AuthRouteContractTests` | ✅ ruta+pantalla instrumentadas (`auth.route.recoverAccount`, `auth.recoverAccount.screen`) |
| 3.4.3 | IOS-080_SESSION_EXPIRED | `fjohT` | ✅ | `todayTab -> auth.route.sessionExpired -> auth.sessionExpired.screen` | `AuthViewModel` (expiracion de sesion con limpieza de credenciales y salida controlada) | Volver a login u abrir modo offline (`auth.sessionExpired.backToSignIn`, `auth.sessionExpired.openOfflineMode`) | loading|session_expired|signed_out|offline|denied|auth_error | ✅ `AuthViewModelTests` + `AuthRouteContractTests` | ✅ ruta+pantalla instrumentadas (`auth.route.sessionExpired`, `auth.sessionExpired.screen`) |

### Task 3.5 — iOS — Auth + Onboarding + Consentimiento / IOS_AUTH_LIGHT_LANE
- Total pantallas en este bloque: **7**
| Subtask | Pantalla | ID | Estado | Ruta | API/Datos | Accion | Estados UI | Test | Captura |
|---|---|---|---|---|---|---|---|---|---|
| 3.5.1 | IOS-L-000_WELCOME | `7XnQm` | ✅ | `todayTab -> auth.route.welcomeLight -> auth.welcome.light.screen` | `CreateAuthSessionUseCase` via `AuthViewModel` (gateway real/demo segun configuracion) | Iniciar con Apple (`auth.welcome.signInApple`) | loading|idle|auth_error|offline|denied|signed_in | ✅ `AuthViewModelTests` + `AuthRouteContractTests` | ✅ ruta+pantalla instrumentadas (`auth.route.welcomeLight`, `auth.welcome.light.screen`) |
| 3.5.2 | IOS-L-010_EMAIL_LOGIN | `1TUiW` | ✅ | `todayTab -> auth.route.emailLoginLight -> auth.emailLogin.light.screen` | `CreateAuthSessionUseCase` via `AuthViewModel` (gateway real/demo segun configuracion) | Iniciar con email + recuperar por email/SMS (`auth.emailLogin.signIn`, `auth.emailLogin.recoverEmail`, `auth.emailLogin.recoverSMS`) | loading|validation_error|auth_error|offline|denied|signed_in|recovery_sent_email|recovery_sent_sms | ✅ `AuthViewModelTests` + `AuthRouteContractTests` | ✅ ruta+pantalla instrumentadas (`auth.route.emailLoginLight`, `auth.emailLogin.light.screen`) |
| 3.5.3 | IOS-L-020_APPLE_HANDOFF | `Ejf4g` | ✅ | `todayTab -> auth.route.appleHandoffLight -> auth.appleHandoff.light.screen` | `CreateAuthSessionUseCase` via `AuthViewModel` (gateway real/demo segun configuracion) | Continuar con Apple (`auth.appleHandoff.continue`) | loading|auth_error|offline|denied|signed_in | ✅ `AuthViewModelTests` + `AuthRouteContractTests` | ✅ ruta+pantalla instrumentadas (`auth.route.appleHandoffLight`, `auth.appleHandoff.light.screen`) |
| 3.5.4 | IOS-L-030_ONBOARDING | `k7vkz` | ✅ | `todayTab -> onboarding.route.step1Light -> onboarding.step1.light.screen` | `OnboardingViewModel` (estado local + validacion de perfil base) | Continuar (`onboarding.step1.continue`) | idle|validation_error|saved|denied|offline | ✅ `OnboardingViewModelTests` + `OnboardingRouteContractTests` | ✅ ruta+pantalla instrumentadas (`onboarding.route.step1Light`, `onboarding.step1.light.screen`) |
| 3.5.5 | IOS-L-035_GOAL_SETUP | `BhWmn` | ✅ | `todayTab -> onboarding.route.goalSetupLight -> onboarding.goalSetup.light.screen` | `OnboardingViewModel` (estado local con validacion de objetivo, sesiones/semana y duracion de sesion) | Guardar objetivo (`onboarding.goalSetup.saveGoal`) | idle|validation_error|success|denied|offline | ✅ `OnboardingViewModelTests` + `OnboardingRouteContractTests` | ✅ ruta+pantalla instrumentadas (`onboarding.route.goalSetupLight`, `onboarding.goalSetup.light.screen`) |
| 3.5.6 | IOS-L-040_PARQ | `9TB4b` | ✅ | `todayTab -> onboarding.route.parQLight -> onboarding.parQ.light.screen` | `OnboardingViewModel` (captura respuestas PAR-Q y serializacion a `parQResponses`) | Guardar PAR-Q (`onboarding.parq.continue`) | loading|success|denied|offline | ✅ `OnboardingViewModelTests` + `OnboardingRouteContractTests` | ✅ ruta+pantalla instrumentadas (`onboarding.route.parQLight`, `onboarding.parQ.light.screen`) |
| 3.5.7 | IOS-L-050_CONSENT | `2AbfS` | ✅ | `todayTab -> onboarding.route.consentLight -> onboarding.consent.light.screen` | `OnboardingViewModel` (captura checklist legal y validacion de consentimiento completo) | Aceptar y continuar (`onboarding.consent.acceptContinue`) | loading|success|consent_required|denied|offline | ✅ `OnboardingViewModelTests` + `OnboardingRouteContractTests` | ✅ ruta+pantalla instrumentadas (`onboarding.route.consentLight`, `onboarding.consent.light.screen`) |

### Task 3.6 — iOS — Auth + Onboarding + Consentimiento / IOS_AUTH_LIGHT_STATES_LANE
- Total pantallas en este bloque: **3**
| Subtask | Pantalla | ID | Estado | Ruta | API/Datos | Accion | Estados UI | Test | Captura |
|---|---|---|---|---|---|---|---|---|---|
| 3.6.1 | IOS-L-060_OTP_VERIFY | `7CA6Q` | ✅ | `todayTab -> auth.route.otpVerifyLight -> auth.otpVerify.light.screen` | `AuthViewModel` (validacion OTP de 6 digitos + reenvio) | Verificar codigo (`auth.otp.verify`) | loading|validation_error|success|denied|offline|recovery_sent_sms | ✅ `AuthViewModelTests` + `AuthRouteContractTests` | ✅ ruta+pantalla instrumentadas (`auth.route.otpVerifyLight`, `auth.otpVerify.light.screen`) |
| 3.6.2 | IOS-L-070_RECOVER_ACCOUNT | `Dt3aX` | ✅ | `todayTab -> auth.route.recoverAccountLight -> auth.recoverAccount.light.screen` | `AuthViewModel` (recuperacion por canal email/SMS + escalado a soporte) | Continuar recuperacion (`auth.recover.continue`) | loading|validation_error|recovery_sent_email|recovery_sent_sms|open|denied|offline | ✅ `AuthViewModelTests` + `AuthRouteContractTests` | ✅ ruta+pantalla instrumentadas (`auth.route.recoverAccountLight`, `auth.recoverAccount.light.screen`) |
| 3.6.3 | IOS-L-080_SESSION_EXPIRED | `Cj6j4` | ✅ | `todayTab -> auth.route.sessionExpiredLight -> auth.sessionExpired.light.screen` | `AuthViewModel` (expiracion de sesion con limpieza de credenciales y salida controlada) | Volver a login u abrir modo offline (`auth.sessionExpired.backToSignIn`, `auth.sessionExpired.openOfflineMode`) | loading|session_expired|signed_out|offline|denied|auth_error | ✅ `AuthViewModelTests` + `AuthRouteContractTests` | ✅ ruta+pantalla instrumentadas (`auth.route.sessionExpiredLight`, `auth.sessionExpired.light.screen`) |

### Task 3.7 — iOS — Video de ejercicios y sustituciones / IOS_EXERCISE_VIDEO_DARK_LANE
- Total pantallas en este bloque: **5**
| Subtask | Pantalla | ID | Estado | Ruta | API/Datos | Accion | Estados UI | Test | Captura |
|---|---|---|---|---|---|---|---|---|---|
| 3.7.1 | IOS-005a_InWorkout_Setup | `SyFcm` | ✅ | `todayTab -> training.route.inWorkoutSetup -> training.inWorkoutSetup.screen` | `ListTrainingPlansUseCase` + `ListWorkoutSessionsUseCase` + `ListExerciseVideosUseCase` (repositorio real/configurado) | Preparar sesion (`training.inWorkoutSetup.prepare`) | loading|empty|error|saved|denied|offline | ✅ `TrainingFlowViewModelTests` + `TrainingRouteContractTests` | ✅ ruta+pantalla instrumentadas (`training.route.inWorkoutSetup`, `training.inWorkoutSetup.screen`) |
| 3.7.2 | IOS-005b_RPE_Rating | `J6XiL` | ✅ | `todayTab -> training.route.rpeRating -> training.rpeRating.screen` | `ListTrainingPlansUseCase` + `CreateWorkoutSessionUseCase` + `ListWorkoutSessionsUseCase` (repositorio real/configurado) | Guardar RPE (`training.rpe.submit`) | loading|empty|error|saved|denied|offline | ✅ `TrainingFlowViewModelTests` + `TrainingRouteContractTests` | ✅ ruta+pantalla instrumentadas (`training.route.rpeRating`, `training.rpeRating.screen`) |
| 3.7.3 | IOS-006_Substitution | `2wmCB` | ✅ | `todayTab -> training.route.substitution -> training.substitution.screen` | `ListTrainingPlansUseCase` + `CreateWorkoutSessionUseCase` + `ListWorkoutSessionsUseCase` + `ListExerciseVideosUseCase` (repositorio real/configurado) | Aplicar sustitucion (`training.substitution.apply`) | loading|empty|error|saved|denied|offline | ✅ `TrainingFlowViewModelTests` + `TrainingRouteContractTests` | ✅ ruta+pantalla instrumentadas (`training.route.substitution`, `training.substitution.screen`) |
| 3.7.4 | IOS-007a_ExerciseLibrary | `MhmXQ` | ✅ | `todayTab -> training.route.exerciseLibrary -> training.exerciseLibrary.screen` | `ListTrainingPlansUseCase` + `ListExerciseVideosUseCase` (repositorio real/configurado) | Cargar biblioteca (`training.library.load`) | loading|empty|error|loaded|denied|offline | ✅ `TrainingFlowViewModelTests` + `TrainingRouteContractTests` | ✅ ruta+pantalla instrumentadas (`training.route.exerciseLibrary`, `training.exerciseLibrary.screen`) |
| 3.7.5 | IOS-007b_VideoPlayer | `PjypK` | ✅ | `todayTab -> training.route.videoPlayer -> training.videoPlayer.screen` | `ListTrainingPlansUseCase` + `ListExerciseVideosUseCase` (repositorio real/configurado) | Cargar y reproducir video (`training.videoPlayer.load`, `training.videoPlayer.play`) | loading|empty|error|success|denied|offline | ✅ `TrainingFlowViewModelTests` + `TrainingRouteContractTests` | ✅ ruta+pantalla instrumentadas (`training.route.videoPlayer`, `training.videoPlayer.screen`) |

### Task 3.8 — iOS — Video de ejercicios y sustituciones / IOS_EXERCISE_VIDEO_LIGHT_LANE
- Total pantallas en este bloque: **5**
| Subtask | Pantalla | ID | Estado | Ruta | API/Datos | Accion | Estados UI | Test | Captura |
|---|---|---|---|---|---|---|---|---|---|
| 3.8.1 | IOS-L-005a_InWorkout | `TGvot` | ✅ | `todayTab -> training.route.inWorkoutSetupLight -> training.inWorkoutSetup.light.screen` | `ListTrainingPlansUseCase` + `ListWorkoutSessionsUseCase` + `ListExerciseVideosUseCase` (repositorio real/configurado) | Preparar sesion light (`training.inWorkoutSetup.prepare`) | loading|empty|error|saved|denied|offline | ✅ `TrainingFlowViewModelTests` + `TrainingRouteContractTests` | ✅ ruta+pantalla instrumentadas (`training.route.inWorkoutSetupLight`, `training.inWorkoutSetup.light.screen`) |
| 3.8.2 | IOS-L-005b_RPE | `fk66m` | ✅ | `todayTab -> training.route.rpeRatingLight -> training.rpeRating.light.screen` | `ListTrainingPlansUseCase` + `CreateWorkoutSessionUseCase` + `ListWorkoutSessionsUseCase` (repositorio real/configurado) | Guardar RPE light (`training.rpe.submit`) | loading|empty|error|saved|denied|offline | ✅ `TrainingFlowViewModelTests` + `TrainingRouteContractTests` | ✅ ruta+pantalla instrumentadas (`training.route.rpeRatingLight`, `training.rpeRating.light.screen`) |
| 3.8.3 | IOS-L-006_Substitution | `DDfx4` | ✅ | `todayTab -> training.route.substitutionLight -> training.substitution.light.screen` | `ListTrainingPlansUseCase` + `CreateWorkoutSessionUseCase` + `ListWorkoutSessionsUseCase` + `ListExerciseVideosUseCase` (repositorio real/configurado) | Aplicar sustitucion light (`training.substitution.apply`) | loading|empty|error|saved|denied|offline | ✅ `TrainingFlowViewModelTests` + `TrainingRouteContractTests` | ✅ ruta+pantalla instrumentadas (`training.route.substitutionLight`, `training.substitution.light.screen`) |
| 3.8.4 | IOS-L-007a_Library | `GXtj7` | ✅ | `todayTab -> training.route.exerciseLibraryLight -> training.exerciseLibrary.light.screen` | `ListTrainingPlansUseCase` + `ListExerciseVideosUseCase` (repositorio real/configurado) | Cargar biblioteca light (`training.library.load`) | loading|empty|error|loaded|denied|offline | ✅ `TrainingFlowViewModelTests` + `TrainingRouteContractTests` | ✅ ruta+pantalla instrumentadas (`training.route.exerciseLibraryLight`, `training.exerciseLibrary.light.screen`) |
| 3.8.5 | IOS-L-007b_VideoPlayer | `u8Peg` | ✅ | `todayTab -> training.route.videoPlayerLight -> training.videoPlayer.light.screen` | `ListTrainingPlansUseCase` + `ListExerciseVideosUseCase` (repositorio real/configurado) | Cargar y reproducir video light (`training.videoPlayer.load`, `training.videoPlayer.play`) | loading|empty|error|success|denied|offline | ✅ `TrainingFlowViewModelTests` + `TrainingRouteContractTests` | ✅ ruta+pantalla instrumentadas (`training.route.videoPlayerLight`, `training.videoPlayer.light.screen`) |

### Task 3.9 — iOS — Progreso + Nutrición + IA Coach / IOS_NUTRITION_DARK_LANE
- Total pantallas en este bloque: **6**
| Subtask | Pantalla | ID | Estado | Ruta | API/Datos | Accion | Estados UI | Test | Captura |
|---|---|---|---|---|---|---|---|---|---|
| 3.9.1 | IOS-200_NUTRITION_HUB | `Kw7X7` | ✅ | `todayTab -> nutrition.route.hub -> nutrition.hub.screen` | `CreateNutritionLogUseCase` + `ListNutritionLogsUseCase` (repositorio real/configurado) | Guardar/cargar nutricion (`nutrition.hub.save`, `nutrition.hub.load`) | loading|empty|error|saved|loaded|denied|offline | ✅ `NutritionViewModelTests` + `NutritionRouteContractTests` | ✅ ruta+pantalla instrumentadas (`nutrition.route.hub`, `nutrition.hub.screen`) |
| 3.9.2 | IOS-210_LOG_MEAL | `ljPEw` | ✅ | `todayTab -> nutrition.route.logMeal -> nutrition.logMeal.screen` | `CreateNutritionLogUseCase` (repositorio real/configurado) | Guardar comida (`nutrition.logMeal.save`) | loading|error|saved|validation_error|denied|offline | ✅ `NutritionViewModelTests` + `NutritionRouteContractTests` | ✅ ruta+pantalla instrumentadas (`nutrition.route.logMeal`, `nutrition.logMeal.screen`) |
| 3.9.3 | IOS-220_PROGRESS_METRICS | `cIytS` | ✅ | `todayTab -> progress.route.metrics -> progress.metrics.screen` | `BuildProgressSummaryUseCase` (repositorios reales/configurados) | Cargar metricas (`progress.metrics.load`) | loading|empty|error|loaded|validation_error|denied|offline | ✅ `ProgressViewModelTests` + `ProgressRouteContractTests` | ✅ ruta+pantalla instrumentadas (`progress.route.metrics`, `progress.metrics.screen`) |
| 3.9.4 | IOS-230_GOAL_ADJUST | `uzaX9` | ✅ | `todayTab -> progress.route.goalAdjust -> progress.goalAdjust.screen` | `OnboardingViewModel.saveGoalSetup` (estado real y validacion) | Ajustar objetivo (`progress.goalAdjust.save`) | loading|validation_error|success|denied|offline | ✅ `OnboardingViewModelTests` + `ProgressRouteContractTests` | ✅ ruta+pantalla instrumentadas (`progress.route.goalAdjust`, `progress.goalAdjust.screen`) |
| 3.9.5 | IOS-240_AI_COACH | `vJNXu` | ✅ | `todayTab -> progress.route.aiCoach -> progress.aiCoach.screen` | `GenerateAIRecommendationsUseCase` (recomendaciones dinamicas por objetivo/adherencia/cola) | Cargar recomendaciones (`aiCoach.load`) | loading|empty|error|loaded|validation_error|denied|offline | ✅ `GenerateAIRecommendationsUseCaseTests` + `ProgressRouteContractTests` | ✅ ruta+pantalla instrumentadas (`progress.route.aiCoach`, `progress.aiCoach.screen`) |
| 3.9.6 | IOS-250_WEEKLY_REVIEW | `mlEPR` | ✅ | `todayTab -> progress.route.weeklyReview -> progress.weeklyReview.screen` | `ProgressViewModel` + `TrainingFlowViewModel` + `NutritionViewModel` (refresh paralelo real) | Refrescar review semanal (`progress.weeklyReview.refresh`) | loading|empty|error|loaded|validation_error|denied|offline | ✅ `ProgressViewModelTests` + `TrainingFlowViewModelTests` + `ProgressRouteContractTests` | ✅ ruta+pantalla instrumentadas (`progress.route.weeklyReview`, `progress.weeklyReview.screen`) |

### Task 3.10 — iOS — Progreso + Nutrición + IA Coach / IOS_NUTRITION_LIGHT_LANE
- Total pantallas en este bloque: **6**
| Subtask | Pantalla | ID | Estado | Ruta | API/Datos | Accion | Estados UI | Test | Captura |
|---|---|---|---|---|---|---|---|---|---|
| 3.10.1 | IOS-L-200_NUTRITION_HUB | `k5Ms0` | ✅ | `todayTab -> nutrition.route.hubLight -> nutrition.hub.light.screen` | `CreateNutritionLogUseCase` + `ListNutritionLogsUseCase` (repositorio real/configurado) | Guardar/cargar nutricion light (`nutrition.hub.save`, `nutrition.hub.load`) | loading|empty|error|saved|loaded|denied|offline | ✅ `NutritionViewModelTests` + `NutritionRouteContractTests` | ✅ ruta+pantalla instrumentadas (`nutrition.route.hubLight`, `nutrition.hub.light.screen`) |
| 3.10.2 | IOS-L-210_LOG_MEAL | `mNfTu` | 🚧 | por_definir | por_definir | por_definir | loading|empty|error|success|denied|offline | ⏳ | ⏳ |
| 3.10.3 | IOS-L-220_PROGRESS_METRICS | `zMn7o` | ⏳ | por_definir | por_definir | por_definir | loading|empty|error|success|denied|offline | ⏳ | ⏳ |
| 3.10.4 | IOS-L-230_GOAL_ADJUST | `4ShGc` | ⏳ | por_definir | por_definir | por_definir | loading|empty|error|success|denied|offline | ⏳ | ⏳ |
| 3.10.5 | IOS-L-240_AI_COACH | `fhGwk` | ⏳ | por_definir | por_definir | por_definir | loading|empty|error|success|denied|offline | ⏳ | ⏳ |
| 3.10.6 | IOS-L-250_WEEKLY_REVIEW | `P4ISc` | ⏳ | por_definir | por_definir | por_definir | loading|empty|error|success|denied|offline | ⏳ | ⏳ |

### Task 3.11 — iOS — Today + Entrenamiento + Sesión / IOS_TRAINING_DARK_LANE
- Total pantallas en este bloque: **6**
| Subtask | Pantalla | ID | Estado | Ruta | API/Datos | Accion | Estados UI | Test | Captura |
|---|---|---|---|---|---|---|---|---|---|
| 3.11.1 | IOS-100_TODAY | `JNePm` | ⏳ | por_definir | por_definir | por_definir | loading|empty|error|success|denied|offline | ⏳ | ⏳ |
| 3.11.2 | IOS-110_PLAN_ACTIVE | `dXK7d` | ⏳ | por_definir | por_definir | por_definir | loading|empty|error|success|denied|offline | ⏳ | ⏳ |
| 3.11.3 | IOS-120_SESSION_SETUP | `A0a4R` | ⏳ | por_definir | por_definir | por_definir | loading|empty|error|success|denied|offline | ⏳ | ⏳ |
| 3.11.4 | IOS-130_WORKOUT_ACTIVE | `L2ntB` | ⏳ | por_definir | por_definir | por_definir | loading|empty|error|success|denied|offline | ⏳ | ⏳ |
| 3.11.5 | IOS-140_EXERCISE_VIDEO | `kQ5o5` | ⏳ | por_definir | por_definir | por_definir | loading|empty|error|success|denied|offline | ⏳ | ⏳ |
| 3.11.6 | IOS-150_SESSION_SUMMARY | `uixTO` | ⏳ | por_definir | por_definir | por_definir | loading|empty|error|success|denied|offline | ⏳ | ⏳ |

### Task 3.12 — iOS — Today + Entrenamiento + Sesión / IOS_TRAINING_LIGHT_LANE
- Total pantallas en este bloque: **6**
| Subtask | Pantalla | ID | Estado | Ruta | API/Datos | Accion | Estados UI | Test | Captura |
|---|---|---|---|---|---|---|---|---|---|
| 3.12.1 | IOS-L-100_TODAY | `J3gTv` | ⏳ | por_definir | por_definir | por_definir | loading|empty|error|success|denied|offline | ⏳ | ⏳ |
| 3.12.2 | IOS-L-110_PLAN_ACTIVE | `rYRMf` | ⏳ | por_definir | por_definir | por_definir | loading|empty|error|success|denied|offline | ⏳ | ⏳ |
| 3.12.3 | IOS-L-120_SESSION_SETUP | `VV9H2` | ⏳ | por_definir | por_definir | por_definir | loading|empty|error|success|denied|offline | ⏳ | ⏳ |
| 3.12.4 | IOS-L-130_WORKOUT_ACTIVE | `1sJe4` | ⏳ | por_definir | por_definir | por_definir | loading|empty|error|success|denied|offline | ⏳ | ⏳ |
| 3.12.5 | IOS-L-140_EXERCISE_VIDEO | `yXWvE` | ⏳ | por_definir | por_definir | por_definir | loading|empty|error|success|denied|offline | ⏳ | ⏳ |
| 3.12.6 | IOS-L-150_SESSION_SUMMARY | `RDysi` | ⏳ | por_definir | por_definir | por_definir | loading|empty|error|success|denied|offline | ⏳ | ⏳ |

## Fase 4 — Web (pantalla a pantalla)

### Task 4.1 — Web — Acceso y Dashboard operativo / WEB_ACCESS_MAIN_LANE
- Total pantallas en este bloque: **6**
| Subtask | Pantalla | ID | Estado | Ruta | API/Datos | Accion | Estados UI | Test | Captura |
|---|---|---|---|---|---|---|---|---|---|
| 4.1.1 | WEB-000_ACCESS_GATE | `f3ZUN` | ⏳ | por_definir | por_definir | por_definir | loading|empty|error|success|denied|offline | ⏳ | ⏳ |
| 4.1.2 | WEB-010_SIGN_IN | `u0Exo` | ⏳ | por_definir | por_definir | por_definir | loading|empty|error|success|denied|offline | ⏳ | ⏳ |
| 4.1.3 | WEB-020_DASHBOARD_HOME | `fAOUV` | ⏳ | por_definir | por_definir | por_definir | loading|empty|error|success|denied|offline | ⏳ | ⏳ |
| 4.1.4 | WEB-030_QUICK_ACTIONS | `xJyx8` | ⏳ | por_definir | por_definir | por_definir | loading|empty|error|success|denied|offline | ⏳ | ⏳ |
| 4.1.5 | WEB-040_ALERT_CENTER | `WmuDh` | ⏳ | por_definir | por_definir | por_definir | loading|empty|error|success|denied|offline | ⏳ | ⏳ |
| 4.1.6 | WEB-050_SYSTEM_STATUS | `7tRaG` | ⏳ | por_definir | por_definir | por_definir | loading|empty|error|success|denied|offline | ⏳ | ⏳ |

### Task 4.2 — Web — Acceso y Dashboard operativo / WEB_ACCESS_SECONDARY_LANE
- Total pantallas en este bloque: **6**
| Subtask | Pantalla | ID | Estado | Ruta | API/Datos | Accion | Estados UI | Test | Captura |
|---|---|---|---|---|---|---|---|---|---|
| 4.2.1 | WEB-L-000_ACCESS_GATE | `0nOxO` | ⏳ | por_definir | por_definir | por_definir | loading|empty|error|success|denied|offline | ⏳ | ⏳ |
| 4.2.2 | WEB-L-010_SIGN_IN | `SEEJU` | ⏳ | por_definir | por_definir | por_definir | loading|empty|error|success|denied|offline | ⏳ | ⏳ |
| 4.2.3 | WEB-L-020_DASHBOARD_HOME | `WrrZF` | ⏳ | por_definir | por_definir | por_definir | loading|empty|error|success|denied|offline | ⏳ | ⏳ |
| 4.2.4 | WEB-L-030_QUICK_ACTIONS | `nnRoY` | ⏳ | por_definir | por_definir | por_definir | loading|empty|error|success|denied|offline | ⏳ | ⏳ |
| 4.2.5 | WEB-L-040_ALERT_CENTER | `94bpd` | ⏳ | por_definir | por_definir | por_definir | loading|empty|error|success|denied|offline | ⏳ | ⏳ |
| 4.2.6 | WEB-L-050_SYSTEM_STATUS | `FdXQL` | ⏳ | por_definir | por_definir | por_definir | loading|empty|error|success|denied|offline | ⏳ | ⏳ |

### Task 4.3 — Web — Acceso y Dashboard operativo / WEB_DASHBOARD_MAIN_LANE
- Total pantallas en este bloque: **5**
| Subtask | Pantalla | ID | Estado | Ruta | API/Datos | Accion | Estados UI | Test | Captura |
|---|---|---|---|---|---|---|---|---|---|
| 4.3.1 | WEB-200_DASHBOARD_KPIS | `ZvoLJ` | ⏳ | por_definir | por_definir | por_definir | loading|empty|error|success|denied|offline | ⏳ | ⏳ |
| 4.3.2 | WEB-210_READINESS_MONITOR | `BylLP` | ⏳ | por_definir | por_definir | por_definir | loading|empty|error|success|denied|offline | ⏳ | ⏳ |
| 4.3.3 | WEB-220_ALERTS_FULL | `NN703` | ⏳ | por_definir | por_definir | por_definir | loading|empty|error|success|denied|offline | ⏳ | ⏳ |
| 4.3.4 | WEB-230_RECENT_ACTIVITY | `CvIve` | ⏳ | por_definir | por_definir | por_definir | loading|empty|error|success|denied|offline | ⏳ | ⏳ |
| 4.3.5 | WEB-240_SHORTCUTS | `BzKbI` | ⏳ | por_definir | por_definir | por_definir | loading|empty|error|success|denied|offline | ⏳ | ⏳ |

### Task 4.4 — Web — Acceso y Dashboard operativo / WEB_DASHBOARD_SECONDARY_LANE
- Total pantallas en este bloque: **3**
| Subtask | Pantalla | ID | Estado | Ruta | API/Datos | Accion | Estados UI | Test | Captura |
|---|---|---|---|---|---|---|---|---|---|
| 4.4.1 | WEB-200_Dashboard_Tablet | `Cjyyr` | ⏳ | por_definir | por_definir | por_definir | loading|empty|error|success|denied|offline | ⏳ | ⏳ |
| 4.4.2 | WEB-210_Readiness_Tablet | `UhMJE` | ⏳ | por_definir | por_definir | por_definir | loading|empty|error|success|denied|offline | ⏳ | ⏳ |
| 4.4.3 | WEB-220_Alerts_Tablet | `x8NM6` | ⏳ | por_definir | por_definir | por_definir | loading|empty|error|success|denied|offline | ⏳ | ⏳ |

### Task 4.5 — Web — Analítica + IA + Admin/Compliance / WEB_ANALYTICS_MAIN_LANE
- Total pantallas en este bloque: **5**
| Subtask | Pantalla | ID | Estado | Ruta | API/Datos | Accion | Estados UI | Test | Captura |
|---|---|---|---|---|---|---|---|---|---|
| 4.5.1 | WEB-500_ANALYTICS_OVERVIEW | `RMiIJ` | ⏳ | por_definir | por_definir | por_definir | loading|empty|error|success|denied|offline | ⏳ | ⏳ |
| 4.5.2 | WEB-510_PROGRESS_TRENDS | `C6igH` | ⏳ | por_definir | por_definir | por_definir | loading|empty|error|success|denied|offline | ⏳ | ⏳ |
| 4.5.3 | WEB-520_COHORT_ANALYSIS | `TAZH6` | ⏳ | por_definir | por_definir | por_definir | loading|empty|error|success|denied|offline | ⏳ | ⏳ |
| 4.5.4 | WEB-600_AI_INSIGHTS | `vfw2W` | ⏳ | por_definir | por_definir | por_definir | loading|empty|error|success|denied|offline | ⏳ | ⏳ |
| 4.5.5 | WEB-700_ADMIN_USERS | `9wlQu` | ⏳ | por_definir | por_definir | por_definir | loading|empty|error|success|denied|offline | ⏳ | ⏳ |

### Task 4.6 — Web — Analítica + IA + Admin/Compliance / WEB_ANALYTICS_SECONDARY_LANE
- Total pantallas en este bloque: **4**
| Subtask | Pantalla | ID | Estado | Ruta | API/Datos | Accion | Estados UI | Test | Captura |
|---|---|---|---|---|---|---|---|---|---|
| 4.6.1 | WEB-710_AUDIT_TRAIL | `aesn3` | ⏳ | por_definir | por_definir | por_definir | loading|empty|error|success|denied|offline | ⏳ | ⏳ |
| 4.6.2 | WEB-730_BILLING_OVERVIEW | `EAdS7` | ⏳ | por_definir | por_definir | por_definir | loading|empty|error|success|denied|offline | ⏳ | ⏳ |
| 4.6.3 | WEB-740_SUPPORT_INCIDENTS | `X9abx` | ⏳ | por_definir | por_definir | por_definir | loading|empty|error|success|denied|offline | ⏳ | ⏳ |
| 4.6.4 | WEB-800_LEGAL_COMPLIANCE | `2o92V` | ⏳ | por_definir | por_definir | por_definir | loading|empty|error|success|denied|offline | ⏳ | ⏳ |

### Task 4.7 — Web — Gestión de atletas / WEB_ATHLETES_MAIN_LANE
- Total pantallas en este bloque: **6**
| Subtask | Pantalla | ID | Estado | Ruta | API/Datos | Accion | Estados UI | Test | Captura |
|---|---|---|---|---|---|---|---|---|---|
| 4.7.1 | WEB-100_ATHLETES_LIST | `vHawc` | ⏳ | por_definir | por_definir | por_definir | loading|empty|error|success|denied|offline | ⏳ | ⏳ |
| 4.7.2 | WEB-110_ATHLETE_FILTERS | `vIhia` | ⏳ | por_definir | por_definir | por_definir | loading|empty|error|success|denied|offline | ⏳ | ⏳ |
| 4.7.3 | WEB-120_ATHLETE_DETAIL | `hFnFe` | ⏳ | por_definir | por_definir | por_definir | loading|empty|error|success|denied|offline | ⏳ | ⏳ |
| 4.7.4 | WEB-130_SESSION_HISTORY | `lx9pZ` | ⏳ | por_definir | por_definir | por_definir | loading|empty|error|success|denied|offline | ⏳ | ⏳ |
| 4.7.5 | WEB-140_COMPARE_PROGRESS | `iIp3R` | ⏳ | por_definir | por_definir | por_definir | loading|empty|error|success|denied|offline | ⏳ | ⏳ |
| 4.7.6 | WEB-150_COACH_NOTES | `KGidn` | ⏳ | por_definir | por_definir | por_definir | loading|empty|error|success|denied|offline | ⏳ | ⏳ |

### Task 4.8 — Web — Gestión de atletas / WEB_ATHLETES_SECONDARY_LANE
- Total pantallas en este bloque: **6**
| Subtask | Pantalla | ID | Estado | Ruta | API/Datos | Accion | Estados UI | Test | Captura |
|---|---|---|---|---|---|---|---|---|---|
| 4.8.1 | WEB-L-100_ATHLETES_LIST | `ln41n` | ⏳ | por_definir | por_definir | por_definir | loading|empty|error|success|denied|offline | ⏳ | ⏳ |
| 4.8.2 | WEB-L-110_FILTERS | `HfCWt` | ⏳ | por_definir | por_definir | por_definir | loading|empty|error|success|denied|offline | ⏳ | ⏳ |
| 4.8.3 | WEB-L-120_ATHLETE_DETAIL | `2ZTiu` | ⏳ | por_definir | por_definir | por_definir | loading|empty|error|success|denied|offline | ⏳ | ⏳ |
| 4.8.4 | WEB-L-130_SESSION_HISTORY | `zJKEv` | ⏳ | por_definir | por_definir | por_definir | loading|empty|error|success|denied|offline | ⏳ | ⏳ |
| 4.8.5 | WEB-L-140_COMPARE_PROGRESS | `wXR6q` | ⏳ | por_definir | por_definir | por_definir | loading|empty|error|success|denied|offline | ⏳ | ⏳ |
| 4.8.6 | WEB-L-150_COACH_NOTES | `2PnS5` | ⏳ | por_definir | por_definir | por_definir | loading|empty|error|success|denied|offline | ⏳ | ⏳ |

### Task 4.9 — Web — Operación de nutrición / WEB_NUTRITION_OPS_MAIN_LANE
- Total pantallas en este bloque: **4**
| Subtask | Pantalla | ID | Estado | Ruta | API/Datos | Accion | Estados UI | Test | Captura |
|---|---|---|---|---|---|---|---|---|---|
| 4.9.1 | WEB-N100_NUTRITION_OVERVIEW | `i1CHy` | ⏳ | por_definir | por_definir | por_definir | loading|empty|error|success|denied|offline | ⏳ | ⏳ |
| 4.9.2 | WEB-N110_DAILY_LOG_REVIEW | `yEQKT` | ⏳ | por_definir | por_definir | por_definir | loading|empty|error|success|denied|offline | ⏳ | ⏳ |
| 4.9.3 | WEB-N120_DEVIATION_ALERTS | `PLAd4` | ⏳ | por_definir | por_definir | por_definir | loading|empty|error|success|denied|offline | ⏳ | ⏳ |
| 4.9.4 | WEB-N130_COACH_VIEW | `GO4Qj` | ⏳ | por_definir | por_definir | por_definir | loading|empty|error|success|denied|offline | ⏳ | ⏳ |

### Task 4.10 — Web — Operación de nutrición / WEB_NUTRITION_OPS_SECONDARY_LANE
- Total pantallas en este bloque: **2**
| Subtask | Pantalla | ID | Estado | Ruta | API/Datos | Accion | Estados UI | Test | Captura |
|---|---|---|---|---|---|---|---|---|---|
| 4.10.1 | WEB-N200_COHORT_NUTRITION | `7fH4L` | ⏳ | por_definir | por_definir | por_definir | loading|empty|error|success|denied|offline | ⏳ | ⏳ |
| 4.10.2 | WEB-N210_LOG_DETAIL | `wOwRW` | ⏳ | por_definir | por_definir | por_definir | loading|empty|error|success|denied|offline | ⏳ | ⏳ |

### Task 4.11 — Web — Planes + CMS de ejercicios / WEB_PLANS_MAIN_LANE
- Total pantallas en este bloque: **6**
| Subtask | Pantalla | ID | Estado | Ruta | API/Datos | Accion | Estados UI | Test | Captura |
|---|---|---|---|---|---|---|---|---|---|
| 4.11.1 | WEB-300_PLANS_LIST | `Hwl9D` | ⏳ | por_definir | por_definir | por_definir | loading|empty|error|success|denied|offline | ⏳ | ⏳ |
| 4.11.2 | WEB-310_PLAN_BUILDER | `esR1M` | ⏳ | por_definir | por_definir | por_definir | loading|empty|error|success|denied|offline | ⏳ | ⏳ |
| 4.11.3 | WEB-320_SESSION_DETAIL | `KzuJA` | ⏳ | por_definir | por_definir | por_definir | loading|empty|error|success|denied|offline | ⏳ | ⏳ |
| 4.11.4 | WEB-330_PLAN_ASSIGNMENT | `5hG0W` | ⏳ | por_definir | por_definir | por_definir | loading|empty|error|success|denied|offline | ⏳ | ⏳ |
| 4.11.5 | WEB-400_EXERCISE_LIBRARY | `tDeSG` | ⏳ | por_definir | por_definir | por_definir | loading|empty|error|success|denied|offline | ⏳ | ⏳ |
| 4.11.6 | WEB-410_EXERCISE_DETAIL | `2C7xM` | ⏳ | por_definir | por_definir | por_definir | loading|empty|error|success|denied|offline | ⏳ | ⏳ |

### Task 4.12 — Web — Planes + CMS de ejercicios / WEB_PLANS_SECONDARY_LANE
- Total pantallas en este bloque: **2**
| Subtask | Pantalla | ID | Estado | Ruta | API/Datos | Accion | Estados UI | Test | Captura |
|---|---|---|---|---|---|---|---|---|---|
| 4.12.1 | WEB-340_PLAN_TEMPLATES | `5fVNS` | ⏳ | por_definir | por_definir | por_definir | loading|empty|error|success|denied|offline | ⏳ | ⏳ |
| 4.12.2 | WEB-350_PUBLISH_REVIEW | `7mbrT` | ⏳ | por_definir | por_definir | por_definir | loading|empty|error|success|denied|offline | ⏳ | ⏳ |

## Fase 5 — Cierre operativo
| Task | Estado | Resultado esperado |
|---|---|---|
| F5-T1 QA funcional E2E iOS/Web/Backend | ⏳ | Flujos completos sin roturas |
| F5-T2 Paridad final Pencil -> Codigo | ⏳ | 121/121 pantallas funcionales y trazables |
| F5-T3 Gate MVP y checklist release | ⏳ | Producto usable por usuarios reales |

## Estado activo ahora
- Task en construccion: **3.10.2 IOS-L-210_LOG_MEAL**
- Siguiente task: **3.10.3 IOS-L-220_PROGRESS_METRICS**
