"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const issues_controller_1 = require("../controllers/issues.controller");
const JWT_middleware_1 = require("../middlewares/JWT.middleware");
const requireAction_middleware_1 = require("../middlewares/requireAction.middleware");
const permission_middleware_1 = require("../middlewares/permission.middleware");
const IssueRouter = express_1.default.Router();
IssueRouter
    .route("/workspace/:workspace_id/project/:project_id/issues")
    .get(JWT_middleware_1.validateToken, permission_middleware_1.attachPermissions, issues_controller_1.GetAllIssues);
IssueRouter
    .route("/workspace/:workspace_id/project/:project_id/issue/:issue_id")
    .get(JWT_middleware_1.validateToken, permission_middleware_1.attachPermissions, issues_controller_1.GetIssueById);
IssueRouter
    .route("/workspace/:workspace_id/project/:project_id/issue/name/:issue_name")
    .get(JWT_middleware_1.validateToken, permission_middleware_1.attachPermissions, issues_controller_1.GetIssueByName);
IssueRouter
    .route("/workspace/:workspace_id/project/:project_id/issue/create")
    .post(JWT_middleware_1.validateToken, permission_middleware_1.attachPermissions, (0, requireAction_middleware_1.requireAction)("issue:create"), issues_controller_1.CreateIssueController);
IssueRouter
    .route("/workspace/:workspace_id/project/:project_id/issue/:issue_id")
    .patch(JWT_middleware_1.validateToken, permission_middleware_1.attachPermissions, (0, requireAction_middleware_1.requireAction)("issue:update"), issues_controller_1.UpdateIssueController);
IssueRouter
    .route("/workspace/:workspace_id/project/:project_id/issue/:issue_id")
    .delete(JWT_middleware_1.validateToken, permission_middleware_1.attachPermissions, (0, requireAction_middleware_1.requireAction)("issue:delete"), issues_controller_1.DeleteIssueController);
IssueRouter
    .route("/workspace/:workspace_id/project/:project_id/issue/:issue_id/subtree")
    .get(JWT_middleware_1.validateToken, permission_middleware_1.attachPermissions, issues_controller_1.GetIssueSubtree);
IssueRouter
    .route("/workspace/:workspace_id/project/:project_id/issues/export")
    .get(JWT_middleware_1.validateToken, permission_middleware_1.attachPermissions, issues_controller_1.ExportIssuesCSV);
exports.default = IssueRouter;
