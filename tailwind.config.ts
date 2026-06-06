import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#0A1628",
        surface: { DEFAULT: "#13243D", soft: "#1B2F4E" },
        line: "#22344F",
        accent: { DEFAULT: "#78BF25", dark: "#5FA01E", muted: "rgba(120,191,37,0.12)", ink: "#0A1628" },
        navy: { DEFAULT: "#1E5A6B", soft: "#256B80", deep: "#16414E" },
        ink: { DEFAULT: "#F8FAFC", soft: "#A8B6CC", faint: "#6B7C97" },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      // Whole app uses Inter at just two weights: Thin (100) for body, Regular
      // (400) for anything emphasized/titles. Collapse the scale so existing
      // font-bold/semibold/etc. utilities resolve to 400 (no synthetic bold).
      fontWeight: {
        thin: "100",
        extralight: "100",
        light: "100",
        normal: "400",
        medium: "400",
        semibold: "400",
        bold: "400",
        extrabold: "400",
        black: "400",
      },
      boxShadow: {
        card: "0 0 0 1px rgba(255,255,255,0.06)",
        nav: "0 -1px 0 0 rgba(255,255,255,0.06)",
        glow: "0 8px 30px rgba(120,191,37,0.28)",
      },
      maxWidth: { md: "430px" },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.35s ease-out both",
      },
    },
  },
  plugins: [],
};
export default config;
