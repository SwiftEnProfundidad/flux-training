# Repository Guidelines

## Project Structure and Module Organization
- `apps/ios/`: app iOS (Swift/SwiftUI), con codigo en `Sources/` y pruebas en `Tests/`.
- `apps/web/`: frontend web (React/TypeScript), con codigo en `src/`.
- `apps/backend/`: backend/API (TypeScript), con codigo en `src/`.
- `packages/contracts/`: contratos compartidos entre plataformas.
- `docs/`: documentacion funcional, tecnica y de validacion.

## Build, Test, and Development Commands
- `pnpm install`: instala dependencias JS/TS del workspace.
- `pnpm -r build`: compila todos los paquetes/apps JS/TS.
- `pnpm -r test`: ejecuta tests de todo el workspace JS/TS.
- `pnpm --filter web dev`: arranca el frontend local.
- `pnpm --filter backend dev`: arranca backend local.
- `cd apps/ios && swift test`: ejecuta pruebas del modulo iOS.

## Coding Style and Naming Conventions
- TypeScript: indentacion de 2 espacios, `strict` activo, evitar `any`.
- Swift: indentacion de 4 espacios, concurrencia moderna con `async/await`.
- Nombres: componentes en `PascalCase`, hooks en `useXxx`, utilidades en `camelCase`.
- Tests: `*.spec.ts` para JS/TS y `*Tests.swift` para Swift.

## Testing Guidelines
- Cubrir casos de uso criticos con pruebas deterministas.
- Incluir regresion en cada bugfix.
- Ejecutar tests relevantes antes de abrir PR y reportar comandos usados.

