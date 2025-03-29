import { defineConfig } from "astro/config";
import tailwindPlugin from "@tailwindcss/vite";

import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  vite: {
    plugins: [tailwindPlugin()],
  },

  // Enable SSR for Functions
  output: "server",

  adapter: cloudflare({
    // Important: Use advanced mode for proper Functions support
    mode: "advanced",
    
    // Let Pages manage the Functions directory structure
    runtime: {
      mode: "local",
      persistTo: "./functions"
    },
    
    // Platform proxy for local dev with R2
    platformProxy: {
      enabled: true,
    }
  })
});