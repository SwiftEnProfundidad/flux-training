# Roadmap v1.1 y Mejora UX

## Objetivo
Entregar una v1.1 centrada en experiencia real de uso diario: interfaz moderna, entrenamientos guiados con video, recomendaciones personalizadas y mejor integración con ecosistema Apple.

## Horizonte propuesto
- Duración objetivo: 8-10 semanas.
- Equipo: 1 dev iOS/web + apoyo IA.
- Criterio de prioridad: impacto en retención semanal y adherencia al plan.

## Frentes de entrega

### 1) UX/UI moderna (Semana 1-3)
- Rediseñar dashboard web/iOS con jerarquía clara (hoy, progreso, siguiente sesión).
- Mejorar onboarding con pasos guiados y feedback de riesgo PAR-Q+.
- Unificar componentes (botones, tarjetas, estados de carga/error, accesibilidad).
- Resultado esperado: reducción de fricción inicial y más sesiones registradas en la primera semana.

### 2) Biblioteca de videos de ejercicios (Semana 2-5)
- Modelo de datos para ejercicio + metadata de video (duración, foco muscular, nivel).
- Reproductor embebido en detalle de ejercicio (web + iOS).
- Fallback cuando no haya video (instrucciones textuales + imagen).
- Resultado esperado: mayor calidad de ejecución y menos abandono durante sesión.

### 3) Recomendaciones IA accionables (Semana 4-7)
- Sugerencias semanales por objetivo: carga, volumen y adherencia nutricional.
- Reglas de seguridad: nunca diagnóstico médico, siempre disclaimer.
- Explicación breve del “por qué” de cada recomendación.
- Resultado esperado: mayor percepción de valor premium y retención.

### 4) HealthKit + Apple Watch refinado (Semana 5-8)
- Sincronizar entrenos y energía activa para completar métricas de progreso.
- Mejorar consistencia offline/online en sincronización de sesiones.
- Resultado esperado: métricas más fiables y hábito diario más sólido.

## KPI de éxito v1.1
- Retención semana 4: +20% vs baseline actual.
- Sesiones completadas por usuario/semana: +25%.
- Ratio de usuarios con onboarding completo: >85%.
- Errores críticos en release check: 0.

## Riesgos y mitigación
- Riesgo: deuda UI entre web e iOS.
  - Mitigación: tokens/estilos compartidos y checklist visual por pantalla.
- Riesgo: videos incompletos o inconsistentes.
  - Mitigación: catálogo mínimo obligatorio por grupos musculares antes de release.
- Riesgo: recomendaciones IA poco útiles.
  - Mitigación: reglas híbridas (heurística + IA) y evaluación semanal.
