"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Moon, SearchX, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { PLACES } from "@/data";
import { recommend } from "@/features/recommendations/recommender";
import { usePreferences } from "@/hooks/usePreferences";
import { useMounted } from "@/hooks/useMounted";
import { RecommendationCard } from "@/components/cards/RecommendationCard";
import { Carousel } from "@/components/feed/Carousel";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";

function SectionHeader({
  icon,
  title,
  subtitle,
}: {
  icon: ReactNode;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="space-y-0.5">
      <h2 className="flex items-center gap-1.5 text-lg font-bold text-ink">
        <span className="text-accent" aria-hidden>
          {icon}
        </span>
        {title}
      </h2>
      {subtitle ? <p className="text-xs text-ink-faint">{subtitle}</p> : null}
    </div>
  );
}

function FeedSkeleton() {
  return (
    <div className="space-y-4">
      {[0, 1, 2].map((i) => (
        <div key={i} className="overflow-hidden rounded-2xl border border-white/[0.06] bg-surface">
          <Skeleton className="h-40 w-full rounded-none" />
          <div className="space-y-2 p-4">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function HomeFeed() {
  const t = useTranslations("Home");
  const interests = usePreferences((s) => s.interests);
  const mounted = useMounted();
  const now = useMemo(() => new Date(), []);
  const ranked = useMemo(
    () =>
      recommend(PLACES, {
        now,
        selectedInterests: mounted ? interests : [],
      }),
    [now, interests, mounted],
  );

  if (!mounted) return <FeedSkeleton />;

  const tonight = ranked.filter((p) => p.signals.soon).slice(0, 6);

  return (
    <div className="space-y-6">
      {tonight.length > 0 ? (
        <section className="space-y-3">
          <SectionHeader icon={<Moon size={18} />} title={t("trending")} />
          <Carousel ariaLabel={t("trending")}>
            {tonight.map((place) => (
              <div key={place.id} className="w-[260px] shrink-0 snap-start">
                <RecommendationCard place={place} />
              </div>
            ))}
          </Carousel>
        </section>
      ) : null}

      <section className="space-y-3">
        <SectionHeader
          icon={<Sparkles size={18} />}
          title={t("forYou")}
        />
        {ranked.length === 0 ? (
          <EmptyState
            icon={<SearchX size={22} />}
            title={t("empty")}
            description={t("emptySub")}
          />
        ) : (
          <div className="space-y-4">
            {ranked.map((place) => (
              <RecommendationCard key={place.id} place={place} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
