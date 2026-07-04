import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "rgb(var(--color-ink) / <alpha-value>)",
        soft: "rgb(var(--color-soft) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        blush: "rgb(var(--color-blush) / <alpha-value>)",
        rose: "rgb(var(--color-rose) / <alpha-value>)",
        line: "rgb(var(--color-line) / <alpha-value>)"
      },
      boxShadow: {
        pixel: "var(--shadow-pixel)",
        lift: "var(--shadow-lift)"
      },
      fontFamily: {
        best: ["var(--font-best)", "monospace"]
      }
    }
  },
  plugins: []
};

export default config;
