import type { Config } from "tailwindcss";
const defaultTheme = require("tailwindcss/defaultTheme");

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        "4xs": "240px",
        "3xs": "320px",
        "2xs": "360px",
        xs: "480px",
        ...defaultTheme.screens,
      },
    },
  },
  plugins: [require("@tailwindcss/container-queries")],
};
export default config;
