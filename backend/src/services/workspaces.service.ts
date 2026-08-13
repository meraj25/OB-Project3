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
import { emitWorkspaceEvent, emitUserEvent } from "../sockets/socket";
import { findByWorkspace } from "../repositories/workspace_members";

const getAllWorkspaces = async () => {
    const workspaces = await findAllWorkspaces();
    return workspaces;

};

const getWorkspaceById = async (workspace_id: number) => {
    const workspace = await findWorkspaceById(workspace_id);
    if(!workspace){
        throw new NotFoundError("workspace found!");
    }
    return workspace;
};

const CreateWorkspace = async (data:{workspace_name:string, created_by:number}) => {

    const workspace = await  createWorkspace(data)

    emitWorkspaceEvent(workspace.workspace_id, "Workspace", "create", workspace.workspace_id);
  

    return workspace;

}


const UpdateWorkspace = async (workspace_id:number, data:Partial<{workspace_name:string}>) => {

    const workspace = await findWorkspaceById(workspace_id);

    if(!workspace){
        throw new NotFoundError("Not found!");
    }

     const result = await updateWorkspace(workspace_id,data);

     const members = await findByWorkspace(workspace_id);

    members.forEach(({ user_id }) => emitUserEvent(user_id, "Workspace", "update", workspace_id));

     return result
    
    

}

const DeleteWorkspace = async (workspace_id:number) => {

    const workspace = await findWorkspaceById(workspace_id);
     if(!workspace){
        throw new NotFoundError("Not found!");
    }

 const members = await findByWorkspace(workspace_id);

    
  const result = await deleteWorkspace(workspace_id)

  members.forEach(({ user_id }) => emitUserEvent(user_id, "Workspace", "delete", workspace_id));

  return result;

}

export {
getAllWorkspaces,
getWorkspaceById,
CreateWorkspace,
UpdateWorkspace,
DeleteWorkspace
}