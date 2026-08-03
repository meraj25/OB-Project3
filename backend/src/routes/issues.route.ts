import express from "express";
import { 
    GetAllIssues,
    GetIssueById,
    GetIssueByName,
    CreateIssueController,
    UpdateIssueController,
    DeleteIssueController,
    GetIssueSubtree,
    ExportIssuesCSV
} from "../controllers/issues.controller";
import { validateToken } from "../middlewares/JWT.middleware";
import { requireAction } from "../middlewares/requireAction.middleware";
import { attachPermissions } from "../middlewares/permission.middleware";

const IssueRouter = express.Router();

IssueRouter
    .route("/workspace/:workspace_id/project/:project_id/issues")
    .get(validateToken,attachPermissions,GetAllIssues)

IssueRouter
    .route("/workspace/:workspace_id/project/:project_id/issue/:issue_id")
    .get(validateToken,attachPermissions,GetIssueById)

IssueRouter
    .route("/workspace/:workspace_id/project/:project_id/issue/name/:issue_name")
    .get(validateToken,attachPermissions,GetIssueByName)

IssueRouter
    .route("/workspace/:workspace_id/project/:project_id/issue/create")
    .post(validateToken,attachPermissions,requireAction("issue:create"),CreateIssueController)

IssueRouter
    .route("/workspace/:workspace_id/project/:project_id/issue/:issue_id")
    .post(validateToken,attachPermissions,requireAction("issue:update"),UpdateIssueController)

IssueRouter
    .route("/workspace/:workspace_id/project/:project_id/issue/:issue_id")
    .delete(validateToken,attachPermissions,requireAction("issue:delete"),DeleteIssueController)
IssueRouter
    .route("/workspace/:workspace_id/project/:project_id/issue/:issue_id/subtree")
    .get(validateToken, attachPermissions, GetIssueSubtree);

IssueRouter
    .route("/workspace/:workspace_id/project/:project_id/issues/export")
    .get(validateToken,attachPermissions,ExportIssuesCSV)


export default IssueRouter;

