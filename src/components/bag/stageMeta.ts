import type { JourneyStage } from "@/features/baggage/types";

/** Emoji + accent flag for each stage. `calm` stages render in the brand green. */
export const STAGE_META: Record<JourneyStage, { emoji: string; calm: boolean }> = {
  checked_in: { emoji: "🧳", calm: true },
  loaded: { emoji: "📦", calm: true },
  in_air: { emoji: "✈️", calm: true },
  connection_ok: { emoji: "🔄", calm: true },
  arrived: { emoji: "🛬", calm: true },
  on_belt: { emoji: "🎉", calm: true },
  collected: { emoji: "✅", calm: true },
  delayed: { emoji: "⏳", calm: false },
};

/** Canonical stage order, for sorting the stepper independent of event order. */
export const STAGE_ORDER: JourneyStage[] = [
  "checked_in",
  "loaded",
  "in_air",
  "connection_ok",
  "arrived",
  "on_belt",
  "collected",
];
