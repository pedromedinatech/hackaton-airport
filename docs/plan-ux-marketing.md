# Plan A — UX & Marketing: el pipeline del pasajero

> **Pivote:** de "recomendaciones al aterrizar" a **"la capa de calma del equipaje"**.
> No somos aeropuerto ni aerolínea. Somos la capa neutral que vive con el pasajero
> y convierte datos dispersos de distintas aerolíneas en **una sola experiencia de tranquilidad**.
> Las recomendaciones (lo ya construido) pasan a ser **el durante-la-espera**, no el producto.

## Posicionamiento en una frase
> *"Los datos de tu maleta ya existen. Lo que no existe es alguien que los convierta en paz mental. Eso hacemos."*

- **No competimos en tracking.** La aerolínea ya registra la maleta (norma IATA 753, 4 puntos). Competimos en la **experiencia** que ellas muestran fatal.
- **Agnósticos:** cualquier aerolínea, cualquier aeropuerto, un solo sitio. La app de Wizz solo trackea Wizz; nosotros, todo.
- **Sin fricción:** sin login, sin instalar. Escaneas y ya.

---

## El pipeline del pasajero (y qué muestra la web en cada paso)

Como es web (no app nativa) **no hay push**. La estrategia: la web es una **superficie de consulta serena**, glanceable, que el usuario abre cuando le entra la duda — y siempre le devuelve calma. La compensación al push:
- **PWA "Add to home screen"** → acceso de 1 toque.
- **Enlace de estado en vivo compartible** → el bucle de crecimiento.
- (Futuro) Web Push como mejora, no como dependencia de la demo.

| # | Etapa del viaje | Estado emocional | Qué muestra la web | Reutiliza |
|---|---|---|---|---|
| 1 | **Awareness** (bag drop) | "¿Y si se pierde?" | QR junto al mostrador → abre la web | — |
| 2 | **Activación** (escaneo) | Curiosidad | Escanea etiqueta → vincula maleta, sin login | `WelcomeScreen` |
| 3 | **Espera salida** | Alivio inicial | "Facturada y cargando en tu vuelo" ✅ | — |
| 4 | **Vuelo / conexión** | **Pico de ansiedad** | "Tu maleta va a bordo / hizo la conexión" | — |
| 5 | **Aterrizaje** | Expectación | "Aterrizó contigo. Descargando…" | `ArrivalContextStrip` |
| 6 | **Camino a la cinta** | Impaciencia | "Cinta 2 · ~7 min · cómo llegar" | datos de `belt` |
| 7 | **Espera en cinta** | Tiempo muerto | ETA sereno **+ recomendaciones cerca** | `HomeFeed`, `recommender`, `transport` |
| 8 | **Recogida** | Alivio total | "¡Recogida! Guarda tu viaje" | `useSavedItems` |
| 9 | **Excepción** (retraso/pérdida) | Frustración/miedo | Guía de reclamación (PIR), contacto, estado | nuevo |

**Insight de diseño:** la etapa 4 (conexión) es donde TODO viajero sufre. Si la web resuelve *explícitamente* ese momento, el jurado que ha viajado lo siente en el cuerpo. Es el clímax — no desperdiciarlo.

---

## Navegación / IA de la web

**Flujo de entrada (antes de la nav):** `Welcome → Escanear etiqueta → Home de maleta`

**Bottom nav nueva (3 destinos, mobile-first 390px):**
1. **🧳 Maleta** — *home / héroe.* Estado actual + timeline del viaje + ETA. Estado de calma persistente ("Todo bajo control").
2. **📍 En Iași** — qué hacer: transporte + sitios cerca (lo ya construido), contextual: "mientras esperas" / "al salir".
3. **🆘 Ayuda** — maleta retrasada, contactos, FAQ, reclamación.

> El "Guardado/Trip" puede vivir dentro de Maleta (historial de viajes) en vez de ocupar un tab.

**Principios UX (foco emocional):**
- **Lenguaje humano, no técnico.** "Tu maleta va contigo", no "Bag status: in transit".
- **El "por qué" contextual** (ya en CLAUDE.md): *"Te avisamos ahora porque las maletas en esta terminal tardan ~11 min"*.
- **La ausencia de ansiedad ES el producto:** check verde grande, tono primera persona, cero jerga.
- i18n **en + ro** desde el inicio (Iași = Rumanía).

---

## Marketing: resolver la discovery (el problema real)

**Reframe clave:** el canal principal NO es la promoción previa. Es el **momento del bag drop**, donde nace la etiqueta y la ansiedad a la vez.

### Canales por prioridad
1. **QR en el bag drop / resguardo de la etiqueta** *(canal primario).* Te encuentra en el segundo exacto en que te importa.
2. **Enlace de estado en vivo compartible** *(bucle de crecimiento).* "Sigue mi maleta aquí" → quien te recoge descubre el producto sin facturar nada. Caso de uso real + viralidad.
3. **Web del Aeropuerto de Iași + pantallas en sala.**
4. **Emails de confirmación de aerolíneas** que vuelan a IAS (Wizz Air, Ryanair, TAROM, Lufthansa, Austrian, HiSky — las del seed real).
5. **Webs de turismo/ciudad de Iași, hoteles y Airbnb** (info de bienvenida).
6. **Universidad (UAIC):** Iași es ciudad estudiantil enorme → estudiantes internacionales que vuelven cada curso = usuarios recurrentes.

### Bucle de crecimiento
`Pasajero escanea` → `comparte enlace en vivo con quien le recoge` → `el receptor descubre el producto` → `lo usa en su próximo viaje`. Acquisition gratis y orgánica.

### Métricas
- **Activación:** nº de escaneos / facturaciones.
- **Engagement:** aperturas durante el viaje (pico en etapa 4).
- **Crecimiento:** enlaces compartidos abiertos.
- **Norte:** "índice de paz mental" (encuesta 1-toque post-recogida).

### Ruta de partnership (pitch de viabilidad)
Aeropuerto de Iași (piloto local, control del bag drop) → aerolíneas (feed IATA 753) → expansión multi-aeropuerto. El aeropuerto gana: menos consultas en mostrador, mejor satisfacción, datos de flujo.

---

## Guion de demo (90s, arco tensión→alivio)
- **Acto 1 — Miedo (5s):** "26M de maletas se pierden al año. Pero el problema no es la maleta: es esto" → cinta vacía.
- **Acto 2 — El viaje sereno:** escaneo → secuencia de micro-momentos de calma (cargada → conexión OK → aterrizó → "cinta 2, ~6 min, relájate").
- **Acto 3 — Alivio (5s):** "No es un tracker. Es paz mental."

> Mecánica: timeline auto-simulado con reloj acelerado + disparador manual oculto para el clímax (ver Plan B).

---

## Relación con el Plan B (software)
- El **escaneo** (etapa 2) → entrada del sistema; la llave es el "license plate" de 10 dígitos.
- El **timeline + ETA** (etapas 3-7) → lo alimenta el simulador vía API con formato IATA 753.
- El **durante-la-espera** (etapa 7) → reutiliza `recommender` / `transport` / `HomeFeed`.
- El **enlace compartible** → ruta pública de solo-estado por tag.
