import type { Config } from "tailwindcss";

/**
 * Colors come from CSS variables (src/app/tokens.css). Light and dark theme
 * (<html class="dark">) only swap the variables — pages need no `dark:` classes.
 * Each palette is split into two roles:
 *  - surface (bg, border, ring, divide, gradient, shadow): `--c-*` + alpha `--a-*`
 *    (shades 50–200 are translucent paint on glass);
 *  - text (text, placeholder, fill…): `--t-*` — lightens in dark mode.
 * `text-white` is always white (text on a colored button); `bg-white` is a surface (graphite in dark).
 */
const SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;
const TOKEN_PALETTES = ["slate", "brand", "accent", "emerald", "amber", "rose", "violet"] as const;

const surface = (name: string) =>
  Object.fromEntries(SHADES.map((s) => [s, `rgb(var(--c-${name}-${s}) / calc(<alpha-value> * var(--a-${name}-${s})))`]));
const text = (name: string) => Object.fromEntries(SHADES.map((s) => [s, `rgb(var(--t-${name}-${s}) / <alpha-value>)`]));

const surfaceColors = Object.fromEntries(TOKEN_PALETTES.map((p) => [p, surface(p)]));
const textColors = {
  ...Object.fromEntries(TOKEN_PALETTES.map((p) => [p, text(p)])),
  white: "#ffffff",
};

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ...surfaceColors,
        white: "rgb(var(--c-white) / calc(<alpha-value> * var(--a-white)))",
      },
      textColor: textColors,
      placeholderColor: textColors,
      textDecorationColor: textColors,
      caretColor: textColors,
      fill: textColors,
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        card: "var(--shadow-card)",
        lift: "var(--shadow-lift)",
        pop: "var(--shadow-pop)",
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.125rem",
        "3xl": "1.5rem",
      },
      transitionTimingFunction: {
        ios: "cubic-bezier(.32,.72,0,1)",
      },
    },
  },
  plugins: [],
};

export default config;
