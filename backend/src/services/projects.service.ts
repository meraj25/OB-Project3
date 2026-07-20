import { 
    findAllProjects,
    findByProjectName,
    findProjectById,
    createProject,
    updateProject,
    deleteProject } from "../repositories/projects.repository";

import NotFoundError from "../domain/errors/not-found-error";
import UnauthorizedError from "../domain/errors/unauthorized-error";
import ValidationError from "../domain/errors/validation-error";
import ForbiddenError from "../domain/errors/forbidden-error";

const getAllProjects = async () => {
    const projects = await findAllProjects();
    return projects;

};

const getProjectById = async (project_id: number) => {
    const project = await findProjectById(project_id);
    if(!project){
        throw new NotFoundError("task now found!");
    }
    return project;
};

const getProjectByName = async(project_name: string) => {

    const project = await findByProjectName(project_name);
    if(project.length === 0){
        throw new NotFoundError("Not found!");
    }

    return project;

};

const CreateProject = async (data:{project_name:string,workspace_id:number; }) => {

    const project = await  createProject(data)
    return project;

}


const UpdateProject = async (project_id:number, data:Partial<{project_name:string}>) => {

    const project = await findProjectById(project_id);

    if(!project){
        throw new NotFoundError("Not found!");
    }

    return await updateProject(project_id,data);
    
    

}

const DeleteProject = async (project_id:number) => {

    const project = await findProjectById(project_id);
     if(!project){
        throw new NotFoundError("Not found!");
    }

    return await deleteProject(project_id)

}

export {
    getAllProjects,
    getProjectById,
    getProjectByName,
    CreateProject,
    UpdateProject,
    DeleteProject
}