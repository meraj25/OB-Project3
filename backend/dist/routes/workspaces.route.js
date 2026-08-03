"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const workspaces_controller_1 = require("../controllers/workspaces.controller");
const JWT_middleware_1 = require("../middlewares/JWT.middleware");
const permission_middleware_1 = require("../middlewares/permission.middleware");
const requireAction_middleware_1 = require("../middlewares/requireAction.middleware");
const WorkspaceRouter = express_1.default.Router();
WorkspaceRouter
    .route("/")
    .get(JWT_middleware_1.validateToken, permission_middleware_1.attachPermissions, requireAction_middleware_1.requireAction, workspaces_controller_1.GetAllWorkspaces);
WorkspaceRouter
    .route("/workspace/:workspace_id")
    .get(JWT_middleware_1.validateToken, permission_middleware_1.attachPermissions, requireAction_middleware_1.requireAction, workspaces_controller_1.GetWorkspaceById);
WorkspaceRouter
    .route("/create")
    .post(JWT_middleware_1.validateToken, workspaces_controller_1.CreateWorkspaceController);
WorkspaceRouter
    .route("/workspace/:workspace_id/update")
    .patch(JWT_middleware_1.validateToken, permission_middleware_1.attachPermissions, (0, requireAction_middleware_1.requireAction)("workspace:update"), workspaces_controller_1.UpdateWorkspaceController);
WorkspaceRouter
    .route("/workspace/:workspace_id/delete")
    .delete(JWT_middleware_1.validateToken, permission_middleware_1.attachPermissions, (0, requireAction_middleware_1.requireAction)("workspace:delete"), workspaces_controller_1.UpdateWorkspaceController);
exports.default = WorkspaceRouter;
