import { getAllWorkspaces,getWorkspaceById,CreateWorkspace,UpdateWorkspace,DeleteWorkspace } from "../services/workspaces.service"
import { Request,Response,NextFunction } from "express"
import ValidationError from "../domain/errors/validation-error"

const GetAllWorkspaces = async (req:Request, res:Response, next:NextFunction) => {

    try{

        const workspaces = await getAllWorkspaces()
        res.status(200).json(workspaces)

    }catch(error){
        next(error);
    }
}
const GetWorkspaceById = async (req:Request, res:Response, next:NextFunction) => {

    try{

        const workspace_id = Number(req.params.workspace_id)
        if(!workspace_id){
            return new ValidationError ("workspace_id required")
        }

        const workspace = await getWorkspaceById(workspace_id)
        res.status(200).json(workspace)

    }catch(error){
        next(error)
    }
};

const CreateWorkspaceController = async (req:Request, res:Response, next:NextFunction) => {

    try{

        const created_by = req.user.user_id
        const {workspace_name} = req.body

        if(!workspace_name){
            return new ValidationError ("name for the workspace is required")
        }

        const workspace = await CreateWorkspace({workspace_name,created_by})
        res.status(201).json(workspace)

    }catch(error){
        next(error)
    }
};

const UpdateWorkspaceController = async (req:Request, res:Response, next:NextFunction) => {

    try{

        const workspace_id = Number(req.params.workspace_id)
        const data = req.body

        const workspace = await UpdateWorkspace(workspace_id,data)
        res.status(200).json(workspace)

    }catch(error){

        next(error)

    }
}

const DeleteWorkspaceController = async (req:Request, res:Response, next:NextFunction) => {

    try{

        const workspace_id = Number(req.params.workspace_id)
        if(!workspace_id){
            return new ValidationError ("workspace_id required")
        }

        await DeleteWorkspace(workspace_id)
        res.status(204).send("workspace deleted successfully");



    }catch(error){

        next(error)

    }
} 


export {
    GetAllWorkspaces,
    GetWorkspaceById,
    CreateWorkspaceController,
    UpdateWorkspaceController,
    DeleteWorkspaceController
}