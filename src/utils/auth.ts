// Basic authentication utility
const BASIC_PASSWORD = "password123";

/**
 * Verify the authentication from request headers or query parameters
 */
export function verifyAuth(request: Request): boolean {
  // Check for auth in headers (for API calls)
  const authHeader = request.headers.get("Authorization");
  if (authHeader) {
    // Simple password-based auth
    const password = authHeader.replace("Bearer ", "");
    return password === BASIC_PASSWORD;
  }
  
  // Check for auth in URL (for browser access)
  const url = new URL(request.url);
  const password = url.searchParams.get("auth");
  if (password === BASIC_PASSWORD) {
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
export function redirectToLogin(): Response {
  return new Response(null, {
    status: 302,
    headers: {
      "Location": "/login"
    }
  });
} 