import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Initialize Upstash Redis client conditionally
const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

const redis = redisUrl && redisToken
    ? new Redis({ url: redisUrl, token: redisToken })
    : null;

const MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX_REQUEST || process.env.RATE_LIMIT_MAX_REQUESTS || '10', 10);
const WINDOW_SECONDS = parseInt(process.env.RATE_LIMIT_WINDOW_SECONDS || process.env.RATE_LIMIT_WINDOW_REQUEST || '60', 10);

const ratelimit = redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(MAX_REQUESTS, `${WINDOW_SECONDS}s`),
        prefix: 'rl:go', // Namespace for /go/ endpoint only
    })
    : null;

export interface RatelimitResult {
    allowed: boolean;
    remaining: number;
    resetAt: Date;
}

export async function checkRateLimit(ip: string): Promise<RatelimitResult> {
    if (!ratelimit) {
        // If Redis is not configured, allow request
        return {
            allowed: true,
            remaining: MAX_REQUESTS,
            resetAt: new Date(Date.now() + WINDOW_SECONDS * 1000),
        };
    }

    try {
        const { success, remaining, reset } = await ratelimit.limit(ip);
        return {
            allowed: success,
            remaining,
            resetAt: new Date(reset),
        };
    } catch (err) {
        console.error('[RateLimiter] Error checking rate limit:', err);
        // Fail open so users aren't blocked on rate limiter failure
        return {
            allowed: true,
            remaining: 1,
            resetAt: new Date(Date.now() + WINDOW_SECONDS * 1000),
        };
    }
}