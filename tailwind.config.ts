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
        // gethomepage/homepage "slate" theme. The arma.* names are kept so
        // existing components re-skin without class changes.
        arma: {
          bg: "#0f172a",
          surface: "#162033",
          card: "#1c2638",
          cardHover: "#243045",
          border: "#2a374d",
          borderHover: "#3d4d68",
          // Brand / CTA accent and down-state colour
          red: "#ef4444",
          redHover: "#f87171",
          redDim: "rgba(239, 68, 68, 0.14)",
          amber: "#ef4444",
          amberHover: "#f87171",
          amberDim: "rgba(239, 68, 68, 0.14)",
          khaki: "#a5b4cb",
          olive: "#4d7c5f",
          green: "#22c55e",
          text: "#e2e8f0",
          textMuted: "#94a3b8",
          textDim: "#64748b",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Arial",
          "sans-serif",
        ],
        mono: [
          "Consolas",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Courier New",
          "monospace",
        ],
      },
      boxShadow: {
        "arma-red": "0 2px 10px rgba(239, 68, 68, 0.25)",
        "arma-amber": "0 2px 10px rgba(239, 68, 68, 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
