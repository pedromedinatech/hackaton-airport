import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: "#0A0F1A", 800: "#0D1321", 700: "#111827" },
        accent: { DEFAULT: "#00D4AA", dark: "#00B891", muted: "rgba(0,212,170,0.12)", ink: "#003D30" },
        ink: { DEFAULT: "#F8FAFC", soft: "#94A3B8", faint: "#475569" },
        surface: "#111827",
        canvas: "#0A0F1A",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "sans-serif"],
      },
      boxShadow: {
        card: "0 0 0 1px rgba(255,255,255,0.06)",
        nav: "0 -1px 0 0 rgba(255,255,255,0.06)",
        glow: "0 0 20px rgba(0,212,170,0.15)",
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
