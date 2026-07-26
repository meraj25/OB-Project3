import express from "express";
import { 
    GetAllIssues,
    GetIssueById,
    GetIssueByName,
    CreateIssueController,
    UpdateIssueController,
    DeleteIssueController
} from "../controllers/issues.controller";
import { validateToken } from "../middlewares/JWT.middleware";
import { requireAction } from "../middlewares/requireAction.middleware";
import { attachPermissions } from "../middlewares/permission.middleware";
const IssueRouter = express.Router();

IssueRouter
    .route("/workspaces/:workspace_id/projects/:project_id/issues")
    .get(validateToken,attachPermissions,requireAction,GetAllIssues)

IssueRouter
    .route("/workspaces/:workspace_id/projects/:project_id/issues/:issue_id")
    .get(validateToken,attachPermissions,requireAction,GetIssueById)

IssueRouter
    .route("/workspaces/:workspace_id/projects/:project_id/issues/name/:issue_name")
    .get(validateToken,attachPermissions,requireAction,GetIssueByName)

IssueRouter
    .route("/workspaces/:workspace_id/projects/:project_id/issues")
    .post(validateToken,attachPermissions,requireAction("issue:create"),CreateIssueController)

IssueRouter
    .route("/workspaces/:workspace_id/projects/:project_id/issues/:issue_id")
    .post(validateToken,attachPermissions,requireAction("issue:update"),UpdateIssueController)

IssueRouter
    .route("/workspaces/:workspace_id/projects/:project_id/issues/:issue_id")
    .post(validateToken,attachPermissions,requireAction("issue:delete"),DeleteIssueController)


export default IssueRouter;