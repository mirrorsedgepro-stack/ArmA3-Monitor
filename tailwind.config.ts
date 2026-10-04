import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ga: {
          bg: "#0B0D17",
          surface: "#101320",
          card: "#161928",
          cardHover: "#1C2035",
          border: "rgba(255, 255, 255, 0.08)",
          borderHover: "rgba(255, 255, 255, 0.16)",
          mint: "#14F0AF",
          mintHover: "#0FE2A3",
          indigo: "#4650F0",
          blue: "#4D65FF",
          purple: "#8B5CF6",
          textMuted: "#94A3B8",
          textDim: "#64748B",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Consolas",
          "monospace",
        ],
      },
      backgroundImage: {
        "ga-gradient": "linear-gradient(135deg, rgba(20, 240, 175, 0.15) 0%, rgba(70, 80, 240, 0.15) 100%)",
        "ga-hero-glow": "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(70, 80, 240, 0.25), transparent)",
        "ga-mint-glow": "radial-gradient(circle at 50% 50%, rgba(20, 240, 175, 0.2) 0%, transparent 60%)",
      },
      boxShadow: {
        "ga-card": "0 4px 20px -2px rgba(0, 0, 0, 0.5)",
        "ga-mint": "0 0 20px -4px rgba(20, 240, 175, 0.4)",
        "ga-indigo": "0 0 20px -4px rgba(70, 80, 240, 0.4)",
      },
    },
  },
  plugins: [],
};

export default config;
