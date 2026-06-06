"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Camera, ScanLine } from "lucide-react";
import { DEMO_TAGS } from "@/features/baggage/simulator";
import { useBarcodeScanner } from "@/hooks/useBarcodeScanner";
import { cn } from "@/lib/cn";

/** Normalize a scanned/typed value to the 10-digit license plate. */
function normalizeTag(raw: string): string {
  return raw.replace(/\D/g, "").slice(0, 10);
}

/**
 * Entry point of the whole flow: the passenger scans the bag tag the airline
 * printed (its barcode encodes the 10-digit license plate) — no app, no login.
 * Falls back to manual entry, with demo tags for a zero-risk live demo.
 */
export function TagScanner({ onLinked }: { onLinked: (tag: string) => void }) {
  const t = useTranslations("Bag.scan");
  const [manual, setManual] = useState("");
  const { videoRef, supported, scanning, error, start, stop } =
    useBarcodeScanner((raw) => {
      const tag = normalizeTag(raw);
      if (tag.length === 10) onLinked(tag);
    });

  const submitManual = () => {
    const tag = normalizeTag(manual);
    if (tag.length === 10) onLinked(tag);
  };

  return (
    <div className="space-y-5">
      <div className="space-y-1 text-center">
        <h2 className="text-xl font-bold text-ink">{t("title")}</h2>
        <p className="mx-auto max-w-xs text-sm text-ink-soft">{t("hint")}</p>
      </div>

      <div className="relative aspect-square overflow-hidden rounded-3xl border border-white/[0.08] bg-canvas">
        <video
          ref={videoRef}
          muted
          playsInline
          className={cn("h-full w-full object-cover", !scanning && "hidden")}
        />
        {!scanning ? (
          <button
            type="button"
            onClick={start}
            disabled={!supported}
            className="flex h-full w-full flex-col items-center justify-center gap-3 text-ink-soft disabled:opacity-60"
          >
            <Camera size={40} aria-hidden className="text-accent" />
            <span className="text-sm font-semibold">
              {supported ? t("scanBtn") : t("noCamera")}
            </span>
          </button>
        ) : (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <ScanLine size={120} aria-hidden className="text-accent/70" />
          </div>
        )}
      </div>

      {scanning ? (
        <button
          type="button"
          onClick={stop}
          className="min-h-[44px] w-full rounded-xl border border-white/[0.08] text-sm font-medium text-ink-soft"
        >
          {t("stop")}
        </button>
      ) : null}
      {error ? <p className="text-center text-xs text-amber-400">{t("cameraError")}</p> : null}

      <div className="flex items-center gap-3 text-xs text-ink-faint">
        <span className="h-px flex-1 bg-white/[0.08]" /> {t("or")}{" "}
        <span className="h-px flex-1 bg-white/[0.08]" />
      </div>

      <div className="flex gap-2">
        <input
          inputMode="numeric"
          value={manual}
          onChange={(e) => setManual(e.target.value)}
          placeholder={t("manualPlaceholder")}
          aria-label={t("manualLabel")}
          className="min-h-[44px] flex-1 rounded-xl border border-white/[0.08] bg-surface px-3 text-sm text-ink placeholder:text-ink-faint"
        />
        <button
          type="button"
          onClick={submitManual}
          disabled={normalizeTag(manual).length !== 10}
          className="min-h-[44px] rounded-xl bg-accent px-4 text-sm font-bold text-canvas disabled:opacity-40"
        >
          {t("submit")}
        </button>
      </div>

      <div className="space-y-1.5">
        <p className="text-xs font-medium text-ink-faint">{t("demoLabel")}</p>
        <div className="flex gap-2">
          {DEMO_TAGS.map((tag, i) => (
            <button
              key={tag}
              type="button"
              onClick={() => onLinked(tag)}
              className="min-h-[44px] flex-1 rounded-xl border border-white/[0.08] bg-surface text-sm font-medium text-ink-soft"
            >
              {t("demoTrip", { n: i + 1 })}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
