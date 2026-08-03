import {prisma} from "../db/prisma"
import { SimpleCache } from "../utils/simpleCache";

const membershipCache = new SimpleCache<any>();

const findAllWorkspaceMembers = () => {

    return prisma.workspace_members.findMany();
};

const findWorkspaceMember = (workspace_member_id:number) => {

    return prisma.workspace_members.findUnique({
        where:{workspace_member_id}
    })

};

const findMembership = (user_id: number, workspace_id: number) => {

    const key = `${user_id}:${workspace_id}`;
    const cached = membershipCache.get(key);
    if (cached) return cached;

    const membership = prisma.workspace_members.findUnique({
        where: { user_id_workspace_id: { user_id, workspace_id } },
        include: { roles: true }
    });
    if (membership) membershipCache.set(key, membership, 30_000);
    return membership;
};

const invalidateMembership = (user_id: number, workspace_id: number) => {
    membershipCache.invalidate(`${user_id}:${workspace_id}`);
};

const createWorkspaceMember = (data:{workspace_id:number,user_id:number,role_id:number}) => {

    return prisma.workspace_members.create({data})

};

const updateWorkspaceMember = (workspace_member_id:number, data: Partial<{role_id:number}>) => {

    return prisma.workspace_members.update({
        where:{workspace_member_id},
        data
    })

}

const deleteWorkspaceMember = (workspace_member_id:number) => {

    return prisma.workspace_members.delete({
        where:{workspace_member_id}
    })


};

const findByWorkspace = (workspace_id:number) => {

     return prisma.workspace_members.findMany({
        where: { workspace_id },
        include: {
            users: true,
            roles: true
        }
    });

}

export {
    findAllWorkspaceMembers,
    findWorkspaceMember,
    createWorkspaceMember,
    findMembership,
    updateWorkspaceMember,
    deleteWorkspaceMember,
    findByWorkspace,
    invalidateMembership
}

