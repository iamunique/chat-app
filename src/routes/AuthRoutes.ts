import express from "express";
import AuthController from "../controllers/AuthController";
import { registerValidator, loginValidator } from "../validators/AuthValidators";
import { validate } from "../middleware/Validator";

const router = express.Router();
const authController = new AuthController();

//Only For First ADMIN Creation
router.post("/register", registerValidator, validate, authController.register);

router.post("/login", loginValidator, validate, authController.login);
router.post("/logout", authController.logout);

export default router;
