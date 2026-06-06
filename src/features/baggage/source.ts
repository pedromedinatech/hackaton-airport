"use client";

import { buildJourney, isKnownTag } from "./simulator";
import type { BagJourney } from "./types";

/**
 * Client-side data adapter. This is the single swap point: today it replays the
 * simulator with an accelerated clock; in production it would be a `fetch()` to
 * the airline's IATA 753 feed returning the same `BagJourney` shape. Nothing
 * downstream (deriveStatus, the UI) changes.
 *
 * The app is a static PWA (output: export), so there's no server to host an API
 * route — the contract lives here instead, fully client-side.
 */

/** Demo time compression: 1 real minute ≈ SPEED journey minutes. */
const SPEED = 120;

/** When each tag's live clock started, in client memory. */
const startedAt = new Map<string, number>();

export function liveJourney(tag: string): BagJourney | null {
  if (!isKnownTag(tag)) return null;
  const now = new Date();

  // Deterministic override for scripted demos: /bag/<tag>/live?t=190
  if (typeof window !== "undefined") {
    const t = new URLSearchParams(window.location.search).get("t");
    if (t !== null) return buildJourney(tag, Math.max(0, Number(t)), now);
  }

  if (!startedAt.has(tag)) startedAt.set(tag, now.getTime());
  const journeyMin = ((now.getTime() - startedAt.get(tag)!) / 60_000) * SPEED;
  return buildJourney(tag, journeyMin, now);
}
