# PLAN CICLO 2 — MVP funcional real

## Leyenda
- ✅ Hecho
- 🚧 En construccion (maximo 1)
- ⏳ Pendiente
- ⛔ Bloqueado

## Objetivo del ciclo
- Llevar Flux a MVP funcional real para usuarios en Web + iOS, alineado con `flux.pen`, sin UI interna de pruebas y con flujos end-to-end operativos.

## Estado actual
- Web: backlog anterior cerrado, pendiente validacion real de producto.
- iOS: backlog anterior cerrado, pendiente validacion real de producto.
- Backend: pendiente validacion real end-to-end.
- Task activa actual: 🚧 Confirmar criterio de cierre del MVP funcional.

## Fase 1 — Reapertura y baseline real
- ✅ Reabrir ciclo 2 en tracking maestro.
- ✅ Registrar gaps reales entre runtime y `flux.pen`.
- ✅ Confirmar criterio de cierre del MVP funcional.

## Criterio de cierre del MVP funcional
- El MVP solo podra declararse `✅` cuando se cumplan a la vez estos cinco bloques:
  - Web producto real:
    - la entrada por defecto en `/` abre experiencia de producto y no una consola interna o shell QA,
    - el usuario puede iniciar sesion por email/password y completar onboarding + consentimiento,
    - entrenamiento, nutricion, progreso, ajustes y legal permiten una accion principal real y muestran un resultado observable,
    - no queda copy tecnica visible al usuario (`screen`, `route`, `qa`, `ops`, `debug`, `idle`, `empty`, `success`, `runtime`, `lane`, `web.*`).
  - iOS producto real:
    - la app abre experiencia de producto y no catalogo tecnico,
    - el usuario puede iniciar sesion y completar onboarding + consentimiento en simulador,
    - entrenamiento, nutricion, progreso y ajustes permiten una accion principal real y muestran un resultado observable,
    - no queda copy tecnica visible al usuario (`screen`, `route`, `ops`, `idle`, `loaded`, `success`, nombres de vistas internas).
  - Backend real:
    - queda demostrado por smoke real que auth, onboarding, training, nutrition, progress y legal operan sin fallback demo encubierto,
    - cualquier fallback local/dev debe quedar limitado a entorno local controlado y nunca ser el camino por defecto de producto.
  - Validacion automatizada:
    - `pnpm check`,
    - `pnpm test`,
    - `pnpm test:critical`,
    - `pnpm release:check`,
    - `cd apps/ios && swift test`
    deben pasar sin fallos en el estado de cierre.
  - Paridad contra `flux.pen`:
    - Web e iOS deben respetar la estructura, jerarquia y flujo principal definidos en `flux.pen`,
    - cualquier pantalla que no replique la experiencia esperada se reabre aunque hoy aparezca como implementada.

## Evidencia minima obligatoria para cerrar el ciclo
- Web:
  - pantalla visible en `localhost`,
  - accion principal ejecutada,
  - estado resultante observable,
  - captura o smoke verificable localmente.
- iOS:
  - pantalla visible en simulador,
  - accion principal ejecutada,
  - estado resultante observable.
- Backend:
  - smoke de endpoint o caso de uso con respuesta valida.
- Tracking:
  - si el producto ejecutado contradice el tracking, prevalece el producto y se reabre la task.

## Baseline real detectado (2026-03-08)
- Web runtime actual:
  - ✅ La entrada carga en `localhost:5173` y permite accion principal real de login por email.
  - ⛔ Tras login, la home sigue renderizando una vista larga tipo panel operativo con modulos apilados (`Onboarding`, `Entrenamiento`, `Insights IA`, `Nutricion`, `Tendencias`, `Ajustes`) en una sola pagina.
  - ⛔ Ese comportamiento no coincide con `flux.pen`, donde Web se organiza por shell, dashboard, atletas, planes, nutricion y analytics en flujos/secciones diferenciadas.
  - ⛔ Sigue habiendo copy de estado interno visible en producto (`Tendencias: empty`, `Ajustes: inactivo`, contadores de runtime), que no deberia verse como UX final.
  - ⛔ El login local con `qa+cycle2-baseline@flux.app` activa sesion directamente; eso obliga a auditar si sigue existiendo fallback de auth no aceptable para MVP real.
- iOS runtime actual:
  - ✅ La app abre en producto real y no en catalogo tecnico.
  - ✅ La entrada visual ya se parece al board de acceso mejor que Web.
  - ⛔ La pantalla inicial no replica todavia la pieza de acceso del board: faltan bloques/CTAs de onboarding y el contenido hero no coincide 1:1 con `flux.pen`.
  - ⏳ Falta revalidacion runtime del flujo completo post-login en entrenamiento, nutricion, progreso y ajustes para confirmar que no quede UI de transicion o estados internos.