## Commit and Pull Request Guidelines
- Usar Conventional Commits: `feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `chore:`.
- Toda PR debe incluir resumen, alcance, evidencia de pruebas y capturas para cambios UI.

## Security and Configuration Tips
- Prohibido commitear secretos.
- Usar `.env` y mantener `.env.example` actualizado.
- Validar input externo en el backend.

## AGENTS.md - Reglas de Codex para este repositorio

### Skills globales: siempre disponibles
- Las skills globales viven en `~/.codex/skills/**`.
- Leer desde `~/.codex/skills/**` esta permitido.
- Escribir o modificar bajo `~/.codex/**` esta prohibido.
- "Siempre disponibles" no significa "siempre aplicables".

### Obligatorio en cada iteracion
- Antes de cualquier accion ejecutar:
- `pwd`
- `git rev-parse --show-toplevel`
- `git status`
- Confirmar que no se trabaja desde `~/.codex`.
- Enumerar skills disponibles (globales + repo) buscando carpetas con `SKILL.md`.
- Decidir skills aplicables y ejecutar sus instrucciones si corresponde.
- Los checks legacy de gate/evidencia estan deprecados y no bloquean trabajo.
- Actualizar el tracking real de refactor/estabilidad al cerrar cada tarea.

### Contrato hard de skills
- Las skills activas son contrato hard no negociable.
- Prohibido omitir, relajar o reinterpretar reglas de una skill.
- Si hay conflicto entre skill vendorizada y local, aplicar la mas estricta y documentar trazabilidad.
- Ambito iOS/Swift/SwiftUI: aplicar siempre `windsurf-rules-ios`, `swift-concurrency`, `swiftui-expert-skill`.
- Ambito frontend web: aplicar siempre `windsurf-rules-frontend`.
- Ambito backend: aplicar siempre `windsurf-rules-backend`.
- Ambito Android: aplicar siempre `windsurf-rules-android`.
- Si una tarea toca varios ambitos, aplicar todas las skills relevantes en conjunto.
- Si una regla no puede cumplirse, detener y declarar `STATUS: BLOCKED` con causa exacta.

### Contrato hard de GitFlow y ramas
- GitFlow es obligatorio.
- Prohibido trabajar o commitear fuera de convencion de ramas.
- Convencion por defecto:
- `main`
- `develop`
- `feature/<descripcion-kebab-case>`
- `bugfix/<descripcion-kebab-case>`
- `hotfix/<descripcion-kebab-case>`
- `release/<semver>`
- `chore/<descripcion-kebab-case>`
- `refactor/<descripcion-kebab-case>`
- `docs/<descripcion-kebab-case>`
- Flujo obligatorio:
- `feature/*`, `bugfix/*`, `chore/*`, `refactor/*`, `docs/*` salen de `develop`.
- `release/*` sale de `develop`.
- `hotfix/*` sale de `main`.
- Prohibido commitear en `main` o `develop` sin instruccion explicita.
- Si la rama no cumple, detener y declarar `STATUS: BLOCKED`.

### Gate operativo obligatorio antes de editar codigo
- Declarar skills aplicables y mantenerlas activas todo el turno.
- Verificar BDD/TDD segun skill aplicable.
- Verificar concurrencia/aislamiento para Swift segun `swift-concurrency`.
- Verificar estado/arquitectura/UI iOS segun skills iOS.
- Verificar reglas frontend/backend/Android segun ambito.
- Verificar rama alineada con GitFlow y naming.
- Si no se puede garantizar gate, no editar codigo.

### Gate hard de ejecucion real (anti "falso DONE")
- Prohibido marcar cualquier task/subtask en `✅` sin evidencia ejecutable real.
- Evidencia minima obligatoria por plataforma:
- Web: pantalla visible en `localhost` + accion principal ejecutada + estado resultante observable.
- iOS: pantalla visible en simulador + accion principal ejecutada + estado resultante observable.
- Backend: smoke de endpoint/caso de uso principal con respuesta valida.
- Prohibido cerrar como "funcional" algo que sea solo shell/listado interno/debug UI.
- Si una pantalla existe pero no permite la accion de usuario esperada E2E, estado obligatorio: `⛔ Bloqueado` o `⏳ Pendiente` (nunca `✅`).

### Gate hard de worktree limpio y commits atomicos
- Si `git status --short` supera 80 entradas, detener implementacion y ejecutar ciclo de limpieza/commits antes de continuar.
- Objetivo operativo: cerrar cada iteracion con worktree limpio (`git status` sin cambios) salvo instruccion explicita del usuario.
- Cada commit debe ser atomico (un solo objetivo funcional claro).
- Tamano recomendado por commit: maximo 25 archivos tocados del mismo ambito.
- Prohibido mezclar en un mismo commit cambios de iOS + Web + Backend + Docs sin relacion directa.
- Antes de pasar una task a `✅`, debe existir commit local del bloque correspondiente.
- Prohibido avanzar a la siguiente task con trabajo local sin commitear del bloque anterior.

### Gate hard de tracking y veracidad
- Solo puede existir una task en `🚧` por plan activo.
- Al cerrar una task:
- actualizar tracking,
- adjuntar evidencia (comandos/test/smoke),
- referenciar el commit hash local que contiene el cierre.
- Prohibido mover tasks a `✅` por "suposicion" o por codigo parcial sin validacion.
- Si hay discrepancia entre tracking y producto ejecutado, prevalece el producto ejecutado y se reabre la task inmediatamente.

### Prohibiciones explicitas
- Prohibido implementar si se incumple cualquier regla hard de skill.
- Prohibido cerrar tarea con violaciones conocidas de skills.
- Prohibido asumir permiso implicito para saltar reglas.
- Prohibido ejecutar `merge`, `rebase`, `cherry-pick` o `push --force` sin instruccion explicita.
- Prohibido trabajar en un workspace/ruta distinta al repo activo validado por `pwd` + `git rev-parse --show-toplevel`.
- Prohibido reportar capturas o evidencias no verificables localmente.
- Prohibido mantener artefactos temporales fuera de control (`tmp`, capturas sueltas, logs, backups ad-hoc).

### Contrato hard de higiene documental y artefactos
- Mantener repositorio limpio, trazable y sin basura operativa.
- Prohibido crear un `.md` por cada micro paso si cabe en documentacion existente.
- Antes de crear archivos en `docs/**`, priorizar actualizacion de:
- `docs/ENTERPRISE_EXECUTION_CYCLE_*.md`
- `docs/REFRACTOR_PROGRESS.md`
- `docs/README.md`
- `docs/validation/README.md`
- Crear `.md` nuevo solo por solicitud explicita o hito contractual no consolidable.
- Si se crea `.md` nuevo, en la misma entrega indexar en READMEs y consolidar/eliminar redundantes.
- Prohibido versionar artefactos efimeros:
- `.audit_tmp/**`, `.audit-reports/**`, `.coverage/**`
- `*.out`, `*.exit`, `*.log`, `*.tmp`, `*.bak`, `*.orig`, `*.rej`
- Limpieza obligatoria antes de cerrar tarea:
- eliminar efimeros locales,
- eliminar directorios vacios huerfanos,
- verificar `git status` sin basura fuera del alcance.
- Si un archivo no aporta valor profesional claro, no mantenerlo.
- En caso de duda, declarar `STATUS: BLOCKED` y pedir decision explicita.

### Seguridad del repositorio
- Cambios solo dentro de este repositorio.
- Evitar refactors amplios salvo peticion explicita.
- Para operaciones destructivas, parar y preguntar.

### Secretos
- Nunca imprimir ni registrar secretos.
- Si se detecta un secreto, reportar solo ruta + remediacion sin exponer valor.

### Protocolo de entrega
- Toda entrega final debe reportar:
- `STATUS` (`DONE` o `BLOCKED`)
- `BRANCH`
- `FILES CHANGED`
- `COMMANDS RUN`
- `NEXT instruction`
- `EVIDENCIA RUNTIME` (web/iOS/backend segun aplique)
- `COMMIT` (hash local del bloque cerrado)

### Plantilla obligatoria de trazabilidad por turno
- Incluir en cada entrega final una matriz:
- `ARCHIVO | SKILL | REGLA | EVIDENCIA | ESTADO`
- Campos:
- `ARCHIVO`: ruta absoluta.
- `SKILL`: skill o contrato aplicable.
- `REGLA`: regla concreta aplicada.
- `EVIDENCIA`: comando, test, diff o referencia de linea.
- `ESTADO`: `OK` o `BLOCKED`.
- Prohibido cerrar tarea sin esta matriz.

<!-- BEGIN CODEX SKILLS -->
## Skills de Codex (local + vendorizado)

### Precedencia y operativa
- Mantener precedencia global definida en `AGENTS.md`.
- Si no existe, usar `AGENTS.md > codex skills > prompts de fase`.
- Al inicio de fase, usar primero `docs/codex-skills/*.md` si existe.
- Si no existe, usar rutas locales.
- Si `docs/codex-skills/` no existe, continuar con rutas locales sin bloquear.
- Aplicar skills siempre que no contradigan `AGENTS.md`.

### Skills
- `windsurf-rules-android`
- Local: `/Users/juancarlosmerlosalbarracin/.codex/skills/public/windsurf-rules-android/SKILL.md`
- Vendorizado: `docs/codex-skills/windsurf-rules-android.md`
- `windsurf-rules-backend`
- Local: `/Users/juancarlosmerlosalbarracin/.codex/skills/public/windsurf-rules-backend/SKILL.md`
- Vendorizado: `docs/codex-skills/windsurf-rules-backend.md`
- `windsurf-rules-frontend`
- Local: `/Users/juancarlosmerlosalbarracin/.codex/skills/public/windsurf-rules-frontend/SKILL.md`
- Vendorizado: `docs/codex-skills/windsurf-rules-frontend.md`
- `windsurf-rules-ios`
- Local: `/Users/juancarlosmerlosalbarracin/.codex/skills/public/windsurf-rules-ios/SKILL.md`
- Vendorizado: `docs/codex-skills/windsurf-rules-ios.md`
- `swift-concurrency`
- Local: `/Users/juancarlosmerlosalbarracin/.codex/skills/swift-concurrency/SKILL.md`
- Vendorizado: `docs/codex-skills/swift-concurrency.md`
- `swiftui-expert-skill`
- Local: `/Users/juancarlosmerlosalbarracin/.codex/skills/swiftui-expert-skill/SKILL.md`
- Vendorizado: `docs/codex-skills/swiftui-expert-skill.md`

### Comando de sincronizacion
- `./scripts/sync-codex-skills.sh`
<!-- END CODEX SKILLS -->
