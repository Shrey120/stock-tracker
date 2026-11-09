import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)", panel: "var(--panel)", line: "var(--line)", ink: "var(--ink)", muted: "var(--muted)",
        accent: "var(--accent)", good: "var(--good)", warn: "var(--warn)", bad: "var(--bad)",
        goodbg: "var(--good-bg)", warnbg: "var(--warn-bg)", badbg: "var(--bad-bg)", accentbg: "var(--accent-bg)",
      },
      fontFamily: { sans: ["var(--font-sans)", "system-ui", "sans-serif"], mono: ["var(--font-mono)", "ui-monospace", "monospace"] },
    },
  },
  plugins: [],
};
export default config;
