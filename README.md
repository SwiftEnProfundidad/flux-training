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
- `pnpm demo:backend`
- `cd apps/ios && swift test`

## Environment
- Web: copy `apps/web/.env.example` to `.env.local`, set Firebase web keys and `VITE_APP_VERSION`.
- Backend: set `apps/backend/.env` from `apps/backend/.env.example`, including `MIN_WEB_CLIENT_VERSION` and `MIN_IOS_CLIENT_VERSION`.

## Local functional demo
- Terminal A: `pnpm demo:backend` (local API runtime at `http://127.0.0.1:8787`)
- Terminal B: `pnpm dev:web` (Vite proxies `/api` to the local runtime)
- Open `http://localhost:5173` (or the next free Vite port if 5173 is busy)
- Optional iOS host app:
  - `cd apps/ios-host && xcodegen generate`
  - Build/run `FluxTrainingHost.xcodeproj` in Simulator (target iOS 17+)

## UI/UX and language support
- Professional redesign direction for Pencil MCP: `docs/PENCIL_UIUX_PROMPT.md`
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
