"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Bus, Plane, Ticket, Bot, ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useBags } from "@/hooks/useBags";
import { useBagJourney } from "@/features/baggage/client";
import { useMounted } from "@/hooks/useMounted";
import { STAGE_META } from "@/components/bag/stageMeta";
import { cn } from "@/lib/cn";

/** A square service tile in the Changi-style bento. */
function Tile({
  icon,
  label,
  sub,
  className,
  chipClass,
}: {
  icon: ReactNode;
  label: string;
  sub?: string;
  className?: string;
  chipClass: string;
}) {
  return (
    <div className={cn("flex min-h-[116px] flex-col justify-between rounded-3xl p-4", className)}>
      <span className={cn("grid h-10 w-10 place-items-center rounded-2xl", chipClass)} aria-hidden>
        {icon}
      </span>
      <span>
        <span className="block text-[15px] font-[700] leading-tight">{label}</span>
        {sub ? (
          <span className="block text-xs font-[300] opacity-80">{sub}</span>
        ) : null}
      </span>
    </div>
  );
}

/** Live bag tile — the hero of the grid. */
function BagTile() {
  const t = useTranslations("Home.tiles");
  const tb = useTranslations("Bag");
  const mounted = useMounted();
  const activeTag = useBags((s) => s.activeTag);
  const { status } = useBagJourney(mounted && activeTag ? activeTag : null);

  const emoji = status ? STAGE_META[status.stage].emoji : "🧳";
  const sub = !status
    ? t("bagCta")
    : status.belt
      ? `${tb(`stage.${status.stage}`)} · ${tb("beltLabel", { belt: status.belt })}`
      : status.etaMin
        ? `${tb(`stage.${status.stage}`)} · ${tb("etaLabel", { eta: status.etaMin })}`
        : tb(`stage.${status.stage}`);

  return (
    <Link
      href="/bag"
      className="group col-span-2 flex min-h-[120px] items-center justify-between rounded-3xl bg-accent p-5 text-accent-ink shadow-glow transition active:scale-[0.99]"
    >
      <div className="flex items-center gap-4">
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-canvas/15 text-3xl" aria-hidden>
          {emoji}
        </span>
        <div className="min-w-0">
          <span className="block text-lg font-[700] leading-tight">{t("bag")}</span>
          <span className="block truncate text-sm font-[300] opacity-90">{sub}</span>
        </div>
      </div>
      <ArrowUpRight size={22} aria-hidden className="shrink-0 transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}

export default function ServicesGrid() {
  const t = useTranslations("Home.tiles");
  return (
    <div className="grid grid-cols-2 gap-3">
      <BagTile />

      <Link href="/transport" className="transition active:scale-[0.98]">
        <Tile
          className="bg-[#F4B740] text-[#2A1E05]"
          chipClass="bg-black/10"
          icon={<Bus size={22} />}
          label={t("city")}
          sub={t("citySub")}
        />
      </Link>

      <Link href="/fly" className="transition active:scale-[0.98]">
        <Tile
          className="bg-navy text-ink"
          chipClass="bg-white/15 text-ink"
          icon={<Plane size={22} />}
          label={t("flights")}
          sub={t("flightsSub")}
        />
      </Link>

      <Link href="/events" className="transition active:scale-[0.98]">
        <Tile
          className="bg-[#E8505B] text-white"
          chipClass="bg-white/20"
          icon={<Ticket size={22} />}
          label={t("events")}
          sub={t("eventsSub")}
        />
      </Link>

      <Link href="/help" className="transition active:scale-[0.98]">
        <Tile
          className="bg-surface-soft text-ink"
          chipClass="bg-accent-muted text-accent"
          icon={<Bot size={22} />}
          label={t("aiAssistant")}
          sub={t("helpSub")}
        />
      </Link>
    </div>
  );
}
