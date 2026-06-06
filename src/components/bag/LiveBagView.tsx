"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Radio, Share2, Check, ArrowRight } from "lucide-react";
import { useBagJourney } from "@/features/baggage/client";
import { useMounted } from "@/hooks/useMounted";
import { Link } from "@/i18n/navigation";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Luggage } from "lucide-react";
import { BagStatusHero } from "./BagStatusHero";
import { BagTimeline } from "./BagTimeline";

/**
 * Public, read-only live status of a bag — the growth loop. A passenger shares
 * this link with whoever is picking them up; that person discovers the product
 * without checking in a single bag. Something a native app can't do.
 */
export function LiveBagView({ tag }: { tag: string }) {
  const t = useTranslations("Bag.live");
  const mounted = useMounted();
  const { journey, status, notFound, isLoading } = useBagJourney(
    mounted ? tag : null,
  );
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      try {
        await navigator.share({ title: t("share"), url });
        return;
      } catch {
        /* user dismissed — fall through to copy */
      }
    }
    await navigator.clipboard?.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-4 pb-10 pt-8">
      <header className="mb-5 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-sm font-bold text-ink">
          <Luggage size={16} className="text-accent" aria-hidden /> AirArrival
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/[0.12] px-2.5 py-1 text-xs font-semibold text-accent">
          <Radio size={12} aria-hidden /> {t("badge")}
        </span>
      </header>

      {!mounted || isLoading ? (
        <Skeleton className="h-52 w-full rounded-3xl" />
      ) : notFound || !status ? (
        <EmptyState
          icon={<Luggage size={22} />}
          title={t("notFound")}
          description={t("notFoundSub")}
        />
      ) : (
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-sm font-semibold text-ink-soft">
              {journey?.passengerName
                ? t("passengerBag", { name: journey.passengerName })
                : t("anonBag")}
            </h1>
            <p className="text-xs text-ink-faint">
              {journey?.origin} → {journey?.destination}
            </p>
          </div>

          <BagStatusHero status={status} />

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-ink">{t("journey")}</h2>
            <div className="rounded-2xl border border-white/[0.06] bg-surface p-4">
              <BagTimeline status={status} />
            </div>
          </section>
        </div>
      )}

      <div className="mt-auto space-y-3 pt-8">
        <button
          type="button"
          onClick={share}
          className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-2xl border border-white/[0.08] text-sm font-semibold text-ink-soft transition active:scale-[0.98]"
        >
          {copied ? <Check size={16} aria-hidden /> : <Share2 size={16} aria-hidden />}
          {copied ? t("copied") : t("share")}
        </button>
        <Link
          href="/bag"
          className="group flex min-h-[48px] w-full items-center justify-center gap-2 rounded-2xl bg-accent text-sm font-bold text-canvas transition active:scale-[0.98] hover:bg-accent-dark"
        >
          {t("trackOwn")}
          <ArrowRight size={16} aria-hidden className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </main>
  );
}
