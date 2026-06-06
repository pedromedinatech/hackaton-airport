"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Luggage, Map, ScanLine, Search, Sparkles, Store } from "lucide-react";
import { FLIGHTS } from "@/data";
import { Tabs } from "@/components/ui/Tabs";
import { FlightCard } from "@/components/cards/FlightCard";
import { EmptyState } from "@/components/ui/EmptyState";
import type { FlightDirection } from "@/features/airport-services/types";

const SERVICES = [
  { key: "baggage", Icon: Luggage },
  { key: "map", Icon: Map },
  { key: "facilities", Icon: Store },
] as const;

export default function FlyView() {
  const t = useTranslations("Fly");
  const [direction, setDirection] = useState<FlightDirection>("arrivals");
  const [query, setQuery] = useState("");
  const [scanned, setScanned] = useState<string | null>(null);

  const flights = FLIGHTS[direction];
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return flights;
    return flights.filter((f) =>
      [f.flightNo, f.airline, f.city, f.code].some((v) =>
        v.toLowerCase().includes(q),
      ),
    );
  }, [flights, query]);

  function handleScan() {
    setDirection("arrivals");
    setQuery("");
    setScanned(FLIGHTS.arrivals[0].flightNo);
  }

  return (
    <div className="space-y-5">
      <section className="space-y-3 rounded-2xl border border-white/[0.06] bg-surface p-4">
        <div className="flex items-center gap-2 rounded-2xl border border-white/[0.10] bg-white/[0.03] px-3">
          <Search size={18} className="text-ink-faint" aria-hidden />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("searchPlaceholder")}
            aria-label={t("searchPlaceholder")}
            className="min-h-[44px] w-full bg-transparent text-sm outline-none placeholder:text-ink-faint"
          />
        </div>
        <button
          type="button"
          onClick={handleScan}
          className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-2xl bg-accent/[0.12] border border-accent/20 text-sm font-semibold text-accent active:scale-[0.99] transition"
        >
          <ScanLine size={18} aria-hidden /> {t("scan")}
        </button>
        {scanned ? (
          <p
            role="status"
            className="flex items-center gap-1.5 rounded-xl bg-accent/[0.12] border border-accent/20 px-3 py-2 text-xs font-semibold text-accent"
          >
            <Sparkles size={14} aria-hidden /> {t("scanned", { flight: scanned })}
          </p>
        ) : null}
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-ink">{t("liveUpdates")}</h2>
          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-bold text-green-700">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
            {t("live")}
          </span>
        </div>
        <Tabs
          tabs={[
            { value: "arrivals", label: t("arrivals") },
            { value: "departures", label: t("departures") },
          ]}
          value={direction}
          onChange={setDirection}
        />
        {filtered.length === 0 ? (
          <EmptyState
            icon={<Search size={22} />}
            title={t("noFlights")}
            description=""
          />
        ) : (
          <div className="space-y-2">
            {filtered.map((flight) => (
              <FlightCard
                key={`${direction}-${flight.flightNo}`}
                flight={flight}
                direction={direction}
              />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-ink">{t("services")}</h2>
        <div className="grid grid-cols-3 gap-2">
          {SERVICES.map(({ key, Icon }) => (
            <div
              key={key}
              className="flex flex-col items-center gap-1.5 rounded-2xl border border-white/[0.06] bg-surface p-3 text-center"
            >
              <span
                className="grid h-11 w-11 place-items-center rounded-2xl bg-white/[0.06] text-ink-soft"
                aria-hidden
              >
                <Icon size={20} />
              </span>
              <span className="text-[11px] font-semibold text-ink">
                {t(key)}
              </span>
              <span className="text-[10px] text-ink-faint">{t(`${key}Sub`)}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
