import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#171215",
        soft: "#fff7fb",
        blush: "#ffd9e9",
        rose: "#ff8fba",
        line: "#2a2025"
      },
      boxShadow: {
        pixel: "6px 6px 0 #ffd9e9",
        lift: "8px 8px 0 #ffd0e5"
      },
      fontFamily: {
        best: ["var(--font-best)", "monospace"]
      }
    }
  },
  plugins: []
};

export default config;
