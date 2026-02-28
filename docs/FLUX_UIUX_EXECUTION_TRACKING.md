# Seguimiento Maestro UI/UX Flux (Pencil)

## Leyenda
- ✅ Hecho
- 🚧 En construccion (maximo 1)
- ⏳ Pendiente
- ⛔ Bloqueado

## Reglas hard de ejecucion
- Solo puede existir 1 task en `🚧`.
- Al cerrar una task: moverla a `✅` y abrir la siguiente en `🚧`.
- Si no se puede completar una regla, marcar `⛔` con causa concreta.
- Estilo obligatorio del board: `Use style guide with name mobile-03-darkbold_light`.
- Estructura obligatoria del `.pen`: solo `BOARD_IOS_APP` y `BOARD_WEB_APP`, sin bloques basura.
- Cada pantalla debe tener estructura propia (no clones) y elementos reales del caso de uso.

## Fase 0 - Base canónica del board
| ID | Task | Estado | Entregable |
|---|---|---|---|
| F0-T1 | Fijar archivo único (`flux.pen`) y abrirlo en extensión + MCP | ✅ | Archivo único activo |
| F0-T2 | Limpiar bloques no producto (cards genéricas, tablas dummy, fases técnicas) | ✅ | Board limpio |
| F0-T3 | Definir grid maestro por plataforma y contenedores de sección | ✅ | Layout de tableros |

## Fase 1 - iOS App (pantallas reales por sección)
| ID | Task | Estado | Pantallas y elementos obligatorios |
|---|---|---|---|
| F1-T1 | Sección iOS-Auth (Welcome, Email Login, Apple Handoff, OTP, Recover, Session Expired) | ✅ | Rework de calidad visual y jerarquía + centrado de CTAs completado |
| F1-T2 | Sección iOS-Onboarding (Profile setup, Goal setup, PAR-Q+, Consent legal) | ✅ | Profile + Goal + PAR-Q+ + Consent en dark/light con flujo explícito |
| F1-T3 | Sección iOS-Today | ✅ | Cockpit real con readiness, prioridades, quick actions y sugerencia IA |
| F1-T4 | Sección iOS-Training | ✅ | Setup, sesión en curso y resumen con métricas operativas |
| F1-T5 | Sección iOS-Exercise Video | ✅ | Player, cues técnicos, CTA de uso y soporte de subtítulos ES/EN |
| F1-T6 | Sección iOS-Nutrition | ✅ | Dark + Light con hub diario, log de comidas, macros e hidratación |
| F1-T7 | Sección iOS-Progress | ✅ | KPIs, tendencias y resumen semanal en dark/light |
| F1-T8 | Sección iOS-AI Coach | ✅ | Feed IA con rationale y feedback útil/no útil en dark/light |
| F1-T9 | Sección iOS-Settings + Legal/Delete | ✅ | Ajustes, privacidad, exportación y borrado en dark/light |
| F1-T10 | Flujo iOS end-to-end entre secciones | ✅ | Flujo completo actualizado en `IOS_GLOBAL_FLOW` |

