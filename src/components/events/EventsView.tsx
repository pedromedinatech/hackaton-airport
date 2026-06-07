"use client";

import React, { useMemo, useState, useRef, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { PLACES } from "@/data";
import { recommend } from "@/features/recommendations/recommender";
import { RecommendationCard } from "@/components/cards/RecommendationCard";
import type { PlaceType, ScoredPlace } from "@/features/recommendations/types";
import { cn } from "@/lib/cn";

const CATEGORY_ORDER: PlaceType[] = [
  "concert",
  "event",
  "museum",
  "restaurant",
  "winery",
  "park",
  "landmark",
  "gallery",
  "coworking",
  "conference",
];

const PILL_ACTIVE: Record<PlaceType, string> = {
  concert: "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/40",
  event: "bg-violet-500/20 text-violet-300 border-violet-500/40",
  museum: "bg-sky-500/20 text-sky-300 border-sky-500/40",
  winery: "bg-rose-500/20 text-rose-300 border-rose-500/40",
  gallery: "bg-purple-500/20 text-purple-300 border-purple-500/40",
  restaurant: "bg-orange-500/20 text-orange-300 border-orange-500/40",
  coworking: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
  conference: "bg-blue-500/20 text-blue-300 border-blue-500/40",
  park: "bg-green-500/20 text-green-300 border-green-500/40",
  landmark: "bg-amber-500/20 text-amber-300 border-amber-500/40",
};

function CategoryPills({
  selected,
  availableCategories,
  onSelect,
}: {
  selected: PlaceType | "all";
  availableCategories: PlaceType[];
  onSelect: (cat: PlaceType | "all") => void;
}) {
  const t = useTranslations("Types");
  const te = useTranslations("Events");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollState, setScrollState] = useState({ left: 0, ratio: 0, thumbW: 0 });

  const updateScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const ratio = max > 0 ? el.scrollLeft / max : 0;
    const thumbW = max > 0 ? Math.max(24, (el.clientWidth / el.scrollWidth) * el.clientWidth) : el.clientWidth;
    setScrollState({ left: el.scrollLeft, ratio, thumbW });
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScroll();
    el.addEventListener("scroll", updateScroll, { passive: true });
    const ro = new ResizeObserver(updateScroll);
    ro.observe(el);
    return () => { el.removeEventListener("scroll", updateScroll); ro.disconnect(); };
  }, [updateScroll]);

  // Desktop: redirect mouse wheel to horizontal scroll
  const onWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    if (max <= 0) return;
    e.preventDefault();
    el.scrollLeft += e.deltaY + e.deltaX;
  }, []);

  const canScrollLeft = scrollState.left > 2;
  const canScrollRight = scrollState.left < (scrollRef.current ? scrollRef.current.scrollWidth - scrollRef.current.clientWidth - 2 : 1);
  const trackW = scrollRef.current?.clientWidth ?? 0;
  const thumbLeft = trackW > 0 ? scrollState.ratio * (trackW - scrollState.thumbW) : 0;
  const showBar = scrollState.thumbW > 0 && scrollState.thumbW < trackW;

  return (
    <div className="space-y-2">
      {/* Scroll row with edge fades */}
      <div className="relative">
        {/* Left fade */}
        {canScrollLeft && (
          <div
            aria-hidden
            className="pointer-events-none absolute left-0 top-0 z-10 h-full w-10"
            style={{ background: "linear-gradient(to right, #0A1628, transparent)" }}
          />
        )}
        {/* Right fade */}
        {canScrollRight && (
          <div
            aria-hidden
            className="pointer-events-none absolute right-0 top-0 z-10 h-full w-10"
            style={{ background: "linear-gradient(to left, #0A1628, transparent)" }}
          />
        )}

        <div
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto pb-1"
          style={{ scrollbarWidth: "none" } as React.CSSProperties}
          onWheel={onWheel}
        >
          <button
            type="button"
            aria-pressed={selected === "all"}
            onClick={() => onSelect("all")}
            className={cn(
              "flex-shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition min-h-[40px]",
              selected === "all"
                ? "bg-accent/20 text-accent border-accent/40"
                : "bg-white/[0.04] text-ink-faint border-white/[0.08] hover:bg-white/[0.08]",
            )}
          >
            {te("all")}
          </button>

          {availableCategories.map((cat) => {
            const active = selected === cat;
            return (
              <button
                key={cat}
                type="button"
                aria-pressed={active}
                onClick={() => onSelect(active ? "all" : cat)}
                className={cn(
                  "flex-shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition min-h-[40px]",
                  active
                    ? PILL_ACTIVE[cat]
                    : "bg-white/[0.04] text-ink-faint border-white/[0.08] hover:bg-white/[0.08]",
                )}
              >
                {t(cat)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom scrollbar track */}
      {showBar && (
        <div
          aria-hidden
          className="relative h-[3px] w-full overflow-hidden rounded-full bg-white/[0.06]"
        >
          <div
            className="absolute top-0 h-full rounded-full bg-white/25 transition-[left,width] duration-75"
            style={{ left: thumbLeft, width: scrollState.thumbW }}
          />
        </div>
      )}
    </div>
  );
}

/** Full city discovery — the browse catalog behind the "Events & tickets" tile. */
export function EventsView() {
  const now = useMemo(() => new Date(), []);
  const [selected, setSelected] = useState<PlaceType | "all">("all");

  const ranked = useMemo(
    () => recommend(PLACES, { now, selectedInterests: [] }),
    [now],
  );

  const availableCategories = useMemo<PlaceType[]>(() => {
    const present = new Set(PLACES.map((p) => p.type));
    return CATEGORY_ORDER.filter((c) => present.has(c));
  }, []);

  const displayed = useMemo((): ScoredPlace[] => {
    if (selected === "all") {
      const seen = new Set<PlaceType>();
      const best: ScoredPlace[] = [];
      for (const place of ranked) {
        if (!seen.has(place.type)) {
          seen.add(place.type);
          best.push(place);
        }
      }
      return best;
    }
    return ranked
      .filter((p) => p.type === selected)
      .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
  }, [selected, ranked]);

  return (
    <div className="space-y-4">
      <CategoryPills
        selected={selected}
        availableCategories={availableCategories}
        onSelect={setSelected}
      />

      <div className="space-y-4">
        {displayed.map((place) => (
          <RecommendationCard key={place.id} place={place} />
        ))}
      </div>
    </div>
  );
}
