import type { Localized } from "@/features/recommendations/types";

export type TransportMode =
  | "tram"
  | "bus"
  | "taxi"
  | "rideshare"
  | "car_rental";

export interface BrandButton {
  label: string;
  href: string;
  bg: string;
  fg: string;
  /** Path to logo image in /public, e.g. "/logos/bolt.png" */
  logoSrc?: string;
}

export interface TransportOption {
  id: string;
  mode: TransportMode;
  /** Estimated travel time to the city center, in minutes. */
  etaMin: number;
  /** Starting price in RON. 0 means free. */
  priceFrom: number;
  /** Optional provider/label badge, e.g. "CTP". */
  badge?: string;
  emoji: string;
  /** Path to a PNG icon in /public to replace the text emoji. */
  emojiSrc?: string;
  gradient: [string, string];
  steps: { en: string[]; ro: string[] };
  note?: Localized;
  /** Override the mode label with a custom localized title. */
  title?: Localized;
  /** "buttons" = app launch buttons (rideshare), "logos" = brand grid (car rental), "bus" = steps + app button */
  layout?: "default" | "buttons" | "bus" | "logos";
  /** Primary CTA buttons (Bolt, Uber). Used with layout "buttons". */
  buttons?: BrandButton[];
  /** Brand logo buttons grid. Used with layout "logos". */
  logos?: BrandButton[];
  /** Single app button shown below steps. Used with layout "bus". */
  appButton?: BrandButton;
}
