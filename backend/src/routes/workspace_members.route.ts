import express from "express"
import { GetAllWorkspaceMembers,CreateMember,UpdateMember,DeleteMember } from "../controllers/workspace_members.controller";
import { requireAction } from "../middlewares/requireAction.middleware";
import { validateToken } from "../middlewares/JWT.middleware";
import { attachPermissions } from "../middlewares/permission.middleware";


const Workspace_MembersRouter = express.Router();

Workspace_MembersRouter
    .route('/:workspace_id/members')
    .get(
        validateToken,
        attachPermissions,
        GetAllWorkspaceMembers
    )

Workspace_MembersRouter
   .route('/:workspace_id/members')
   .post(
    validateToken,
    attachPermissions,
    requireAction("member:invite"),
    CreateMember
   )

Workspace_MembersRouter
   .route("/:workspace_id/members/:member_id")
   .patch(
    validateToken,
    attachPermissions,
    requireAction("member:changeRole"),
    UpdateMember
   )

Workspace_MembersRouter
   .route("/:workspace_id/members/:member_id")
   .delete(
    validateToken,
    attachPermissions,
    requireAction("member:remove"),
    DeleteMember

   )

export default Workspace_MembersRouter;

