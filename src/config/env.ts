import { z } from "zod";

const envSchema = z.object({
  PUBLIC_API_BACKEND_URL: z.string().url(),
  API_SECRET_KEY: z.string().min(1),
});

const rawEnv = {
  PUBLIC_API_BACKEND_URL:
    process.env.PUBLIC_API_BACKEND_URL ??
    import.meta.env.PUBLIC_API_BACKEND_URL,

  API_SECRET_KEY:
    process.env.API_SECRET_KEY ??
    import.meta.env.API_SECRET_KEY,
};

const parsed = envSchema.safeParse(rawEnv);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:", parsed.error.format());
  throw new Error("Environment validation failed");
}

function getMediaBaseUrl(apiUrl: string): string {
  try {
    const url = new URL(apiUrl);
    url.pathname = url.pathname.replace(/\/api\/?$/, "");
    return url.origin + url.pathname;
  } catch {
    return apiUrl;
  }
}

export const ENV = {
  API_BACKEND_URL: parsed.data.PUBLIC_API_BACKEND_URL,
  API_SECRET_KEY: parsed.data.API_SECRET_KEY,
  MEDIA_BASE_URL: getMediaBaseUrl(parsed.data.PUBLIC_API_BACKEND_URL),
} as const;