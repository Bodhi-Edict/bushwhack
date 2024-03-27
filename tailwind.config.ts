import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      colors: {
        "accent-1-200": "#f47e9a",
        "accent-1-300": "#f26c8c",
        "accent-1-400": "#f1597d",
        "accent-1-500": "#ef476f",
        "accent-1-600": "#d74064",
        "accent-1-700": "#bf3959",
        "accent-1-800": "#a7324e",

        "accent-2-200": "#ffdf94",
        "accent-2-300": "#ffda85",
        "accent-2-400": "#ffd675",
        "accent-2-500": "#ffd166",
        "accent-2-600": "#e6bc5c",
        "accent-2-700": "#cca752",
        "accent-2-800": "#b39247",

        "accent-3-500": "#06d6a0",
        "accent-4-500": "#118ab2",
        "accent-5-500": "#073b4c",
      }
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
} satisfies Config;
