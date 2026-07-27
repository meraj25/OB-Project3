import { 
    findAllProjectsByWorkspace,
    findByProjectName,
    findProjectById,
    createProject,
    updateProject,
    deleteProject } from "../repositories/projects.repository";

import NotFoundError from "../domain/errors/not-found-error";
import ValidationError from "../domain/errors/validation-error";


const getAllProjects = async (workspace_id: number) => {
    const projects = await findAllProjectsByWorkspace(workspace_id);
    return projects;

};

const getProjectById = async (project_id: number, workspace_id: number) => {
    const project = await findProjectById(project_id);
    if(!project || project.workspace_id !== workspace_id){
        throw new NotFoundError("Project not found!");
    }
    return project;
};

const getProjectByName = async(project_name: string, workspace_id: number) => {

    const projects = await findByProjectName(project_name);
    const project = projects.find((project) => project.workspace_id === workspace_id);
    if(!project){
        throw new NotFoundError("Project not found!");
    }

    return project;

};

const CreateProject = async (data:{project_name:string,workspace_id:number; }) => {

     if (!data.project_name) {
        throw new ValidationError("Project name is required");
    }

    return  createProject(data)
    

}


const UpdateProject = async (workspace_id: number, project_id: number, data: Partial<{ project_name: string }>) => {

    const project = await findProjectById(project_id);

    if(!project || project.workspace_id !== workspace_id){
        throw new NotFoundError("Project not found!");
    }

    return await updateProject(project_id,data);
    
    

}

const DeleteProject = async (workspace_id: number, project_id: number) => {

    const project = await findProjectById(project_id);
    if(!project || project.workspace_id !== workspace_id){
        throw new NotFoundError("Project not found!");
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