"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface BagsState {
  /** License-plate tags the passenger has linked. */
  tags: string[];
  /** The tag currently shown in the tracker. */
  activeTag: string | null;
  link: (tag: string) => void;
  unlink: (tag: string) => void;
  setActive: (tag: string) => void;
}

/** Local-first linked bags. No account, persisted in localStorage (GDPR-safe). */
export const useBags = create<BagsState>()(
  persist(
    (set) => ({
      tags: [],
      activeTag: null,
      link: (tag) =>
        set((state) => ({
          tags: state.tags.includes(tag) ? state.tags : [...state.tags, tag],
          activeTag: tag,
        })),
      unlink: (tag) =>
        set((state) => {
          const tags = state.tags.filter((t) => t !== tag);
          return {
            tags,
            activeTag: state.activeTag === tag ? (tags[0] ?? null) : state.activeTag,
          };
        }),
      setActive: (tag) => set({ activeTag: tag }),
    }),
    { name: "airarrival-bags" },
  ),
);
