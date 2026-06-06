# Integraciones de APIs externas

## Estado actual (hackathon / demo)
AirArrival funciona **sin APIs externas ni backend**: usa **datos semilla** en
[`src/data/seed/`](../src/data/seed/) y un **recomendador por reglas**. Esto garantiza una demo
rápida, fiable y 100% offline, sin exponer claves (regla dura de CLAUDE.md).

## Puntos de extensión futuros
Si se quisiera ir a datos en vivo, estos serían los enganches (siempre **server-side**, nunca con
claves en el cliente):

| Dominio | Fuente potencial | Dónde encaja |
|---|---|---|
| Vuelos IAS (ARR/DEP) | API del aeropuerto / AviationStack / FlightAware | `features/airport-services/` (sustituir `FLIGHTS`) |
| Eventos / entradas | Eventbrite, Fever, AllEvents, Luma | `features/recommendations/` (fuente de `PLACES`) |
| Lugares / mapas | Google Places, OpenStreetMap | enriquecer `Place` (coords, fotos) |
| Transporte | CTP Iași (GTFS), Bolt deeplinks | `features/transport/` |

### Reglas
- Las llamadas con clave van en **Route Handlers** (`src/app/api/…`) o Server Components.
- Cachear de forma agresiva en el service worker y degradar a datos semilla si no hay red.
