# Prompt Maestro de Flujo y Pantallas (Pencil MCP)

## Directriz de estilo (obligatoria)
- Use style guide with name `mobile-03-darkbold_light`.

Usa este prompt en Pencil para generar el flujo completo de producto y el set de pantallas de `Flux Training`, alineado al tracking oficial:  
`/Users/juancarlosmerlosalbarracin/Developer/Projects/PENCIL/FLUX_TRAINNING/FLUX_TRACKING.md`

## Prompt

Diseña el flujo de producto end-to-end para `Flux Training` en iOS y web, manteniendo como fuente de verdad las decisiones cerradas, roadmap, kanban y scope S1 del tracking oficial.

### Contexto de producto (obligatorio)
- Modelo mental confirmado: `Today/Training/Progress/Nutrition/AI`.
- Navegación iOS confirmada: `Hoy`, `Training`, `Progress`, `Nutrition`, `AI`.
- Navegación Web confirmada: `Dashboard`, `Athletes`, `Plans`, `Exercise Library`, `Progress`, `Nutrition`, `AI Insights`, `Admin`, `Support`.
- Readiness UX: score 0-100 explicable con drivers y confianza de datos.
- Idioma base: `es`. Idioma secundario: `en`.

### Entregables obligatorios
- Arquitectura de información completa por plataforma.
- Mapa de flujo entre pantallas con decisiones y bifurcaciones.
- Inventario de pantallas con IDs y eventos clave (`DOC-001`).
- Set de pantallas para iOS y web con todos los estados críticos por vista.
- Variante de copy por idioma (`es` y `en`) para navegación, CTAs y estados.

### Pantallas iOS mínimas (alineadas a backlog)
- Auth completo: Welcome, Login, Signup, 2FA, Verify (`IOS-001`).
- Onboarding: perfil inicial, permisos Health/Notifs (`IOS-002`), PAR-Q+.
- Today Cockpit con Readiness, plan del día y atajos (`IOS-003`).
- Training semanal/mensual + detalle de sesión (`IOS-004`).
- In-Workout offline-first: sets/reps/timer/RPE/notas (`IOS-005`).
- Sustitución de ejercicio por lesión/equipamiento (`IOS-006`).
- Exercise Library + Video player + captions (`IOS-007`).
- Progress KPIs/tendencias/comparativas (`IOS-008`).
- Nutrition diario/macros/hidratación/plantillas (`IOS-009`).
- AI Recommendations feed/detalle/feedback (`IOS-010`).
- Settings: perfil, unidades, idioma, privacidad, export/delete (`IOS-011`).

### Pantallas web mínimas (alineadas a backlog)
- Shell role-aware: sidebar/topbar/breadcrumbs (`WEB-001`).
- Dashboard coach/admin con KPIs + readiness monitor (`WEB-002`).
- Athletes list + profile + segmentación (`WEB-003`).
- Plan Builder + templates + assignment (`WEB-004`).
- Exercise/Video CMS (`WEB-005`).
- Progress analytics por cohortes + export (`WEB-006`).
- Admin users + RBAC + billing + compliance (`WEB-007`).
- Audit trail + Support console (`WEB-008`).

### Flujos obligatorios a modelar
- Primera apertura: version check -> acceso o bloqueo por upgrade.
- Autenticación y verificación: login/signup/2FA/verify -> onboarding.
- Onboarding completo: perfil + PAR-Q+ + permisos + consentimiento.
- Loop diario atleta: Today -> Training/In-Workout -> Nutrition -> Progress -> AI.
- Loop coach/admin web: Dashboard -> Athletes -> Plans -> Insights -> Admin/Support.
- Offline/sync: cola, reintentos, conflictos y resolución.
- Seguridad/legal: gestión de sesión, logout remoto, dispositivos, consentimientos, exportación y borrado.

### Estados críticos por pantalla (QA-001)
- `default`, `loading`, `empty`, `error`, `offline`, `denied`, `success`.
- Mostrar siempre CTA de recuperación en `error` y `offline`.

### Instrumentación y trazabilidad (QA-002)
- Definir eventos de analytics por flujo con formato:
  - `flux.<platform>.<domain>.<action>`
- Incluir en cada pantalla:
  - evento de entrada de pantalla,
  - evento de acción principal,
  - evento de error.

### Criterios de aceptación de salida en Pencil
- Cobertura completa del scope S1 comprometido: `DS-001`, `DS-002`, `DS-003`, `IOS-001`, `IOS-003`, `IOS-004`, `WEB-001`, `WEB-002`.
- Flujos navegables y conectados sin pantallas huérfanas.
- Estados críticos presentes en pantallas núcleo.
- Copys y navegación listos en `es` y `en`.
