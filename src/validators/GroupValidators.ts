import { body, param } from 'express-validator';

export const createGroupValidator = [
  body('name').isString().withMessage('Group name must be a string'),
];

export const addMemberValidator = [
  body('groupId').isMongoId().withMessage('Group ID must be a valid Mongo ID'),
  body('userId').isString().withMessage('User ID must be a string'),
];
