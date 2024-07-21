import express from "express";
import UserController from "../controllers/UserController";
import { authenticate, isAdmin } from "../middleware/AuthMiddleware";
import { createUserValidator, updateUserValidator } from "../validators/UserValidators";
import { validate } from "../middleware/Validator";

const router = express.Router();
const userController = new UserController();

router.post("/", authenticate, isAdmin, createUserValidator, validate, userController.createUser);
router.put("/:id", authenticate, isAdmin, updateUserValidator, validate, userController.editUser);
router.get("/", authenticate, isAdmin, userController.getUsers);

export default router;
