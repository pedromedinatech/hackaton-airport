"use client";

import { useTranslations } from "next-intl";
import { useMounted } from "@/hooks/useMounted";

/** Time-aware greeting above the home dashboard, à la Changi's "Good afternoon!". */
export default function HomeGreeting() {
  const t = useTranslations("Home");
  const mounted = useMounted();

  const hour = new Date().getHours();
  const greetingKey =
    hour < 12
      ? "greetingMorning"
      : hour < 19
        ? "greetingAfternoon"
        : "greetingEvening";

  return (
    <header>
      <p className="text-sm font-medium text-ink-faint">
        {mounted ? t(greetingKey) : " "}
      </p>
      <h1 className="font-display text-3xl uppercase leading-none tracking-tight text-ink">
        {t("welcomeCity")}
      </h1>
    </header>
  );
}
