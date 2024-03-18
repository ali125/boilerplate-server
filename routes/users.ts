import { Router } from "express";
import UserController from "../controllers/UserController";

const router = Router();

router.get("/", UserController.getAll);
router.post("/", UserController.add);

router.get("/:id", UserController.getById);
router.patch("/:id", UserController.updateById);
router.delete("/:id", UserController.deleteById);


export default router;
