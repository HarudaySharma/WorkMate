import pino from "pino";

const logger = pino({
    transport: {
        target: "pino-pretty",
        options: {
            colorize: true,
            translateTime: "HH:MM:ss Z",
            ignore: "pid,",
        },
    }
})

export default logger;
