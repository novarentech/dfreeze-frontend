import { ENV_SERVER } from "@/config/env.server";
import { getCache, setCache } from "@/lib/cache";
import type { Question } from "@/types/question";

const CACHE_TTL = 60 * 1000; // 1 min

export interface GetQuestionsOptions {
  query?: string;
}

/**
 * Fetch questions from the backend with optional filter
 * Example URL: questions?filters[question][$containsi]=query
 */
export async function getQuestions(options: GetQuestionsOptions = {}): Promise<Question[]> {
  const { query } = options;
  const cacheKey = `questions-${query || "all"}`;

  const cached = getCache<Question[]>(cacheKey);
  if (cached) return cached;

  try {
    const params = new URLSearchParams();
    
    // Add filter if query is provided
    if (query) {
      params.append("filters[question][$containsi]", query);
    }

    const res = await fetch(
      `${ENV_SERVER.API_BACKEND_URL}/questions?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${ENV_SERVER.API_SECRET_KEY}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch questions: ${res.statusText}`);
    }

    const json = await res.json();
    const data = json.data || [];

    setCache(cacheKey, data, CACHE_TTL);
    return data;
  } catch (error) {
    console.error("Fetch questions error:", error);
    
    // If request fails, try to return cached data even if potentially stale
    if (cached) return cached;
    
    return [];
  }
}
