import { Request, Response } from "express";
import { AppDataSource } from "../config/db";
import { User } from "../models/User";
import { RefreshToken } from "../models/RefreshToken";

const userRepository = AppDataSource.getRepository(User);
const refreshTokenRepository = AppDataSource.getRepository(RefreshToken);

class AuthController {
    register = async (req: Request, res: Response) => {
        try {
            const {
                firstName,
                lastName,
                password,
                email,
                mobile,
            } = req.body;

            if (!email || !password) {
                return res.status(400).json({ error: "Username and password are required!" })
            }
    
            const user = new User();
            user.firstName = firstName
            user.lastName = lastName
            user.password = password
            user.email = email
            if (mobile) user.mobile = mobile

            // check for duplicate email in the db
            const duplicate = await userRepository.findOneBy({ email });
            if (duplicate) {
                // 409 Conflict
                return res.status(409).json({ error: "This Email is already exists." })
            }

            const result = await AppDataSource.manager.save(user)
    
            res.status(201).json({ result });
            res.sendStatus(204);
        } catch (e: any) {
            res.status(500).json({ error: e.toString() });
        }
    };
}

const authController = new AuthController();

export default authController;
