## Why

La integracion de Pumuki en este repo enterprise esta generando bloqueos de flujo
(SDD, evidence, hooks) que deben documentarse de forma trazable para acelerar su mejora.

## What Changes

- Crear una fuente de verdad para registrar bugs y mejoras de Pumuki detectados en runtime real.
- Definir campos minimos de evidencia para cada hallazgo.
- Añadir regla de proceso para actualizar este registro en cada iteracion.

## Capabilities

### New Capabilities
- `pumuki-integration-feedback`: Registro estructurado de bugs/mejoras de Pumuki con evidencia y estado.

### Modified Capabilities
- Ninguna.

## Impact

- Documentacion: `docs/BUGS_Y_MEJORAS_PUMUKI.md`, `README.md`, `AGENTS.md`.
- Operacion: mejor trazabilidad de incidencias del framework durante desarrollo.
