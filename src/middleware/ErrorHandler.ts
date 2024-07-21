import { Request, Response, NextFunction } from "express";
import Logger from "../services/Logger";

const logger = Logger.getInstance();

const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction): Response<any, Record<string, any>> | void => {
  const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
  const errorStack = err instanceof Error ? err.stack : "";
  logger.error(`Error occurred: ${errorMessage}\n${errorStack}`);

  return res.status(err.status || 500).send({
    error: "An unexpected error occurred.",
    details: err.message || "Internal Server Error",
  });
};

export default errorHandler;
