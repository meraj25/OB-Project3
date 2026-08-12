import  { Request,Response,NextFunction } from "express"
import {GetCommentsForIssue,CreateComment,DeleteComment} from "../services/issueComments.service"
import ValidationError from "../domain/errors/validation-error"
import NotFoundError from "../domain/errors/not-found-error"

const GetCommentsController = async(req:Request, res:Response, next:NextFunction) => {

    try{

        const comments = await GetCommentsForIssue(
            Number(req.params.issue_id),
            Number(req.params.project_id),
            Number(req.params.workspace_id)
        );
        res.status(200).json(comments);

    }catch(error){
        next(error)
    }


};

const CreateCommentController = async (req:Request, res:Response, next:NextFunction) => {

    try{
        const comment = await CreateComment(
            Number(req.params.issue_id),
            Number(req.params.project_id),
            Number(req.params.workspace_id),
            { user_id: req.user.user_id, comment: req.body.comment }
        );
        res.status(201).json(comment);

    }catch(error){
        next(error)
    }

};

const DeleteCommentController = async (req:Request, res:Response, next:NextFunction) => {

    try{

        await DeleteComment(
            Number(req.params.comment_id),
            Number(req.params.issue_id),
            Number(req.params.project_id),
            Number(req.params.workspace_id),
            req.user.user_id
        );
        res.status(204).send();

    }catch(error){

        next(error)
    }
}

export {GetCommentsController,CreateCommentController,DeleteCommentController}