## Fase 2 - Web App (pantallas reales por sección)
| ID | Task | Estado | Pantallas y elementos obligatorios |
|---|---|---|---|
| F2-T1 | Sección WEB-Access + Shell | ✅ | Login, recover, selector idioma en WEB_SECTION_ACCESS_DASHBOARD. Shell refactorizada a componente reutilizable (sidebar + topbar + breadcrumbs) |
| F2-T2 | Sección WEB-Dashboard | ✅ | KPIs, readiness monitor, alertas y shortcuts en sub-sección Dashboard dentro de WEB_SECTION_ACCESS_DASHBOARD |
| F2-T3 | Sección WEB-Athletes | ✅ | Tabla atletas, filtros, detalle, historial y adherencia en WEB_SECTION_ATHLETES (Desktop + Tablet) |
| F2-T4 | Sección WEB-Plans Builder | ✅ | Plantillas, calendario semanal, asignación y conflictos en WEB_SECTION_PLANS_CMS |
| F2-T5 | Sección WEB-Exercise/Video CMS | ✅ | CRUD ejercicios/videos, metadata y búsqueda en WEB_SECTION_PLANS_CMS |
| F2-T6 | Sección WEB-Progress Analytics | ✅ | Cohortes, tendencias y exportación en WEB_SECTION_ANALYTICS_AI_ADMIN |
| F2-T7 | Sección WEB-Nutrition Ops | ✅ | Revisión de logs, alertas desvío y vista coach en WEB_SECTION_NUTRITION_OPS (sección dedicada añadida) |
| F2-T8 | Sección WEB-AI Insights | ✅ | Recomendaciones por atleta, confianza y acciones en WEB_SECTION_ANALYTICS_AI_ADMIN |
| F2-T9 | Sección WEB-Admin + Support + Audit | ✅ | RBAC, sesiones, trazas, tickets y cumplimiento en WEB_SECTION_ANALYTICS_AI_ADMIN |
| F2-T10 | Flujo Web end-to-end por rol | ✅ | Admin (acceso completo), Coach (operacional sin Admin), Athlete (autoservicio) con rutas y bifurcaciones explícitas en WEB_GLOBAL_FLOW |

> **Nota de auditoría (2026-02-27):** El pen `flux.pen` tenía contenido en todas las secciones web antes de este tracking. Se detectaron y corrigen: Shell sin componente reutilizable (P2), lane heights web insuficientes 380→768px (P4), Nutrition Ops sin sección dedicada (P5), WEB_GLOBAL_FLOW sin roles (P6).

## Fase 3 - Reglas transversales de producto
| ID | Task | Estado | Entregable |
|---|---|---|---|
| F3-T1 | Bilingüe real ES base + EN completo en navegación, estados y CTAs | ✅ | Secciones IOS_SECTION_COPY_I18N + WEB_SECTION_COPY_I18N con tablas ES→EN: nav, CTAs, estados, títulos, errores y notificaciones push |
| F3-T2 | Estados UX por pantalla crítica (`default/loading/empty/error/offline/success/denied`) | ✅ | Lanes `IOS_AUTH_CRITICAL_STATES`, `IOS_TRAINING_CRITICAL_STATES`, `WEB_DASHBOARD_CRITICAL_STATES`, `WEB_ATHLETES_CRITICAL_STATES` con 6 estados c/u + CTAs de recuperación |
| F3-T3 | Accesibilidad base para handoff (jerarquía, foco, contraste, tamaños táctiles) | ✅ | `IOS_SECTION_A11Y_CHECKLIST` con 4 categorías: jerarquía tipográfica, contraste dark mode, tamaños táctiles HIG, foco+teclado+ARIA |
| F3-T4 | Mapa maestro de flujos iOS + Web con nodos y decisiones | ✅ | `IOS_GLOBAL_FLOW` expandido con 4 tracks (Primera apertura, Onboarding, Loop diario, Edge cases). `WEB_GLOBAL_FLOW` con Access, Loop coach, Admin ops, Edge cases web |

## Fase 4 - QA duro y handoff a implementación
| ID | Task | Estado | Criterio de aceptación |
|---|---|---|---|
| F4-T1 | QA layout estricto (0 overflow, 0 solapes, 0 desalineaciones) | ✅ | PASS — NxUZ5 expandido a 36000px, 0 clips, 0 overflow |
| F4-T2 | QA consistencia visual por secciones (ritmo, jerarquía, espaciado) | ✅ | PASS — pitch black + zinc + lime uniforme, jerarquía tipográfica consistente, 0 clips |
| F4-T3 | Handoff técnico por sección (pantallas + elementos + flujo) | ✅ | `WEB_SECTION_HANDOFF_NOTES`: componentes iOS+Web, 31 eventos analytics `flux.<platform>.<domain>.<action>`, stack técnico, prioridades P0/P1/P2 S1 MVP |
| F4-T4 | Cierre y congelación del board canónico | ✅ | Board canónico v1.0 entregado. `flux.pen` estable con BOARD_IOS_APP + BOARD_WEB_APP. NxUZ5 37000px, 0 clipping, style guide mobile-03-darkbold_light aplicado. |

