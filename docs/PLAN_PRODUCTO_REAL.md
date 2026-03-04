# PLAN PRODUCTO REAL — Flux Training

## Estado del documento
- HISTORICO INVALIDADO en `F1-T2` del plan activo.
- Las tareas marcadas como `✅` en Fases 2-5 fueron reabiertas por falta de validacion runtime pantalla a pantalla.
- Evidencia de reapertura: `docs/validation/MVP_T1_2_REOPENED_CLOSURES_V1.csv`.

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
| Cerrar separacion demo vs productivo | ⛔ | Cierre invalido: reabierto por baseline runtime |
| Endurecer auth + autorizacion por endpoint | ⛔ | Cierre invalido: reabierto por baseline runtime |
| Validar smoke de APIs criticas | ⛔ | Cierre invalido: reabierto por baseline runtime |

## Fase 3 — Web productiva real
| Task | Estado | Resultado esperado |
|---|---|---|
| Quitar hardcode `demo-user` | ⛔ | Cierre invalido: reabierto por evidencia de hardcode |
| Cerrar login y operacion con backend real | ⛔ | Cierre invalido: reabierto por baseline runtime |
| Completar estados de pantalla | ⛔ | Cierre invalido: reabierto por baseline runtime |

## Fase 4 — iOS productiva real
| Task | Estado | Resultado esperado |
|---|---|---|
| Crear app real en `apps/ios` | ⛔ | Cierre invalido: reabierto por baseline runtime |
| Sustituir gateways in-memory/demo | ⛔ | Cierre invalido: reabierto por evidencia de factories demo |
| Navegacion final por secciones | ⛔ | Cierre invalido: reabierto por brecha de flujo/pantallas |

## Fase 5 — Cierre de producto
| Task | Estado | Resultado esperado |
|---|---|---|
| Matriz de paridad Pencil->Codigo | ⛔ | Cierre invalido: reabierto por baseline runtime |
| QA funcional E2E iOS/Web/Backend | ⛔ | Cierre invalido: reabierto por falta de evidencia por pantalla |
| Gate final MVP productivo | ⛔ | Cierre invalido: reabierto |
