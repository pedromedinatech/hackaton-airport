import { describe, it, expect } from "vitest";
import { deriveStatus, AVG_BELT_MIN } from "./deriveStatus";
import { buildJourney } from "./simulator";
import type { BagEvent, BagJourney } from "./types";

const NOW = new Date("2026-06-06T14:30:00Z");

/** Build a journey with events at fixed minutes before NOW. */
function journeyWith(
  events: Array<Partial<BagEvent> & { type: BagEvent["type"]; minAgo: number }>,
  connection?: string,
): BagJourney {
  return {
    bagTag: "0000000001",
    origin: "MAD",
    connection,
    destination: "IAS",
    events: events.map(({ minAgo, ...rest }) => ({
      station: "IAS",
      ts: new Date(NOW.getTime() - minAgo * 60_000).toISOString(),
      ...rest,
    })) as BagEvent[],
  };
}

describe("deriveStatus — stages", () => {
  it("reports 'linked' when no events have happened", () => {
    const status = deriveStatus(journeyWith([]), NOW);
    expect(status.stage).toBe("checked_in");
    expect(status.reasonKey).toBe("reason.linked");
    expect(status.lastEvent).toBeNull();
  });

  it("maps the latest event to its stage", () => {
    const status = deriveStatus(
      journeyWith([
        { type: "BagCheckedIn", minAgo: 120 },
        { type: "BagLoaded", minAgo: 90 },
        { type: "FlightDep", minAgo: 80 },
      ]),
      NOW,
    );
    expect(status.stage).toBe("in_air");
  });

  it("resolves a successful connection", () => {
    const status = deriveStatus(
      journeyWith(
        [
          { type: "FlightDep", minAgo: 200 },
          { type: "BagTransfer", minAgo: 60, connection: "OK" },
        ],
        "MUC",
      ),
      NOW,
    );
    expect(status.stage).toBe("connection_ok");
  });

  it("flags a missed connection as delayed", () => {
    const status = deriveStatus(
      journeyWith(
        [{ type: "BagTransfer", minAgo: 30, connection: "MISSED" }],
        "MUC",
      ),
      NOW,
    );
    expect(status.stage).toBe("delayed");
  });
});

describe("deriveStatus — last mile ETA", () => {
  it("estimates minutes to the belt after unloading", () => {
    const status = deriveStatus(
      journeyWith([{ type: "BagUnloaded", minAgo: 4 }]),
      NOW,
    );
    expect(status.stage).toBe("arrived");
    expect(status.etaMin).toBe(AVG_BELT_MIN - 4);
    expect(status.reasonKey).toBe("reason.arrivedEta");
  });

  it("clears the ETA and exposes the belt once on the belt", () => {
    const status = deriveStatus(
      journeyWith([
        { type: "BagUnloaded", minAgo: 12 },
        { type: "BagOnBelt", minAgo: 1, belt: "2" },
      ]),
      NOW,
    );
    expect(status.stage).toBe("on_belt");
    expect(status.belt).toBe("2");
    expect(status.etaMin).toBe(0);
  });

  it("switches to delayed when unloaded long ago without reaching the belt", () => {
    const status = deriveStatus(
      journeyWith([{ type: "BagUnloaded", minAgo: AVG_BELT_MIN * 2 + 5 }]),
      NOW,
    );
    expect(status.stage).toBe("delayed");
    expect(status.etaMin).toBeNull();
  });
});

describe("deriveStatus — timeline", () => {
  it("includes the connection step only for trips with a connection", () => {
    const direct = deriveStatus(journeyWith([{ type: "BagLoaded", minAgo: 10 }]), NOW);
    const connecting = deriveStatus(
      journeyWith([{ type: "BagLoaded", minAgo: 10 }], "MUC"),
      NOW,
    );
    expect(direct.timeline.some((s) => s.stage === "connection_ok")).toBe(false);
    expect(connecting.timeline.some((s) => s.stage === "connection_ok")).toBe(true);
  });

  it("marks exactly one current step and earlier steps done", () => {
    const status = deriveStatus(
      journeyWith([
        { type: "BagCheckedIn", minAgo: 100 },
        { type: "BagLoaded", minAgo: 80 },
        { type: "FlightDep", minAgo: 70 },
      ]),
      NOW,
    );
    expect(status.timeline.filter((s) => s.current)).toHaveLength(1);
    const current = status.timeline.find((s) => s.current);
    expect(current?.stage).toBe("in_air");
    expect(status.timeline.find((s) => s.stage === "checked_in")?.done).toBe(true);
  });
});

describe("simulator — buildJourney", () => {
  it("returns null for an unknown tag", () => {
    expect(buildJourney("9999999999", 100, NOW)).toBeNull();
  });

  it("replays only milestones that have happened by journeyMin", () => {
    const early = buildJourney("0125460012", 10, NOW)!;
    expect(early.events.map((e) => e.type)).toEqual(["BagCheckedIn", "BagScreened"]);
  });

  it("produces a full, ordered journey by the end", () => {
    const done = buildJourney("0125460012", 400, NOW)!;
    expect(done.events[0].type).toBe("BagCheckedIn");
    expect(done.events[done.events.length - 1].type).toBe("BagOnBelt");
    const ts = done.events.map((e) => new Date(e.ts).getTime());
    expect([...ts]).toEqual([...ts].sort((a, b) => a - b));
  });

  it("feeds deriveStatus end to end into an on-belt state", () => {
    const journey = buildJourney("0125460012", 370, NOW)!;
    const status = deriveStatus(journey, NOW);
    expect(status.stage).toBe("on_belt");
    expect(status.belt).toBe("2");
  });
});
