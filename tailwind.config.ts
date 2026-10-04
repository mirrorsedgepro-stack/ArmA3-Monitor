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
          amber: "#d9822b",
          amberHover: "#ea8f34",
          amberDim: "rgba(217, 130, 43, 0.12)",
          khaki: "#9e8e6f",
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
        "arma-amber": "0 2px 10px rgba(217, 130, 43, 0.2)",
      },
    },
  },
  plugins: [],
};

export default config;
