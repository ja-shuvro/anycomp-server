import helmet from "helmet";

/**
 * Security middleware using Helmet
 * Sets various HTTP headers for security
 */
export const securityMiddleware = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
            scriptSrc: [
                "'self'",
                "https://cdnjs.cloudflare.com",
                "https://vercel.live",
            ],
            imgSrc: ["'self'", "data:", "https:"],
            frameSrc: ["'self'", "https://vercel.live"],
        },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
});
