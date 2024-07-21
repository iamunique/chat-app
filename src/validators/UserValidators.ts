import { body } from 'express-validator';

export const createUserValidator = [
  body('username').isString().withMessage('Username must be a string'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('role').isIn(['user', 'admin']).withMessage('Role must be either user or admin'),
];

export const updateUserValidator = [
  body('username').optional().isString().withMessage('Username must be a string'),
  body('role').optional().isIn(['user', 'admin']).withMessage('Role must be either user or admin'),
];
