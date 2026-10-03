/**
 * In-memory sliding-window rate limiter. Best effort on serverless (limits are
 * per instance); the honeypot and fill-time checks provide the first layer.
 */

const WINDOW_MS = 10 * 60 * 1000;
const MAX = 5;
const hits = new Map<string, number[]>();

export function rateLimited(key: string): boolean {
  const now = Date.now();
  const list = (hits.get(key) || []).filter((t) => now - t < WINDOW_MS);
  if (list.length >= MAX) {
    hits.set(key, list);
    return true;
  }
  list.push(now);
  hits.set(key, list);
  // Bound the map so it cannot grow without limit.
  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      if (!v.length || now - v[v.length - 1] > WINDOW_MS) hits.delete(k);
    }
  }
  return false;
}
