import verifyEmail from "../services/verify_email.service";
import { Request,Response,NextFunction } from "express";


const VerifyEmailController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = String(req.params.token)
        const result = await verifyEmail(token);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export default VerifyEmailController