import { getConnInfo } from "@hono/node-server/conninfo";
import { rateLimiter } from "hono-rate-limiter";

export const authRateLimiter = rateLimiter({
  // 5 requests per minute
  limit: 5,
  windowMs: 60 * 1000,
  standardHeaders: "draft-7",
  keyGenerator: (c) => {
    const connInfo = getConnInfo(c);
    return connInfo.remote.address || "unknown";
  },
});

export const emailRateLimiter = rateLimiter({
  // 3 requests per 10 minutes
  limit: 3,
  windowMs: 10 * 60 * 1000,
  standardHeaders: "draft-7",
  keyGenerator: (c) => {
    const connInfo = getConnInfo(c);
    return connInfo.remote.address || "unknown";
  },
});

export const passwordResetLimiter = rateLimiter({
  // 3 requests per hour
  limit: 3,
  windowMs: 60 * 60 * 1000,
  standardHeaders: "draft-7",
  keyGenerator: (c) => {
    const connInfo = getConnInfo(c);
    return connInfo.remote.address || "unknown";
  },
});
