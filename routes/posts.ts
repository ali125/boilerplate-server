import { Router } from "express";
import postController from "../controllers/PostController";

const router = Router();

router.get("/", postController.getAll);
router.post("/", postController.add);

router.get("/getBySlug/:slug", postController.getBySlug);
router.get("/:id/", postController.getById);
router.patch("/:id", postController.updateById);
router.delete("/:id", postController.deleteById);


export default router;
