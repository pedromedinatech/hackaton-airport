"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

export default function LanguageSwitch() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const next = locale === "en" ? "ro" : "en";

  return (
    <button
      type="button"
      onClick={() => router.replace(pathname, { locale: next })}
      aria-label={`Switch language to ${next.toUpperCase()}`}
      className="grid h-10 min-w-[44px] place-items-center rounded-full bg-white/10 px-2 text-sm font-bold uppercase text-white"
    >
      {next}
    </button>
  );
}
