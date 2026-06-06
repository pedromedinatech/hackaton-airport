"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Check, Ticket } from "lucide-react";
import { cn } from "@/lib/cn";

export default function ReserveButton() {
  const t = useTranslations("Detail");
  const [done, setDone] = useState(false);

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => setDone(true)}
        className={cn(
          "flex min-h-[48px] w-full items-center justify-center gap-2 rounded-2xl text-sm font-bold transition active:scale-[0.98]",
          done ? "bg-accent/[0.12] text-accent border border-accent/20" : "bg-accent text-canvas",
        )}
      >
        {done ? <Check size={18} aria-hidden /> : <Ticket size={18} aria-hidden />}
        {done ? t("reserved") : t("reserve")}
      </button>
      {done ? (
        <p className="text-center text-xs text-ink-soft" role="status">
          {t("reservedMsg")}
        </p>
      ) : null}
    </div>
  );
}
