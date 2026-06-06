"use client";

import { useTranslations } from "next-intl";
import { WifiOff } from "lucide-react";
import { useOffline } from "@/hooks/useOffline";

export default function OfflineBanner() {
  const offline = useOffline();
  const t = useTranslations("Offline");

  if (!offline) return null;

  return (
    <div
      role="status"
      className="bg-amber-500 px-4 py-2 text-center text-xs font-semibold text-white"
    >
      <span className="inline-flex items-center gap-1.5">
        <WifiOff size={14} aria-hidden /> {t("message")}
      </span>
    </div>
  );
}
