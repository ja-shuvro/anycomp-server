import helmet from "helmet";

/**
 * Security middleware using Helmet
 * Sets various HTTP headers for security
 */
export const securityMiddleware = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com", "https://cdn.jsdelivr.net"],
            scriptSrc: [
                "'self'",
                "'unsafe-inline'", // Swagger UI requires this for its initialization
                "https://cdnjs.cloudflare.com",
                "https://cdn.jsdelivr.net",
                "https://vercel.live",
            ],
            imgSrc: ["'self'", "data:", "https:", "https://cdn.jsdelivr.net"],
            frameSrc: ["'self'", "https://vercel.live"],
            connectSrc: ["'self'", "https://vercel.live", "wss://*.pusher.com", "https://cdn.jsdelivr.net"],
        },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
});
