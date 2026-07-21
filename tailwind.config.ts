import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        "bg-elev": "var(--bg-elev)",
        glass: "var(--glass)",
        "glass-brd": "var(--glass-brd)",
        ink: "var(--text)",
        "ink-dim": "var(--text-dim)",
        "ink-faint": "var(--text-faint)",
        indig: "#6366F1",
        vio: "#A855F7",
        cyan: "#22D3EE",
        amber: "#FBBF24",
        rose: "#FB7185",
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      backgroundImage: {
        "grad-brand": "linear-gradient(120deg,#6366F1,#A855F7)",
      },
      borderRadius: { xl2: "16px" },
    },
  },
  plugins: [],
};
export default config;
