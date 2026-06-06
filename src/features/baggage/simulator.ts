import type { BagEvent, BagEventType, BagJourney } from "./types";

/**
 * Demo data source. Each profile is a real-shaped trip ending at Iași (IAS),
 * described as milestones with offsets (in minutes) from the moment the bag is
 * dropped. `buildJourney` replays the milestones up to a given point in time, so
 * an accelerated clock makes the journey advance live during a demo.
 *
 * This is the swap point: today these milestones come from the simulator,
 * tomorrow the same `BagJourney` shape comes from an airline's IATA 753 feed.
 */

interface Milestone {
  type: BagEventType;
  station: string;
  /** Minutes from the bag drop (T0). */
  offsetMin: number;
  flight?: string;
  belt?: string;
  connection?: "OK" | "MISSED";
}

interface JourneyProfile {
  passengerName: string;
  origin: string;
  connection?: string;
  destination: string;
  milestones: Milestone[];
}

/** Total real-world span (minutes) a journey's milestones cover. */
function spanOf(profile: JourneyProfile): number {
  return profile.milestones.reduce((max, m) => Math.max(max, m.offsetMin), 0);
}

const PROFILES: Record<string, JourneyProfile> = {
  // Hero demo: Madrid → Munich connection → Iași. The connection is the
  // highest-anxiety moment, and we resolve it explicitly.
  "0125460012": {
    passengerName: "Ana",
    origin: "MAD",
    connection: "MUC",
    destination: "IAS",
    milestones: [
      { type: "BagCheckedIn", station: "MAD", offsetMin: 0 },
      { type: "BagScreened", station: "MAD", offsetMin: 9 },
      { type: "BagLoaded", station: "MAD", offsetMin: 38, flight: "LH 1801" },
      { type: "FlightDep", station: "MAD", offsetMin: 52, flight: "LH 1801" },
      {
        type: "BagTransfer",
        station: "MUC",
        offsetMin: 188,
        flight: "LH 1664",
        connection: "OK",
      },
      { type: "FlightDep", station: "MUC", offsetMin: 205, flight: "LH 1664" },
      { type: "BagUnloaded", station: "IAS", offsetMin: 352 },
      { type: "BagOnBelt", station: "IAS", offsetMin: 364, belt: "2" },
    ],
  },
  // Direct: London Luton → Iași (matches a Wizz arrival in the seed).
  "0734551890": {
    passengerName: "Tom",
    origin: "LTN",
    destination: "IAS",
    milestones: [
      { type: "BagCheckedIn", station: "LTN", offsetMin: 0 },
      { type: "BagScreened", station: "LTN", offsetMin: 7 },
      { type: "BagLoaded", station: "LTN", offsetMin: 33, flight: "W6 3214" },
      { type: "FlightDep", station: "LTN", offsetMin: 50, flight: "W6 3214" },
      { type: "BagUnloaded", station: "IAS", offsetMin: 205 },
      { type: "BagOnBelt", station: "IAS", offsetMin: 216, belt: "2" },
    ],
  },
};

export const DEMO_TAGS = Object.keys(PROFILES);

/**
 * Replay a profile up to `journeyMin` minutes into the trip.
 *
 * Returns only the events that have happened by then, each with a wall-clock
 * `ts` anchored so that `journeyMin` lands at `now`. Pure and deterministic.
 */
export function buildJourney(
  bagTag: string,
  journeyMin: number,
  now: Date,
): BagJourney | null {
  const profile = PROFILES[bagTag];
  if (!profile) return null;

  // Anchor T0 so that `journeyMin` into the trip equals `now`.
  const t0 = now.getTime() - journeyMin * 60_000;

  const events: BagEvent[] = profile.milestones
    .filter((m) => m.offsetMin <= journeyMin)
    .map((m) => ({
      type: m.type,
      station: m.station,
      ts: new Date(t0 + m.offsetMin * 60_000).toISOString(),
      ...(m.flight ? { flight: m.flight } : {}),
      ...(m.belt ? { belt: m.belt } : {}),
      ...(m.connection ? { connection: m.connection } : {}),
    }));

  return {
    bagTag,
    passengerName: profile.passengerName,
    origin: profile.origin,
    connection: profile.connection,
    destination: profile.destination,
    events,
  };
}

/** Whole-journey span in minutes for a tag, for clock scaling. Null if unknown. */
export function journeySpan(bagTag: string): number | null {
  const profile = PROFILES[bagTag];
  return profile ? spanOf(profile) : null;
}

export function isKnownTag(bagTag: string): boolean {
  return bagTag in PROFILES;
}
