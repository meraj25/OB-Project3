import { Request,Response,NextFunction } from "express";
import { createInvite, acceptInvite, getInviteDetails, declineInvite } from "../services/workspace_invites.service";

const CreateInviteController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const workspace_id = Number(req.params.workspace_id);
        const { user_email, role_id } = req.body;
        console.log(user_email,"email")
        const invite = await createInvite(workspace_id, user_email, role_id, req.user.user_id);
        res.status(201).json({ message: "Invite sent", invite_id: invite.invite_id });
    } catch (error) {
        next(error);
    }   
};

const AcceptInviteController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { token } = req.params;
        const validtoken = String(token)

        const member = await acceptInvite(validtoken, req.user.user_id, req.user.user_email);
        res.status(200).json(member);
    } catch (error) {
        next(error);
    }
};

const GetInviteDetailsController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {token} = req.params;
        const validtoken = String(token)
        const details = await getInviteDetails(validtoken);
        res.status(200).json(details);
    } catch (error) {
        next(error);
    }
};


const DeclineInviteController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {token} = req.params;
        const validtoken = String(token)
        await declineInvite(validtoken, req.user.user_email);
        res.status(200).json({ message: "Invite declined" });
    } catch (error) {
        next(error);
    }
};

export { CreateInviteController, AcceptInviteController , GetInviteDetailsController, DeclineInviteController};