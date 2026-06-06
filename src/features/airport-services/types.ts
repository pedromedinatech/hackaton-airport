export type FlightStatus =
  | "on_time"
  | "landed"
  | "delayed"
  | "boarding"
  | "departed";

export type FlightDirection = "arrivals" | "departures";

export interface Flight {
  flightNo: string;
  airline: string;
  /** The other endpoint city (origin for arrivals, destination for departures). */
  city: string;
  /** IATA code of the other endpoint. */
  code: string;
  /** Scheduled local time, "HH:MM". */
  time: string;
  status: FlightStatus;
  gate?: string;
  belt?: string;
}

export interface FlightBoard {
  arrivals: Flight[];
  departures: Flight[];
}
