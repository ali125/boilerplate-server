import { Router, Response, Request } from "express";

const router = Router();

router.get("/", (req: Request, res: Response) => {
    res.status(200).json({ message: "hello world!" });
});

export default router;
