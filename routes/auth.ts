import { Router } from "express";
import authController from "../controllers/AuthController";

const router = Router();

router.post("/register", authController.register);

