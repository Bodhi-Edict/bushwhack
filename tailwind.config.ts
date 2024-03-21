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
        "accent-1-500": "#ef476f",
        "accent-2-500": "#ffd166",
        "accent-3-500": "#06d6a0",
        "accent-4-500": "#118ab2",
        "accent-5-500": "#073b4c",
      }
    },
  },
  plugins: [],
} satisfies Config;
