import placesData from "./seed/places.iasi.json";
import flightsData from "./seed/flights.iasi.json";
import transportData from "./seed/transport.iasi.json";
import airportData from "./seed/airport.iasi.json";
import type { Place } from "@/features/recommendations/types";
import type { FlightBoard } from "@/features/airport-services/types";
import type { TransportOption } from "@/features/transport/types";

export interface AirportInfo {
  name: string;
  iata: string;
  icao: string;
  city: string;
  country: string;
  distanceToCenterKm: number;
  terminals: string[];
}

export const PLACES = placesData as unknown as Place[];
export const FLIGHTS = flightsData as unknown as FlightBoard;
export const TRANSPORT = transportData as unknown as TransportOption[];
export const AIRPORT = airportData as AirportInfo;

export function getPlace(id: string): Place | undefined {
  return PLACES.find((p) => p.id === id);
}
