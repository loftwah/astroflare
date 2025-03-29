// Basic authentication utility
// Using hardcoded password for development and environment variable for production

// This is a fallback for development only
const BASIC_PASSWORD = "password123";

/**
 * Get the expected password securely from environment or fallback.
 */
function getExpectedPassword(locals?: any): string {
  // Try to get password from environment
  const passwordFromEnv = locals?.runtime?.env?.PASSWORD;
  
  // If environment password exists, use it
  if (passwordFromEnv) {
    return passwordFromEnv;
  }
  
  // Fallback to hardcoded password for development
  return BASIC_PASSWORD;
}

/**
 * Verify the authentication from request headers or query parameters
 */
export function verifyAuth(request: Request, locals?: any): boolean {
  const expectedPassword = getExpectedPassword(locals);
  
  // Check for auth in headers (for API calls)
  const authHeader = request.headers.get("Authorization");
  if (authHeader) {
    // Simple password-based auth
    const password = authHeader.replace("Bearer ", "");
    return password === expectedPassword;
  }
  
  // Check for auth in URL (for browser access)
  const url = new URL(request.url);
  const password = url.searchParams.get("auth");
  if (password === expectedPassword) {
    return true;
  }
  
  return false;
}

/**
 * Create an unauthorized response
 */
export function unauthorizedResponse(): Response {
  return new Response(JSON.stringify({
    success: false,
    error: "Unauthorized - Authentication required"
  }), {
    status: 401,
    headers: {
      "Content-Type": "application/json",
      "WWW-Authenticate": "Bearer"
    }
  });
}

/**
 * Create a redirect to login response
 */
export function redirectToLogin(error: boolean = false): Response {
  const location = error ? "/login?error=true" : "/login";
  return new Response(null, {
    status: 302,
    headers: {
      "Location": location
    }
  });
}