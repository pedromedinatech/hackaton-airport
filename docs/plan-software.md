# Plan B — Software: arquitectura del tracker de maletas

> **Regla de oro:** los datos **no están hardcodeados en la UI**. La UI lee de una **API**
> que devuelve eventos en **formato IATA 753**. Hoy esa API la alimenta un **simulador**;
> mañana, el feed real de la aerolínea. *La app no nota la diferencia: solo cambia la fuente.*
> Esa frase es la respuesta a "¿cómo lo habéis hecho?" → arquitectura seria, no truco.

## Por qué esto gana credibilidad
| ❌ Hardcode en componente | ✅ API + contrato de datos |
|---|---|
| La pantalla "sabe" el guion | La pantalla solo lee datos |
| "¿Esto es real?" → te pillan | "Estándar IATA, hoy sintético" → impresionas |
| Imposible extender | Cambias la URL y es real |

---

## Arquitectura (capas)

```
Cámara (escaneo)  ─┐
Entrada manual    ─┼─► tag (license plate 10 díg.)
Demo tags         ─┘
                       │
         localStorage (zustand, sin login)  ← maletas vinculadas
                       │
   SWR poll ──► GET /api/bag/{tag}/events ──► Simulador (formato IATA 753)
                       │                              │ (futuro: feed aerolínea)
        deriveStatus(events, now) [función pura]
                       │
        { stage, etaMin, belt, reason, timeline }
                       │
   UI: Hero de estado + Timeline + capa "mientras esperas" (recommender)
```

---

## Módulo nuevo: `src/features/baggage/`

### `types.ts` — el contrato (formato IATA 753)
```ts
export type BagEventType =
  | "BagCheckedIn"   // facturada en el mostrador
  | "BagScreened"    // pasó seguridad
  | "BagLoaded"      // cargada en el avión
  | "FlightDep"      // vuelo despegó
  | "BagTransfer"    // cambio en conexión (connection: "OK" | "MISSED")
  | "BagUnloaded"    // descargada en destino
  | "BagOnBelt"      // en la cinta (belt)
  | "BagCollected";  // recogida (la marca el usuario)

export interface BagEvent {
  type: BagEventType;
  station: string;      // IATA del aeropuerto (MAD, FRA, IAS…)
  ts: string;           // ISO 8601
  flight?: string;      // p.ej. "LH 1664"
  belt?: string;
  connection?: "OK" | "MISSED";
}

export interface BagJourney {
  bagTag: string;       // license plate 10 díg.
  passengerName?: string;
  origin: string;
  connection?: string;  // estación de conexión, si la hay
  destination: string;  // "IAS"
  events: BagEvent[];
}

export type JourneyStage =
  | "checked_in" | "loaded" | "in_air"
  | "connection_ok" | "arrived" | "on_belt"
  | "collected" | "delayed";

export interface BagStatus {
  stage: JourneyStage;
  etaMin: number | null;     // min hasta cinta / null
  belt: string | null;
  reasonKey: string;         // clave i18n del "por qué"
  lastEvent: BagEvent;
  timeline: { event: BagEvent; done: boolean }[];
}
```

### `deriveStatus.ts` — función pura testeable
`(journey, now) => BagStatus`. Mapea el último evento al `stage`, calcula `etaMin`
(con tiempo medio de cinta del aeropuerto), arma el `timeline` (done/pending) y elige
`reasonKey`. **Esto se testea con Vitest** (encaja con `recommender.test.ts` ya existente).

### `simulator.ts` — genera eventos realistas
`buildJourney(profile, clock)`: dado un perfil de viaje (origen, conexión?, destino IAS,
horarios programados) y un reloj, devuelve los eventos cuyo `ts <= now`. Un **reloj
acelerado** (1 min real = N min de viaje) hace que el timeline avance **en vivo** durante
la demo. Perfiles preconfigurados para demo tags.

