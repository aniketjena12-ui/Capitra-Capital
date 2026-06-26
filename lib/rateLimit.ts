/**
 * lib/rateLimit.ts
 * Lightweight in-memory sliding-window rate limiter for Next.js API routes.
 *
 * Works per serverless function instance on Vercel. For a multi-instance
 * production setup, replace the store with a Redis-backed solution (e.g. Upstash).
 *
 * Usage:
 *   const result = rateLimit(ip, { limit: 5, windowSeconds: 60 });
 *   if (!result.success) return NextResponse.json({ error: "Too many requests." }, { status: 429 });
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// In-memory store: key → { count, resetAt }
const store = new Map<string, RateLimitEntry>();

// Clean up expired entries every 5 minutes to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt < now) {
      store.delete(key);
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitOptions {
  /** Maximum number of requests allowed in the window */
  limit: number;
  /** Window size in seconds */
  windowSeconds: number;
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
}

/**
 * Check and increment rate limit for a given key (typically IP + route).
 */
export function rateLimit(
  key: string,
  options: RateLimitOptions
): RateLimitResult {
  const now = Date.now();
  const windowMs = options.windowSeconds * 1000;

  const entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    // First request in this window (or window has expired)
    const newEntry: RateLimitEntry = {
      count: 1,
      resetAt: now + windowMs,
    };
    store.set(key, newEntry);
    return {
      success: true,
      remaining: options.limit - 1,
      resetAt: newEntry.resetAt,
    };
  }

  if (entry.count >= options.limit) {
    return {
      success: false,
      remaining: 0,
      resetAt: entry.resetAt,
    };
  }

  entry.count += 1;
  return {
    success: true,
    remaining: options.limit - entry.count,
    resetAt: entry.resetAt,
  };
}

/**
 * Helper: extract a best-effort IP address from a NextRequest.
 * Falls back to "unknown" if no IP header is found.
 */
export function getIp(request: { headers: { get: (key: string) => string | null } }): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}
