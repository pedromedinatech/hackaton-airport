"use client";

import { Heart } from "lucide-react";
import { useSavedItems } from "@/hooks/useSavedItems";
import { useMounted } from "@/hooks/useMounted";
import { cn } from "@/lib/cn";

export function SaveButton({
  id,
  label,
  className,
  size = 18,
}: {
  id: string;
  label: string;
  className?: string;
  size?: number;
}) {
  const saved = useSavedItems((s) => s.ids.includes(id));
  const toggle = useSavedItems((s) => s.toggle);
  const mounted = useMounted();
  const active = mounted && saved;

  return (
    <button
      type="button"
      onClick={() => toggle(id)}
      aria-pressed={active}
      aria-label={label}
      className={cn(
        "grid place-items-center rounded-full transition active:scale-90",
        className,
      )}
    >
      <Heart
        size={size}
        className={cn(active ? "fill-rose-500 text-rose-500" : "text-white")}
        aria-hidden
      />
    </button>
  );
}
