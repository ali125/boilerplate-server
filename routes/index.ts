import { Router, Response, Request } from "express";
import PostRouters from "./posts";
import UserRouters from "./users";
import AuthRouters from "./auth";

const router = Router();

router.get("/", (req: Request, res: Response) => {
    res.status(200).json({ message: "hello world!" });
});

router.use("/posts", PostRouters);
router.use("/users", UserRouters);
router.use("/auth", AuthRouters);

export default router;
