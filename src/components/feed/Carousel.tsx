import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Carousel({
  children,
  ariaLabel,
  /** When true, cards bleed to the screen edge (-mx-4). Off keeps them aligned. */
  bleed = true,
}: {
  children: ReactNode;
  ariaLabel: string;
  bleed?: boolean;
}) {
  return (
    <div
      role="region"
      aria-label={ariaLabel}
      className={cn(
        "no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1",
        bleed && "-mx-4 px-4",
      )}
    >
      {children}
    </div>
  );
}
