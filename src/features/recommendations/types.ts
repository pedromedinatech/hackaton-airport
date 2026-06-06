export type PlaceType =
  | "event"
  | "concert"
  | "museum"
  | "winery"
  | "gallery"
  | "restaurant"
  | "coworking"
  | "conference"
  | "park"
  | "landmark";

export type Interest =
  | "culture"
  | "wine"
  | "food"
  | "music"
  | "business"
  | "art"
  | "nature";

/** A string available in every supported locale. Keys match `Locale`. */
export interface Localized {
  en: string;
  ro: string;
}

export interface Place {
  id: string;
  type: PlaceType;
  title: string;
  summary: Localized;
  interests: Interest[];
  /** Starting price in RON. Omitted or 0 means free. */
  priceFrom?: number;
  /** Distance from the city center, in km. */
  distanceKm: number;
  area: string;
  /** 0..5 */
  rating?: number;
  /** [from, to] hex colors for the placeholder hero gradient. */
  gradient: [string, string];
  emoji: string;
  address?: string;
  /** ISO start time for time-bound items (events/concerts/conferences). */
  startsAt?: string;
  /** Opening hour 0..23 for venues that keep regular hours. */
  opensHour?: number;
  /** Closing hour 0..23 (may be <= opensHour for after-midnight closing). */
  closesHour?: number;
}

export interface ReasonSignals {
  matchedInterest?: Interest;
  openNow: boolean;
  soon: boolean;
  nearby: boolean;
}

export interface ScoredPlace extends Place {
  score: number;
  signals: ReasonSignals;
}

export interface RecommendContext {
  now: Date;
  selectedInterests: Interest[];
}

export type PrimaryReason =
  | { kind: "match"; interest: Interest }
  | { kind: "soon" }
  | { kind: "openNow" }
  | { kind: "nearby"; km: number }
  | { kind: "default" };
