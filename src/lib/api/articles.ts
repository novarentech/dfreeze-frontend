import { ENV_SERVER } from "@/config/env.server";
import { getCache, setCache } from "@/lib/cache";
import type { Article } from "@/types/article";

const CACHE_TTL = 60 * 1000; // 1 menit

export interface GetArticlesOptions {
  pageSize?: number;
  page?: number;
  sort?: string;
}

export interface StrapiPagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export interface StrapiMeta {
  pagination: StrapiPagination;
}

export interface PaginatedArticles {
  data: Article[];
  meta: StrapiMeta;
}

async function fetchArticlesFromAPI(options: GetArticlesOptions = {}): Promise<PaginatedArticles> {
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
  
  return {
    data: Array.isArray(json.data) ? json.data : [],
    meta: json.meta || { pagination: { page: 1, pageSize: 1, pageCount: 1, total: 0 } }
  };
}

/**
 * Get articles as a simple array for backward compatibility
 */
export async function getArticles(options: GetArticlesOptions = {}): Promise<Article[]> {
  const cacheKey = `articles-${JSON.stringify(options)}`;

  const cached = getCache<Article[]>(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetchArticlesFromAPI(options);
    setCache(cacheKey, response.data, CACHE_TTL);
    return response.data;
  } catch (err) {
    console.error(err);
    if (cached) return cached;

    return [];
  }
}

/**
 * Get articles with pagination metadata
 */
export async function getPaginatedArticles(options: GetArticlesOptions = {}): Promise<PaginatedArticles> {
  const cacheKey = `articles-paginated-${JSON.stringify(options)}`;

  const cached = getCache<PaginatedArticles>(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetchArticlesFromAPI(options);
    setCache(cacheKey, response, CACHE_TTL);
    return response;
  } catch (err) {
    console.error("Fetch paginated articles error:", err);
    if (cached) return cached;

    return {
      data: [],
      meta: { pagination: { page: 1, pageSize: 1, pageCount: 1, total: 0 } }
    };
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