/**
 * Baggage tracking domain types.
 *
 * The event shape mirrors the IATA Resolution 753 model: airlines record a bag
 * at a handful of milestones (check-in, load, transfer, unload, claim). We are
 * the passenger-facing layer that reads those events — today from the simulator,
 * tomorrow from a real airline feed — and turns them into peace of mind.
 */

/** Milestones an airline records for a bag, IATA 753 style. */
export type BagEventType =
  | "BagCheckedIn" // dropped at the counter
  | "BagScreened" // cleared security
  | "BagLoaded" // loaded onto the aircraft
  | "FlightDep" // the flight departed
  | "BagTransfer" // changed aircraft at a connection
  | "BagUnloaded" // unloaded at destination
  | "BagOnBelt" // arrived on the claim belt
  | "BagCollected"; // passenger confirmed pickup

/** A single recorded event in a bag's journey. */
export interface BagEvent {
  type: BagEventType;
  /** IATA code of the station where it happened, e.g. "MAD", "IAS". */
  station: string;
  /** ISO 8601 timestamp. */
  ts: string;
  /** Flight number, when relevant, e.g. "LH 1664". */
  flight?: string;
  /** Claim belt, present on BagOnBelt. */
  belt?: string;
  /** Outcome of a connection, present on BagTransfer. */
  connection?: "OK" | "MISSED";
}

/** A bag's journey as returned by the API: only events that have happened. */
export interface BagJourney {
  /** The 10-digit license-plate tag the airline printed. */
  bagTag: string;
  passengerName?: string;
  /** Origin station IATA. */
  origin: string;
  /** Connection station IATA, if the trip has one. */
  connection?: string;
  /** Destination station IATA. */
  destination: string;
  events: BagEvent[];
}

/**
 * Canonical passenger-facing stages, in order. `connection_ok` only appears for
 * trips with a connection; `delayed` is an overlay, not a position in the line.
 */
export type JourneyStage =
  | "checked_in"
  | "loaded"
  | "in_air"
  | "connection_ok"
  | "arrived"
  | "on_belt"
  | "collected"
  | "delayed";

/** One step in the timeline stepper shown to the passenger. */
export interface TimelineStep {
  stage: JourneyStage;
  done: boolean;
  current: boolean;
  /** ISO timestamp of the event that fulfilled this step, if reached. */
  at: string | null;
}

/** The derived, render-ready status of a bag. */
export interface BagStatus {
  stage: JourneyStage;
  /** Minutes until the bag reaches the belt; null when not in the last mile. */
  etaMin: number | null;
  /** Claim belt once known, else null. */
  belt: string | null;
  /** i18n key for the human "why now" reassurance line. */
  reasonKey: string;
  /** Most recent recorded event, or null if nothing has happened yet. */
  lastEvent: BagEvent | null;
  /** Full canonical stepper with done/current flags. */
  timeline: TimelineStep[];
}
