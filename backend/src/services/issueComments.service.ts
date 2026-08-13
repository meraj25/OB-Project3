import {
    findChainByIssueId,
    findCommentsByChainId,
    createChainForIssue,
    createComment,
    deleteComment,
} from "../repositories/issueComments.repository"
import { findIssueById } from "../repositories/issues.repository"
import ValidationError from "../domain/errors/validation-error"
import NotFoundError from "../domain/errors/not-found-error"

const GetCommentsForIssue = async(issue_id:number, project_id:number, workspace_id:number) => {

    const issue = await findIssueById(issue_id);
    if (!issue || issue.project_id !== project_id || issue.projects.workspace_id !== workspace_id) {
        throw new NotFoundError("Issue not found");
    }

    const chain = await findChainByIssueId(issue_id);
    if(!chain){

        return [];
    } 

    return findCommentsByChainId(chain.chain_id);

};

const CreateComment = async(
    issue_id:number,
    project_id:number,
    workspace_id:number,
    data:{user_id:number; comment:string}
) => {

    const issue = await findIssueById(issue_id)
    if (!issue || issue.project_id !== project_id || issue.projects.workspace_id !== workspace_id) {
        throw new NotFoundError("Issue not found");
    }

    if (!data.comment?.trim()) {
        throw new ValidationError("Comment text is required");
    }

    let chain = await findChainByIssueId(issue_id);
    if (!chain) {
        chain = await createChainForIssue(issue_id);
    }

    return createComment({
        chain_id: chain.chain_id,
        user_id: data.user_id,
        comment: data.comment.trim(),
    });

};

const DeleteComment = async(
    comment_id:number,
    issue_id:number,
    project_id:number,
    workspace_id:number,
    requesting_user_id:number
) => {

    const issue = await findIssueById(issue_id);
    if (!issue || issue.project_id !== project_id || issue.projects.workspace_id !== workspace_id) {
        throw new NotFoundError("Issue not found");
    }

    const chain = await findChainByIssueId(issue_id);
    if (!chain) {
        throw new NotFoundError("Comment not found");
    }

    const comments = await findCommentsByChainId(chain.chain_id);
    const comment = comments.find((c) => c.comment_id === comment_id);
    if (!comment) {
        throw new NotFoundError("Comment not found");
    }

     if (comment.user_id !== requesting_user_id) {
        throw { status: 403, message: "You can only delete your own comments" };
    }

    return deleteComment(comment_id);

};

export {
    GetCommentsForIssue,
    CreateComment,
    DeleteComment
}; 

