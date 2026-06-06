"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SavedState {
  ids: string[];
  toggle: (id: string) => void;
}

/** Saved places/events for the trip. Persisted locally (GDPR-friendly). */
export const useSavedItems = create<SavedState>()(
  persist(
    (set) => ({
      ids: [],
      toggle: (id) =>
        set((state) => ({
          ids: state.ids.includes(id)
            ? state.ids.filter((x) => x !== id)
            : [...state.ids, id],
        })),
    }),
    { name: "airarrival-saved" },
  ),
);
