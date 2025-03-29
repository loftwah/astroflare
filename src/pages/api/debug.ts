import type { APIContext } from 'astro';

// Define proper types for Cloudflare environment
interface Env {
  DB?: any;
  STORAGE?: any;
}

interface CloudflareRuntime {
  env: Env;
}

// Extend the Locals interface
declare namespace App {
  interface Locals {
    runtime: CloudflareRuntime;
  }
}

export async function GET({ locals }: APIContext) {
  const env = locals.runtime.env;
  
  // Collect environment information
  const debug = {
    timestamp: new Date().toISOString(),
    environment: {
      NODE_ENV: typeof process !== 'undefined' ? process.env.NODE_ENV : undefined,
      ASTRO_ENV: import.meta.env.MODE,
    },
    bindings: {
      DB: !!env.DB ? 'Connected' : 'Not connected',
      STORAGE: !!env.STORAGE ? 'Connected' : 'Not connected',
    },
    info: {
      astro: 'v5.5+',
      cloudflare: 'Pages + D1 + R2',
    }
  };

  return new Response(JSON.stringify(debug, null, 2), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
} 