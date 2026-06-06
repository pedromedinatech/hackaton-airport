import type { Locale } from "@/i18n/routing";

/** Format a price in RON (lei). Returns null for free so callers can label it. */
export function formatPrice(
  amount: number | undefined,
  locale: Locale,
): string | null {
  if (amount === undefined || amount <= 0) return null;
  return new Intl.NumberFormat(locale === "ro" ? "ro-RO" : "en-US", {
    style: "currency",
    currency: "RON",
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Format an ISO timestamp as a short local time, e.g. "20:45". */
export function formatTime(iso: string | undefined, locale: Locale): string {
  if (!iso) return "";
  return new Intl.DateTimeFormat(locale === "ro" ? "ro-RO" : "en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

/** "HH:MM" clock string for a given hour-of-day number (0-23). */
export function hourLabel(hour: number): string {
  return `${String(hour).padStart(2, "0")}:00`;
}
