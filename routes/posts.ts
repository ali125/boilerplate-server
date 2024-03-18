import { Router } from "express";
import PostController from "../controllers/PostController";

const router = Router();

router.get("/", PostController.getAll);
router.post("/", PostController.add);

router.get("/getBySlug/:slug", PostController.getBySlug);
router.get("/:id/", PostController.getById);
router.patch("/:id", PostController.updateById);
router.delete("/:id", PostController.deleteById);


export default router;
