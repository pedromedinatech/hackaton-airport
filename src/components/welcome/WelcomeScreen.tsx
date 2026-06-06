"use client";

import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import { Link } from "@/i18n/navigation";

const STATS = [
  { value: "Live", label: "Events tonight" },
  { value: "5", label: "Ways to get around" },
  { value: "24/7", label: "Right as you land" },
] as const;

export function WelcomeScreen() {
  const reduce = useReducedMotion();

  const container: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduce ? 0 : 0.08, delayChildren: 0.1 },
    },
  };
  const item: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-canvas">
      {/* Backdrop photo */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: reduce ? 1 : 1.08, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <Image
          src="/palas.jpeg"
          alt="Palace of Culture, Iași at dusk"
          fill
          priority
          unoptimized
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Scrims for legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-canvas via-canvas/55 to-canvas/10" />
        <div className="absolute inset-0 bg-gradient-to-b from-canvas/70 via-transparent to-transparent" />
      </motion.div>

      {/* Top badge */}
      <div className="relative z-10 px-6 pt-12">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-ink backdrop-blur-md">
          <MapPin size={12} aria-hidden />
          IAS · Iași International
        </span>
      </div>

      {/* Bottom-anchored content */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 mt-auto px-6 pb-10"
      >
        <motion.p
          variants={item}
          className="mb-1 font-display text-lg font-semibold uppercase tracking-[0.32em] text-accent"
        >
          Welcome to
        </motion.p>

        <motion.h1
          variants={item}
          className="font-display text-[5.5rem] font-black uppercase leading-[0.85] tracking-tight text-ink"
        >
          Iași
        </motion.h1>

        <motion.div
          variants={item}
          className="mt-1 flex items-center gap-3"
        >
          <span className="h-px w-10 bg-accent" />
          <span className="font-display text-xl font-semibold uppercase tracking-[0.2em] text-ink-soft">
            Romania
          </span>
        </motion.div>

        <motion.p
          variants={item}
          className="mt-5 max-w-sm text-[15px] leading-relaxed text-ink-soft"
        >
          Events tonight, transport that actually works, and live flights —
          everything you need the moment you step off the plane.
        </motion.p>

        {/* Stats row */}
        <motion.div
          variants={item}
          className="mt-7 grid grid-cols-3 gap-2"
        >
          {STATS.map(({ value, label }) => (
            <div
              key={label}
              className="rounded-2xl border border-white/10 bg-white/[0.05] px-3 py-3 backdrop-blur-md"
            >
              <p className="font-display text-2xl font-extrabold leading-none text-ink">
                {value}
              </p>
              <p className="mt-1.5 text-[11px] leading-tight text-ink-soft">
                {label}
              </p>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div variants={item} className="mt-8 space-y-3">
          <Link
            href="/bag"
            className="group flex min-h-[54px] w-full items-center justify-center gap-2 rounded-2xl bg-accent text-base font-bold text-canvas shadow-glow transition active:scale-[0.98] hover:bg-accent-dark"
          >
            Track my bag
            <ArrowRight
              size={18}
              aria-hidden
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
          <Link
            href="/"
            className="flex min-h-[44px] w-full items-center justify-center text-sm font-medium text-ink-soft"
          >
            Explore Iași instead
          </Link>
          <p className="text-center text-xs text-ink-faint">
            No sign-up needed · Works offline
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
