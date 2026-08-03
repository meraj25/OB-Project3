import { Request,Response,NextFunction } from "express";
import { 
    getAllBlockedIssues,
    getBlockedIssueById,
    CreateBlockedIssue,
    DeleteBlockedIssue
 } from "../services/block_issues.service";
 import ValidationError from "../domain/errors/validation-error";

 const GetAllBlockedIssues = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const links = await getAllBlockedIssues();
        res.status(200).json(links);
    } catch (error) {
        next(error);
    }
};

const GetBlockedIssueById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const blocked_issue_id = Number(req.params.blocked_issue_id);
        const blocking_issue_id = Number(req.params.blocking_issue_id);
        const project_id = Number(req.params.project_id);
        const workspace_id = Number(req.params.workspace_id);

        if (isNaN(blocked_issue_id) || isNaN(blocking_issue_id) || isNaN(project_id) || isNaN(workspace_id)) {
            throw new ValidationError("Invalid id");
        }

        const link = await getBlockedIssueById(blocked_issue_id, blocking_issue_id, project_id, workspace_id);
        res.status(200).json(link);
    } catch (error) {
        next(error);
    }
};

const CreateBlockedIssueController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const project_id = Number(req.params.project_id);
        const workspace_id = Number(req.params.workspace_id);
        const { blocking_issue_id, blocked_issue_id } = req.body;

        if (isNaN(project_id) || isNaN(workspace_id)) {
            throw new ValidationError("Invalid project or workspace id");
        }

        const link = await CreateBlockedIssue(
            Number(blocking_issue_id),
            Number(blocked_issue_id),
            project_id,
            workspace_id
        );

        res.status(201).json(link);
    } catch (error) {
        next(error);
    }
};

const DeleteBlockedIssueController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const blocked_issue_id = Number(req.params.blocked_issue_id);
        const blocking_issue_id = Number(req.params.blocking_issue_id);

        if (isNaN(blocked_issue_id) || isNaN(blocking_issue_id)) {
            throw new ValidationError("Invalid id");
        }

        await DeleteBlockedIssue(blocked_issue_id, blocking_issue_id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

export {
    GetAllBlockedIssues,
    GetBlockedIssueById,
    CreateBlockedIssueController,
    DeleteBlockedIssueController
}