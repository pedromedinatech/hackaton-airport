import type { ReactNode } from "react";

export function Carousel({
  children,
  ariaLabel,
}: {
  children: ReactNode;
  ariaLabel: string;
}) {
  return (
    <div
      role="region"
      aria-label={ariaLabel}
      className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1"
    >
      {children}
    </div>
  );
}
