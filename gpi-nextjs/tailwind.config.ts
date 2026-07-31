import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0f1b33",
        ink2: "#16274a",
        paper: "#fbf8f2",
        paper2: "#f2ede1",
        stamp: "#c08a2e",
        stamp2: "#e0ac4c",
        route: "#2e6e62",
        route2: "#3f8c7d",
        ruby: "#9b3b3b",
        slate: "#4a5568",
        slateLight: "#8993a4",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      borderRadius: {
        gpi: "14px",
      },
      boxShadow: {
        gpi: "0 12px 30px -14px rgba(15,27,51,0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
