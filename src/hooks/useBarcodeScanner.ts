"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Minimal shape of the native BarcodeDetector API (not yet in TS lib types).
 * Used to read the bag tag's barcode/QR from the device camera.
 */
interface DetectedBarcode {
  rawValue: string;
}
interface BarcodeDetectorLike {
  detect(source: CanvasImageSource): Promise<DetectedBarcode[]>;
}
type BarcodeDetectorCtor = new (opts?: {
  formats?: string[];
}) => BarcodeDetectorLike;

function getDetectorCtor(): BarcodeDetectorCtor | null {
  if (typeof window === "undefined") return null;
  return (
    (window as unknown as { BarcodeDetector?: BarcodeDetectorCtor })
      .BarcodeDetector ?? null
  );
}

export interface ScannerControls {
  videoRef: React.RefObject<HTMLVideoElement>;
  /** True when the browser exposes BarcodeDetector + a camera can be used. */
  supported: boolean;
  scanning: boolean;
  error: boolean;
  start: () => Promise<void>;
  stop: () => void;
}

/** Drives the camera and polls BarcodeDetector, calling `onResult` on a hit. */
export function useBarcodeScanner(
  onResult: (value: string) => void,
): ScannerControls {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState(false);

  const supported = getDetectorCtor() !== null;

  const stop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setScanning(false);
  }, []);

  const start = useCallback(async () => {
    const Ctor = getDetectorCtor();
    if (!Ctor) {
      setError(true);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      const video = videoRef.current;
      if (!video) return;
      video.srcObject = stream;
      await video.play();
      setScanning(true);
      setError(false);

      const detector = new Ctor({ formats: ["code_128", "qr_code", "code_39"] });
      const tick = async () => {
        if (!videoRef.current) return;
        try {
          const hits = await detector.detect(videoRef.current);
          if (hits[0]?.rawValue) {
            onResult(hits[0].rawValue);
            stop();
            return;
          }
        } catch {
          /* transient decode miss — keep polling */
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    } catch {
      setError(true);
      stop();
    }
  }, [onResult, stop]);

  useEffect(() => stop, [stop]);

  return { videoRef, supported, scanning, error, start, stop };
}
