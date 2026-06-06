"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { PlaneLanding } from "lucide-react";

export default function ArrivalContextStrip() {
  const t = useTranslations("Home");
  const [time, setTime] = useState<string | null>(null);

  // Render the time only after mount to avoid an SSR/CSR hydration mismatch.
  useEffect(() => {
    setTime(
      new Intl.DateTimeFormat([], {
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date()),
    );
  }, []);

  return (
    <section className="rounded-3xl bg-navy p-5 text-white shadow-card">
      <div className="flex items-center gap-3">
        <span
          className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-accent text-navy"
          aria-hidden
        >
          <PlaneLanding size={22} />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-bold">
            {t("landedAt")}
            {time ? ` · ${time}` : ""}
          </p>
          <p className="mt-0.5 text-xs text-white/60">{t("personalized")}</p>
        </div>
      </div>
    </section>
  );
}
