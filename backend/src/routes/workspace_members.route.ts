import express from "express"
import { GetAllWorkspaceMembers,GetWorkspaceMembersById,CreateMember,UpdateMember,DeleteMember } from "../controllers/workspace_members.controller";
import { CreateInviteController,AcceptInviteController, GetInviteDetailsController, DeclineInviteController } from "../controllers/workspace_invites.controller";
import { requireAction } from "../middlewares/requireAction.middleware";
import { validateToken } from "../middlewares/JWT.middleware";
import { attachPermissions } from "../middlewares/permission.middleware";


const Workspace_MembersRouter = express.Router();

Workspace_MembersRouter
    .route('/')
    .get(
        validateToken,
        GetAllWorkspaceMembers
    )

Workspace_MembersRouter
    .route('/workspace/:workspace_id/members')
    .get(
        validateToken,
        GetWorkspaceMembersById
    )

Workspace_MembersRouter
   .route('/workspace/:workspace_id/members')
   .post(
    validateToken,
    attachPermissions,
    requireAction("member:invite"),
    CreateMember
   )

Workspace_MembersRouter
   .route("/workspace/:workspace_id/member/:member_id")
   .patch(
    validateToken,
    attachPermissions,
    requireAction("member:changeRole"),
    UpdateMember
   )

Workspace_MembersRouter
   .route("/workspace/:workspace_id/member/:member_id")
   .delete(
    validateToken,
    attachPermissions,
    requireAction("member:remove"),
    DeleteMember

   )

Workspace_MembersRouter
   .route("/workspace/:workspace_id/invite")
   .post(
    validateToken,
    attachPermissions,
    requireAction("member:invite"),
    CreateInviteController

   )

Workspace_MembersRouter
   .route("/invites/:token")
   .get(GetInviteDetailsController)
   

Workspace_MembersRouter
   .route("/invites/:token/accept")
   .post(validateToken,AcceptInviteController)



Workspace_MembersRouter
   .route("/invites/:token/decline")
   .post(validateToken,DeclineInviteController)

export default Workspace_MembersRouter;

