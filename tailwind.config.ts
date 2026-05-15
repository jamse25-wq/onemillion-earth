import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0f0a",
        foreground: "#e8f5e9",
        "green-primary": "#3ddc84",
        "green-secondary": "#7aab8a",
        "green-muted": "#2a3f2a",
        surface: "#111811",
        "surface-2": "#162016",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "glow-sm": "0 0 12px rgba(61, 220, 132, 0.15)",
        glow: "0 0 24px rgba(61, 220, 132, 0.2)",
        "glow-lg": "0 0 48px rgba(61, 220, 132, 0.25)",
        "glow-xl": "0 0 80px rgba(61, 220, 132, 0.3)",
      },
      animation: {
        ticker: "ticker 40s linear infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
