import type { APIContext } from 'astro';

// Define the expected structure of Cloudflare environment bindings
interface CloudflareEnv {
  STORAGE: R2Bucket; // Use the R2Bucket type if available or 'any'
}

// Define the expected structure for Astro.locals when using Cloudflare adapter
interface CloudflareLocals {
  runtime?: {
    env: CloudflareEnv;
  };
}

export const prerender = false; // Ensure this route is dynamically rendered

export async function GET({ params, locals }: APIContext<CloudflareLocals>) {
  const path = params.path; // Astro gives us the path directly

  // Ensure we have a path and the R2 binding via Astro.locals
  // @ts-ignore - runtime might not be strictly typed depending on setup
  const storageBucket = locals?.runtime?.env?.STORAGE;

  if (!path || !storageBucket) {
    console.error('[Astro R2 Route] Invalid request: Missing path or STORAGE binding in locals.runtime.env');
    return new Response('Not Found or Server Error', { status: 404 });
  }

  console.log(`[Astro R2 Route] Attempting to get: ${path}`);

  try {
    // Get the file from R2 using the binding from Astro.locals
    const file = await storageBucket.get(path);

    if (!file) {
      console.log(`[Astro R2 Route] File not found in R2: ${path}`);
      return new Response(`File not found: ${path}`, { status: 404 });
    }

    console.log(`[Astro R2 Route] File found: ${path}, Size: ${file.size}`);

    // Determine Content-Type
    const contentType = file.httpMetadata?.contentType || getContentType(path);
    console.log(`[Astro R2 Route] Serving with Content-Type: ${contentType}`);

    // Prepare headers
    const headers = new Headers();
    headers.set('Content-Type', contentType);
    headers.set('Content-Length', file.size.toString());
    if (file.httpEtag) {
        headers.set('ETag', file.httpEtag);
    }
    headers.set('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year

    // Add custom metadata if present
    if (file.customMetadata) {
        Object.entries(file.customMetadata).forEach(([key, value]) => {
          headers.set(`X-Custom-${key}`, value as string);
        });
    }

    // Return the response with the file body and headers
    // IMPORTANT: R2 object body is a ReadableStream
    return new Response(file.body, {
      headers: headers,
    });

  } catch (error) {
    console.error(`[Astro R2 Route] Error fetching file from R2: ${path}`, error);
    return new Response(`Error fetching file: ${error instanceof Error ? error.message : String(error)}`, { status: 500 });
  }
}

// Simple content type detection
function getContentType(path: string): string {
    const ext = path.split('.').pop()?.toLowerCase() || '';
    const types: Record<string, string> = {
      'jpg': 'image/jpeg', 'jpeg': 'image/jpeg', 'png': 'image/png',
      'gif': 'image/gif', 'webp': 'image/webp', 'svg': 'image/svg+xml',
      'pdf': 'application/pdf', 'json': 'application/json', 'js': 'application/javascript',
      'css': 'text/css', 'html': 'text/html', 'txt': 'text/plain'
    };
    return types[ext] || 'application/octet-stream';
} 