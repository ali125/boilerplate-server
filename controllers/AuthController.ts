import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
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
        } catch (e: any) {
            res.status(500).json({ error: e.message });
        }
    };

    login = async (req: Request, res: Response) => {
        try {
            const cookies = req.cookies;
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ error: "Username and password are required!" })
            }

            // check for the user in the db
            const user = await userRepository.findOne({ where: { email }, select: ['id', 'password']});
            if (!user) {
                return res.sendStatus(401);
            }
            // evaluate password
            const match = await bcrypt.compare(password, user.password);
            
            if (!match) {
                return res.sendStatus(401);
            }

            const accessToken = jwt.sign(
                { userInfo: { email } },
                process.env.ACCESS_TOKEN_SECRET as string,
                { expiresIn: "120s" }
            )
            const newRefreshToken = jwt.sign(
                { email },
                process.env.REFRESH_TOKEN_SECRET as string,
                { expiresIn: "1d" }
            );

            if (cookies?.jwt) {
                /**
                 * Scenario added here
                 * 1) User logs in but never uses RT and does not logout
                 * 2) RT is stolen
                 * 3) If 1 & 2, reuse detection is needed to clear all RTs when user logs in
                 */
                const refreshToken = cookies.jwt;
                const foundToken = await refreshTokenRepository.findOneBy({ token: refreshToken });

                // Detected refresh token reuse!
                if (!foundToken) {
                    console.log("attempted refresh token reuse at login!");
                    // clear out ALL previous refresh tokens
                    res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', maxAge: 24 * 60 * 60 * 1000 });
                    await refreshTokenRepository.softRemove({ userId: user.id });
                } else {
                    await refreshTokenRepository.softRemove(foundToken);
                }
            }

            const refreshToken = new RefreshToken();
            refreshToken.ip = req.ip || "";
            refreshToken.userAgent = req.headers['user-agent'] || "";
            refreshToken.token = newRefreshToken;
            refreshToken.user = user;

            // Save the new refresh token with current user
            const result = await refreshTokenRepository.save(refreshToken);
            console.log(result);

            // "sameSite" => if the front-end is not in the same domain, this option should add as(sameSite: 'none')
            // "httpOnly" is not available to javascript
            // secure: true => Don't use this while testing on "Thunder client"
            res.cookie("jwt", newRefreshToken, { httpOnly: true, sameSite: 'none', maxAge: 24 * 60 * 60 * 60 * 1000});
            res.json({ accessToken });
        } catch (e: any) {
            res.status(500).json({ error: e.message });
        }
    };

    refreshTokenAccess = async (req: Request, res: Response) => {
        const cookies = req.cookies;

        if (!cookies.jwt) {
            return res.sendStatus(401);
        }
        const refreshToken = cookies.jwt;

        const foundToken = await refreshTokenRepository.findOne({ where: { token: refreshToken }, relations: ['user']});

        if (!foundToken) {
            jwt.verify(
                refreshToken,
                process.env.REFRESH_TOKEN_SECRET as string,
                async (err: any, decoded: any) => {
                    if (err) {
                        return res.sendStatus(403); // Forbidden
                    }
                    console.log("attempted refresh token reuse!");
                    const hackedUser = await userRepository.findOneBy({ email: decoded.email });
                    if (hackedUser) {
                        const result = await refreshTokenRepository.softRemove({ userId: hackedUser.id });
                        console.log(result);
                    }
                }
            );
            return res.sendStatus(403); // Forbidden
        }

        // evaluate jwt
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET as string,
            async (err: any, decoded: any) => {
                if (err) {
                    console.log("expired refresh token");
                    const result = await refreshTokenRepository.softRemove(foundToken);
                    console.log(result);
                }
                if (err || foundToken.user.email !== decoded.email) {
                    return res.sendStatus(403); // Forbidden
                }
                // Refresh token was still valid
                const user = await userRepository.findOneBy({ email: decoded.email });
                if (!user) return res.sendStatus(403);

                const accessToken = jwt.sign(
                    { userInfo: { email: user.email } },
                    process.env.ACCESS_TOKEN_SECRET as string,
                    { expiresIn: "120s" }
                );

                const newRefreshToken = jwt.sign(
                    { email: user.email },
                    process.env.REFRESH_TOKEN_SECRET as string,
                    { expiresIn: "1d" }
                );

                const refreshToken = new RefreshToken();
                refreshToken.ip = req.ip || "";
                refreshToken.userAgent = req.headers['user-agent'] || "";
                refreshToken.token = newRefreshToken;
                refreshToken.user = user;

                // Save the new refresh token with current user
                const result = await refreshTokenRepository.save(refreshToken);
                console.log(result);

                // Create Secure Cookie with refresh token
                res.cookie("jwt", newRefreshToken, { httpOnly: true, sameSite: 'none', maxAge: 24 * 60 * 60 * 60 * 1000});
                res.json({ accessToken });
            }
        );
    };

    logout = async (req: Request, res: Response) => {
        // On client, also delete the accessToken
        const cookies = req.cookies;
        if (!cookies.jwt) return res.sendStatus(204); // No content
        const refreshToken = cookies.jwt;

        const foundToken = await refreshTokenRepository.findOneBy({ token: refreshToken });
        if (!foundToken) {
            // "sameSite" => if the front-end is not in the same domain, this option should add as(sameSite: "none")
            // "httpOnly" => cookie is not available to javascript
            // scure: true => Don't use this while testing on "Thunder client"
            res.clearCookie("jwt", { httpOnly: true, sameSite: 'none', maxAge: 24 * 60 * 60 * 1000 });
            return res.sendStatus(403);
        }
        // Delete refreshToken in db
        const result = await refreshTokenRepository.softRemove(foundToken);
        console.log(result);

        // secure: true => Don't use this while testing on "Thunder client"
        res.clearCookie("jwt", { httpOnly: true, sameSite: 'none', maxAge: 24 * 60 * 60 * 1000 });
        return res.sendStatus(204);
    };
}

const authController = new AuthController();

export default authController;
