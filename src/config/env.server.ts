import { z } from "zod";

const schema = z.object({
  API_BACKEND_URL: z.string().url(),
  API_SECRET_KEY: z.string().min(1),
});

const parsed = schema.safeParse({
  API_BACKEND_URL: process.env.API_BACKEND_URL,
  API_SECRET_KEY: process.env.API_SECRET_KEY,
});

if (!parsed.success) {
  console.error("❌ Invalid SERVER env:", parsed.error.format());
  throw new Error("Invalid server environment variables");
}

// helper aman
function getMediaBaseUrl(apiUrl: string) {
  try {
    const url = new URL(apiUrl);
    url.pathname = url.pathname.replace(/\/api\/?$/, "");
    return url.origin + url.pathname;
  } catch {
    return apiUrl;
  }
}

export const ENV_SERVER = {
  API_BACKEND_URL: parsed.data.API_BACKEND_URL,
  API_SECRET_KEY: parsed.data.API_SECRET_KEY,

  // derived
  MEDIA_BASE_URL: getMediaBaseUrl(parsed.data.API_BACKEND_URL),
} as const;