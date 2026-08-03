"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const block_issues_controller_1 = require("../controllers/block_issues.controller");
const JWT_middleware_1 = require("../middlewares/JWT.middleware");
const permission_middleware_1 = require("../middlewares/permission.middleware");
const requireAction_middleware_1 = require("../middlewares/requireAction.middleware");
const Block_issuesRouter = express_1.default.Router();
Block_issuesRouter
    .route("/workspace/:workspace_id/project/:project_id/block-issues")
    .get(JWT_middleware_1.validateToken, permission_middleware_1.attachPermissions, block_issues_controller_1.GetAllBlockedIssues)
    .post(JWT_middleware_1.validateToken, permission_middleware_1.attachPermissions, (0, requireAction_middleware_1.requireAction)("issue:update"), block_issues_controller_1.CreateBlockedIssueController);
Block_issuesRouter
    .route("/workspace/:workspace_id/project/:project_id/block-issues/:blocking_issue_id/:blocked_issue_id")
    .get(JWT_middleware_1.validateToken, permission_middleware_1.attachPermissions, block_issues_controller_1.GetBlockedIssueById)
    .delete(JWT_middleware_1.validateToken, permission_middleware_1.attachPermissions, (0, requireAction_middleware_1.requireAction)("issue:update"), block_issues_controller_1.DeleteBlockedIssueController);
exports.default = Block_issuesRouter;
