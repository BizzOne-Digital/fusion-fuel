interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

export interface RateLimitOptions {
  /** Maximum number of attempts within the window */
  limit: number;
  /** Window duration in milliseconds */
  windowMs: number;
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
}

function cleanupExpired(now: number): void {
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt <= now) {
      store.delete(key);
    }
  }
}

export function rateLimit(key: string, options: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  cleanupExpired(now);

  const existing = store.get(key);

  if (!existing || existing.resetAt <= now) {
    const resetAt = now + options.windowMs;
    store.set(key, { count: 1, resetAt });
    return { success: true, remaining: options.limit - 1, resetAt };
  }

  if (existing.count >= options.limit) {
    return { success: false, remaining: 0, resetAt: existing.resetAt };
  }

  existing.count += 1;
  store.set(key, existing);

  return {
    success: true,
    remaining: options.limit - existing.count,
    resetAt: existing.resetAt,
  };
}

export function buildRateLimitKey(prefix: string, identifier: string): string {
  return `${prefix}:${identifier}`;
}

export const LOGIN_RATE_LIMIT: RateLimitOptions = {
  limit: 5,
  windowMs: 15 * 60 * 1000,
};

export const PASSWORD_RESET_RATE_LIMIT: RateLimitOptions = {
  limit: 3,
  windowMs: 60 * 60 * 1000,
};
