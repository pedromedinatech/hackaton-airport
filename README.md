# AirArrival · Aeropuerto de Iași (IAS)

PWA **mobile-first** que da la bienvenida al pasajero recién aterrizado en **Iași**: recomendaciones
personalizadas (eventos, conciertos, museos, bodegas, galerías, restaurantes, coworking,
conferencias), **servicios aeroportuarios** al estilo de la app de **Changi (Singapur)** y opciones
de **transporte** hacia la ciudad. Construida para un hackathon — pensada para un pitch de 3 minutos.

## Stack
Next.js 14 (App Router) · React 18 · TypeScript · Tailwind CSS · next-intl (RO/EN) ·
Zustand · Framer Motion · `@ducanh2912/next-pwa` (service worker + offline) · Vitest · Playwright.

Paleta: azul profundo `#0A1628` + verde eléctrico `#00D4AA` + blanco. Viewport primario 390×844.

## Puesta en marcha
```bash
npm install
npm run dev            # http://localhost:3000  (redirige a /en)
```
La app es **multi-idioma**: `/en` y `/ro`. Cambia el idioma con el botón de la barra superior.

### Otros comandos
```bash
npm run build          # build de producción (genera el service worker)
npm run start          # sirve el build (PWA/offline activos — el SW se desactiva en dev)
npm run test           # tests unitarios del recomendador (Vitest)
npm run test:e2e       # e2e móvil a 390px (Playwright)
npm run lighthouse     # auditoría PWA/perf (requiere el server en marcha)
npm run check:quality  # lint + tests + build
```

## Cómo funciona
- **Datos semilla** realistas de Iași en [`src/data/seed/`](src/data/seed/) (lugares, vuelos,
  transporte). Sin backend, sin claves, 100% offline.
- **Recomendador por reglas** puro y testeado en
  [`src/features/recommendations/recommender.ts`](src/features/recommendations/recommender.ts):
  puntúa por interés, hora de llegada (abierto ahora / empieza pronto) y cercanía, y genera el
  **“por qué”** de cada tarjeta.
- **Sin onboarding pesado**: el feed muestra valor al instante; los *chips de interés* son
  opcionales y reordenan el feed en vivo. Preferencias y guardados se persisten en `localStorage`.

## Estructura
```
src/
  app/[locale]/        # rutas: home, place/[id], fly, transport, saved
  components/          # layout, cards, feed, ui, detail, fly, saved
  features/            # recommendations, airport-services, transport
  hooks/               # usePreferences, useSavedItems, useOffline, useMounted
  data/seed/           # JSON semilla de Iași
  i18n/ + messages/    # next-intl (en/ro)
```

## Guion de la demo (pitch 3 min)
1. Abrir la app → **“Tocmai ai aterizat la Iași (IAS)”** → feed personalizado al instante.
2. Tocar el chip **Vin/Wine** → las bodegas (Bucium, Gramma, Cotnari) suben con *“Pentru că îți place Vin”*.
3. Abrir un evento → detalle estilo Fever/Luma → **Reservar / Guardar**.
4. Pestaña **Zbor/Fly** → llegadas/salidas en vivo + equipaje + mapa (momento Changi).
5. **Transport** → IAS→centro: Bolt / taxi / autobús / alquiler con tiempo y precio.
6. Cambiar idioma RO↔EN. Instalable como PWA y funciona offline (service worker).

> Reservar es una confirmación demo; los datos de vuelos/eventos son semilla.
