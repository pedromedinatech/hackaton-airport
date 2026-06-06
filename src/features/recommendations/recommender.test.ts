import { describe, it, expect } from "vitest";
import {
  recommend,
  scorePlace,
  isOpenNow,
  startsSoon,
  primaryReason,
} from "./recommender";
import type { Place } from "./types";

const museum: Place = {
  id: "museum",
  type: "museum",
  title: "Museum",
  summary: { en: "", ro: "" },
  interests: ["culture", "art"],
  distanceKm: 0.5,
  area: "Center",
  rating: 4.5,
  gradient: ["#000", "#111"],
  emoji: "🏛️",
  opensHour: 10,
  closesHour: 18,
};

const winery: Place = {
  id: "winery",
  type: "winery",
  title: "Winery",
  summary: { en: "", ro: "" },
  interests: ["wine", "food"],
  distanceKm: 7,
  area: "Bucium",
  rating: 4.5,
  gradient: ["#000", "#111"],
  emoji: "🍷",
  opensHour: 11,
  closesHour: 22,
};

const concert: Place = {
  id: "concert",
  type: "concert",
  title: "Concert",
  summary: { en: "", ro: "" },
  interests: ["music"],
  distanceKm: 1,
  area: "Center",
  rating: 4.5,
  gradient: ["#000", "#111"],
  emoji: "🎻",
  startsAt: "2026-06-05T21:00:00",
};

const evening = new Date("2026-06-05T20:00:00");
const morning = new Date("2026-06-05T09:00:00");

describe("isOpenNow", () => {
  it("is true within regular hours", () => {
    expect(isOpenNow(museum, new Date("2026-06-05T12:00:00"))).toBe(true);
  });
  it("is false outside regular hours", () => {
    expect(isOpenNow(museum, new Date("2026-06-05T20:00:00"))).toBe(false);
  });
  it("handles after-midnight closing", () => {
    const bar: Place = { ...winery, opensHour: 18, closesHour: 2 };
    expect(isOpenNow(bar, new Date("2026-06-05T23:00:00"))).toBe(true);
    expect(isOpenNow(bar, new Date("2026-06-05T01:00:00"))).toBe(true);
    expect(isOpenNow(bar, new Date("2026-06-05T15:00:00"))).toBe(false);
  });
  it("returns false for time-bound items without hours", () => {
    expect(isOpenNow(concert, evening)).toBe(false);
  });
});

describe("startsSoon", () => {
  it("is true within the soon window", () => {
    expect(startsSoon(concert, evening)).toBe(true);
  });
  it("is false far in advance", () => {
    expect(startsSoon(concert, morning)).toBe(false);
  });
});

describe("scorePlace", () => {
  it("boosts a place that matches a selected interest", () => {
    const without = scorePlace(winery, {
      now: evening,
      selectedInterests: [],
    });
    const withWine = scorePlace(winery, {
      now: evening,
      selectedInterests: ["wine"],
    });
    expect(withWine.score).toBeGreaterThan(without.score);
    expect(withWine.signals.matchedInterest).toBe("wine");
  });
});

describe("recommend", () => {
  const places = [museum, winery, concert];

  it("ranks wine-interest places first when wine is selected", () => {
    const ranked = recommend(places, {
      now: evening,
      selectedInterests: ["wine"],
    });
    expect(ranked[0].id).toBe("winery");
  });

  it("returns every place regardless of filters", () => {
    const ranked = recommend(places, {
      now: evening,
      selectedInterests: ["wine"],
    });
    expect(ranked).toHaveLength(places.length);
  });

  it("ranks an open museum above a closed one at midday", () => {
    const closedMuseum: Place = {
      ...museum,
      id: "closed",
      title: "Closed",
      opensHour: 19,
      closesHour: 23,
    };
    const ranked = recommend([closedMuseum, museum], {
      now: new Date("2026-06-05T12:00:00"),
      selectedInterests: [],
    });
    expect(ranked[0].id).toBe("museum");
  });

  it("falls back to a default reason without signals", () => {
    const far: Place = { ...winery, id: "far", distanceKm: 50 };
    const [scored] = recommend([far], { now: morning, selectedInterests: [] });
    expect(primaryReason(scored).kind).toBe("default");
  });
});
