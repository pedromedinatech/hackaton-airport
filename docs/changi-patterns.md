# Patrones UI/UX de referencia — Changi App

Notas de los patrones de la app de Changi que AirArrival adapta para Iași.

## Navegación
- **Bottom nav** persistente de 4–5 destinos. AirArrival: Descubre · Vuelo · Transporte · Guardados
  (`src/components/layout/BottomNav.tsx`).
- **Top bar** oscura con marca + acceso a guardados + (aquí) selector de idioma.

## Pantalla "My Flight" (Vuelo)
- Tarjeta de **búsqueda** + **"Scan boarding pass"** como atajo destacado.
- Bloque **"Real-Time Updates / Track Today's Flights"** con tabs **Arrivals / Departures** y chip *Live*.
- Cada vuelo: hora, ruta/ciudad, nº de vuelo + aerolínea, estado (badge) y puerta/cinta.
- Grid de **servicios** (Equipaje, Mapa, Facilities). Ver `src/components/fly/FlyView.tsx`.

## Home "Explore & Fly"
- **Grid de accesos rápidos** con iconos (Vuelos, Transporte, Mapa, Guardados) →
  `src/components/feed/QuickActions.tsx`.
- Tarjetas tipo *card* con imagen, badge de categoría y CTA. Carruseles horizontales con swipe.

## Principios trasladados
- Tap targets ≥44px, esquinas redondeadas generosas, sombras suaves, skeleton loaders.
- Contenido accionable "para ahora" (hora de llegada) por encima de lo genérico.
