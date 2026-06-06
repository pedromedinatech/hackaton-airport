import type { ReactNode } from "react";

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-white/[0.06] bg-surface px-6 py-12 text-center">
      <div
        className="grid h-14 w-14 place-items-center rounded-2xl bg-white/[0.06] text-ink-soft"
        aria-hidden
      >
        {icon}
      </div>
      <h3 className="text-base font-semibold text-ink">{title}</h3>
      <p className="max-w-xs text-sm text-ink-soft">{description}</p>
      {action}
    </div>
  );
}
