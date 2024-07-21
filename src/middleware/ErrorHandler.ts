import { Request, Response, NextFunction } from "express";
import Logger from "../services/Logger";

const logger = Logger.getInstance();

const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction): Response<any, Record<string, any>> | void => {
  const statusCode = err.statusCode || 500;
  const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
  const errorStack = err instanceof Error ? err.stack : "";
  logger.error(`Error occurred: ${errorMessage}\n${errorStack}`);

  let responseMessage;
  switch (statusCode) {
    case 400:
      responseMessage = "Bad Request";
      break;
    case 401:
      responseMessage = "Unauthorized";
      break;
    case 403:
      responseMessage = "Forbidden";
      break;
    case 404:
      responseMessage = "Not Found";
      break;
    case 409:
      responseMessage = "Conflict";
      break;
    default:
      responseMessage = "Internal Server Error";
  }

  return res.status(statusCode).send({
    error: responseMessage,
    details: errorMessage,
  });
};

export default errorHandler;
