"use client";

import { useTranslations } from "next-intl";
import { Bus, Compass, Plane, Star } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

const ITEMS = [
  { href: "/", key: "discover", Icon: Compass, exact: true },
  { href: "/fly", key: "fly", Icon: Plane, exact: false },
  { href: "/transport", key: "transport", Icon: Bus, exact: false },
  { href: "/saved", key: "saved", Icon: Star, exact: false },
] as const;

export default function BottomNav() {
  const t = useTranslations("Nav");
  const pathname = usePathname();

  return (
    <nav className="safe-bottom fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 shadow-nav backdrop-blur">
      <ul className="mx-auto flex max-w-md items-stretch justify-around px-2 pt-1.5">
        {ITEMS.map(({ href, key, Icon, exact }) => {
          const active = exact
            ? pathname === href
            : pathname.startsWith(href);
          return (
            <li key={key} className="flex-1">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-[52px] flex-col items-center justify-center gap-1 rounded-xl text-[11px] font-medium",
                  active ? "text-accent-dark" : "text-ink-faint",
                )}
              >
                <Icon size={22} strokeWidth={active ? 2.4 : 2} aria-hidden />
                {t(key)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
