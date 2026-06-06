"use client";

import { useEffect, useState } from "react";

/**
 * Returns true only after the first client render. Use to gate UI that depends
 * on localStorage-persisted state so server and client markup match on hydration.
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
