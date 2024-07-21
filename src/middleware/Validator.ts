import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorDetails = errors
      .array()
      .map((err) => err.msg)
      .join(", ");
    return res.status(400).json({ error: "Invalid Payload", details: errorDetails });
  }
  next();
};
