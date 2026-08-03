"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const workspace_members_controller_1 = require("../controllers/workspace_members.controller");
const requireAction_middleware_1 = require("../middlewares/requireAction.middleware");
const JWT_middleware_1 = require("../middlewares/JWT.middleware");
const permission_middleware_1 = require("../middlewares/permission.middleware");
const Workspace_MembersRouter = express_1.default.Router();
Workspace_MembersRouter
    .route('/:workspace_id/members')
    .get(JWT_middleware_1.validateToken, permission_middleware_1.attachPermissions, workspace_members_controller_1.GetAllWorkspaceMembers);
Workspace_MembersRouter
    .route('/:workspace_id/members')
    .post(JWT_middleware_1.validateToken, permission_middleware_1.attachPermissions, (0, requireAction_middleware_1.requireAction)("member:invite"), workspace_members_controller_1.CreateMember);
Workspace_MembersRouter
    .route("/:workspace_id/members/:member_id")
    .patch(JWT_middleware_1.validateToken, permission_middleware_1.attachPermissions, (0, requireAction_middleware_1.requireAction)("member:changeRole"), workspace_members_controller_1.UpdateMember);
Workspace_MembersRouter
    .route("/:workspace_id/members/:member_id")
    .delete(JWT_middleware_1.validateToken, permission_middleware_1.attachPermissions, (0, requireAction_middleware_1.requireAction)("member:remove"), workspace_members_controller_1.DeleteMember);
exports.default = Workspace_MembersRouter;
