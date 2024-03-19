import { Response, Request } from "express";
import { User } from "../models/User";
import { AppDataSource } from "../config/db";

const userRepository = AppDataSource.getRepository(User);

class UserController {
    getAll = async (req: Request, res: Response) => {
        try {
            const users = await userRepository.find();
            res.status(200).json({ users });
        } catch (e: any) {
            res.status(500).json({ error: e.toString() })
        }
    }
    
    add = async (req: Request, res: Response) => {
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
        } catch (e: any) {
            if (e?.code === "23505") {
                // 409 Conflict
                return res.status(409).json({ error: "This Email is already exists." })
            }
            res.status(500).json({ error: e.toString() })
        }
    }
    
    getById = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const user = await userRepository.findOneBy({ id });
            if (!user) {
                return res.status(400).json({ error: 400, message: "data not found" });
            }
            res.status(200).json({ user });
        } catch (e: any) {
            res.status(500).json({ error: e.toString() });
        }
    };

    updateById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const {
                firstName,
                lastName,
                password,
                email,
                mobile,
            } = req.body;
    
            const user = await userRepository.findOneBy({ id });
            if (!user) {
                return res.status(404).json({ error: 'Not Found', message: 'User not found' });
            }
    
            if (firstName) user.firstName = firstName;
            if (lastName) user.lastName = lastName;
            if (password) user.password = password;
            if (email) user.email = email;
            if (mobile) user.mobile = mobile
    
            await userRepository.save(user);
            res.status(200).json({ user });
        } catch (e: any) {
            if (e?.code === "23505") {
                // 409 Conflict
                return res.status(409).json({ error: "This Email is already exists." })
            }
            res.status(500).json({ error: e.toString() });
        }
    };

    deleteById = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const user = await userRepository.findOneBy({ id });
            if (!user) {
                return res.status(400).json({ error: 400, message: "data not found" });
            }
            await userRepository.softRemove(user);
            res.sendStatus(204);
        } catch (e: any) {
            res.status(500).json({ error: e.toString() });
        }
    };
}

const userController = new UserController();

export default userController;
