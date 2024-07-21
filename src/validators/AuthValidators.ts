import { body } from 'express-validator';

export const registerValidator = [
  body('username').isString().withMessage('Username must be a string'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  // body('role').isIn(['user', 'admin']).withMessage('Role must be either user or admin'),
];

export const loginValidator = [
  body('username').isString().withMessage('Username must be a string'),
  body('password').isString().withMessage('Password must be a string'),
];
