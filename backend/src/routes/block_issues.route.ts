import express from "express"
import { 
    GetAllBlockedIssues,
    GetBlockedIssueById,
    CreateBlockedIssueController,
    DeleteBlockedIssueController
 } from "../controllers/block_issues.controller"
 import { validateToken } from "../middlewares/JWT.middleware"
 import { attachPermissions } from "../middlewares/permission.middleware"
 import { requireAction } from "../middlewares/requireAction.middleware"

 const Block_issuesRouter = express.Router()

 Block_issuesRouter
      .route("/workspace/:workspace_id/project/:project_id/block-issues")
      .get(validateToken, attachPermissions, GetAllBlockedIssues)
      .post(validateToken, attachPermissions, requireAction("issue:update"), CreateBlockedIssueController);

 Block_issuesRouter
      .route("/workspace/:workspace_id/project/:project_id/block-issues/:blocking_issue_id/:blocked_issue_id")
      .get(validateToken, attachPermissions, GetBlockedIssueById)
      .delete(validateToken, attachPermissions, requireAction("issue:update"), DeleteBlockedIssueController);

export default Block_issuesRouter;