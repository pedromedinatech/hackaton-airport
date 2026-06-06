# Patrones de descubrimiento de eventos — Fever / Luma

Patrones de discovery que inspiran el feed de recomendaciones de AirArrival.

## Tarjeta de recomendación
- Imagen/hero destacada + **badge de categoría** + título + resumen corto (2 líneas).
- **"Por qué se recomienda"** explícito (regla de CLAUDE.md): interés, abierto ahora / empieza
  pronto, cercanía. Implementado en `RecommendationCard` + `recommender.ts` (`primaryReason`).
- Meta compacta: zona, rating, precio desde (o "gratis").

## Feed
- Sección **"Happening tonight"** (carrusel de ítems con hora) + **"Recommended for you"**
  (lista vertical rankeada).
- **Filtros por interés** no bloqueantes (chips) que reordenan en vivo, sin onboarding pesado.

## Detalle de evento
- Hero, categoría, rating, resumen, bloque "por qué", info (precio/horario/distancia) y
  CTAs **Guardar** / **Reservar** (demo) + **"Cómo llegar"** enlazado a Transporte.

## Estados
- Skeletons al cargar, estado vacío diseñado ("sin coincidencias / quita un filtro").
