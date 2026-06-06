"use client";

import { useTranslations } from "next-intl";
import { Heart } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useSavedItems } from "@/hooks/useSavedItems";
import { useMounted } from "@/hooks/useMounted";
import { getPlace } from "@/data";
import { scorePlace } from "@/features/recommendations/recommender";
import { RecommendationCard } from "@/components/cards/RecommendationCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";

export default function SavedView() {
  const t = useTranslations("Saved");
  const ids = useSavedItems((s) => s.ids);
  const mounted = useMounted();

  if (!mounted) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-44 w-full rounded-3xl" />
        <Skeleton className="h-44 w-full rounded-3xl" />
      </div>
    );
  }

  const now = new Date();
  const saved = ids
    .map((id) => getPlace(id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .map((p) => scorePlace(p, { now, selectedInterests: [] }));

  if (saved.length === 0) {
    return (
      <EmptyState
        icon={<Heart size={22} />}
        title={t("empty")}
        description={t("emptySub")}
        action={
          <Link
            href="/"
            className="mt-1 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-canvas"
          >
            {t("browse")}
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      {saved.map((place) => (
        <RecommendationCard key={place.id} place={place} />
      ))}
    </div>
  );
}
