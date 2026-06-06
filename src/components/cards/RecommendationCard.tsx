"use client";

import { useLocale, useTranslations } from "next-intl";
import { MapPin, Sparkles, Star } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import type { ScoredPlace } from "@/features/recommendations/types";
import { primaryReason } from "@/features/recommendations/recommender";
import { formatPrice } from "@/lib/format";
import { CardImage } from "./CardImage";
import { SaveButton } from "./SaveButton";
import { Badge } from "@/components/ui/Badge";

function useReasonText(place: ScoredPlace): string {
  const t = useTranslations("Reason");
  const ti = useTranslations("Interests");
  const reason = primaryReason(place);
  switch (reason.kind) {
    case "match":
      return t("match", { interest: ti(reason.interest) });
    case "soon":
      return t("soon");
    case "openNow":
      return t("openNow");
    case "nearby":
      return t("nearby", { km: reason.km });
    default:
      return t("default");
  }
}

export function RecommendationCard({ place }: { place: ScoredPlace }) {
  const locale = useLocale() as Locale;
  const tt = useTranslations("Types");
  const td = useTranslations("Detail");
  const reason = useReasonText(place);
  const price = formatPrice(place.priceFrom, locale);

  return (
    <article className="relative h-full animate-fade-up overflow-hidden rounded-3xl bg-surface shadow-card">
      <Link href={`/place/${place.id}`} className="block focus:outline-none">
        <CardImage gradient={place.gradient} emoji={place.emoji} className="h-40 w-full">
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
          <div className="absolute left-3 top-3">
            <Badge tone={place.type}>{tt(place.type)}</Badge>
          </div>
        </CardImage>
        <div className="space-y-2 p-4">
          <h3 className="text-base font-bold leading-snug text-ink">
            {place.title}
          </h3>
          <p className="line-clamp-2 text-sm text-ink-soft">
            {place.summary[locale]}
          </p>
          <p className="flex items-center gap-1.5 text-xs font-semibold text-accent-dark">
            <Sparkles size={13} aria-hidden /> {reason}
          </p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-0.5 text-xs text-ink-faint">
            <span className="inline-flex items-center gap-1">
              <MapPin size={13} aria-hidden /> {place.area}
            </span>
            {place.rating ? (
              <span className="inline-flex items-center gap-1">
                <Star size={13} aria-hidden className="fill-amber-400 text-amber-400" />
                {place.rating}
              </span>
            ) : null}
            <span className="font-semibold text-ink-soft">
              {price ?? td("free")}
            </span>
          </div>
        </div>
      </Link>
      <SaveButton
        id={place.id}
        label={`${td("save")} · ${place.title}`}
        className="absolute right-3 top-3 h-10 w-10 bg-black/30 backdrop-blur-sm"
      />
    </article>
  );
}
