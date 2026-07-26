import { rateLimit, getRateLimitKey } from '@/lib/rate-limit'

describe('rateLimit', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2026-01-01T00:00:00Z'))
  })
  afterEach(() => {
    jest.useRealTimers()
  })

  it('allows up to max requests within the window', () => {
    const key = getRateLimitKey('user-1', 'login')
    for (let i = 0; i < 5; i++) {
      expect(rateLimit(key).success).toBe(true)
    }
    const sixth = rateLimit(key)
    expect(sixth.success).toBe(false)
    expect(sixth.remaining).toBe(0)
  })

  it('resets after the window elapses', () => {
    const key = getRateLimitKey('user-2', 'login')
    for (let i = 0; i < 5; i++) rateLimit(key)
    expect(rateLimit(key).success).toBe(false)
    jest.advanceTimersByTime(15 * 60 * 1000 + 1)
    expect(rateLimit(key).success).toBe(true)
  })

  it('isolates keys per (identifier, action)', () => {
    expect(rateLimit(getRateLimitKey('a', 'login')).success).toBe(true)
    expect(rateLimit(getRateLimitKey('a', 'register')).success).toBe(true)
    expect(rateLimit(getRateLimitKey('b', 'login')).success).toBe(true)
  })

  it('returns resetAt in the future', () => {
    const r = rateLimit(getRateLimitKey('x', 'y'))
    expect(r.resetAt).toBeGreaterThan(Date.now())
  })
})
