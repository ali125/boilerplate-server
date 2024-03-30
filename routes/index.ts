import { Router, Response, Request } from "express";
import PostRouters from "./posts";
import UserRouters from "./users";
import AuthRouters from "./auth";
import verifyJWT from "../middleware/verifyJWT";

const router = Router();

router.get("/", (req: Request, res: Response) => {
    res.status(200).json({ message: "hello world!" });
});

router.use("/auth", AuthRouters);
router.use("/posts", verifyJWT, PostRouters);
router.use("/users", verifyJWT, UserRouters);

export default router;
