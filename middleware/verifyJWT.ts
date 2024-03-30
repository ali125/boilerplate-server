import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const verifyJWT = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = (req.headers.authorization || req.headers.Authorization) as string;
    if (!(authHeader || "").startsWith("Bearer ")) {
        return res.sendStatus(401);
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET as string,
        async (err: any, decoded: any) => {
            if (err) return res.sendStatus(403); // invalid token

            req.email = decoded.userInfo.email;
            next();
        }
    );
}

export default verifyJWT;