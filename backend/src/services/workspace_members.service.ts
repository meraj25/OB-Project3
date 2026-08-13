import { 
    findAllWorkspaceMembers,
    findMembership,
    createWorkspaceMember,
    updateWorkspaceMember,
    deleteWorkspaceMember,
    findByWorkspace,
    findWorkspaceMember} from "../repositories/workspace_members";

import { findUserByEmail } from "../repositories/users.repository";
import ValidationError from "../domain/errors/validation-error";
import NotFoundError from "../domain/errors/not-found-error";
import { prisma } from "../db/prisma";
import { emitWorkspaceEvent } from "../sockets/socket";


const getWorkspaceMembersById = async (workspace_id:number) => {

    return prisma.workspace_members.findMany({
        where:{workspace_id}
    })

};

const getAllWorkspaceMembers = async () => {

    const workspaceMembers = await findAllWorkspaceMembers();
    return workspaceMembers;

}

const createMember = async (data:{workspace_id:number;user_id:number;role_id:number}) => {

   
    if (!data.user_id || !data.role_id) {
        throw new ValidationError("User and role are required");
    }

    if (data.role_id === 1) {
        throw new ValidationError("Cannot assign owner role directly");
    }


    const existing = await findMembership(data.user_id, data.workspace_id);
    if (existing) {
        throw { status: 409, message: "User is already a member of this workspace" };
    }

    const workspaceMember = await createWorkspaceMember({ workspace_id:data.workspace_id, user_id: data.user_id, role_id:data.role_id });
    emitWorkspaceEvent(data.workspace_id, "WorkspaceMember", "create", workspaceMember.workspace_member_id);


    return workspaceMember;
}

const updateMember = async (workspace_member_id:number, workspace_id:number, role_id:number) => {

    if (!role_id) {
        throw new ValidationError("Role is required");
    }
    const member = await findWorkspaceMember(workspace_member_id);

    if(!member || member.workspace_id !== workspace_id){

        throw new NotFoundError("Member not found");
    }

    if (member.role_id === 1 || role_id === 1) {
        throw new ValidationError("Cannot change ownership or assign an ownership");
    }

     const workspaceMember = await updateWorkspaceMember(workspace_member_id,{role_id})

     emitWorkspaceEvent(workspace_id, "WorkspaceMember", "update", workspace_member_id);

     return workspaceMember;


}

const deleteMember = async (workspace_id:number,workspace_member_id:number) => {

    const member = await findWorkspaceMember(workspace_member_id);

     if (!member || member.workspace_id !== workspace_id) {
        throw new NotFoundError("Member not found");
    }
    if (member.role_id === 1) {
        throw new ValidationError("Cannot remove the workspace owner");
    }

    const workspaceMember = await deleteWorkspaceMember(workspace_member_id);

    emitWorkspaceEvent(workspace_id, "WorkspaceMember", "delete", workspace_member_id);

    return workspaceMember;

}

export{getAllWorkspaceMembers,getWorkspaceMembersById,createMember,updateMember,deleteMember}
