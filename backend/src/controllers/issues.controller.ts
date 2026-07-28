import { Request,Response,NextFunction } from "express";
import { 
    getAllIssues,
    getIssueById,
    getIssueByName,
    CreateIssue,
    UpdateIssue,
    DeleteIssue,
    getIssueSubtree
 } from "../services/issues.service";
import ValidationError from "../domain/errors/validation-error";

const GetAllIssues = async (req:Request, res:Response,next:NextFunction) => {
    try{
        const project_id = Number(req.params.project_id)    
        const workspace_id = Number(req.params.workspace_id)
        const issues = await getAllIssues(req.query,project_id,workspace_id)
        res.status(200).json(issues)

    }catch(error){
        next(error)
    }

};

const GetIssueById = async (req:Request, res:Response, next:NextFunction) => {

    try{

        const issue_id = Number(req.params.issue_id) 
        const project_id = Number(req.params.project_id) 
        const workspace_id = Number(req.params.workspace_id)
        if (isNaN(workspace_id) || isNaN(project_id) || isNaN(issue_id)) {
            throw new ValidationError("Invalid id");
        }
        const issue = await getIssueById(issue_id,project_id,workspace_id)
        res.status(200).json(issue)

    }catch(error){
        next(error)
    }
};

const GetIssueByName = async (req:Request, res:Response, next:NextFunction) => {

    try{

        const issue_name = String(req.params.issue_name)
        const project_id = Number(req.params.project_id)
        const workspace_id = Number(req.params.workspace_id)

        if(!issue_name){
            return new ValidationError("Required issue_name")
        }
        if(!project_id){
            return new ValidationError("Required project_id")
        }
        const issue = await getIssueByName(issue_name, project_id, workspace_id)
        res.status(200).json(issue)

    }catch(error){

        next(error)

    }

};

const CreateIssueController = async (req:Request, res:Response, next:NextFunction) => {

    try{

        const project_id = Number(req.params.project_id)
        const workspace_id = Number(req.params.workspace_id)

        if (isNaN(project_id) || isNaN(workspace_id)) {
            throw new ValidationError("Invalid project or workspace id");
        }
        const data = req.body

        const issue = await CreateIssue({ ...data, project_id}, workspace_id)
        res.status(201).json(issue)

    }catch(error){
        next(error)
    }

};

const UpdateIssueController = async (req:Request, res:Response, next:NextFunction) => {

    try{

        const issue_id = Number(req.params.issue_id)
        const project_id = Number(req.params.project_id)
        const workspace_id = Number(req.params.workspace_id)
        const data = req.body

        const issue = await UpdateIssue(issue_id, project_id,workspace_id, data)
        res.status(200).json(issue)

    }catch(error){
        next(error)
    }
};

const DeleteIssueController = async (req:Request, res:Response, next:NextFunction) => {

    try{

        const issue_id = Number(req.params.issue_id)
        const project_id = Number(req.params.project_id)
        const workspace_id = Number(req.params.workspace_id)

        await DeleteIssue(issue_id, project_id, workspace_id)
        res.status(204).send();

    }catch(error){
        next(error)
    }
};

const GetIssueSubtree = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const issue_id = Number(req.params.issue_id);
        const project_id = Number(req.params.project_id);
        const workspace_id = Number(req.params.workspace_id);

        if (isNaN(issue_id) || isNaN(project_id) || isNaN(workspace_id)) {
            throw new ValidationError("Invalid id");
        }

        const tree = await getIssueSubtree(issue_id, project_id, workspace_id);
        res.status(200).json(tree);

    } catch (error) {
        next(error);
    }
};

export {
    GetAllIssues,
    GetIssueById,
    GetIssueByName,
    CreateIssueController,
    UpdateIssueController,
    DeleteIssueController,
    GetIssueSubtree
}