import { Router } from "express";
import userController from "../controllers/UserController";

const router = Router();

router.get("/", userController.getAll);
router.post("/", userController.add);

router.get("/:id", userController.getById);
router.patch("/:id", userController.updateById);
router.delete("/:id", userController.deleteById);


export default router;
