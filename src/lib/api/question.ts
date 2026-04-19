import { getCache, setCache } from "@/lib/cache";
import type { Question, QuestionsResponse } from "@/types/question";
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
export async function getQuestions(options: GetQuestionsOptions = {}): Promise<QuestionsResponse> {
  const { query, page, pageSize } = options;
  const cacheKey = `questions-${query || "all"}-${page || 1}-${pageSize || 25}`;

  const cached = getCache<QuestionsResponse>(cacheKey);
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

    const json: QuestionsResponse = await res.json();

    setCache(cacheKey, json, CACHE_TTL);
    return json;
  } catch (error) {
    console.error("Fetch questions error:", error);
    if (cached) return cached;
    
    // Return empty structure on error
    return {
      data: [],
      meta: {
        pagination: { page: 1, pageSize: 25, pageCount: 0, total: 0 }
      }
    };
  }
}

/**
 * Submit a new question to the internal API endpoint
 */
export async function createQuestion(data: QuestionSubmissionValues) {
// ...
// (rest of the file remains same, I'll use replace_file_content if I were only changing one part, but I'll write the whole file for safety)
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
