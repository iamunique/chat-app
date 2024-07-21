import express from 'express';
import GroupController from '../controllers/GroupController';
import { authenticate } from '../middleware/AuthMiddleware';
import { createGroupValidator, addMemberValidator } from '../validators/GroupValidators';
import { validate } from '../middleware/Validator';

const router = express.Router();
const groupController = new GroupController();

router.post('/', authenticate, createGroupValidator, validate, groupController.createGroup);
router.delete('/:id', authenticate, groupController.deleteGroup);
router.get('/', authenticate, groupController.searchGroups);
router.post('/add-member', authenticate, addMemberValidator, validate, groupController.addMember);
router.post('/send-message', authenticate, groupController.sendMessage);
router.post('/like-message/:id', authenticate, groupController.likeMessage);

export default router;
