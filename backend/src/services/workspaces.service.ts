import { 
    findAllWorkspaces,
    findWorkspaceById,
    findWorkspaceByName,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace 
} from "../repositories/workspaces.repository";

import NotFoundError from "../domain/errors/not-found-error";
import UnauthorizedError from "../domain/errors/unauthorized-error";
import ValidationError from "../domain/errors/validation-error";
import ForbiddenError from "../domain/errors/forbidden-error";

const getAllWorkspaces = async () => {
    const workspaces = await findAllWorkspaces();
    return workspaces;

};

const getWorkspaceById = async (workspace_id: number) => {
    const workspace = await findWorkspaceById(workspace_id);
    if(!workspace){
        throw new NotFoundError("task now found!");
    }
    return workspace;
};

const CreateWorkspace = async (data:{workspace_name:string}) => {

    const workspace = await  createWorkspace(data)
    return workspace;

}


const UpdateWorkspace = async (workspace_id:number, data:Partial<{workspace_name:string}>) => {

    const workspace = await findWorkspaceById(workspace_id);

    if(!workspace){
        throw new NotFoundError("Not found!");
    }

    return await updateWorkspace(workspace_id,data);
    
    

}

const DeleteWorkspace = async (workspace_id:number) => {

    const workspace = await findWorkspaceById(workspace_id);
     if(!workspace){
        throw new NotFoundError("Not found!");
    }

    return await deleteWorkspace(workspace_id)

}

export {
getAllWorkspaces,
getWorkspaceById,
CreateWorkspace,
UpdateWorkspace,
DeleteWorkspace
}