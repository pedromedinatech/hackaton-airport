"use client";

import { useMemo } from "react";
import { PLACES } from "@/data";
import { recommend } from "@/features/recommendations/recommender";
import { useMounted } from "@/hooks/useMounted";
import { RecommendationCard } from "@/components/cards/RecommendationCard";
import { Skeleton } from "@/components/ui/Skeleton";

function ListSkeleton() {
  return (
    <div className="space-y-4">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="space-y-2 rounded-2xl border border-white/[0.06] bg-surface p-4"
        >
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      ))}
    </div>
  );
}

/** Full city discovery — the browse catalog behind the "Events & tickets" tile. */
export function EventsView() {
  const mounted = useMounted();
  const now = useMemo(() => new Date(), []);
  const ranked = useMemo(
    () => recommend(PLACES, { now, selectedInterests: [] }),
    [now],
  );

  if (!mounted) return <ListSkeleton />;

  return (
    <div className="space-y-4">
      {ranked.map((place) => (
        <RecommendationCard key={place.id} place={place} />
      ))}
    </div>
  );
}
