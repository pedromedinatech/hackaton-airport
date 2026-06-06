"use client";

import { useTranslations, useLocale } from "next-intl";
import { Check } from "lucide-react";
import type { BagStatus } from "@/features/baggage/types";
import type { Locale } from "@/i18n/routing";
import { formatTime } from "@/lib/format";
import { cn } from "@/lib/cn";
import { STAGE_META } from "./stageMeta";

/** Vertical stepper of the bag's full journey: where it's been, where it is. */
export function BagTimeline({ status }: { status: BagStatus }) {
  const t = useTranslations("Bag");
  const locale = useLocale() as Locale;

  return (
    <ol className="space-y-0">
      {status.timeline.map((step, i) => {
        const last = i === status.timeline.length - 1;
        const active = step.done || step.current;
        return (
          <li key={step.stage} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm",
                  step.current && "border-accent bg-accent/15 text-accent",
                  step.done && "border-accent/40 bg-accent/10 text-accent",
                  !active && "border-white/[0.08] bg-surface text-ink-faint",
                )}
                aria-hidden
              >
                {step.done ? <Check size={15} /> : STAGE_META[step.stage].emoji}
              </span>
              {!last ? (
                <span
                  className={cn(
                    "w-px flex-1",
                    active ? "bg-accent/30" : "bg-white/[0.06]",
                  )}
                />
              ) : null}
            </div>
            <div className={cn("pb-5", last && "pb-0")}>
              <p
                className={cn(
                  "text-sm font-medium",
                  step.current ? "text-ink" : active ? "text-ink-soft" : "text-ink-faint",
                )}
              >
                {t(`stage.${step.stage}`)}
                {step.current ? (
                  <span className="ml-2 text-xs font-semibold text-accent">
                    {t("now")}
                  </span>
                ) : null}
              </p>
              {step.at ? (
                <p className="text-xs text-ink-faint">{formatTime(step.at, locale)}</p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
