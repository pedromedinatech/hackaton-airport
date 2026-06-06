# Inspiración para la Web App — Hackathon Aeroport Iași

> **Concepto central:** Una web app de bienvenida para pasajeros que aterrizan en el Aeropuerto Internacional de Iași (IAS), Rumanía. Muestra qué hacer, adónde ir y qué eventos hay en la ciudad, justo cuando el viajero llega.

---

## 1. Inspiración de Diseño

### 1.1 Fever — [feverup.com/ro/iasi](https://feverup.com/ro/iasi)

**Qué hace bien:**
- Tarjetas de evento con imagen prominente, precio, valoración con estrellas y número de reseñas.
- Filtros por categoría visibles desde el primer scroll: música, exposiciones, experiencias, etc.
- Sección "Candlelight" como experiencia premium diferenciada visualmente.
- Llamada a la acción clara para descargar la app móvil.
- Soporte multilingüe y 24/7 — ideal para turistas internacionales.

**Ideas a adoptar:**
- Tarjetas con rating visible → genera confianza inmediata en el viajero.
- Filtrado por categoría con etiquetas pill/chip arriba del feed.
- Badge de precio desde X RON / gratis en cada tarjeta.
- Sección destacada tipo "Editor's Pick" para el evento más relevante del día.

---

### 1.2 AllEvents — [allevents.in](https://allevents.in)

**Qué hace bien:**
- Tagline emocional: *"Live. Don't Just Exist"* — engancha antes de mostrar contenido.
- Señales de interés social: "X personas interesadas" con avatares → prueba social.
- Organización geográfica clara (país → ciudad → evento).
- Etiquetas de categoría múltiple por evento (ej. `parties`, `pub-crawl`, `entertainment`).
- Optimización de imágenes con formatos modernos (AVIF).

**Ideas a adoptar:**
- Hero con tagline de bienvenida al llegar a Iași (ej. *"Acabas de aterrizar. Ahora empieza la aventura."*).
- Contador de personas interesadas en cada evento → urgencia y popularidad.
- Multi-etiqueta por evento para facilitar el descubrimiento.
- Conversión automática de zona horaria para viajeros internacionales.

---

### 1.3 Luma — [lu.ma](https://lu.ma/home)

**Qué hace bien:**
- Diseño minimalista, muy limpio, fácil de escanear en segundos.
- Segmentación simple: **Próximos** / **Pasados** — no hay fricción cognitiva.
- Header ligero con sólo lo esencial: descubrir eventos, iniciar sesión.
- Footer con app móvil y redes sociales.

**Ideas a adoptar:**
- Interfaz minimalista — el viajero está cansado, no quiere aprender una UI compleja.
- Tabs "Esta semana / Este fin de semana / Este mes" como navegación temporal sencilla.
- Onboarding de cero pasos: no pedir registro para ver eventos.

---

## 2. Propuesta de Diseño para la App

### Paleta de colores sugerida
| Elemento | Color |
|---|---|
| Fondo principal | `#0F0F10` (casi negro, elegante) |
| Fondo tarjeta | `#1A1A1E` |
| Acento primario | `#E8C84A` (oro/ámbar — evoca Rumanía, luz cálida) |
| Texto principal | `#F5F5F5` |
| Texto secundario | `#9A9A9A` |
| Etiqueta gratis | `#2ECC71` |
| Etiqueta de precio | `#E8C84A` |

### Tipografía
- **Headings:** Inter o Geist — sans-serif moderna, legible en pantalla pequeña.
- **Body:** Inter Regular 14–16px.
- **Etiquetas/badges:** Monospace o Inter Medium Uppercase.

### Estructura de pantallas

