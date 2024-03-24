import { Router } from "express";
import authController from "../controllers/AuthController";

const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refreshTokenAccess", authController.refreshTokenAccess);
router.post("/logout", authController.logout);

export default router;