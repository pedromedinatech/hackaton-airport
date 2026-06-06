"use client";

import { Link } from "@/i18n/navigation";
import LanguageSwitch from "./LanguageSwitch";

function IASMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 52 38"
      fill="none"
      className={className}
      aria-hidden
    >
      <path d="M3,35 L10,3 L18,3 L11,35Z" fill="#78BF25" />
      <path d="M18,35 L27,3 L34,3 L25,35Z" fill="#78BF25" />
      <path d="M31,35 Q39,19 52,5 L52,14 Q41,26 39,35Z" fill="#78BF25" />
    </svg>
  );
}

export default function TopBar() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-canvas/95 backdrop-blur">
      <div className="mx-auto flex max-w-md items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2.5">
          <IASMark className="h-8 w-10 shrink-0" />
          <span className="leading-tight">
            <span className="block text-sm font-bold tracking-widest uppercase text-ink">
              Iași Airport
            </span>
            <span className="block text-[11px] text-ink-faint tracking-wide">
              AirArrival · IAS
            </span>
          </span>
        </Link>
        <LanguageSwitch />
      </div>
    </header>
  );
}
