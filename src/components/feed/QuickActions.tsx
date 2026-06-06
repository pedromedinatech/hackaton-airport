"use client";

import { useTranslations } from "next-intl";
import { Bus, Map, Plane, Star } from "lucide-react";
import { Link } from "@/i18n/navigation";

const ITEMS = [
  { href: "/fly", key: "flights", Icon: Plane },
  { href: "/transport", key: "transport", Icon: Bus },
  { href: "/fly", key: "map", Icon: Map },
  { href: "/saved", key: "saved", Icon: Star },
] as const;

export default function QuickActions() {
  const t = useTranslations("QuickActions");
  return (
    <div className="grid grid-cols-4 gap-2">
      {ITEMS.map(({ href, key, Icon }) => (
        <Link
          key={key}
          href={href}
          className="flex flex-col items-center gap-1.5 rounded-2xl border border-white/[0.06] bg-surface p-3 text-center"
        >
          <span
            className="grid h-11 w-11 place-items-center rounded-2xl bg-white/[0.06] text-accent"
            aria-hidden
          >
            <Icon size={20} />
          </span>
          <span className="text-[11px] font-semibold leading-tight text-ink-soft">
            {t(key)}
          </span>
        </Link>
      ))}
    </div>
  );
}
