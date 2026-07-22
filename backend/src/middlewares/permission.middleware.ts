import { Request,Response,NextFunction } from "express";
import { findMembership } from "../repositories/workspace_members";
import { permissions , Action} from "../domain/permissions";


const attachPermissions = async (req:Request, res:Response, next:NextFunction) => {

    const user_id = req.user?.user_id;
    const workspace_id = Number(req.params.workspace_id)

    if (!user_id) return res.status(401).json({ error: "Not authenticated" });
    if (isNaN(workspace_id)) return res.status(404).json({ error: "Not found" });

    const membership = await findMembership(user_id,workspace_id)

    if (!membership) return res.status(404).json({ error: "Not found" });

    const allowedActions : Action[] = permissions[membership?.role_id] ?? []

    req.membership = membership;
    req.allowedActions = allowedActions;

    next();


} 

export { attachPermissions }


    