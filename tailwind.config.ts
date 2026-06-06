import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: "#1E5A6B", 800: "#174E5E", 700: "#0F3F4E" },
        accent: { DEFAULT: "#78BF25", dark: "#5E9A1D", ink: "#1A3008" },
        ink: { DEFAULT: "#0A1628", soft: "#475569", faint: "#94A3B8" },
        surface: "#FFFFFF",
        canvas: "#F3F5FA",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 6px 24px -8px rgba(10,22,40,0.18)",
        nav: "0 -4px 24px -10px rgba(10,22,40,0.20)",
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
