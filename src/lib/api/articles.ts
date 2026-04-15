import { ENV_SERVER } from "../../config/env.server";
import { getCache, setCache } from "../cache";

const CACHE_TTL = 60 * 1000; // 1 menit

async function fetchArticlesFromAPI() {
  const res = await fetch(
    `${ENV_SERVER.API_BACKEND_URL}/articles?populate=thumbnail`,
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

export async function getArticles() {
  const cacheKey = "articles";

  const cached = getCache<any[]>(cacheKey);
  if (cached) return cached;

  try {
    const data = await fetchArticlesFromAPI();
    setCache(cacheKey, data, CACHE_TTL);
    return data;
  } catch (err) {
    console.error(err);
    if (cached) return cached;

    return [];
  }
}

export async function getArticleBySlug(slug: string) {
  const cacheKey = `article-${slug}`;

  // ambil cache dulu (kalau ada)
  const cached = getCache<any>(cacheKey);

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