import rateLimit from "express-rate-limit";

/**
 * General API rate limiter
 * Limits each IP to a specified number of requests per window
 */
export const apiLimiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10), // 15 minutes default
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100", 10), // 100 requests per window
    message: {
        success: false,
        error: {
            code: "RATE_LIMIT_EXCEEDED",
            message: "Too many requests from this IP, please try again later.",
            statusCode: 429,
            timestamp: new Date().toISOString(),
        },
    },
    standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
    legacyHeaders: false, // Disable `X-RateLimit-*` headers
    handler: (req, res) => {
        res.status(429).json({
            success: false,
            error: {
                code: "RATE_LIMIT_EXCEEDED",
                message: "Too many requests from this IP, please try again later.",
                statusCode: 429,
                timestamp: new Date().toISOString(),
                path: req.originalUrl,
            },
        });
    },
});

/**
 * Strict rate limiter for sensitive endpoints (e.g., auth, uploads)
 */
export const strictLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 requests per window
    message: {
        success: false,
        error: {
            code: "RATE_LIMIT_EXCEEDED",
            message: "Too many attempts, please try again later.",
            statusCode: 429,
            timestamp: new Date().toISOString(),
        },
    },
    standardHeaders: true,
    legacyHeaders: false,
});
