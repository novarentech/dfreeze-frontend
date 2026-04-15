import { z } from "zod";

const schema = z.object({
  PUBLIC_API_BACKEND_URL: z.string().url(),
});

const parsed = schema.safeParse({
  PUBLIC_API_BACKEND_URL: import.meta.env.PUBLIC_API_BACKEND_URL,
});

if (!parsed.success) {
  console.error("❌ Invalid CLIENT env:", parsed.error.format());
  throw new Error("Invalid client environment variables");
}

export const ENV_CLIENT = parsed.data;