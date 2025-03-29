/**
 * Debug API endpoint to check bindings
 */
export async function onRequest(context) {
  const { request, env } = context;
  
  // Get available bindings
  const bindings = {
    env: Object.keys(env),
    r2Storage: !!env.STORAGE,
    r2StorageType: env.STORAGE ? typeof env.STORAGE : 'undefined'
  };
  
  // Test R2 connection
  let r2Test = { success: false, error: null };
  
  if (env.STORAGE) {
    try {
      // Try to list objects in R2
      const testPath = 'images/astroflare.jpg';
      const file = await env.STORAGE.get(testPath);
      
      r2Test = {
        success: !!file,
        fileExists: !!file,
        filePath: testPath,
        fileSize: file ? file.size : null,
        httpMetadata: file ? file.httpMetadata : null,
        error: null
      };
    } catch (error) {
      r2Test = {
        success: false,
        error: error.message,
        stack: error.stack
      };
    }
  }
  
  // Return debug info
  return new Response(JSON.stringify({
    bindings,
    r2Test,
    url: request.url,
    method: request.method,
    headers: Object.fromEntries([...request.headers.entries()]),
    env: process.env.NODE_ENV || 'unknown'
  }, null, 2), {
    headers: { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
} 