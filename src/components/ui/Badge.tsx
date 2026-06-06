import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

const TONES: Record<string, string> = {
  event: "bg-violet-100 text-violet-700",
  concert: "bg-fuchsia-100 text-fuchsia-700",
  museum: "bg-sky-100 text-sky-700",
  winery: "bg-rose-100 text-rose-700",
  gallery: "bg-purple-100 text-purple-700",
  restaurant: "bg-orange-100 text-orange-700",
  coworking: "bg-emerald-100 text-emerald-700",
  conference: "bg-blue-100 text-blue-700",
  park: "bg-green-100 text-green-700",
  landmark: "bg-amber-100 text-amber-700",
  neutral: "bg-slate-100 text-slate-600",
  accent: "bg-accent/15 text-accent-dark",
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
