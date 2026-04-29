interface RateLimitEntry {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

const DEFAULT_WINDOW_MS = 15 * 60 * 1000 // 15 minutes
const DEFAULT_MAX = 5

export function rateLimit(
  key: string,
  options: { windowMs?: number; max?: number } = {},
): { success: boolean; remaining: number; resetAt: number } {
  const { windowMs = DEFAULT_WINDOW_MS, max = DEFAULT_MAX } = options
  const now = Date.now()

  const entry = store.get(key)

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return { success: true, remaining: max - 1, resetAt: now + windowMs }
  }

  if (entry.count >= max) {
    return { success: false, remaining: 0, resetAt: entry.resetAt }
  }

  entry.count++
  return { success: true, remaining: max - entry.count, resetAt: entry.resetAt }
}

export function getRateLimitKey(identifier: string, action: string): string {
  return `ratelimit:${action}:${identifier}`
}
