import { Router, Response, Request } from "express";
import PostRouters from "./posts";
import UserRouters from "./users";

const router = Router();

router.get("/", (req: Request, res: Response) => {
    res.status(200).json({ message: "hello world!" });
});

router.use("/posts", PostRouters);
router.use("/users", UserRouters);

export default router;
