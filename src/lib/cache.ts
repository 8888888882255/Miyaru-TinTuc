const cache = new Map<string, { data: any; exp: number }>();

export function cacheGet(key: string) {
  const v = cache.get(key);
  if (!v || Date.now() > v.exp) return null;
  return v.data;
}

export function cacheSet(key: string, data: any, ttl = 60) {
  cache.set(key, { data, exp: Date.now() + ttl * 1000 });
}
