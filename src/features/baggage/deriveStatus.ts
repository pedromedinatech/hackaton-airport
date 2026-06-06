import type {
  BagEvent,
  BagEventType,
  BagJourney,
  BagStatus,
  JourneyStage,
  TimelineStep,
} from "./types";

/** Average minutes from "unloaded" to "on belt" at the destination airport. */
export const AVG_BELT_MIN = 12;
/**
 * Once a bag has been unloaded for more than this many minutes without reaching
 * the belt, we surface a calm "running late" state instead of a stale ETA.
 */
export const DELAYED_AFTER_MIN = AVG_BELT_MIN * 2;

/** Map a recorded event to the stage it represents. */
function stageOf(event: BagEvent): JourneyStage {
  const map: Record<BagEventType, JourneyStage> = {
    BagCheckedIn: "checked_in",
    BagScreened: "checked_in",
    BagLoaded: "loaded",
    FlightDep: "in_air",
    BagTransfer: "connection_ok",
    BagUnloaded: "arrived",
    BagOnBelt: "on_belt",
    BagCollected: "collected",
  };
  if (event.type === "BagTransfer" && event.connection === "MISSED") {
    return "delayed";
  }
  return map[event.type];
}

/** The canonical ordered stages for a trip, with or without a connection. */
function canonicalStages(hasConnection: boolean): JourneyStage[] {
  const base: JourneyStage[] = ["checked_in", "loaded", "in_air"];
  if (hasConnection) base.push("connection_ok");
  return [...base, "arrived", "on_belt", "collected"];
}

function minutesSince(iso: string, now: Date): number {
  return (now.getTime() - new Date(iso).getTime()) / 60_000;
}

/** Pick the i18n reassurance key for the current stage. */
function reasonKeyFor(stage: JourneyStage, etaMin: number | null): string {
  if (stage === "on_belt") return "reason.onBelt";
  if (stage === "arrived") {
    return etaMin !== null ? "reason.arrivedEta" : "reason.arrived";
  }
  return `reason.${stage}`;
}

/**
 * Derive the render-ready status of a bag from its recorded events.
 *
 * Pure and deterministic given (journey, now). ETA is only meaningful in the
 * last mile (unloaded → belt), which is exactly the high-anxiety moment; for
 * earlier stages we reassure with context instead of a countdown.
 */
export function deriveStatus(journey: BagJourney, now: Date): BagStatus {
  const events = [...journey.events].sort(
    (a, b) => new Date(a.ts).getTime() - new Date(b.ts).getTime(),
  );
  const hasConnection = Boolean(journey.connection);
  const stages = canonicalStages(hasConnection);

  // Nothing recorded yet: the tag is linked but the airline hasn't acted.
  if (events.length === 0) {
    return {
      stage: "checked_in",
      etaMin: null,
      belt: null,
      reasonKey: "reason.linked",
      lastEvent: null,
      timeline: stages.map((stage, i) => ({
        stage,
        done: false,
        current: i === 0,
        at: null,
      })),
    };
  }

  const lastEvent = events[events.length - 1];
  const reached = new Set(events.map(stageOf));
  const beltEvent = events.find((e) => e.type === "BagOnBelt");
  const unloadedEvent = events.find((e) => e.type === "BagUnloaded");
  const belt = beltEvent?.belt ?? null;

  let stage = stageOf(lastEvent);

  // ETA only in the last mile.
  let etaMin: number | null = null;
  if (stage === "on_belt" || stage === "collected") {
    etaMin = 0;
  } else if (stage === "arrived" && unloadedEvent) {
    const elapsed = minutesSince(unloadedEvent.ts, now);
    if (elapsed > DELAYED_AFTER_MIN) {
      stage = "delayed";
    } else {
      etaMin = Math.max(1, Math.round(AVG_BELT_MIN - elapsed));
    }
  }

  // Build the canonical stepper. A step is done if its stage was reached and the
  // journey has since moved past it; the latest reached stage is "current".
  const lastReachedStage = stageOf(lastEvent);
  const tsForStage = (s: JourneyStage): string | null =>
    events.find((e) => stageOf(e) === s)?.ts ?? null;

  const timeline: TimelineStep[] = stages.map((s) => {
    const at = tsForStage(s);
    const isCurrent = s === lastReachedStage && stage !== "delayed";
    return {
      stage: s,
      done: reached.has(s) && !isCurrent,
      current: isCurrent,
      at,
    };
  });

  return {
    stage,
    etaMin,
    belt,
    reasonKey: reasonKeyFor(stage, etaMin),
    lastEvent,
    timeline,
  };
}
