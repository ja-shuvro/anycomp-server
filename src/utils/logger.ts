import winston from "winston";
import path from "path";

// Define log levels
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};

// Define log colors
const colors = {
    error: "red",
    warn: "yellow",
    info: "green",
    http: "magenta",
    debug: "white",
};

// Tell winston to use these colors
winston.addColors(colors);

// Determine log level based on environment
const level = () => {
    const env = process.env.NODE_ENV || "development";
    const isDevelopment = env === "development";
    return isDevelopment ? "debug" : "warn";
};

// Define log format
const format = winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
    winston.format.colorize({ all: true }),
    winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
);

// Define log transports
const transports: winston.transport[] = [
    // Console transport (Always enabled)
    new winston.transports.Console(),
];

// Only add file transports if NOT running on Vercel
// Vercel file system is read-only, so writing logs to file will prevent startup
if (!process.env.VERCEL) {
    transports.push(
        // All logs file transport
        new winston.transports.File({
            filename: path.join(process.env.LOG_FILE_PATH || "./logs", "all.log"),
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        })
    );
    transports.push(
        // Error logs file transport
        new winston.transports.File({
            filename: path.join(process.env.LOG_FILE_PATH || "./logs", "error.log"),
            level: "error",
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        })
    );
}

// Create the logger
const logger = winston.createLogger({
    level: level(),
    levels,
    format,
    transports,
});

export default logger;
