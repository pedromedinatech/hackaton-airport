"use client";

import { useTranslations } from "next-intl";
import { usePreferences } from "@/hooks/usePreferences";
import { useMounted } from "@/hooks/useMounted";
import { cn } from "@/lib/cn";
import type { Interest } from "@/features/recommendations/types";

const INTERESTS: Interest[] = [
  "culture",
  "wine",
  "food",
  "music",
  "business",
  "art",
  "nature",
];

export default function InterestChips() {
  const t = useTranslations("Interests");
  const selected = usePreferences((s) => s.interests);
  const toggle = usePreferences((s) => s.toggleInterest);
  const mounted = useMounted();

  return (
    <section aria-label={t("title")}>
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
        {INTERESTS.map((interest) => {
          const active = mounted && selected.includes(interest);
          return (
            <button
              key={interest}
              type="button"
              onClick={() => toggle(interest)}
              aria-pressed={active}
              className={cn(
                "min-h-[38px] shrink-0 rounded-full border px-4 text-sm font-semibold transition",
                active
                  ? "border-accent/40 bg-accent/[0.12] text-accent"
                  : "border-white/[0.10] bg-transparent text-ink-soft hover:border-white/20",
              )}
            >
              {t(interest)}
            </button>
          );
        })}
      </div>
    </section>
  );
}
