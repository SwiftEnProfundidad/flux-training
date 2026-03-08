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
- 🚧 Confirmar criterio de cierre del MVP funcional.

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
- ⏳ Auditar backend real vs fallback/demo.
- ⏳ Validar login email/password end-to-end.
- ⏳ Validar onboarding + consentimiento en backend real.
- ⏳ Validar training, nutrition, progress y legal por endpoint real.

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
