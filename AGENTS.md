# AGENTS.md - Flux_training

## Idioma y comunicacion
- MUST: Responder siempre en espanol.
- MUST: Mantener trazabilidad en cada entrega (`escenario -> tests -> evidencia -> task`).
- MUST: Al cerrar cada iteracion, responder siempre con `MD de seguimiento` y `task actual`.

## Project mode
- PROJECT MODE: brownfield

## Metodo
- REQUIRED SKILL: `enterprise-operating-system`

## Fuente de verdad
- MUST: La autoridad documental del producto vive en:
  - `docs/SEGUIMIENTO_MASTER.md`
  - `docs/PLAN_CICLO_2_MVP_FUNCIONAL.md`
  - `docs/PLAN_IOS_MVP_OPERATIVO.md`
  - `docs/PLAN_WEB_MVP_OPERATIVO.md`
  - `docs/validation/README.md`
- MUST: La arquitectura local del repo se organiza en:
  - `apps/ios/Sources/{Presentation,Application,Domain,Infrastructure}`
  - `apps/web/src`
  - `apps/backend/src`
  - `packages/contracts/src`
- MUST: Si hay conflicto entre capas, manda `vendor/skills/` del repo sobre la skill global y `AGENTS.md` contextualiza sin reescribir la doctrina comun.

## Skills requeridos
- REQUIRED SKILL: `ios-enterprise-rules`
- REQUIRED SKILL: `swift-concurrency`
- REQUIRED SKILL: `swiftui-expert-skill`
- REQUIRED SKILL: `backend-enterprise-rules`
- REQUIRED SKILL: `frontend-enterprise-rules`

## Reglas del modo
- MUST: No abrir features nuevas sin diagnostico del estado actual y del impacto sobre el legado.
- MUST: Mantener visible que parte del legado se conserva, aísla o sustituye.
- MUST: No mezclar una migracion/refactor estructural con features de negocio sin ownership claro.

## Reglas locales del repo
- MUST: Mantener bounded contexts explicitos entre `ios`, `web`, `backend` y `contracts`; no mezclar runtime de plataformas en un mismo cambio sin necesidad trazable.
- MUST: Registrar bugs o gaps de Pumuki en `docs/BUGS_Y_MEJORAS_PUMUKI.md`.
- MUST: Ejecutar `pnpm -r test` y, si el cambio toca iOS, `cd apps/ios && swift test` antes de `in review`.
- MUST: Mantener `docs/README.md` y `docs/SEGUIMIENTO_MASTER.md` alineados cuando cambie el foco real del producto.
