import { Request, Response, NextFunction } from "express";
import { Action } from "../domain/permissions";

const requireAction = (action: Action) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.allowedActions?.includes(action)) {
            return res.status(403).json({ error: "You do not have permission to perform this action" });
        }
        next();
    }
}

export { requireAction };