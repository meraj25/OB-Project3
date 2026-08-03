"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const projects_controller_1 = require("../controllers/projects.controller");
const requireAction_middleware_1 = require("../middlewares/requireAction.middleware");
const JWT_middleware_1 = require("../middlewares/JWT.middleware");
const permission_middleware_1 = require("../middlewares/permission.middleware");
const ProjectRouter = express_1.default.Router();
ProjectRouter
    .route("/workspace/:workspace_id")
    .get(JWT_middleware_1.validateToken, permission_middleware_1.attachPermissions, projects_controller_1.GetAllProjects);
ProjectRouter
    .route("/workspace/:workspace_id/project/:project_id")
    .get(JWT_middleware_1.validateToken, permission_middleware_1.attachPermissions, projects_controller_1.GetProjectById);
ProjectRouter
    .route("/workspace/:workspace_id/project/create")
    .post(JWT_middleware_1.validateToken, permission_middleware_1.attachPermissions, (0, requireAction_middleware_1.requireAction)("project:create"), projects_controller_1.CreateProjectController);
ProjectRouter
    .route("/workspace/:workspace_id/project/:project_id/update")
    .patch(JWT_middleware_1.validateToken, permission_middleware_1.attachPermissions, (0, requireAction_middleware_1.requireAction)("project:update"), projects_controller_1.UpdateProjectController);
ProjectRouter
    .route("/workspace/:workspace_id/project/:project_id/delete")
    .delete(JWT_middleware_1.validateToken, permission_middleware_1.attachPermissions, (0, requireAction_middleware_1.requireAction)("project:delete"), projects_controller_1.DeleteProjectController);
exports.default = ProjectRouter;
