import { defineMiddleware } from "astro:middleware";
import { ENV_SERVER } from "./config/env.server";

export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();

  // 1. Get backend origins for CSP
  const backendOrigin = new URL(ENV_SERVER.API_BACKEND_URL).origin;
  const mediaOrigin = new URL(ENV_SERVER.MEDIA_BASE_URL).origin;

  // 2. Define Security Headers
  const securityHeaders = {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "SAMEORIGIN",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=(self)",
  };

  // 3. Define Content Security Policy (CSP)
  // Note: 'unsafe-inline' is used for styles and scripts to ensure compatibility with 
  // Astro's zero-JS approach and various UI libraries (Framer Motion, Shadcn).
  const csp = [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com`,
    `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
    `img-src 'self' data: blob: https://*.basemaps.cartocdn.com ${mediaOrigin}`,
    `font-src 'self' data: https://fonts.gstatic.com`,
    `connect-src 'self' ${backendOrigin} https://www.google-analytics.com`,
    "frame-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; ");

  // 4. Apply headers (creating a new response to ensure headers are mutable)
  const newResponse = new Response(response.body, response);
  
  Object.entries(securityHeaders).forEach(([key, value]) => {
    newResponse.headers.set(key, value);
  });
  
  newResponse.headers.set("Content-Security-Policy", csp);

  return newResponse;
});
