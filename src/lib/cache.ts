type CacheItem<T> = {
  data: T;
  expiry: number;
};

const cache = new Map<string, CacheItem<any>>();

export function getCache<T>(key: string): T | null {
  const item = cache.get(key);

  if (!item) return null;

  if (Date.now() > item.expiry) {
    cache.delete(key);
    return null;
  }

  return item.data;
}

export function setCache<T>(key: string, data: T, ttl: number) {
  cache.set(key, {
    data,
    expiry: Date.now() + ttl,
  });
}