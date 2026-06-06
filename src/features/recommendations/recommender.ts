import type {
  Place,
  RecommendContext,
  ReasonSignals,
  ScoredPlace,
  PrimaryReason,
} from "./types";

/** A place this close (km) to the center is flagged as "nearby". */
export const NEARBY_KM = 5;
/** An event starting within this many hours is "soon". */
export const SOON_HOURS = 6;

const WEIGHTS = {
  interest: 14,
  extraOverlap: 3,
  openNow: 5,
  soon: 7,
  proximity: 1.2,
  rating: 2,
} as const;

/** Is a venue with regular hours open at `now`? Events return false here. */
export function isOpenNow(place: Place, now: Date): boolean {
  if (place.opensHour === undefined || place.closesHour === undefined) {
    return false;
  }
  const h = now.getHours();
  const { opensHour, closesHour } = place;
  if (closesHour <= opensHour) {
    // Closes after midnight, e.g. opens 18 closes 02
    return h >= opensHour || h < closesHour;
  }
  return h >= opensHour && h < closesHour;
}

/** Does a time-bound item start within the SOON window of `now`? */
export function startsSoon(place: Place, now: Date): boolean {
  if (!place.startsAt) return false;
  const hours =
    (new Date(place.startsAt).getTime() - now.getTime()) / 3_600_000;
  return hours >= -1 && hours <= SOON_HOURS;
}

export function scorePlace(place: Place, ctx: RecommendContext): ScoredPlace {
  const { now, selectedInterests } = ctx;
  let score = 0;

  const matchedInterest = selectedInterests.find((i) =>
    place.interests.includes(i),
  );
  if (matchedInterest) score += WEIGHTS.interest;

  const overlaps = place.interests.filter((i) =>
    selectedInterests.includes(i),
  ).length;
  if (overlaps > 1) score += (overlaps - 1) * WEIGHTS.extraOverlap;

  const openNow = isOpenNow(place, now);
  if (openNow) score += WEIGHTS.openNow;

  const soon = startsSoon(place, now);
  if (soon) score += WEIGHTS.soon;

  score += Math.max(0, 10 - place.distanceKm) * WEIGHTS.proximity;
  if (place.rating) score += place.rating * WEIGHTS.rating;

  const signals: ReasonSignals = {
    matchedInterest,
    openNow,
    soon,
    nearby: place.distanceKm <= NEARBY_KM,
  };

  return { ...place, score: Math.round(score * 100) / 100, signals };
}

/** Rank places for the given context, highest score first (stable). */
export function recommend(
  places: Place[],
  ctx: RecommendContext,
): ScoredPlace[] {
  return places
    .map((p) => scorePlace(p, ctx))
    .sort(
      (a, b) =>
        b.score - a.score ||
        (b.rating ?? 0) - (a.rating ?? 0) ||
        a.title.localeCompare(b.title),
    );
}

/** The single most relevant reason to surface on a card. */
export function primaryReason(place: ScoredPlace): PrimaryReason {
  const { signals } = place;
  if (signals.matchedInterest)
    return { kind: "match", interest: signals.matchedInterest };
  if (signals.soon) return { kind: "soon" };
  if (signals.openNow) return { kind: "openNow" };
  if (signals.nearby) return { kind: "nearby", km: place.distanceKm };
  return { kind: "default" };
}
