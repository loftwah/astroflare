import { defineConfig } from "astro/config";
import tailwindPlugin from "@tailwindcss/vite";

import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  vite: {
    plugins: [tailwindPlugin()],
  },

  // Enable SSR for Functions
  output: "server",

  adapter: cloudflare()
});