### `client.ts`
`useBagJourney(tag)` con SWR (`refreshInterval` ~5s) → consulta la API → `deriveStatus`.
El polling **sustituye al push**: la web se auto-refresca serena.

---

## API route: `src/app/api/bag/[tag]/route.ts`
`GET` → busca el perfil del tag → `simulator.buildJourney(profile, Date.now())` → JSON.
Es el **punto de conmutación**: el día de mañana, aquí se llama al feed real. El frontend
no cambia ni una línea. (Server-side → respeta "no API keys en cliente".)

---

## Escaneo de etiqueta
- **Primario:** `BarcodeDetector` API del navegador (sin dependencias) sobre la cámara.
- **Fallback:** lib ligera (`@zxing/browser` o `html5-qrcode`) si el navegador no soporta.
- **Manual:** input del número de 10 dígitos.
- **Demo:** 2-3 **demo tags** preconfigurados (botones) → cero riesgo en vivo.
- Tras escanear → guardar en `localStorage` vía zustand (patrón de `usePreferences`). **Sin login** (regla dura).

---

## Persistencia y estado
- Store zustand `useBags` (tags vinculados, viaje activo) — espejo de `useSavedItems`/`usePreferences`.
- Sin backend de usuario, sin datos personales persistidos sin consentimiento (GDPR / regla dura).

---

## Rutas / navegación (sobre lo ya existente)
Ya hay route groups `(app)` y `(standalone)/welcome`. Propuesta:

```
(standalone)/welcome        → onboarding + escaneo
(app)/                      → 🧳 Maleta (home): hero estado + timeline
(app)/iasi   (o reuse home) → 📍 En Iași: transporte + recomendaciones (existente)
(app)/help                  → 🆘 maleta retrasada / contacto / FAQ
/bag/[tag]/live             → ruta PÚBLICA solo-estado (enlace compartible, sin nav)
```
Refactor de `BottomNav` a 3 destinos (Maleta / En Iași / Ayuda).

---

## Reutilización (no tiramos nada de lo construido)
- `ArrivalContextStrip` → cabecera de la etapa "aterrizaje".
- `HomeFeed` + `recommender` + `transport` → capa "mientras esperas" (etapa 7).
- `useSavedItems` → "guarda tu viaje" (etapa 8).
- `Skeleton`, `Badge`, `EmptyState`, `Tabs`, `OfflineBanner` → directos.
- Datos `belt` de `flights.iasi.json` → coherencia con el tracker.

---

## "La tecnología está por ver" — qué decir al jurado
- La llave universal es el **bag tag license plate** (10 díg.) que imprime la aerolínea.
- En producción, se consulta por ese número al feed de la aerolínea (WorldTracer /
  BagJourney / mensajería IATA 753). **No depende del hardware del aeropuerto destino.**
- Fallback elegante sin señal: ETA por horario + última ubicación conocida → la
  incertidumbre **también está diseñada**.

---

## Plan de implementación (orden sugerido)
1. `features/baggage/types.ts` + `deriveStatus.ts` + **test Vitest**.
2. `simulator.ts` + perfiles demo + `app/api/bag/[tag]/route.ts`.
3. `client.ts` (SWR poll) + store `useBags`.
4. UI: Hero de estado + Timeline (mobile 390px, skeleton, i18n en/ro).
5. Escaneo (BarcodeDetector + fallback + demo tags) en `welcome`.
6. Refactor `BottomNav` (3 tabs) + enganchar capa "mientras esperas".
7. Ruta pública `/bag/[tag]/live` (enlace compartible).
8. Reloj acelerado + disparador oculto para el clímax de demo.
9. `npm run check:quality`.

## Relación con el Plan A
- Etapa 2 (activación) = escaneo. Etapas 3-7 = simulador+API+deriveStatus.
  Etapa 7 = recommender. Enlace compartible = `/bag/[tag]/live` = bucle de crecimiento.
