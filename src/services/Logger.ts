import winston from "winston";

class Logger {
  private static instance: winston.Logger;

  public static getInstance(): winston.Logger {
    if (!Logger.instance) {
      Logger.instance = winston.createLogger({
        level: "info",
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`)
        ),
        transports: [new winston.transports.Console(), new winston.transports.File({ filename: "app.log" })],
      });
    }
    return Logger.instance;
  }
}

export default Logger;
