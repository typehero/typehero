const idToRequestCount = new Map<string, number>(); // keeps track of individual users
const rateLimiter = {
  windowStart: Date.now(),
  windowSize: 60 * 60 * 1000,
  maxRequests: 30,
};
// Max 30 requests per hour per user by default

interface RateLimiterConfig {
  windowStart?: number;
  windowSize?: number;
  maxRequests?: number;
}

export const rateLimit = (ip: string, config = {} as RateLimiterConfig) => {
  const { windowStart, windowSize, maxRequests } = { ...rateLimiter, ...config };
  // Check and update current window
  const now = Date.now();
  const isNewWindow = now - windowStart > windowSize;
  if (isNewWindow) {
    config.windowStart = now;
    idToRequestCount.set(ip, 0);
  }

  // Check and update current request limits
  const currentRequestCount = idToRequestCount.get(ip) ?? 0;
  if (currentRequestCount >= maxRequests) return true;
  idToRequestCount.set(ip, currentRequestCount + 1);

  return false;
};
