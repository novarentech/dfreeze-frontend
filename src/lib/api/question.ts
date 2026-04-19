import { getCache, setCache } from "@/lib/cache";
import type { Question } from "@/types/question";
import type { QuestionSubmissionValues } from "@/types/question_submission";

const CACHE_TTL = 60 * 1000; // 1 min

export interface GetQuestionsOptions {
  query?: string;
  page?: number;
  pageSize?: number;
}

/**
 * Fetch questions from the internal API endpoint.
 * This is safe to call from the client side.
 */
export async function getQuestions(options: GetQuestionsOptions = {}): Promise<Question[]> {
  const { query, page, pageSize } = options;
  const cacheKey = `questions-${query || "all"}-${page || 1}-${pageSize || 25}`;

  const cached = getCache<Question[]>(cacheKey);
  if (cached) return cached;

  try {
    const params = new URLSearchParams();
    if (query) {
      params.append("query", query);
    }
    if (page) {
      params.append("page", page.toString());
    }
    if (pageSize) {
      params.append("pageSize", pageSize.toString());
    }

    const res = await fetch(`/api/questions?${params.toString()}`);

    if (!res.ok) {
      throw new Error(`Failed to fetch questions: ${res.statusText}`);
    }

    const json = await res.json();
    const data = json.data || [];

    setCache(cacheKey, data, CACHE_TTL);
    return data;
  } catch (error) {
    console.error("Fetch questions error:", error);
    if (cached) return cached;
    return [];
  }
}

/**
 * Submit a new question to the internal API endpoint
 */
export async function createQuestion(data: QuestionSubmissionValues) {
  const res = await fetch("/api/questions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data }),
  });

  const responseData = await res.json();

  if (!res.ok) {
    throw new Error(responseData.message || "Gagal mengirim pertanyaan");
  }

  return responseData;
}
