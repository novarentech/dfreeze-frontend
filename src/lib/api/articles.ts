import { ENV_SERVER } from "@/config/env.server";
import { getCache, setCache } from "@/lib/cache";
import type { Article } from "@/types/article";

const CACHE_TTL = 60 * 1000; // 1 menit

export interface GetArticlesOptions {
  pageSize?: number;
  page?: number;
  sort?: string;
}

async function fetchArticlesFromAPI(options: GetArticlesOptions = {}): Promise<Article[]> {
  const { pageSize, page, sort } = options;
  
  const params = new URLSearchParams();
  params.append("populate", "thumbnail");

  if (pageSize) params.append("pagination[pageSize]", pageSize.toString());
  if (page) params.append("pagination[page]", page.toString());
  if (sort) params.append("sort", sort);

  const res = await fetch(
    `${ENV_SERVER.API_BACKEND_URL}/articles?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${ENV_SERVER.API_SECRET_KEY}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed fetch articles");
  }

  const json = await res.json();
  return Array.isArray(json.data) ? json.data : [];
}

export async function getArticles(options: GetArticlesOptions = {}): Promise<Article[]> {
  const cacheKey = `articles-${JSON.stringify(options)}`;

  const cached = getCache<Article[]>(cacheKey);
  if (cached) return cached;

  try {
    const data = await fetchArticlesFromAPI(options);
    setCache(cacheKey, data, CACHE_TTL);
    return data;
  } catch (err) {
    console.error(err);
    if (cached) return cached;

    return [];
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const cacheKey = `article-${slug}`;

  const cached = getCache<Article>(cacheKey);

  try {
    const res = await fetch(
      `${ENV_SERVER.API_BACKEND_URL}/articles/${slug}?populate=thumbnail`,
      {
        headers: {
          Authorization: `Bearer ${ENV_SERVER.API_SECRET_KEY}`,
        },
      }
    );

    if (res.status === 404) {
      return null;
    }

    if (!res.ok) {
      throw new Error("Failed fetch article");
    }

    const json = await res.json();
    const data = json.data ?? null;

    if (data) {
      setCache(cacheKey, data, CACHE_TTL);
    }

    return data;
  } catch (error) {
    console.error("Fetch article error:", error);

    if (cached) {
      console.warn("⚠️ Using stale cache for:", slug);
      return cached;
    }

    return null;
  }
}