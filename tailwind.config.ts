import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx,svelte,vue}"],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;