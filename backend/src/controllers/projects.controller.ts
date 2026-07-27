import e, { Request, Response, NextFunction } from "express";
import { 
    getAllProjects,
    getProjectById,
    CreateProject,
    UpdateProject,
    DeleteProject} from "../services/projects.service";
import ValidationError from "../domain/errors/validation-error";

const GetAllProjects = async (req:Request, res:Response, next:NextFunction) => {

    try{
        const workspace_id = Number(req.params.workspace_id)
        const projects = await getAllProjects(workspace_id);

        res.status(200).json(projects);


    }catch(error){

        next(error)
    }
};

const GetProjectById = async (req:Request, res:Response, next:NextFunction) => {

    try{
         const workspace_id = Number(req.params.workspace_id)
         const project_id = Number(req.params.project_id)

         if (isNaN(project_id)) throw new ValidationError("Invalid project id");

         const project = await getProjectById(workspace_id,project_id)
         res.status(200).json(project)

    }catch(error){

        next(error)

    }

};

const CreateProjectController = async (req:Request, res:Response, next:NextFunction) => {

try{

    const workspace_id = Number(req.params.workspace_id)
    const {project_name} = req.body

    const project = await CreateProject({workspace_id,project_name})
    res.status(201).json(project);

}catch(error){

    next(error)

}
};

const UpdateProjectController = async (req:Request, res:Response, next:NextFunction) => {

    try{

        const workspace_id = Number(req.params.workspace_id)
        const project_id = Number(req.params.project_id)
        const project_name = req.body;

        const project = await UpdateProject(workspace_id,project_id,project_name)
        res.status(201).json(project)

    }catch(error){

        next(error)

    }
};

const DeleteProjectController = async (req:Request, res:Response, next:NextFunction) => {

    try{

        const workspace_id = Number(req.params.workspace_id)
        const project_id = Number(req.params.project_id)

        await DeleteProject(workspace_id,project_id);
        res.status(201).send();

    }catch(error){

        next(error)
    }

};

export {
    GetAllProjects,
    GetProjectById,
    CreateProjectController,
    UpdateProjectController,
    DeleteProjectController
}