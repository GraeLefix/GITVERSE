interface RateLimiterOptions {
  windowMs: number;
  max: number;
}

export class RateLimiter {
  private store = new Map<string, { count: number; resetAt: number }>();
  private windowMs: number;
  private max: number;

  constructor({ windowMs, max }: RateLimiterOptions) {
    this.windowMs = windowMs;
    this.max = max;
  }

  check(key: string): boolean {
    const now = Date.now();
    const entry = this.store.get(key);
    if (!entry || now > entry.resetAt) {
      this.store.set(key, { count: 1, resetAt: now + this.windowMs });
      return true;
    }
    if (entry.count >= this.max) return false;
    entry.count++;
    return true;
  }
}
