import { ENV_SERVER } from "@/config/env.server";
import { getCache, setCache } from "@/lib/cache";
import type { Gallery, PaginatedGalleries } from "@/types/gallery";

const CACHE_TTL = 60 * 1000; // 1 min

export interface GetGalleriesOptions {
  pageSize?: number;
  page?: number;
}

/**
 * Fetch galleries from the backend
 */
export async function getGalleries(options: GetGalleriesOptions = {}): Promise<Gallery[]> {
  const { pageSize = 15, page = 1 } = options;
  const cacheKey = `galleries-${pageSize}-${page}`;

  const cached = getCache<Gallery[]>(cacheKey);
  if (cached) return cached;

  try {
    const params = new URLSearchParams();
    params.append("populate", "photo");
    params.append("pagination[pageSize]", pageSize.toString());
    params.append("pagination[page]", page.toString());
    params.append("filters[active][$eq]", "true");

    const res = await fetch(
      `${ENV_SERVER.API_BACKEND_URL}/galleries?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${ENV_SERVER.API_SECRET_KEY}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch galleries: ${res.statusText}`);
    }

    const json: PaginatedGalleries = await res.json();
    const data = json.data || [];

    setCache(cacheKey, data, CACHE_TTL);
    return data;
  } catch (error) {
    console.error("Fetch galleries error:", error);
    if (cached) return cached;
    return [];
  }
}
