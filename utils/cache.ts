import { any } from "prop-types";

const memoryCache = new Map<string, { value: any; expiresAt: number }>();

export function setCache(key: string, value: any, ttlSeconds = 300) {
  memoryCache.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1000 });
}

export function getCache(key: string) : any | null {
  const entry = memoryCache.get(key);
  if (!entry|| Date.now() > entry.expiresAt){
    memoryCache.delete(key);
    return null;
  }
  return entry.value;
}
