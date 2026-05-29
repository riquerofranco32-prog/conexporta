const rateMap = new Map();
const WINDOW_MS = 60_000;
const LIMIT = 20;

export function checkRateLimit(req) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const now = Date.now();
  const hits = (rateMap.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (hits.length >= LIMIT) return false;
  rateMap.set(ip, [...hits, now]);
  return true;
}
