import winston from "winston";

const logger = winston.createLogger({
    level: 'debug',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize(),
        winston.format.printf(
            (info) => `${info.timestamp} ${info.level}: ${info.message}`,
        ),
    ),
    transports: [new winston.transports.Console()],
});

export default logger;

export const authFailureLogger = winston.createLogger({
    level: "debug",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(
            (info) => `${info.timestamp} ${info.level}: ${info.message}`,
        ),
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            filename: "auth_failures.log",
            dirname: "",
            maxFiles: 2,
            maxsize: 1024 * 1024,
        }),
    ],
});