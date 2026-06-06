"use client";

import useSWR from "swr";
import { liveJourney } from "./source";
import { deriveStatus } from "./deriveStatus";
import type { BagJourney, BagStatus } from "./types";

export interface UseBagResult {
  journey: BagJourney | undefined;
  status: BagStatus | null;
  isLoading: boolean;
  notFound: boolean;
  error: boolean;
}

/**
 * Live bag status for a tag. Re-reads the source every few seconds — this poll
 * is what stands in for push notifications in a web-only experience. `status`
 * is derived on each read so the ETA re-computes as the journey advances.
 */
export function useBagJourney(tag: string | null): UseBagResult {
  const { data, isLoading } = useSWR<BagJourney | null>(
    tag ? ["bag", tag] : null,
    () => liveJourney(tag as string),
    { refreshInterval: 4000, revalidateOnFocus: true },
  );

  const journey = data ?? undefined;
  return {
    journey,
    status: journey ? deriveStatus(journey, new Date()) : null,
    isLoading,
    notFound: tag !== null && data === null,
    error: false,
  };
}