## Estado final — Board canónico v1.0 (2026-02-27)

**flux.pen** está listo para handoff a implementación.

### Inventario de secciones iOS (BOARD_IOS_APP)
| Sección | Contenido |
|---|---|
| IOS_SECTION_AUTH_ONBOARDING | Dark + Dark States + Light + Light States + Critical States (6) |
| IOS_SECTION_TODAY_TRAINING | Dark + Light + Critical States (6) |
| IOS_SECTION_EXERCISE_VIDEO | Dark + Light (IOS-005, IOS-006, IOS-007) |
| IOS_SECTION_PROGRESS_NUTRITION | Dark + Light |
| IOS_SECTION_AI_SETTINGS_LEGAL | Dark + Light |
| IOS_SECTION_COPY_I18N | Tablas ES→EN: nav, CTAs, estados, títulos, errores, push |
| IOS_SECTION_A11Y_CHECKLIST | Jerarquía, contraste, táctiles HIG, foco+ARIA |
| IOS_GLOBAL_FLOW | 4 tracks: Primera apertura, Onboarding, Loop diario, Edge cases |

### Inventario de secciones Web (BOARD_WEB_APP)
| Sección | Contenido |
|---|---|
| WEB_SECTION_SHELL_COMPONENT | WEB_SHELL (reusable: true) — sidebar + topbar + breadcrumbs |
| WEB_SECTION_ACCESS_AND_DASHBOARD | Login/Recover + Dashboard KPIs/Readiness/Alerts + Critical States (6) |
| WEB_SECTION_ATHLETES | Desktop + Tablet + Critical States (6) |
| WEB_SECTION_PLANS_CMS | Desktop + Tablet (Plans Builder + Exercise CMS) |
| WEB_SECTION_ANALYTICS_AI_ADMIN | Desktop + Tablet (Progress + AI Insights + Admin) |
| WEB_SECTION_NUTRITION_OPS | Desktop + Tablet (Logs + Alertas + Coach view) |
| WEB_SECTION_COPY_I18N | Tablas ES→EN: nav sidebar, CTAs, estados, roles, push |
| WEB_GLOBAL_FLOW | Role flows + 4 tracks: Access, Coach loop, Admin ops, Edge cases |
| WEB_SECTION_HANDOFF_NOTES | Componentes, analytics events, stack técnico, prioridades MVP |

## Sprint correctivo v1.1 (2026-02-28)

### Correcciones web aplicadas
- Todos los screens web reconstruidos de 320×340px → **1440×768px desktop** con sidebar 240px + main area real.
- `WEB_SECTION_PLANS_CMS` (main + secondary lanes): WEB-300 a WEB-410 reemplazados con content real.
- `WEB_SECTION_ANALYTICS_AI_ADMIN` (main + secondary lanes): WEB-500 a WEB-800 reemplazados.
- `WEB_SECTION_NUTRITION_OPS` (main + secondary lanes): WEB-N100 a WEB-N210 construidos de cero.
- Lanes actualizadas de `layout:vertical` → `layout:horizontal, height:820` para screens side-by-side.

### Correcciones iOS aplicadas
- **Status bar (44px)** añadida a todos los dark lane post-login screens (18 screens: Training, Nutrition, Settings).
- **Tab bar (83px, 5 tabs: Hoy / Entreno / Progreso / Nutricion / IA)** añadida con tab activo correcto por sección.
- `IOS_SECTION_EXERCISE_VIDEO` mini-screens (5 pantallas 210px) expandidas → **393×852px** con chrome completo.

## TODO pendiente post-handoff
- Validar densidad final web (compacta vs cómoda) con datos reales de producción.
- Verificar prioridades de implementación si hay recorte de alcance de release S1.
- Implementar axe-core en pipeline CI antes de release.
- Aplicar status bar + tab bar a light lanes iOS (opcional, baja prioridad).
- Rellenar espacio vacío en screens Training/Nutrition/Settings entre content y tab bar.
