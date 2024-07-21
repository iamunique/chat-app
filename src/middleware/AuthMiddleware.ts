import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Logger from '../services/Logger';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  const logger = Logger.getInstance();
  if (!token) {
    logger.error('Access denied. No token provided.');
    return res.status(401).send({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    (req as any).user = decoded;
    next();
  } catch (ex) {
    logger.error('Invalid token.');
    res.status(400).send({ error: 'Invalid token.' });
  }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if ((req as any).user.role !== 'admin') {
    Logger.getInstance().error('Access denied. Not an admin.');
    return res.status(403).send({ error: 'Access denied. Not an admin.' });
  }
  next();
};
