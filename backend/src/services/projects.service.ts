import { 
    findAllProjectsByWorkspace,
    findByProjectName,
    findProjectById,
    createProject,
    updateProject,
    deleteProject } from "../repositories/projects.repository";

import NotFoundError from "../domain/errors/not-found-error";
import ValidationError from "../domain/errors/validation-error";
import { emitWorkspaceEvent } from "../sockets/socket";


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

    const project = await createProject(data)

    emitWorkspaceEvent(data.workspace_id, "Project", "create", project.project_id);

    return project;
    

}


const UpdateProject = async (workspace_id: number, project_id: number, data: Partial<{ project_name: string }>) => {

    const project = await findProjectById(project_id);

    if(!project || project.workspace_id !== workspace_id){
        throw new NotFoundError("Project not found!");
    }

    const updatedProject = await updateProject(project_id,data);

    emitWorkspaceEvent(workspace_id, "Project", "update", project_id);

    return updatedProject;
    
    

}

const DeleteProject = async (workspace_id: number, project_id: number) => {

    const project = await findProjectById(project_id);
    if(!project || project.workspace_id !== workspace_id){
        throw new NotFoundError("Project not found!");
    }

    const deletedProject = await deleteProject(project_id)
    emitWorkspaceEvent(workspace_id, "Project", "delete", project_id);

    return deletedProject;

}

export {
    getAllProjects,
    getProjectById,
    getProjectByName,
    CreateProject,
    UpdateProject,
    DeleteProject
}