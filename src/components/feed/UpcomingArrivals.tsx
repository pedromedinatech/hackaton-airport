import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { FLIGHTS } from "@/data";
import type { FlightStatus } from "@/features/airport-services/types";
import { cn } from "@/lib/cn";

const STATUS_COLOR: Record<FlightStatus, string> = {
  on_time: "text-accent",
  landed: "text-accent",
  boarding: "text-sky-400",
  delayed: "text-amber-400",
  departed: "text-ink-faint",
};

/** Changi-style "Upcoming arrivals" list: a clean divided list, gate/belt on the right. */
export default function UpcomingArrivals() {
  const t = useTranslations("Fly");
  const ts = useTranslations("Fly.status");
  const arrivals = FLIGHTS.arrivals.slice(0, 4);

  return (
    <section>
      <div className="mb-1 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-ink-soft">
          {t("upcomingArrivals")}
        </h2>
        <Link
          href="/fly"
          className="inline-flex items-center gap-1 text-xs font-medium text-ink-faint transition hover:text-ink-soft"
        >
          {t("viewAll")} <ArrowUpRight size={13} aria-hidden />
        </Link>
      </div>
      <ul>
        {arrivals.map((f) => (
          <li key={f.flightNo}>
            <Link
              href="/fly"
              className="flex items-center gap-3 border-b border-line py-3.5 last:border-0"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-bold text-ink">
                  {f.city}{" "}
                  <span className="font-normal text-ink-faint">→ Iași</span>
                </p>
                <p className="truncate text-xs text-ink-faint">
                  {f.flightNo} · {f.airline} · {f.time}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-xs font-semibold text-ink-soft">
                  {t("belt")} {f.belt ?? "—"}
                </p>
                <p className={cn("text-[11px] font-medium", STATUS_COLOR[f.status])}>
                  {ts(f.status)}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
