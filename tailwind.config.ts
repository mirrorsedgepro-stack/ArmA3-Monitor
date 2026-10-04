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
        arma: {
          bg: "#0c0e12",
          surface: "#12151b",
          card: "#161a22",
          cardHover: "#1c212c",
          border: "#232936",
          borderHover: "#353d4f",
          // Tactical Military Red Colorscheme
          red: "#e03131",
          redHover: "#f03e3e",
          redDim: "rgba(224, 49, 49, 0.16)",
          // Aliased to red for compatibility
          amber: "#e03131",
          amberHover: "#f03e3e",
          amberDim: "rgba(224, 49, 49, 0.16)",
          khaki: "#a89f91",
          olive: "#5f7353",
          green: "#46a758",
          text: "#e1e4e8",
          textMuted: "#8892a0",
          textDim: "#545d6e",
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
        "arma-red": "0 2px 14px rgba(224, 49, 49, 0.35)",
        "arma-amber": "0 2px 14px rgba(224, 49, 49, 0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
