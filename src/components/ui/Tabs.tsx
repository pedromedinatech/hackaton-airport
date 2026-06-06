"use client";

import { cn } from "@/lib/cn";

interface Tab<T extends string> {
  value: T;
  label: string;
}

export function Tabs<T extends string>({
  tabs,
  value,
  onChange,
}: {
  tabs: Tab<T>[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div
      role="tablist"
      className="grid gap-1 rounded-2xl bg-white/[0.04] border border-white/[0.06] p-1"
      style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}
    >
      {tabs.map((tab) => {
        const active = tab.value === value;
        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.value)}
            className={cn(
              "min-h-[40px] rounded-xl text-sm font-semibold transition",
              active ? "bg-surface text-ink shadow-sm" : "text-ink-faint",
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
