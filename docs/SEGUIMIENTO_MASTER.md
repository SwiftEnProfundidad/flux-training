# SEGUIMIENTO MASTER — Flux Training

## Leyenda
- ✅ Hecho
- 🚧 En construccion (maximo 1)
- ⏳ Pendiente
- ⛔ Bloqueado

## Estado global
- Base tecnica multi-plataforma construida (contracts + backend + web + ios).
- APIs y tests en verde, pero con partes demo todavia visibles en la experiencia final.
- Objetivo actual: convertir demo a producto real usable en iOS/Web con persistencia y auth real.

## Trazabilidad consolidada (resumen humano)
- Se cerraron ciclos previos de UI/UX, hardening y rollout tecnico.
- Se validaron contratos, estados runtime y cobertura de test critica.
- Se detecto deuda principal de producto: identidad de usuario demo, persistencia parcial y flujo visual no totalmente acoplado a Pencil.

## Decisiones activas
- Backend productivo: Firebase Functions + Firestore.
- Idioma base: ES, secundario: EN.
- Fuente UI: hibrido (`flux.pen` + prompt Pencil para huecos).
- Alcance de salida inmediata: MVP productivo funcional, sin mock estatico.

## Ciclo activo (producto real)
| Fase | Task | Estado |
|---|---|---|
| F1 | Limpieza de tracking y artefactos de seguimiento | ✅ |
| F2 | Backend productivo con auth/persistencia real end-to-end | 🚧 |
| F3 | Web productiva sin `demo-user`, con sesion real | ⏳ |
| F4 | iOS productiva con navegacion final y gateways reales | ⏳ |
| F5 | Paridad Pencil -> codigo + QA final de release | ⏳ |

## Regla de operacion
- Solo una task en `🚧`.
- Al cerrar task: marcar `✅` y mover la siguiente a `🚧`.
