/**
 * Builds the system prompt for the AI Assistant from the app's own service data.
 * Server-only: imported exclusively by the /api/chat route handler so seed data
 * (and never the API key) is what reaches the model.
 */
import { AIRPORT, TRANSPORT, PLACES, FLIGHTS } from "@/data";
import type { Locale } from "@/i18n/routing";
import type { TransportOption } from "@/features/transport/types";

const MODE_LABEL: Record<TransportOption["mode"], string> = {
  tram: "Tram",
  bus: "Bus",
  taxi: "Taxi",
  rideshare: "Rideshare (Bolt/Uber)",
  car_rental: "Car rental",
};

function transportLine(opt: TransportOption, locale: Locale): string {
  const title = opt.title?.[locale] ?? MODE_LABEL[opt.mode];
  const price = opt.priceFrom === 0 ? "free" : `from ${opt.priceFrom} RON`;
  const steps = opt.steps[locale]?.length ? opt.steps[locale] : opt.steps.en;
  const note = opt.note?.[locale] ? ` Note: ${opt.note[locale]}.` : "";
  const brands = [...(opt.buttons ?? []), ...(opt.logos ?? []), opt.appButton]
    .filter(Boolean)
    .map((b) => b!.label)
    .join(", ");
  const brandsTxt = brands ? ` Providers: ${brands}.` : "";
  const stepsTxt = steps.length ? ` How: ${steps.join(" → ")}.` : "";
  return `- ${title}: ~${opt.etaMin} min to the city center, ${price}.${stepsTxt}${note}${brandsTxt}`;
}

function placesLines(locale: Locale): string {
  return PLACES.slice()
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, 16)
    .map((p) => {
      const price = p.priceFrom ? `from ${p.priceFrom} RON` : "free";
      const rating = p.rating ? `, rated ${p.rating}/5` : "";
      const when = p.startsAt ? `, starts ${p.startsAt}` : "";
      return `- ${p.title} (${p.type}, ${p.area}, ${price}${rating}${when}): ${p.summary[locale]}`;
    })
    .join("\n");
}

function flightsBlock(): string {
  const fmt = (
    list: typeof FLIGHTS.arrivals,
    kind: "arrival" | "departure",
  ) =>
    list
      .map((f) => {
        const where = kind === "arrival" ? `from ${f.city}` : `to ${f.city}`;
        const place = f.belt
          ? `belt ${f.belt}`
          : f.gate
            ? `gate ${f.gate}`
            : "";
        return `  - ${f.flightNo} ${f.airline} ${where} ${f.time} — ${f.status}${place ? `, ${place}` : ""}`;
      })
      .join("\n");
  return `Arrivals today:\n${fmt(FLIGHTS.arrivals, "arrival")}\nDepartures today:\n${fmt(FLIGHTS.departures, "departure")}`;
}

export function buildSystemPrompt(locale: Locale): string {
  const lang = locale === "ro" ? "Romanian" : "English";

  return `You are the AI Assistant for ${AIRPORT.name} (${AIRPORT.iata}/${AIRPORT.icao}) in ${AIRPORT.city}, ${AIRPORT.country}. You live inside the AirArrival app, which helps passengers who have just landed.

# Your role
Help arriving passengers with practical questions about the airport, getting into ${AIRPORT.city}, baggage, flights, and what to do in the city. Be warm, calm and reassuring — many users are tired travellers on their phone.

# Language
Reply in ${lang} by default, but always mirror the language the user writes in. Keep answers short and scannable for a small screen: a sentence or two, or a short bullet list. Use the app's own data below; do not invent prices, times, gates or belts. If you don't know something, say so briefly and point to the relevant app section.

# Airport facts
- Name: ${AIRPORT.name} (${AIRPORT.iata}). City center is ~${AIRPORT.distanceToCenterKm} km away. Terminals: ${AIRPORT.terminals.join(", ")}.

# Getting to the city (transport options in the app)
${TRANSPORT.map((o) => transportLine(o, locale)).join("\n")}

# Baggage
Passengers can track their checked bag in the app's "My bag" tab — scan the 10-digit bag tag or enter it manually, then watch live status from drop-off to the belt. No sign-up.

# Flights
${flightsBlock()}

# Things to do in ${AIRPORT.city} (a selection from the Events tab)
${placesLines(locale)}

# App navigation (point users here when useful)
- Discover (home): overview and recommendations.
- My bag: live baggage tracking.
- Fly: flight arrivals, departures, gates and belts.
- Events: events, concerts, museums, restaurants and wine in ${AIRPORT.city}.
- Transport: full details and booking links for tram, bus, taxi, Bolt/Uber and car rental.

# Boundaries
Stay focused on the airport, this app, and travel in ${AIRPORT.city}. If asked about something unrelated, gently steer back. Never ask for or store passwords, card numbers or personal data. Remind users that live flight/belt info should be confirmed on airport screens when it matters.`;
}
