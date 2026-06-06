"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Luggage, Plus, Share2 } from "lucide-react";
import { useBagJourney } from "@/features/baggage/client";
import { Link } from "@/i18n/navigation";
import { useBags } from "@/hooks/useBags";
import { useMounted } from "@/hooks/useMounted";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { BagStatusHero } from "./BagStatusHero";
import { BagTimeline } from "./BagTimeline";
import { TagScanner } from "./TagScanner";
import { WhileYouWait } from "./WhileYouWait";

/** Stages where the passenger is on the ground and waiting — show things to do. */
const LAST_MILE = new Set(["arrived", "on_belt", "delayed"]);

function HeroSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-52 w-full rounded-3xl" />
      <div className="space-y-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function BagView() {
  const t = useTranslations("Bag");
  const mounted = useMounted();
  const activeTag = useBags((s) => s.activeTag);
  const link = useBags((s) => s.link);
  const [adding, setAdding] = useState(false);

  const { status, notFound, error, isLoading } = useBagJourney(
    mounted && activeTag ? activeTag : null,
  );

  if (!mounted) return <HeroSkeleton />;

  // No bag linked yet, or the passenger is adding another: show the scanner.
  if (!activeTag || adding) {
    return (
      <TagScanner
        onLinked={(tag) => {
          link(tag);
          setAdding(false);
        }}
      />
    );
  }

  if (isLoading || !status) return <HeroSkeleton />;

  if (notFound || error) {
    return (
      <div className="space-y-4">
        <EmptyState
          icon={<Luggage size={22} />}
          title={t(notFound ? "notFound" : "errorTitle")}
          description={t(notFound ? "notFoundSub" : "errorSub")}
        />
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="min-h-[44px] w-full rounded-xl border border-white/[0.08] text-sm font-medium text-ink-soft"
        >
          {t("trackAnother")}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <BagStatusHero status={status} />
      {LAST_MILE.has(status.stage) ? (
        <WhileYouWait etaMin={status.etaMin} />
      ) : null}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-ink">{t("journey")}</h2>
        <div className="rounded-2xl border border-white/[0.06] bg-surface p-4">
          <BagTimeline status={status} />
        </div>
      </section>
      <div className="flex gap-2">
        <Link
          href={`/bag/${activeTag}/live`}
          className="flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl border border-white/[0.08] text-sm font-medium text-ink-soft"
        >
          <Share2 size={16} aria-hidden /> {t("shareLive")}
        </Link>
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl border border-white/[0.08] text-sm font-medium text-ink-soft"
        >
          <Plus size={16} aria-hidden /> {t("trackAnother")}
        </button>
      </div>
    </div>
  );
}
