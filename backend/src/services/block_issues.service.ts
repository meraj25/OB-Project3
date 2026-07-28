import { 
    findAllBlockedIssues,
    findBlockedIssueById,
    createBlockedIssueById,
    deleteBlockedIssueId,
    wouldCreateCycle
 } from "../repositories/block_issues.repository";
import { findIssueById } from "../repositories/issues.repository";
import ValidationError from "../domain/errors/validation-error";
import NotFoundError from "../domain/errors/not-found-error";

const getAllBlockedIssues = async () => {
    return findAllBlockedIssues();
};

const getBlockedIssueById = async (blocked_issue_id: number, blocking_issue_id: number, project_id: number, workspace_id: number) => {
    const link = await findBlockedIssueById(blocked_issue_id, blocking_issue_id);

    if (!link) {
        throw new NotFoundError("Blocking link not found");
    }
    const [blockedIssue, blockingIssue] = await Promise.all([
        findIssueById(blocked_issue_id),
        findIssueById(blocking_issue_id),
    ]);

    const belongsHere = (issue: any) =>
        issue && issue.project_id === project_id && issue.projects.workspace_id === workspace_id;

    if (!belongsHere(blockedIssue) || !belongsHere(blockingIssue)) {
        throw new NotFoundError("Blocking link not found");
    }

    return link;
};

const CreateBlockedIssue = async (
    blocking_issue_id: number,
    blocked_issue_id: number,
    project_id: number,
    workspace_id: number
) => {
    if (!blocking_issue_id || !blocked_issue_id) {
        throw new ValidationError("blocking_issue_id and blocked_issue_id are required");
    }

    if (blocking_issue_id === blocked_issue_id) {
        throw new ValidationError("An issue cannot block itself");
    }
    const [blockingIssue, blockedIssue] = await Promise.all([
        findIssueById(blocking_issue_id),
        findIssueById(blocked_issue_id),
    ]);

    const belongsHere = (issue: any) =>
        issue && issue.project_id === project_id && issue.projects.workspace_id === workspace_id;

    if (!belongsHere(blockingIssue) || !belongsHere(blockedIssue)) {
        throw new NotFoundError("One or both issues not found");
    }

    if (await wouldCreateCycle(blocking_issue_id, blocked_issue_id)) {
        throw new ValidationError("This link would create a circular dependency!");
    }

    return createBlockedIssueById({ blocking_issue_id, blocked_issue_id });
};

const DeleteBlockedIssue = async (blocked_issue_id: number, blocking_issue_id: number) => {
    const link = await findBlockedIssueById(blocked_issue_id, blocking_issue_id);

    if (!link) {
        throw new NotFoundError("Blocking link not found");
    }

    return deleteBlockedIssueId(blocked_issue_id, blocking_issue_id);
};

export {
    getAllBlockedIssues,
    getBlockedIssueById,
    CreateBlockedIssue,
    DeleteBlockedIssue

}