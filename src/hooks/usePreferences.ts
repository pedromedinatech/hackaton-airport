"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Interest } from "@/features/recommendations/types";

interface PreferencesState {
  interests: Interest[];
  toggleInterest: (interest: Interest) => void;
  clear: () => void;
}

/** Local-first interest preferences. No account, persisted in localStorage. */
export const usePreferences = create<PreferencesState>()(
  persist(
    (set) => ({
      interests: [],
      toggleInterest: (interest) =>
        set((state) => ({
          interests: state.interests.includes(interest)
            ? state.interests.filter((i) => i !== interest)
            : [...state.interests, interest],
        })),
      clear: () => set({ interests: [] }),
    }),
    { name: "airarrival-preferences" },
  ),
);