- Backend/runtime real:
  - ⏳ Todavia no queda demostrado en este ciclo que Web+iOS esten operando contra backend MVP real sin fallback demo/local encubierto.

## Fase 2 — Backend y autenticacion real
- ✅ Auditar backend real vs fallback/demo.
- 🚧 Preparar entorno minimo de auth/backend real.
- ⏳ Validar login email/password end-to-end.
- ⏳ Validar onboarding + consentimiento en backend real.
- ⏳ Validar training, nutrition, progress y legal por endpoint real.

## Resultado de la auditoria backend/runtime real (2026-03-08)
- Backend real:
  - `apps/backend/src/presentation/http.ts` usa Firebase Functions + Firestore + `FirebaseAuthTokenVerifier`.
  - `apps/backend/src/application/create-auth-session.ts` solo acepta sesiones reales si `FirebaseAuthTokenVerifier.verify(...)` valida el token.
  - conclusion: el camino cloud es real; no hay fallback demo dentro del backend cloud.
- Backend local:
  - `package.json` raiz define `dev:backend` como compilacion (`pnpm --filter @flux/backend dev`) y `dev:backend:demo` como unico servidor HTTP local (`pnpm --filter @flux/backend start:demo`).
  - `apps/backend/src/presentation/demo-http-server.ts` y `demo-api-runtime.ts` implementan un backend demo explicito.
  - conclusion: hoy no existe un backend real local emulado; el backend HTTP local disponible es solo demo.
- Web:
  - `apps/web/vite.config.ts` apunta por defecto a `http://127.0.0.1:8787` cuando `VITE_API_TARGET` no esta definido.
  - `apps/web/src/infrastructure/firebase-auth-client.ts` activa fallback de auth local si el target es loopback o si el host runtime es local sin config Firebase.
  - ese fallback crea sesion backend con `apple-local-dev-token` o con el email normalizado como `providerToken`.
  - conclusion: en local la web puede autenticarse por camino demo aunque la UI este en modo producto.
- iOS:
  - `apps/ios/Sources/App/FluxTrainingAppConfiguration.swift` apunta por defecto al backend cloud real.
  - `apps/ios/Sources/Infrastructure/RemoteAuthGateway.swift` activa fallback local si `baseURL` es loopback y faltan tokens/config.
  - `apps/ios/Sources/App/CompositionRoot.swift` mezcla repositorios remotos y persistencia local:
    - remoto: training, workout sessions, nutrition, offline sync, observability, role capabilities,
    - local persistido: onboarding/profile, settings, legal consent, export y delete account.
  - conclusion: iOS no esta aun end-to-end contra backend real en todos los dominios del MVP.
- Entorno actual del repo:
  - no hay variables cargadas para auth/backend cloud real en esta sesion:
    - `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`,
    - `FLUX_FIREBASE_WEB_API_KEY`, `FLUX_FIREBASE_API_KEY`,
    - `FLUX_BACKEND_BASE_URL`, `FLUX_APPLE_PROVIDER_TOKEN`,
    - `FIREBASE_CONFIG`, `GOOGLE_APPLICATION_CREDENTIALS`.
  - conclusion: la validacion real de auth/backend esta bloqueada hasta preparar entorno minimo.

## Fase 3 — Web producto real
- ⏳ Corregir entrada web para modo producto real.
- ⏳ Validar auth + onboarding + consentimiento.
- ⏳ Validar training end-to-end.
- ⏳ Validar nutrition + progress + IA.
- ⏳ Validar settings + legal.
- ⏳ Corregir diferencias visuales/funcionales vs `flux.pen`.

## Fase 4 — iOS producto real
- ⏳ Corregir entrada iOS para modo producto real.
- ⏳ Validar auth + onboarding + consentimiento.
- ⏳ Validar training end-to-end.
- ⏳ Validar nutrition + progress + IA.
- ⏳ Validar settings + legal.
- ⏳ Corregir diferencias visuales/funcionales vs `flux.pen`.

## Fase 5 — Gate final MVP
- ⏳ Ejecutar smoke matrix Web/iOS/Backend.
- ⏳ Ejecutar suite de validacion final.
- ⏳ Reabrir cualquier falso ✅ detectado.
- ⏳ Declarar MVP funcional real o bloquear con causas exactas.