```
┌─────────────────────────────────┐
│  ✈  Bienvenido a Iași           │  ← Header con hora local + temp
│  Viernes, 6 Jun · 18:23 · 24°C │
├─────────────────────────────────┤
│  [Esta semana] [Fin de semana]  │  ← Tabs temporales
│  [Música] [Arte] [Gastronomía]  │  ← Filtros de categoría
├─────────────────────────────────┤
│  ┌─────────────────────────┐    │
│  │  [Imagen evento]        │    │  ← Tarjeta evento destacado
│  │  ★ Candlelight: Coldplay│    │
│  │  Palatul Culturii       │    │
│  │  Sáb 7 Jun · 120 RON   │    │
│  │  🔥 234 personas        │    │
│  └─────────────────────────┘    │
│  ┌──────────┐ ┌──────────┐      │
│  │ [Img]    │ │ [Img]    │      │  ← Grid 2 columnas
│  │ Evento A │ │ Evento B │      │
│  └──────────┘ └──────────┘      │
└─────────────────────────────────┘
```

### UX para el pasajero recién llegado
- **Sin registro obligatorio** — ver todo sin cuenta.
- **Detección de idioma** del navegador → mostrar en inglés/rumano/español automáticamente.
- **Distancia desde el aeropuerto** en cada evento (ej. "a 4 km").
- **Cómo llegar** con un botón que abre Google Maps / Waze.
- **Modo offline parcial**: guardar eventos favoritos para ver sin conexión.
- **Resumen "Esta noche"** como primera tarjeta siempre visible.

---

## 3. Eventos Reales para la Interfaz (Iași, Rumanía)

> Fuente: Fever Iași — eventos actuales verificados.

### Conciertos y Música

| Evento | Venue | Fecha | Precio | Rating |
|---|---|---|---|---|
| Candlelight: Tributo Coldplay & Imagine Dragons | Palatul Culturii | Por confirmar | desde 120 RON | ★ 5.0 (78 reseñas) |
| Candlelight: Las Cuatro Estaciones de Vivaldi | Palatul Culturii | Por confirmar | desde 120 RON | ★ 4.8 (84 reseñas) |
| Candlelight: Tributo Hans Zimmer | Palatul Culturii | 19 Dic | desde 115 RON | ★ 4.8 (125 reseñas) |
| Candlelight: Clásicos de Navidad | Palatul Culturii | 19 Dic | desde 115 RON | ★ 4.9 (34 reseñas) |

### Experiencias y Cultura

| Evento | Categoría | Descripción breve |
|---|---|---|
| Visita Palatul Culturii | Cultura / Historia | Palacio cultural icónico de Iași, sede de varios museos |
| Piața Unirii nocturna | Gastronomía / Paseo | Plaza central con bares, restaurantes y ambiente nocturno |
| Tour Vino Moldavo | Gastronomía / Tour | Degustación de vinos de la región de Moldavia rumana |
| Gradina Botanică | Naturaleza | Jardín botánico, perfecto para mañanas tranquilas |

### Tarjetas Regalo (Fever)

| Producto | Precio desde |
|---|---|
| Candlelight Gift Card | 300 RON |
| Fever Gift Card (Te iubesc! / La mulți ani!) | 100 RON |

---

## 4. Funcionalidades Clave a Implementar

### MVP (Hackathon)
- [ ] Feed de eventos con tarjetas (imagen, nombre, fecha, precio, categoría)
- [ ] Filtros por categoría (música, arte, gastronomía, familia)
- [ ] Filtro temporal (hoy / este fin de semana / esta semana)
- [ ] Detalle de evento con mapa y botón "Cómo llegar"
- [ ] Pantalla de bienvenida con hora local y temperatura en Iași
- [ ] Soporte bilingüe rumano / inglés

### Nice-to-have
- [ ] Contador de interesados (prueba social)
- [ ] Favoritos guardados localmente
- [ ] Sección "Cerca del aeropuerto" (radio < 5 km)
- [ ] Integración con Google Maps para direcciones
- [ ] QR code en pantallas del aeropuerto que abre la app

---

## 5. Referencias Visuales Clave

| Referencia | Qué robar |
|---|---|
| **Fever** | Tarjetas con rating + precio + imagen grande |
| **AllEvents** | Prueba social ("X interesados") + tagline emocional |
| **Luma** | Minimalismo total + tabs temporales simples |
| **Google Flights** | Información contextual inmediata sin fricción |
| **Airbnb Experiences** | Cards con categorías visuales y CTA claro |
