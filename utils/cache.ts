// utils/cache.ts

const globalForCache = globalThis as unknown as { __memoryCache?: Map<string, { value: any; expiresAt: number }> };

const memoryCache =
  globalForCache.__memoryCache ?? (globalForCache.__memoryCache = new Map());

type CacheEntry = {
  value: any;
  expiresAt: number;
};

export function setCache(key: string, value: any, ttlSeconds: number = 300) {
  const expiresAt = Date.now() + ttlSeconds * 1000;
  memoryCache.set(key, { value, expiresAt });
}

export function getCache(key: string): any | null {
  const entry = memoryCache.get(key);
  if (!entry || Date.now() > entry.expiresAt) {
    memoryCache.delete(key);
    return null;
  }
  return entry.value;
}
