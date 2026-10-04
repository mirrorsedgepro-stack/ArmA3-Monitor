import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        tactical: {
          950: "#070a0e",
          900: "#0b1017",
          850: "#101721",
          800: "#16202c",
          700: "#223144",
          600: "#324660",
          500: "#496385",
        },
        hud: {
          green: "#10b981",
          emerald: "#059669",
          amber: "#f59e0b",
          cyan: "#06b6d4",
          blue: "#3b82f6",
          red: "#ef4444",
        },
      },
      fontFamily: {
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "Liberation Mono",
          "Courier New",
          "monospace",
        ],
      },
      boxShadow: {
        "tactical-glow": "0 0 25px -5px rgba(16, 185, 129, 0.25)",
        "amber-glow": "0 0 25px -5px rgba(245, 158, 11, 0.25)",
        "cyan-glow": "0 0 25px -5px rgba(6, 182, 212, 0.25)",
      },
      animation: {
        "pulse-subtle": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "scanline": "scanline 8s linear infinite",
      },
      keyframes: {
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(1000%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
