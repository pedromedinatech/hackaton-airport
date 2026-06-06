"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { MapPin, Clock } from "lucide-react";
import type { BagStatus } from "@/features/baggage/types";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/cn";
import { STAGE_META } from "./stageMeta";

/**
 * The emotional centerpiece: a large, calm status that answers "is my bag OK?"
 * before the passenger has to look for anything. Green = on track.
 */
export function BagStatusHero({ status }: { status: BagStatus }) {
  const t = useTranslations("Bag");
  const meta = STAGE_META[status.stage];

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-3xl border p-6 text-center",
        meta.calm
          ? "border-accent/20 bg-accent/[0.06]"
          : "border-amber-800/40 bg-amber-950/30",
      )}
      aria-live="polite"
    >
      <motion.div
        key={status.stage}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-canvas/60 text-4xl"
        aria-hidden
      >
        {meta.emoji}
      </motion.div>

      <h1 className="text-2xl font-bold leading-tight text-ink">
        {t(`headline.${status.stage}`)}
      </h1>
      <p className="mx-auto mt-2 max-w-xs text-sm text-ink-soft">
        {t(status.reasonKey, { eta: status.etaMin ?? 0 })}
      </p>

      {(status.belt || status.etaMin) && status.stage !== "collected" ? (
        <div className="mt-4 flex items-center justify-center gap-2">
          {status.belt ? (
            <Badge tone="accent">
              <MapPin size={13} aria-hidden /> {t("beltLabel", { belt: status.belt })}
            </Badge>
          ) : null}
          {status.etaMin && status.etaMin > 0 ? (
            <Badge tone="neutral">
              <Clock size={13} aria-hidden /> {t("etaLabel", { eta: status.etaMin })}
            </Badge>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
