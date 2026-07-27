import express from "express";
import { 
    GetAllWorkspaces,
    GetWorkspaceById,
    CreateWorkspaceController,
    UpdateWorkspaceController,
    DeleteWorkspaceController 
} from "../controllers/workspaces.controller";
import { validateToken } from "../middlewares/JWT.middleware";
import { attachPermissions } from "../middlewares/permission.middleware";
import { requireAction } from "../middlewares/requireAction.middleware";

const WorkspaceRouter = express.Router();

WorkspaceRouter
    .route("/")
    .get(validateToken,attachPermissions,requireAction,GetAllWorkspaces)

WorkspaceRouter
    .route("/workspace/:workspace_id")
    .get(validateToken,attachPermissions,requireAction,GetWorkspaceById)

WorkspaceRouter
    .route("/create")
    .post(validateToken,CreateWorkspaceController)

WorkspaceRouter
    .route("/workspace/:workspace_id/update")
    .patch(validateToken,attachPermissions,requireAction("workspace:update"),UpdateWorkspaceController)
    
WorkspaceRouter
    .route("/workspace/:workspace_id/delete")
    .delete(validateToken,attachPermissions,requireAction("workspace:delete"),UpdateWorkspaceController)

export default WorkspaceRouter;