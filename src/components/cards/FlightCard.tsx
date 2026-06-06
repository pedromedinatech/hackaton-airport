import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/Badge";
import type {
  Flight,
  FlightDirection,
  FlightStatus,
} from "@/features/airport-services/types";

const STATUS_TONE: Record<FlightStatus, string> = {
  on_time: "accent",
  landed: "accent",
  boarding: "event",
  delayed: "winery",
  departed: "neutral",
};

export function FlightCard({
  flight,
  direction,
}: {
  flight: Flight;
  direction: FlightDirection;
}) {
  const t = useTranslations("Fly");
  const ts = useTranslations("Fly.status");

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-surface p-3.5">
      <div className="w-12 shrink-0 text-center">
        <p className="text-lg font-bold tabular-nums leading-none text-ink">
          {flight.time}
        </p>
        <p className="mt-1 text-[11px] font-semibold text-ink-faint">
          {flight.code}
        </p>
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-ink">{flight.city}</p>
        <p className="truncate text-xs text-ink-faint">
          {flight.flightNo} · {flight.airline}
        </p>
      </div>
      <div className="shrink-0 text-right">
        <Badge tone={STATUS_TONE[flight.status]}>{ts(flight.status)}</Badge>
        <p className="mt-1 text-[11px] text-ink-faint">
          {direction === "arrivals"
            ? `${t("belt")} ${flight.belt ?? "—"}`
            : `${t("gate")} ${flight.gate ?? "—"}`}
        </p>
      </div>
    </div>
  );
}
