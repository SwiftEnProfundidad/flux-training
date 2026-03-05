# Flux Training

Monorepo for iOS, web, backend, and shared contracts.

## Workspace commands
- `pnpm install`
- `pnpm build`
- `pnpm test`
- `pnpm test:critical`
- `pnpm release:check`
- `pnpm check`
- `pnpm dev:web`
- `pnpm dev:backend`
- `cd apps/ios && swift test`

## Environment
- Web: copy `apps/web/.env.example` to `.env.local`, set Firebase web keys, `VITE_API_TARGET` (backend real) and `VITE_APP_VERSION`.
- Backend: set `apps/backend/.env` from `apps/backend/.env.example`, including `MIN_WEB_CLIENT_VERSION` and `MIN_IOS_CLIENT_VERSION`.

## Local functional runtime
- Configure `VITE_API_TARGET` to your backend real endpoint (Firebase Functions URL or emulator URL).
- Terminal A: `pnpm dev:web` (Vite proxies `/api/*` to `VITE_API_TARGET/*`).
- Open `http://localhost:5173` (or the next free Vite port if 5173 is busy).
- Optional iOS host app:
  - `cd apps/ios-host && xcodegen generate`
  - Build/run `FluxTrainingHost.xcodeproj` in Simulator (target iOS 17+)

## UI/UX and language support
- Professional redesign direction for Pencil MCP: `docs/PENCIL_UIUX_PROMPT.md`
- Active MVP tracking:
  - Master orchestration: `docs/PLAN_MVP_OPERATIVO_WEB_IOS.md`
  - iOS screen-by-screen: `docs/PLAN_IOS_MVP_OPERATIVO.md`
  - Web screen-by-screen: `docs/PLAN_WEB_MVP_OPERATIVO.md`
  - Pumuki bugs and improvements log: `docs/BUGS_Y_MEJORAS_PUMUKI.md`
- Bilingual UI support:
  - Web: Spanish (`es`) default + English (`en`) switch in hero.
  - iOS: Spanish (`es`) default + English (`en`) switch in readiness hero.

## Beta stabilization
- Backend rejects outdated app versions with HTTP `426` and error `client_update_required`.
- Web sends `x-flux-client-platform` and `x-flux-client-version` headers in every API request.
- Web UI shows an actionable upgrade warning when backend requires a newer version.
- Web and backend include legal hardening flows for consent capture and data deletion requests.

## Release v1
- Release gate command: `pnpm release:check`
- Detailed checklist: `docs/RELEASE_CHECKLIST_V1.md`

## Post-release v1.1
- Product and technical roadmap: `docs/ROADMAP_V1_1.md`
