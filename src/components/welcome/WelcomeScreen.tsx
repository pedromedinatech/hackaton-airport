"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import LanguageSwitch from "@/components/layout/LanguageSwitch";

export function WelcomeScreen() {
  const t = useTranslations("Welcome");
  const reduce = useReducedMotion();

  const container: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduce ? 0 : 0.07, delayChildren: 0.1 },
    },
  };
  const item: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 18 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-canvas">
      {/* Backdrop */}
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
        <div className="absolute inset-0 bg-gradient-to-t from-canvas via-canvas/75 to-canvas/20" />
        <div className="absolute inset-0 bg-gradient-to-b from-canvas/60 via-transparent to-transparent" />
      </motion.div>

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-end px-5 pt-12">
        <LanguageSwitch />
      </div>

      {/* Poster */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 mt-auto px-5 pb-9"
      >
        <motion.span
          variants={item}
          className="inline-block bg-accent px-3 py-1 font-display text-3xl uppercase leading-none tracking-tight text-accent-ink"
        >
          {t("kicker")}
        </motion.span>

        <motion.h1
          variants={item}
          className="mt-3 font-display text-[5.5rem] uppercase leading-[0.82] tracking-tight text-ink"
        >
          {t("city")}
        </motion.h1>

        <motion.h2
          variants={item}
          className="mt-1 font-display text-[2.1rem] uppercase leading-[0.95] tracking-tight text-ink/90"
        >
          {t("airport")}
        </motion.h2>

        <motion.p
          variants={item}
          className="mt-5 max-w-sm text-[15px] leading-relaxed text-ink-soft"
        >
          {t("subtitle")}
        </motion.p>

        <motion.div variants={item} className="mt-7 space-y-3">
          <Link
            href="/"
            className="group flex min-h-[58px] w-full items-center justify-between rounded-full bg-accent pl-6 pr-2 text-base font-bold text-accent-ink shadow-glow transition active:scale-[0.98] hover:bg-accent-dark"
          >
            {t("cta")}
            <span className="grid h-11 w-11 place-items-center rounded-full bg-canvas/15 transition-transform group-hover:translate-x-0.5">
              <ArrowUpRight size={20} aria-hidden />
            </span>
          </Link>
          <Link
            href="/bag"
            className="flex min-h-[44px] w-full items-center justify-center text-sm font-semibold text-ink-soft transition hover:text-ink"
          >
            {t("secondary")}
          </Link>
          <p className="text-center text-xs text-ink-faint">{t("note")}</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
