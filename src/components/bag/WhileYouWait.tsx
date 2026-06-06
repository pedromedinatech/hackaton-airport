"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Coffee } from "lucide-react";
import { PLACES } from "@/data";
import { recommend } from "@/features/recommendations/recommender";
import { usePreferences } from "@/hooks/usePreferences";
import { RecommendationCard } from "@/components/cards/RecommendationCard";
import { Carousel } from "@/components/feed/Carousel";

/**
 * The narrative payoff: once the bag has landed and the passenger is waiting at
 * the belt, we turn dead time into discovery — reusing the recommendation
 * engine, ranked toward what's open and nearby right now.
 */
export function WhileYouWait({ etaMin }: { etaMin: number | null }) {
  const t = useTranslations("Bag.wait");
  const interests = usePreferences((s) => s.interests);
  const now = useMemo(() => new Date(), []);

  const picks = useMemo(
    () =>
      recommend(PLACES, { now, selectedInterests: interests })
        .filter((p) => p.signals.openNow || p.signals.soon || p.signals.nearby)
        .slice(0, 6),
    [now, interests],
  );

  if (picks.length === 0) return null;

  return (
    <section className="space-y-3">
      <div className="space-y-0.5">
        <h2 className="flex items-center gap-1.5 text-lg font-bold text-ink">
          <span className="text-accent" aria-hidden>
            <Coffee size={18} />
          </span>
          {etaMin && etaMin > 0 ? t("titleEta", { eta: etaMin }) : t("title")}
        </h2>
        <p className="text-xs text-ink-faint">{t("subtitle")}</p>
      </div>
      <Carousel ariaLabel={t("title")}>
        {picks.map((place) => (
          <div key={place.id} className="w-[260px] shrink-0 snap-start">
            <RecommendationCard place={place} />
          </div>
        ))}
      </Carousel>
    </section>
  );
}
