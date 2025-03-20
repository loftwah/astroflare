import type { APIContext } from 'astro';

// Define the extended Locals type with runtime
interface CloudflareLocals {
  runtime: {
    env: {
      DB: any; // D1 database
    };
  };
}

export async function GET({ locals }: APIContext & { locals: CloudflareLocals }) {
  try {
    // Using SELECT 1 instead of sqlite_version() which is restricted in D1
    const stmt = await locals.runtime.env.DB.prepare("SELECT 1 as test").run();
    
    return new Response(JSON.stringify({
      message: "D1 database connection successful",
      data: stmt.results,
      time: new Date().toISOString()
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error('Database error:', error);
    return new Response(JSON.stringify({ 
      error: 'Database error', 
      message: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
} 