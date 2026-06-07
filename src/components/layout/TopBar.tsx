"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import LanguageSwitch from "./LanguageSwitch";

export default function TopBar() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-canvas/95 backdrop-blur">
      <div className="mx-auto flex max-w-md items-center justify-between px-4 py-1">
        <Link href="/" aria-label="Iași Airport" className="flex items-center">
          <Image
            src="/iasi-airport-logo.png"
            alt="Iași Airport"
            width={182}
            height={36}
            className="h-9 w-auto object-contain"
            priority
          />
        </Link>
        <LanguageSwitch />
      </div>
    </header>
  );
}
