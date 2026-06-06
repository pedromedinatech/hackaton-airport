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
      className="grid gap-1 rounded-2xl bg-slate-100 p-1"
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
              active ? "bg-white text-navy shadow-sm" : "text-ink-soft",
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
