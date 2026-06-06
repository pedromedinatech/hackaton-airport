# AirArrival — PWA Mobile-First para Pasajeros en Aeropuertos

## Project Overview
PWA mobile-first que ofrece a pasajeros recomendaciones personalizadas para su llegada: eventos, conciertos, museos, bodegas, galerías de arte, restaurantes, coworking, conferencias y transporte local. Inspirada en Changi Airport (servicios aeroportuarios fluidos), Luma (descubrimiento de eventos tech), Fever y AllEvents (eventos en vivo y venta de entradas).

## Target Users & Priorities
Pasajeros internacionales recién aterrizados, principalmente en móvil. Prioridades: baja latencia, offline-first, UX simple y rápida, accesibilidad WCAG AA, multi-idioma.

## Tech Stack
- **Framework**: Next.js 14 (App Router), React 18, TypeScript
- **Estilos**: Tailwind CSS (mobile-first breakpoints)
- **PWA**: next-pwa + service workers para offline
- **Estado**: Zustand (ligero, sin boilerplate)
- **Animaciones**: Framer Motion (micro-interacciones móvil)
- **i18n**: next-intl
- **Testing**: Vitest + Playwright (e2e móvil)

## Key Commands
```bash
npm run dev          # Desarrollo local
npm run build        # Build de producción
npm run test         # Tests unitarios (Vitest)
npm run test:e2e     # Tests e2e móvil (Playwright, viewport 390px)
npm run lighthouse   # Auditoría PWA/performance
npm run check:quality # Bucle de verificación de calidad (ver abajo)
```

## Project Structure
```
src/
  app/              # Next.js App Router (layout, pages)
  components/       # Componentes reutilizables (EventCard, TransportCard, etc.)
  features/
    recommendations/  # Motor de recomendaciones personalizadas
    airport-services/ # Equipaje, reservas, pagos aeroportuarios
    events/           # Integración Luma/Fever/AllEvents-style
    transport/        # Opciones de transporte local
  hooks/            # Custom hooks (useLocation, usePreferences, useOffline)
  lib/              # Utils, API clients, tipos
  styles/           # Variables CSS globales, temas
docs/
  changi-patterns.md    # Patrones UI/UX de referencia Changi
  event-discovery.md    # Patrones de descubrimiento de eventos
  api-integrations.md   # Guía de APIs externas
```

## Coding Conventions (solo las no-default)
- **UI style**: Limpio y aeroportuario — paleta azul profundo (#0A1628) + verde eléctrico (#00D4AA) + blanco. Tipografía: display bold para títulos, sans-serif para cuerpo.
- **Cards**: Componente `<EventCard>` y `<TransportCard>` reutilizables con skeleton loaders.
- **Touch**: Todos los tap targets mínimo 44×44px. Swipe gestures para carruseles.
- **Imágenes**: `next/image` siempre, con lazy loading. WebP obligatorio.
- **Fetch**: SWR para datos remotos. Cache agresivo en service worker.
- **Componentes**: Máximo ~150 líneas. Divide antes de crecer.

## Hard Rules — NUNCA VIOLAR
- ❌ No exponer API keys en el cliente. Usar variables de entorno server-side únicamente.
- ❌ No pedir login pesado para recomendaciones básicas (preferencias locales primero).
- ❌ No renders bloqueantes en móvil. Skeleton loaders siempre.
- ❌ No ignorar offline: toda la UI debe degradarse gracefully sin red.
- ✅ Datos de ubicación: pedir permiso explícito, no persistir sin consentimiento (GDPR).
- ✅ Accesibilidad: aria-labels en iconos, contraste WCAG AA mínimo.
- ✅ Viewport de prueba primario: 390×844px (iPhone 14). Siempre testear aquí primero.

## Workflows
1. **Features nuevas**: Usar Plan Mode → diseñar componentes → implementar → ejecutar `npm run check:quality`.
2. **Prioridad de UX**: Mobile → tablet → desktop. Nunca al revés.
3. **Recomendaciones**: Siempre mostrar "por qué se recomienda" (contexto: hora de llegada, intereses, destino).
4. **Referencia Changi**: Para flujos de reserva y servicios aeroportuarios, consultar `docs/changi-patterns.md`.
5. **Referencia Fever/Luma**: Para discovery de eventos, consultar `docs/event-discovery.md`.

---

## 🔄 Quality Verification Loop

**Ejecutar `npm run check:quality` al terminar cada feature o sesión de trabajo.**

El script automatiza las verificaciones, pero Claude también debe ejecutar este checklist mental antes de dar cualquier tarea por terminada:

### Iteración 1 — Funcionalidad Base (cada componente nuevo)
- [ ] ¿Renderiza correctamente en 390px sin overflow horizontal?
- [ ] ¿Los estados de carga tienen skeleton loader?
- [ ] ¿El estado de error está manejado y visible para el usuario?
- [ ] ¿Funciona offline (o degrada con mensaje claro)?
- [ ] ¿Los tap targets son ≥44×44px?

### Iteración 2 — Calidad de Código (cada PR/commit significativo)
- [ ] ¿El componente tiene <150 líneas? Si no, dividir.
- [ ] ¿No hay API keys hardcodeadas?
- [ ] ¿Los tipos TypeScript están definidos (no `any` sin justificación)?
- [ ] ¿Las imágenes usan `next/image` con `alt` descriptivo?
- [ ] ¿Los tests unitarios pasan (`npm run test`)?

### Iteración 3 — UX y Accesibilidad (cada feature completa)
- [ ] ¿Contraste de color ≥4.5:1 (WCAG AA)?
- [ ] ¿Iconos tienen `aria-label`?
- [ ] ¿La navegación es usable con teclado/screen reader?
- [ ] ¿Los textos están preparados para i18n (sin strings hardcodeados en JSX)?
- [ ] ¿Las animaciones respetan `prefers-reduced-motion`?

### Iteración 4 — Performance PWA (al finalizar cada módulo principal)
- [ ] Lighthouse PWA score ≥90 (`npm run lighthouse`)
- [ ] LCP <2.5s en red 4G simulada
- [ ] No JS bloqueante en el critical path
- [ ] Service worker cacheando assets estáticos y llamadas de API críticas
- [ ] Installable como PWA (manifest válido, HTTPS, service worker activo)

### Iteración 5 — Revisión Final de Demo (antes de cada presentación)
- [ ] Flujo completo probado: aterrizaje → recomendaciones → detalle de evento → reserva/transporte
- [ ] Funciona en modo avión (offline)
- [ ] Sin console.errors en producción
- [ ] Sin datos de usuario hardcodeados o datos de prueba visibles
- [ ] La app se puede instalar en un móvil real

**Si algún check falla → corregir antes de continuar. No acumular deuda de calidad.**

---

## Mistakes to Avoid (actualizar tras cada sesión)
- No crear páginas con scroll horizontal accidental en móvil.
- No usar `position: fixed` sin probar en Safari iOS (comportamiento diferente).
- No olvidar el estado vacío ("sin eventos cerca") — diseñarlo explícitamente.
- No hardcodear ciudad o aeropuerto — la app debe ser multi-aeropuerto desde el inicio.
- No mezclar lógica de negocio dentro de componentes UI — usar hooks o features/.
