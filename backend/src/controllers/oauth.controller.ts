import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { issueRefreshToken } from "../services/users.service";

const GoogleCallback = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user as any; 

        const accessToken = jwt.sign(
            { user_id: user.user_id, user_name: user.user_name , user_email: user.user_email },
            process.env.JWT_SECRET as string,
            { expiresIn: "2m" }
        );

        const refreshToken = await issueRefreshToken(user.user_id);

        res.cookie("access-Token", accessToken, { httpOnly: true, sameSite: "lax", maxAge: 10 * 60 * 1000 });
        res.cookie("refresh-Token", refreshToken, { httpOnly: true, sameSite: "lax", maxAge: 7 * 24 * 60 * 60 * 1000 });

        const redirect = req.query.state ? String(req.query.state) : "";
        res.redirect(process.env.FRONTEND_URL + (redirect || "/"));  

    } catch (error) {
        next(error);
    }
};

export { GoogleCallback };