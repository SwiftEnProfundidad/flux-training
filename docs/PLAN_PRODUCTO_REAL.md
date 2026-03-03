# PLAN PRODUCTO REAL — Flux Training

## Leyenda
- ✅ Hecho
- 🚧 En construccion (maximo 1)
- ⏳ Pendiente
- ⛔ Bloqueado

## Objetivo
Transformar la base demo en producto real iOS/Web: autenticacion real, persistencia real, navegacion final y paridad funcional con el diseño definido en Pencil.

## Fase 1 — Limpieza y consolidacion documental
| Task | Estado | Resultado esperado |
|---|---|---|
| Consolidar historial en un master legible | ✅ | Contexto unico, simple y trazable |
| Eliminar mds de tracking legacy | ✅ | `docs/` sin ruido de planes antiguos |
| Dejar solo 2 mds activos de seguimiento | ✅ | `SEGUIMIENTO_MASTER.md` y `PLAN_PRODUCTO_REAL.md` |

## Fase 2 — Backend productivo real
| Task | Estado | Resultado esperado |
|---|---|---|
| Cerrar separacion demo vs productivo | ✅ | Rutas reales con persistencia de Firestore |
| Endurecer auth + autorizacion por endpoint | ✅ | Flujo seguro de sesion y permisos |
| Validar smoke de APIs criticas | ✅ | Auth/onboarding/training/nutrition/progress/legal OK |

## Fase 3 — Web productiva real
| Task | Estado | Resultado esperado |
|---|---|---|
| Quitar hardcode `demo-user` | ✅ | Operacion con userId de sesion real |
| Cerrar login y operacion con backend real | ✅ | Flujos funcionales sin fallback estatico |
| Completar estados de pantalla | ✅ | default/loading/empty/error/offline/denied/success |

## Fase 4 — iOS productiva real
| Task | Estado | Resultado esperado |
|---|---|---|
| Crear app real en `apps/ios` | ✅ | Bootstrap de app final sin dependencia host demo |
| Sustituir gateways in-memory/demo | ✅ | Networking y persistencia reales |
| Navegacion final por secciones | 🚧 | Flujo alineado con Pencil para codificar release |

## Fase 5 — Cierre de producto
| Task | Estado | Resultado esperado |
|---|---|---|
| Matriz de paridad Pencil->Codigo | ⏳ | Cobertura de pantallas y estados por plataforma |
| QA funcional E2E iOS/Web/Backend | ⏳ | Evidencia real de flujo completo |
| Gate final MVP productivo | ⏳ | Release candidate sin comportamiento mock |
