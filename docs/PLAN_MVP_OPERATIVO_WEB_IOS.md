# PLAN ACTIVO - MVP OPERATIVO (ORQUESTACION)

## Leyenda
- ✅ Hecho
- 🚧 En construccion (maximo 1 global)
- ⏳ Pendiente
- ⛔ Bloqueado

## Objetivo
Orquestar la entrega del MVP operativo real con tracking separado por plataforma y una sola task global en `🚧`.

## Documentos canonicos por plataforma
- iOS: `docs/PLAN_IOS_MVP_OPERATIVO.md`
- Web: `docs/PLAN_WEB_MVP_OPERATIVO.md`

## Alcance canonico total
- Total pantallas: **121**
- iOS: **66**
- Web: **55**

## Fases comunes (cross-plataforma)
| Fase | Task | Estado | Resultado esperado |
|---|---|---|---|
| F1 | Inventario canonico 121/121 + cobertura base | ✅ | Base unica de seguimiento pantalla a pantalla |
| F1 | Reabrir cierres no validados en runtime | ✅ | Estado real alineado con funcionamiento |
| F1 | Priorizacion por impacto de usuario | ✅ | Orden de ejecucion sin desviaciones |
| F2 | Auth real de sesion (email/password + Apple) | ✅ | Sesion valida para Web+iOS sin bypass |
| F2 | RBAC por endpoint y dominio | ✅ | Permisos consistentes por rol |
| F2 | Persistencia real (Firestore) sin in-memory | ✅ | Datos durables end-to-end |
| F2 | Errores observables (codigos + correlationId) | ✅ | Debug y soporte operativos |
| F5 | QA funcional E2E iOS/Web/Backend | ✅ | Flujos completos sin roturas |
| F5 | Paridad final Pencil -> Codigo | 🚧 | 121/121 pantallas funcionales y trazables |
| F5 | Gate MVP y checklist release | ⏳ | Producto usable por usuarios reales |

## Estado activo global
- iOS: sin task en construccion (66/66 en ✅)
- Web: `✅ 55/55 pantallas en operativo`
- Siguiente global: `🚧 F5 Paridad final Pencil -> Codigo`
- Avance F5 (runtime local funcional): autenticacion Web+iOS ahora permite fallback local controlado (solo `localhost/127.0.0.1`) para validar flujo E2E contra `backend:start:demo` sin bloqueo por credenciales Firebase/Apple ausentes.
