"use client";

import { useLocale, useTranslations } from "next-intl";
import { MapPin, Star } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import type { ScoredPlace } from "@/features/recommendations/types";
import { primaryReason } from "@/features/recommendations/recommender";
import { formatPrice } from "@/lib/format";
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
    <article className="relative animate-fade-up overflow-hidden rounded-2xl border border-white/[0.06] bg-surface">
      <Link href={`/place/${place.id}`} className="block focus:outline-none">
        <div className="p-4 pb-3">
          {/* Top row: category + price */}
          <div className="mb-3 flex items-center justify-between gap-2">
            <Badge tone={place.type}>{tt(place.type)}</Badge>
            {price ? (
              <span className="text-xs font-semibold text-ink-soft">
                {price}
              </span>
            ) : (
              <span className="text-xs font-semibold text-accent">
                {td("free")}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-[17px] font-bold leading-snug tracking-tight text-ink">
            {place.title}
          </h3>

          {/* Summary */}
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-ink-soft">
            {place.summary[locale]}
          </p>

          {/* Reason */}
          <p className="mt-2.5 text-xs font-semibold text-accent">
            · {reason}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 border-t border-white/[0.05] px-4 py-2.5">
          <span className="inline-flex items-center gap-1 text-xs text-ink-faint">
            <MapPin size={12} aria-hidden /> {place.area}
          </span>
          {place.rating ? (
            <span className="inline-flex items-center gap-1 text-xs text-ink-faint">
              <Star size={12} aria-hidden className="fill-amber-400 text-amber-400" />
              {place.rating}
            </span>
          ) : null}
        </div>
      </Link>
    </article>
  );
}
