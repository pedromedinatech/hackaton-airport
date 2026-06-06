import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

const TONES: Record<string, string> = {
  event: "bg-violet-950/60 text-violet-300 border border-violet-800/40",
  concert: "bg-fuchsia-950/60 text-fuchsia-300 border border-fuchsia-800/40",
  museum: "bg-sky-950/60 text-sky-300 border border-sky-800/40",
  winery: "bg-rose-950/60 text-rose-300 border border-rose-800/40",
  gallery: "bg-purple-950/60 text-purple-300 border border-purple-800/40",
  restaurant: "bg-orange-950/60 text-orange-300 border border-orange-800/40",
  coworking: "bg-emerald-950/60 text-emerald-300 border border-emerald-800/40",
  conference: "bg-blue-950/60 text-blue-300 border border-blue-800/40",
  park: "bg-green-950/60 text-green-300 border border-green-800/40",
  landmark: "bg-amber-950/60 text-amber-300 border border-amber-800/40",
  neutral: "bg-white/[0.06] text-ink-soft border border-white/[0.08]",
  accent: "bg-accent/[0.12] text-accent border border-accent/20",
};

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: keyof typeof TONES | string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
        TONES[tone] ?? TONES.neutral,
        className,
      )}
    >
      {children}
    </span>
  );
}
